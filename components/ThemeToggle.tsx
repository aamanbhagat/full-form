'use client';

// Flips the `data-theme` attribute on <html> and remembers the choice.
// Icon shown is driven entirely by CSS ([data-theme]) so there is no React
// state and therefore no hydration mismatch.
export function ThemeToggle() {
  function toggle() {
    const el = document.documentElement;
    const next = el.dataset.theme === 'dark' ? 'light' : 'dark';
    el.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode — fall back to in-memory only */
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <svg
        className="theme-toggle__moon"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        className="theme-toggle__sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
