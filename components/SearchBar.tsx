'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AcronymSummary } from '@/types';
import { catVars } from '@/lib/css';

export function SearchBar({
  autoFocus = false,
  initialQuery = '',
}: {
  autoFocus?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AcronymSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [searched, setSearched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Debounced lookup. Aborts any in-flight request so late responses to an
  // older query can never overwrite newer results.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/acronyms/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data: AcronymSummary[] = await res.json();
        setResults(data);
        setSearched(true);
        setOpen(true);
        setActive(-1);
      } catch {
        /* aborted or offline — ignore */
      }
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function go(target: AcronymSummary) {
    router.push(`/full-form/${target.slug}`);
    setOpen(false);
  }

  function submit() {
    const q = query.trim();
    if (active >= 0 && results[active]) {
      go(results[active]);
    } else if (q.length > 0) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const showResults = open && query.trim().length >= 2;

  return (
    <div className="search" ref={rootRef}>
      <form
        className="search-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          className="search-input"
          type="search"
          name="q"
          value={query}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Try UPI, NEET, RBI…"
          aria-label="Search for an acronym"
          aria-expanded={showResults}
          aria-controls={listId}
          role="combobox"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button className="search-submit" type="submit">
          Search
        </button>
      </form>

      {showResults ? (
        <div className="search-results" id={listId} role="listbox">
          {results.length > 0 ? (
            results.map((r, i) => (
              <a
                key={r.slug}
                href={`/full-form/${r.slug}`}
                className="search-result"
                role="option"
                aria-selected={i === active}
                style={catVars(r.category)}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(r);
                }}
              >
                <span className="search-result__ac">{r.acronym}</span>
                <span className="search-result__ff">{r.full_form}</span>
              </a>
            ))
          ) : searched ? (
            <p className="search-empty">
              No match for “{query.trim()}”. Press Search to see all results.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
