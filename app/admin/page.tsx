import { Suspense } from 'react';
import {
  adminIsLive,
  getAdminRows,
  getAdminStats,
} from '@/lib/admin-data';
import { CATEGORIES } from '@/types';
import { approveAcronym, rejectAcronym, runGenerate } from './actions';

export default function AdminPage() {
  const live = adminIsLive();
  return (
    <div className="page-stack">
      <h1 className="category-header__name">Review queue</h1>

      {!live ? (
        <p className="notice">
          Running on the bundled mock dataset — no service-role Supabase key is
          set. Generation and approvals are previews only and won’t persist.
        </p>
      ) : null}

      <section>
        <h2 className="section-title">Generate</h2>
        <form action={runGenerate} className="admin-form">
          <label className="field-label" htmlFor="acronyms">
            Acronyms (comma- or newline-separated, up to 30)
          </label>
          <textarea
            id="acronyms"
            name="acronyms"
            className="field-input"
            rows={4}
            placeholder="RBI, SEBI, NEFT…"
          />
          <button className="btn btn--primary" type="submit">
            Generate drafts
          </button>
        </form>
      </section>

      <Suspense fallback={<p className="page-status">Loading stats…</p>}>
        <Stats />
      </Suspense>

      <Suspense fallback={<p className="page-status">Loading acronyms…</p>}>
        <ReviewTable live={live} />
      </Suspense>
    </div>
  );
}

async function Stats() {
  const stats = await getAdminStats();
  const cards: Array<{ label: string; value: number }> = [
    { label: 'Total', value: stats.total },
    { label: 'Published', value: stats.published },
    { label: 'Pending', value: stats.pending },
    { label: 'Categories', value: CATEGORIES.length },
  ];
  return (
    <section>
      <div className="admin-stats">
        {cards.map((c) => (
          <div className="admin-stat" key={c.label}>
            <div className="admin-stat__value">{c.value}</div>
            <div className="admin-stat__label">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function ReviewTable({ live }: { live: boolean }) {
  const rows = await getAdminRows('all');
  return (
    <section>
      <h2 className="section-title">Acronyms</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Acronym</th>
              <th>Full form</th>
              <th>Category</th>
              <th>Reviewed</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="t-mono">{row.acronym}</td>
                <td>{row.full_form}</td>
                <td>{row.category}</td>
                <td>
                  <Pill yes={row.is_reviewed} />
                </td>
                <td>
                  <Pill yes={row.is_published} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <form action={approveAcronym}>
                      <input type="hidden" name="id" value={row.id} />
                      <button
                        type="submit"
                        className="btn"
                        disabled={!live || row.is_published}
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectAcronym}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="btn" disabled={!live}>
                        Reject
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Pill({ yes }: { yes: boolean }) {
  return (
    <span className={`admin-pill ${yes ? 'admin-pill--yes' : 'admin-pill--no'}`}>
      {yes ? 'yes' : 'no'}
    </span>
  );
}
