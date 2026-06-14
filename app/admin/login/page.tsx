import { Suspense } from 'react';
import { login } from '../actions';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="page-stack">
      <h1 className="category-header__name">Admin sign in</h1>
      <Suspense fallback={null}>
        <LoginError searchParams={searchParams} />
      </Suspense>
      <form action={login} className="admin-form">
        <label className="field-label" htmlFor="password">
          Admin token
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="field-input"
          autoComplete="current-password"
          required
        />
        <button className="btn btn--primary" type="submit">
          Sign in
        </button>
        <p className="footer-blurb">
          Use the value of <code>ADMIN_SECRET_TOKEN</code>.
        </p>
      </form>
    </div>
  );
}

async function LoginError({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  if (!sp.error) return null;
  return <p className="admin-pill admin-pill--no">Incorrect token. Try again.</p>;
}
