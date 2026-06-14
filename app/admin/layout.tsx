import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { logout } from './actions';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="site-header">
        <div className="shell masthead">
          <Link href="/admin" className="wordmark">
            FullForm<span className="wordmark__hub">Hub</span>
            <span className="nav-link" style={{ marginLeft: '0.5rem' }}>
              admin
            </span>
          </Link>
          <div className="masthead__right">
            <ThemeToggle />
            <form action={logout}>
              <button type="submit" className="btn">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="admin-shell">
        {children}
      </main>
    </>
  );
}
