import Link from 'next/link';

export interface Crumb {
  label: string;
  href: string | null;
  isCategory?: boolean;
}

// Visual breadcrumb. The matching BreadcrumbList JSON-LD is emitted separately
// via lib/schema so the markup stays clean.
export function BreadcrumbNav({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={item.label}
              style={{ display: 'contents' }}
            >
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={item.isCategory ? 'breadcrumb__cat' : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              )}
              {!last ? (
                <span className="breadcrumb__sep" aria-hidden>
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
