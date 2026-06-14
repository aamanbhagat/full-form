// Canonical slug for an acronym page: `full-form-of-upsc`.
// Matched by the SEO route and generate-content script — keep in lock-step.
export function acronymSlug(acronym: string): string {
  return `full-form-of-${acronym.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/** First A–Z bucket for a row, or '#' for anything non-alphabetic. */
export function azBucket(acronym: string): string {
  const first = acronym.charAt(0).toUpperCase();
  return first >= 'A' && first <= 'Z' ? first : '#';
}

export const AZ_LETTERS = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  '#',
] as const;
