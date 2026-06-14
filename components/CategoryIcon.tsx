import type { Category } from '@/types';
import type { LucideIcon } from 'lucide-react';
import {
  Banknote,
  Landmark,
  GraduationCap,
  Stethoscope,
  Cpu,
  FlaskConical,
  Briefcase,
  Scale,
  ShieldCheck,
  Trophy,
  Building2,
  MessageCircle,
  Smile,
  Library,
  Globe,
  MapPin,
} from 'lucide-react';
import { catVars } from '@/lib/css';

// Crisp, consistent Lucide icons — one per category, rendered in the category
// colour via currentColor (so they adapt to light/dark automatically).
const ICONS: Record<Category, LucideIcon> = {
  Banking: Banknote,
  Government: Landmark,
  Education: GraduationCap,
  Medical: Stethoscope,
  Tech: Cpu,
  Science: FlaskConical,
  Business: Briefcase,
  Law: Scale,
  Defence: ShieldCheck,
  Sports: Trophy,
  Organisations: Building2,
  Chat: MessageCircle,
  Slang: Smile,
  General: Library,
  Country: Globe,
  State: MapPin,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}

// The icon set in a soft, colour-tinted rounded tile with depth + a top sheen.
export function CategoryTile({
  category,
  size = 'md',
}: {
  category: Category;
  size?: 'md' | 'lg';
}) {
  return (
    <span
      className={`icon-tile${size === 'lg' ? ' icon-tile--lg' : ''}`}
      style={catVars(category)}
    >
      <CategoryIcon category={category} className="icon-tile__icon" />
    </span>
  );
}
