// Fixed-dimension ad container. Reserves space *before* any script loads so
// CLS stays at 0 (DESIGN brief gate). Renders a labelled placeholder until a
// real AdSense client id is configured via NEXT_PUBLIC_ADSENSE_CLIENT.
const SIZES = {
  '300x250': 'ad-slot--300x250',
} as const;

export function AdSlot({
  id,
  size = '300x250',
}: {
  id: string;
  size?: keyof typeof SIZES;
}) {
  return (
    <div
      className={`ad-slot ${SIZES[size]}`}
      id={id}
      role="complementary"
      aria-label="Advertisement"
    >
      Advertisement
    </div>
  );
}
