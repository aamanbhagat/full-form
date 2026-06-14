'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  createServiceSupabaseClient,
  isSupabaseServiceConfigured,
} from '@/lib/supabase-server';
import { getSql, isPgConfigured } from '@/lib/pg';
import { processAcronym } from '@/lib/generate';

const COOKIE = 'admin_token';
const isProd = process.env.NODE_ENV === 'production';

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const secret = process.env.ADMIN_SECRET_TOKEN;
  if (!secret || password !== secret) {
    redirect('/admin/login?error=1');
  }
  const store = await cookies();
  store.set(COOKIE, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  redirect('/admin');
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
  redirect('/admin/login');
}

export async function approveAcronym(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceSupabaseClient();
    await supabase
      .from('acronyms')
      .update({ is_reviewed: true, is_published: true })
      .eq('id', id);
  } else if (isPgConfigured()) {
    const sql = getSql();
    await sql`update acronyms set is_reviewed = true, is_published = true where id = ${id}`;
  } else {
    return;
  }
  revalidatePath('/admin');
}

export async function rejectAcronym(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  if (isSupabaseServiceConfigured()) {
    const supabase = createServiceSupabaseClient();
    await supabase.from('acronyms').delete().eq('id', id);
  } else if (isPgConfigured()) {
    const sql = getSql();
    await sql`delete from acronyms where id = ${id}`;
  } else {
    return;
  }
  revalidatePath('/admin');
}

export async function runGenerate(formData: FormData) {
  const raw = String(formData.get('acronyms') ?? '');
  const list = raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);

  for (const acronym of list) {
    await processAcronym(acronym);
  }
  revalidatePath('/admin');
  redirect('/admin');
}
