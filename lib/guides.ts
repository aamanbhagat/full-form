import type { AcronymSummary, Category, FaqItem } from '@/types';

// Editorial "cluster" content: longer explainers that target informational
// queries and funnel internal-link authority into the acronym pages they
// reference. Fully static (no DB) so guides build and serve as plain HTML.

export interface GuideSection {
  heading: string;
  body: string[];
}

export interface Guide {
  slug: string;
  title: string; // <h1> / <title>
  description: string; // meta description (~150–160 chars)
  excerpt: string; // shown on the guides index
  category: Category; // colour theming + breadcrumb
  datePublished: string; // ISO
  dateModified: string; // ISO
  intro: string[];
  sections: GuideSection[];
  related: AcronymSummary[]; // acronym pages this guide links to
  faq: FaqItem[];
}

const rel = (
  acronym: string,
  full_form: string,
  category: Category,
): AcronymSummary => ({
  acronym,
  full_form,
  slug: `full-form-of-${acronym.toLowerCase()}`,
  category,
});

export const GUIDES: Guide[] = [
  {
    slug: 'neft-vs-rtgs-vs-imps-vs-upi',
    title: 'NEFT vs RTGS vs IMPS vs UPI: Differences, Limits & Timings',
    description:
      'NEFT, RTGS, IMPS and UPI compared — what each stands for, transfer speed, minimum and maximum limits, timings, and which to use when in India.',
    excerpt:
      'Four ways to move money in India, four sets of rules. Here is how NEFT, RTGS, IMPS and UPI differ on speed, limits, timings and cost — and when to use each.',
    category: 'Banking',
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    intro: [
      'If you bank in India, you have almost certainly chosen between NEFT, RTGS, IMPS and UPI without being sure what separates them. All four move money electronically from one account to another, but they differ in speed, the amounts they allow, when they run, and what they cost.',
      'This guide expands each acronym and lays out the practical differences so you can pick the right rail for the job.',
    ],
    sections: [
      {
        heading: 'What each one stands for',
        body: [
          'NEFT is National Electronic Funds Transfer, a system run by the Reserve Bank of India that settles transfers in batches.',
          'RTGS is Real Time Gross Settlement, designed for large-value transfers that settle one-by-one, in real time.',
          'IMPS is Immediate Payment Service, an instant interbank service operated by NPCI.',
          'UPI is Unified Payments Interface, the mobile-first system that lets you pay straight from your bank account using a UPI ID or QR code.',
        ],
      },
      {
        heading: 'Speed and timings',
        body: [
          'RTGS, IMPS and UPI are effectively instant, and all three are available 24x7, including weekends and holidays. RTGS became round-the-clock in December 2020.',
          'NEFT is also available 24x7 but settles in half-hourly batches rather than instantly, so a transfer can take anywhere from a few minutes to about half an hour to reflect.',
        ],
      },
      {
        heading: 'Limits and cost',
        body: [
          'RTGS is built for big amounts: the minimum is ₹2,00,000 and there is no upper limit set by the RBI. NEFT has no minimum and no RBI-mandated maximum, though your bank may cap it.',
          'IMPS typically allows up to ₹5,00,000 per transaction. UPI is meant for everyday payments, with a common per-transaction limit of ₹1,00,000 (higher for specific categories such as hospitals, education and capital markets).',
          'For online and mobile transfers, the RBI has waived NEFT and RTGS charges, and UPI is free for normal person-to-person payments. Banks may apply small charges on IMPS or on branch transactions, so check your bank’s schedule.',
        ],
      },
      {
        heading: 'Which should you use?',
        body: [
          'For a quick everyday payment from your phone, UPI is usually the simplest. For an instant transfer of a larger sum, IMPS works well. For very large transfers, RTGS is the designed choice, and NEFT is a reliable option when instant settlement is not essential.',
          'Whichever you use, you will need the recipient’s account number and IFSC for NEFT, RTGS and IMPS, while UPI only needs their UPI ID or QR code.',
        ],
      },
    ],
    related: [
      rel('NEFT', 'National Electronic Funds Transfer', 'Banking'),
      rel('RTGS', 'Real Time Gross Settlement', 'Banking'),
      rel('IMPS', 'Immediate Payment Service', 'Banking'),
      rel('UPI', 'Unified Payments Interface', 'Banking'),
      rel('IFSC', 'Indian Financial System Code', 'Banking'),
    ],
    faq: [
      {
        question: 'Which is faster, NEFT or IMPS?',
        answer:
          'IMPS is faster. It is instant and runs 24x7, whereas NEFT settles in half-hourly batches and can take a few minutes to half an hour.',
      },
      {
        question: 'What is the minimum amount for RTGS?',
        answer:
          'RTGS is for high-value transfers, with a minimum of ₹2,00,000 per transaction and no upper limit set by the RBI.',
      },
      {
        question: 'Do I need an IFSC code for UPI?',
        answer:
          'No. UPI uses a UPI ID or QR code. You only need the account number and IFSC for NEFT, RTGS and IMPS transfers.',
      },
    ],
  },
  {
    slug: 'upsc-vs-ssc-vs-ibps',
    title: 'UPSC vs SSC vs IBPS: Which Government Exam Is Right for You?',
    description:
      'UPSC, SSC and IBPS explained — what each commission recruits for, eligibility, exam stages, and how to choose the right government exam in India.',
    excerpt:
      'Three of India’s biggest recruitment bodies, three very different career paths. Here is what UPSC, SSC and IBPS stand for and who each one is for.',
    category: 'Government',
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    intro: [
      'Government job aspirants in India quickly run into three acronyms — UPSC, SSC and IBPS. They are all recruitment bodies, but they hire for very different roles, with different eligibility and exam patterns.',
      'This guide expands each one and explains who should target which, so you can spend your preparation on the right exam.',
    ],
    sections: [
      {
        heading: 'What each body recruits for',
        body: [
          'UPSC, the Union Public Service Commission, conducts the Civil Services Examination that leads to top services such as the IAS, IPS and IFS, along with several other central exams.',
          'SSC, the Staff Selection Commission, recruits for Group B and Group C posts across central government ministries and departments through exams like the CGL (Combined Graduate Level) and CHSL.',
          'IBPS, the Institute of Banking Personnel Selection, conducts the recruitment exams for public-sector banks, including Probationary Officer (PO) and Clerk roles.',
        ],
      },
      {
        heading: 'Eligibility at a glance',
        body: [
          'All three generally require a bachelor’s degree. UPSC and IBPS have an upper age limit with relaxations for reserved categories, while SSC’s age limits vary by post.',
          'UPSC’s Civil Services is famously competitive, with a limited number of attempts; SSC and IBPS allow more attempts within the age window.',
        ],
      },
      {
        heading: 'Exam structure',
        body: [
          'UPSC Civil Services has three stages: a Preliminary objective test, a written Main examination, and an Interview (Personality Test).',
          'SSC CGL and IBPS exams are typically multi-tier as well, combining objective online tests (often Prelims and Mains) with, in some cases, a skill test, document verification or interview.',
        ],
      },
      {
        heading: 'How to choose',
        body: [
          'If your goal is a leadership role in administration, police or diplomacy and you can commit to long, intense preparation, UPSC is the path. If you want a stable central-government desk role sooner, SSC is a strong option. If banking appeals to you, IBPS is the route into public-sector banks.',
          'Many aspirants prepare for more than one, since the syllabi for reasoning, quantitative aptitude and general awareness overlap considerably.',
        ],
      },
    ],
    related: [
      rel('UPSC', 'Union Public Service Commission', 'Government'),
      rel('SSC', 'Staff Selection Commission', 'Government'),
      rel('IBPS', 'Institute of Banking Personnel Selection', 'Banking'),
      rel('IAS', 'Indian Administrative Service', 'Government'),
      rel('IPS', 'Indian Police Service', 'Government'),
    ],
    faq: [
      {
        question: 'Is UPSC tougher than SSC?',
        answer:
          'Generally yes. UPSC’s Civil Services Examination has a far lower selection ratio and a wider syllabus, while SSC exams are competitive but recruit for a larger number of posts.',
      },
      {
        question: 'Does IBPS only recruit for banks?',
        answer:
          'IBPS primarily conducts recruitment for public-sector banks (such as PO and Clerk roles) and some regional rural banks and participating institutions.',
      },
      {
        question: 'Can a graduate apply to all three?',
        answer:
          'Yes. A bachelor’s degree is the common baseline, so a graduate within the age limits can apply to UPSC, SSC and IBPS exams.',
      },
    ],
  },
  {
    slug: 'common-medical-abbreviations',
    title: 'Common Medical Abbreviations on Prescriptions & Lab Reports',
    description:
      'A plain-English guide to medical abbreviations on Indian prescriptions and lab reports — dosage terms, vital signs, common blood tests and scans.',
    excerpt:
      'Confused by the shorthand on your prescription or blood report? Here is what the most common medical abbreviations mean — in plain language.',
    category: 'Medical',
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    intro: [
      'Prescriptions, lab reports and discharge summaries are written in a dense shorthand that can be hard to follow. Knowing a handful of common abbreviations makes it much easier to understand your own care.',
      'This guide explains the medical abbreviations you are most likely to see in India. It is for general understanding only — always follow your doctor’s instructions and ask them if anything is unclear.',
    ],
    sections: [
      {
        heading: 'On a prescription (dosage)',
        body: [
          'Doctors often use Latin-derived shorthand for timing. OD means once a day, BD (or BID) means twice a day, and TDS (or TID) means three times a day. QID means four times a day.',
          'HS means at bedtime, SOS means take only if needed, AC means before food and PC means after food. “Rx” simply marks the start of the prescription.',
        ],
      },
      {
        heading: 'Vital signs',
        body: [
          'BP is blood pressure, HR is heart rate, RR is respiratory rate and SpO2 is the oxygen saturation of your blood. BMI, the Body Mass Index, relates your weight to your height.',
        ],
      },
      {
        heading: 'Common blood tests',
        body: [
          'CBC is a Complete Blood Count, one of the most frequently ordered tests. ESR and CRP are markers of inflammation.',
          'LFT and KFT (also called RFT) check liver and kidney function, while HbA1c reflects your average blood sugar over the past two to three months.',
        ],
      },
      {
        heading: 'Scans and imaging',
        body: [
          'X-ray, USG (ultrasound), CT and MRI are imaging tests that look inside the body in different ways. ECG (or EKG) records the heart’s electrical activity.',
          'If a report mentions a test you do not recognise, look up the acronym or ask your doctor what it was checking for.',
        ],
      },
    ],
    related: [
      rel('CBC', 'Complete Blood Count', 'Medical'),
      rel('ECG', 'Electrocardiogram', 'Medical'),
      rel('MRI', 'Magnetic Resonance Imaging', 'Medical'),
      rel('BP', 'Blood Pressure', 'Medical'),
      rel('BMI', 'Body Mass Index', 'Medical'),
    ],
    faq: [
      {
        question: 'What does BD mean on a prescription?',
        answer:
          'BD (from the Latin “bis die”) means twice a day. TDS means three times a day and OD means once a day.',
      },
      {
        question: 'What is the difference between KFT and LFT?',
        answer:
          'LFT is a Liver Function Test and KFT (or RFT) is a Kidney/Renal Function Test. They assess how well the liver and kidneys are working, respectively.',
      },
      {
        question: 'Is this guide a substitute for medical advice?',
        answer:
          'No. It explains common abbreviations for general understanding only. Always follow your doctor and verify anything important with a qualified professional.',
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
