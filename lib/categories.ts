import type { Category, CategorySlug, CategoryRow } from '@/types';

// Category metadata + the signature colour system (see DESIGN.md §3).
// One colour per category, threaded through tab, badge, breadcrumb, and hub.
// Icons are SVG (components/CategoryIcon), not emoji.
interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string; // short — used for the <meta name="description"> tag
  intro: string; // 2–3 sentence on-page intro — unique, indexable hub copy
  color: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Banking: {
    slug: 'banking',
    name: 'Banking & Finance',
    description:
      'Full forms of banking, finance, and RBI-related acronyms used across India.',
    intro:
      'From RBI and SEBI to NEFT, RTGS, IMPS, and UPI, Indian banking runs on acronyms. This section decodes the terms you meet on bank statements, loan documents, and net-banking screens, plus the bodies that regulate them. Each entry explains what the abbreviation stands for and how it is used in everyday Indian finance.',
    color: '#0F6E5C',
  },
  Government: {
    slug: 'government',
    name: 'Government & Exams',
    description:
      'Full forms of government bodies, schemes, and competitive exam acronyms.',
    intro:
      'India’s government, ministries, schemes, and recruitment exams are a maze of abbreviations — UPSC, SSC, IBPS, NDA, PAN, GST, and many more. Here you will find clear full forms for the departments, documents, and exams that students and citizens deal with most, written with the Indian context front and centre.',
    color: '#9B2D2D',
  },
  Education: {
    slug: 'education',
    name: 'Education',
    description:
      'Full forms of boards, entrance exams, and educational institution acronyms.',
    intro:
      'School boards, entrance tests, degrees, and institutions all hide behind acronyms like CBSE, NEET, JEE, IIT, and UGC. This section spells them out so students, parents, and teachers can quickly understand admission notices, mark sheets, and exam announcements.',
    color: '#1F5FA8',
  },
  Medical: {
    slug: 'medical',
    name: 'Medical & Health',
    description:
      'Full forms of medical terms, diseases, and health-organisation acronyms.',
    intro:
      'Prescriptions, lab reports, and hospital paperwork are full of abbreviations — CBC, ECG, MRI, BP, ICU, and more. Here we expand the medical and health acronyms commonly seen in India so you can better understand what a report or referral is referring to. These explanations are for general understanding only, not medical advice.',
    color: '#7A2E8F',
  },
  Tech: {
    slug: 'tech',
    name: 'Technology',
    description:
      'Full forms of tech, software, hardware, and internet acronyms.',
    intro:
      'Computing and the internet generate acronyms faster than any other field — API, CPU, HTTP, VPN, AI, and thousands more. This section covers software, hardware, networking, and security abbreviations in plain language, useful for students, developers, and anyone curious about the tech they use daily.',
    color: '#14627E',
  },
  Science: {
    slug: 'science',
    name: 'Science',
    description:
      'Full forms from physics, chemistry, biology, space, and research.',
    intro:
      'Science is dense with shorthand — DNA, RNA, ATP, LASER, and the units and agencies behind research. Here you will find the full forms used across physics, chemistry, biology, and space science, explained simply enough for school revision yet precise enough to trust.',
    color: '#2A7030',
  },
  Business: {
    slug: 'business',
    name: 'Business & Corporate',
    description:
      'Full forms of management, corporate, marketing, and workplace acronyms.',
    intro:
      'The corporate world speaks in initials — CEO, CFO, KPI, ROI, B2B, and CRM among them. This section explains the management, finance, marketing, and workplace acronyms you meet in offices, job descriptions, and business news across India.',
    color: '#9E5512',
  },
  Law: {
    slug: 'law',
    name: 'Law & Legal',
    description:
      'Full forms of courts, acts, and legal-procedure acronyms used in India.',
    intro:
      'Legal documents and news reports lean on abbreviations like FIR, PIL, IPC, and SC. Here we expand the courts, acts, and procedural terms used in the Indian legal system so the language of law is a little less intimidating. This is general information, not legal advice.',
    color: '#3E4C9A',
  },
  Defence: {
    slug: 'defence',
    name: 'Defence & Police',
    description:
      'Full forms of the armed forces, paramilitary, and police acronyms.',
    intro:
      'India’s armed forces, paramilitary, and police use a vocabulary of their own — from ranks and wings to agencies like CRPF, BSF, and NSG. This section decodes the defence and policing acronyms that appear in current affairs and recruitment exams.',
    color: '#4F5E2A',
  },
  Sports: {
    slug: 'sports',
    name: 'Sports',
    description:
      'Full forms of games, tournaments, and sporting-body acronyms.',
    intro:
      'Leagues, formats, and governing bodies fill sport with acronyms — IPL, ODI, FIFA, BCCI, and more. Here you will find the full forms behind the tournaments, teams, and organisations that fans and quiz-takers come across most often.',
    color: '#8A6D1F',
  },
  Organisations: {
    slug: 'organisations',
    name: 'Organisations',
    description:
      'Full forms of companies, PSUs, and well-known Indian and global bodies.',
    intro:
      'Public-sector undertakings, companies, and international bodies are usually known by their initials — ISRO, ONGC, WHO, and UN among them. This section expands the names of the organisations that shape policy, industry, and daily life in India and around the world.',
    color: '#5C6470',
  },
  Chat: {
    slug: 'chat',
    name: 'Chat & Texting',
    description:
      'Full forms of texting and messaging shorthand — BRB, GTG, TTYL, IMO, and the rest.',
    intro:
      'Texting has a shorthand all its own — BRB, GTG, TTYL, IMO, and dozens more. This section translates the messaging abbreviations that fly across WhatsApp and chat apps, so you are never left guessing what a reply actually means.',
    color: '#C2255C',
  },
  Slang: {
    slug: 'slang',
    name: 'Slang & Internet',
    description:
      'Full forms of internet slang and social-media lingo — LOL, LMAO, YOLO, FOMO, GOAT.',
    intro:
      'Internet culture moves fast, and its slang moves faster — LOL, LMAO, YOLO, FOMO, and GOAT are just the start. Here we explain the social-media and meme abbreviations trending across posts, comments, and DMs.',
    color: '#6741D9',
  },
  General: {
    slug: 'general',
    name: 'General',
    description: 'Common everyday acronyms used in India across all domains.',
    intro:
      'Some acronyms do not fit neatly into one field but turn up everywhere — in forms, signs, news, and conversation. This section collects the common everyday abbreviations used across India, from DOB and PIN to GDP and NGO.',
    color: '#6E5E2F',
  },
  Country: {
    slug: 'country',
    name: 'Countries',
    description:
      'Country codes, international abbreviations, and global organisation acronyms.',
    intro:
      'Countries appear in short form across passports, sports scoreboards, and international news — IND, USA, UAE, and the rest. This section expands country codes and the abbreviations of major global blocs and organisations so the world map is easier to read.',
    color: '#D14D0A',
  },
  State: {
    slug: 'state',
    name: 'States & Provinces',
    description:
      'Full forms of states, provinces, and territories from India and around the world.',
    intro:
      'Indian states and union territories, along with provinces around the globe, are often written as short codes on number plates, addresses, and official forms. Here you will find the full names behind those state and province abbreviations, in India and beyond.',
    color: '#FF7F50',
  },
};

const SLUG_TO_CATEGORY = Object.fromEntries(
  (Object.keys(CATEGORY_META) as Category[]).map((c) => [
    CATEGORY_META[c].slug,
    c,
  ]),
) as Record<CategorySlug, Category>;

export const CATEGORY_SLUGS = Object.values(CATEGORY_META).map((c) => c.slug);

export function categoryColor(category: Category): string {
  return CATEGORY_META[category].color;
}

export function categoryToSlug(category: Category): CategorySlug {
  return CATEGORY_META[category].slug;
}

export function slugToCategory(slug: string): Category | null {
  return SLUG_TO_CATEGORY[slug as CategorySlug] ?? null;
}

/** Build the public `categories` listing from metadata + live counts. */
export function buildCategoryRows(
  counts: Record<Category, number>,
): CategoryRow[] {
  return (Object.keys(CATEGORY_META) as Category[]).map((category) => {
    const meta = CATEGORY_META[category];
    return {
      slug: meta.slug,
      category,
      name: meta.name,
      description: meta.description,
      color_hex: meta.color,
      acronym_count: counts[category] ?? 0,
    };
  });
}
