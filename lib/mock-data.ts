import type { AcronymRow, Category, FaqItem } from '@/types';
import { acronymSlug } from '@/lib/slug';

// Bundled seed dataset. Used for every read until Supabase env vars are set,
// so the site builds, runs, and passes Lighthouse with zero external services.
// Real, longer content arrives via scripts/generate-content.ts (DeepSeek).

interface Seed {
  acronym: string;
  full_form: string;
  category: Category;
  description: string;
  example_usage: string;
  hindi_full_form: string;
  related_acronyms: string[];
  tags: string[];
  faq: FaqItem[];
  search_volume_estimate: number;
}

const SEED: Seed[] = [
  // ─── Banking & Finance ─────────────────────────────────────
  {
    acronym: 'UPI',
    full_form: 'Unified Payments Interface',
    category: 'Banking',
    description:
      'UPI is a real-time payment system built by the National Payments Corporation of India (NPCI) that lets you send money instantly between bank accounts using a mobile app. It powers apps like Google Pay, PhonePe, and BHIM, and has become the default way Indians pay for everything from street food to rent.',
    example_usage:
      'I paid the auto driver ₹60 over UPI by scanning the QR code at the stand.',
    hindi_full_form: 'एकीकृत भुगतान इंटरफ़ेस',
    related_acronyms: ['NEFT', 'IFSC', 'RBI', 'GST'],
    tags: ['payments', 'npci', 'fintech', 'upi', 'banking'],
    faq: [
      {
        question: 'What is the full form of UPI?',
        answer:
          'UPI stands for Unified Payments Interface, a real-time bank-to-bank payment system from NPCI.',
      },
      {
        question: 'Is UPI free to use?',
        answer:
          'For regular person-to-person and most person-to-merchant payments, UPI is free for the customer.',
      },
      {
        question: 'Who runs UPI in India?',
        answer:
          'UPI is operated by the National Payments Corporation of India (NPCI) and regulated by the RBI.',
      },
    ],
    search_volume_estimate: 90000,
  },
  {
    acronym: 'RBI',
    full_form: 'Reserve Bank of India',
    category: 'Banking',
    description:
      'The RBI is India’s central bank. It issues the rupee, sets the key interest rates that influence loan and deposit rates, regulates commercial banks, and manages the country’s foreign-exchange reserves. It was established in 1935 and is headquartered in Mumbai.',
    example_usage:
      'The RBI kept the repo rate unchanged in its latest monetary policy review.',
    hindi_full_form: 'भारतीय रिज़र्व बैंक',
    related_acronyms: ['UPI', 'NEFT', 'IFSC', 'GDP'],
    tags: ['central bank', 'monetary policy', 'rbi', 'banking', 'rupee'],
    faq: [
      {
        question: 'What is the full form of RBI?',
        answer: 'RBI stands for Reserve Bank of India, the country’s central bank.',
      },
      {
        question: 'Who is the head of the RBI?',
        answer:
          'The RBI is headed by a Governor appointed by the Government of India.',
      },
      {
        question: 'When was the RBI established?',
        answer: 'The Reserve Bank of India was established on 1 April 1935.',
      },
    ],
    search_volume_estimate: 60000,
  },
  {
    acronym: 'NEFT',
    full_form: 'National Electronic Funds Transfer',
    category: 'Banking',
    description:
      'NEFT is a nationwide electronic payment system that lets banks transfer funds from one account to another. Once batch-based, it now settles around the clock, and is commonly used for salary, vendor, and bill payments where a bank account number and IFSC code are known.',
    example_usage:
      'My employer credits my salary every month through an NEFT transfer.',
    hindi_full_form: 'राष्ट्रीय इलेक्ट्रॉनिक निधि अंतरण',
    related_acronyms: ['UPI', 'IFSC', 'RBI'],
    tags: ['funds transfer', 'banking', 'neft', 'payments'],
    faq: [
      {
        question: 'What is the full form of NEFT?',
        answer: 'NEFT stands for National Electronic Funds Transfer.',
      },
      {
        question: 'What is the difference between NEFT and UPI?',
        answer:
          'NEFT uses account number and IFSC and suits larger transfers; UPI is instant and app-based for everyday payments.',
      },
      {
        question: 'Is NEFT available 24x7?',
        answer: 'Yes, the RBI made NEFT available round the clock, every day.',
      },
    ],
    search_volume_estimate: 22000,
  },
  {
    acronym: 'IFSC',
    full_form: 'Indian Financial System Code',
    category: 'Banking',
    description:
      'An IFSC is an 11-character code that uniquely identifies a bank branch in India for electronic transfers like NEFT, RTGS, and IMPS. The first four characters are the bank code and the last six identify the branch. You will find it printed on your cheque book and passbook.',
    example_usage:
      'I checked my branch’s IFSC on the first page of my passbook before adding a payee.',
    hindi_full_form: 'भारतीय वित्तीय प्रणाली कोड',
    related_acronyms: ['NEFT', 'UPI', 'RBI'],
    tags: ['ifsc', 'bank branch', 'banking', 'transfers'],
    faq: [
      {
        question: 'What is the full form of IFSC?',
        answer: 'IFSC stands for Indian Financial System Code.',
      },
      {
        question: 'How many characters are in an IFSC code?',
        answer: 'An IFSC code has 11 characters — four for the bank and the rest for the branch.',
      },
      {
        question: 'Where can I find my IFSC code?',
        answer: 'It is printed on your cheque leaf and passbook, and listed on your bank’s website.',
      },
    ],
    search_volume_estimate: 30000,
  },

  // ─── Government & Exams ────────────────────────────────────
  {
    acronym: 'UPSC',
    full_form: 'Union Public Service Commission',
    category: 'Government',
    description:
      'The UPSC is India’s central recruiting agency. It conducts the Civil Services Examination that selects officers for the IAS, IPS, IFS, and other central services, along with many other national-level exams. Clearing the UPSC is widely regarded as one of the toughest career milestones in the country.',
    example_usage:
      'She cleared the UPSC on her second attempt and was allotted the IAS.',
    hindi_full_form: 'संघ लोक सेवा आयोग',
    related_acronyms: ['IAS', 'SSC', 'NEET'],
    tags: ['civil services', 'upsc', 'government exam', 'ias'],
    faq: [
      {
        question: 'What is the full form of UPSC?',
        answer: 'UPSC stands for Union Public Service Commission.',
      },
      {
        question: 'What exams does the UPSC conduct?',
        answer:
          'The UPSC conducts the Civil Services Exam (IAS/IPS/IFS), plus NDA, CDS, and other recruitment exams.',
      },
      {
        question: 'How many attempts are allowed in UPSC?',
        answer:
          'A general-category candidate gets six attempts, with relaxations for reserved categories.',
      },
    ],
    search_volume_estimate: 80000,
  },
  {
    acronym: 'IAS',
    full_form: 'Indian Administrative Service',
    category: 'Government',
    description:
      'The IAS is the premier administrative civil service of the Government of India. IAS officers hold key posts in the central and state governments — from District Magistrate to Secretary — and are recruited through the UPSC Civil Services Examination.',
    example_usage:
      'As the District Magistrate, the IAS officer oversaw flood-relief operations.',
    hindi_full_form: 'भारतीय प्रशासनिक सेवा',
    related_acronyms: ['UPSC', 'SSC'],
    tags: ['ias', 'civil services', 'administration', 'government'],
    faq: [
      {
        question: 'What is the full form of IAS?',
        answer: 'IAS stands for Indian Administrative Service.',
      },
      {
        question: 'How do you become an IAS officer?',
        answer: 'By clearing the UPSC Civil Services Examination with a high enough rank.',
      },
      {
        question: 'What is the role of an IAS officer?',
        answer:
          'IAS officers run the administrative machinery, implementing government policy at district, state, and central levels.',
      },
    ],
    search_volume_estimate: 50000,
  },
  {
    acronym: 'SSC',
    full_form: 'Staff Selection Commission',
    category: 'Government',
    description:
      'The SSC recruits staff for various posts in ministries, departments, and subordinate offices of the Government of India. Its best-known exams are the Combined Graduate Level (CGL) and Combined Higher Secondary Level (CHSL), taken by millions of aspirants each year.',
    example_usage:
      'He is preparing for the SSC CGL exam to land a government clerical job.',
    hindi_full_form: 'कर्मचारी चयन आयोग',
    related_acronyms: ['UPSC', 'IAS'],
    tags: ['ssc', 'government exam', 'recruitment', 'cgl'],
    faq: [
      {
        question: 'What is the full form of SSC?',
        answer: 'SSC stands for Staff Selection Commission.',
      },
      {
        question: 'What is SSC CGL?',
        answer:
          'SSC CGL is the Combined Graduate Level exam for graduate-level government posts.',
      },
      {
        question: 'Who can apply for SSC exams?',
        answer:
          'Eligibility varies by exam — generally Indian citizens meeting the age and education criteria for the post.',
      },
    ],
    search_volume_estimate: 40000,
  },
  {
    acronym: 'FIR',
    full_form: 'First Information Report',
    category: 'Government',
    description:
      'An FIR is the written document a police station prepares when it first receives information about a cognizable offence. It sets the criminal-justice process in motion and is your right to file under the Code of Criminal Procedure. A copy of the FIR must be given to the complainant free of cost.',
    example_usage:
      'After the phone was stolen, she filed an FIR at the local police station.',
    hindi_full_form: 'प्रथम सूचना रिपोर्ट',
    related_acronyms: ['UPSC', 'PAN'],
    tags: ['fir', 'police', 'law', 'criminal procedure'],
    faq: [
      {
        question: 'What is the full form of FIR?',
        answer: 'FIR stands for First Information Report.',
      },
      {
        question: 'Can an FIR be filed online?',
        answer:
          'Many states allow online FIR or e-FIR filing for specific offences through the state police website.',
      },
      {
        question: 'Is filing an FIR free?',
        answer: 'Yes, registering an FIR is free and you are entitled to a free copy.',
      },
    ],
    search_volume_estimate: 35000,
  },

  // ─── Education ─────────────────────────────────────────────
  {
    acronym: 'NEET',
    full_form: 'National Eligibility cum Entrance Test',
    category: 'Education',
    description:
      'NEET is the single national entrance exam for admission to undergraduate medical (MBBS) and dental (BDS) courses in India. Conducted by the National Testing Agency, it replaced multiple separate medical entrance tests and is one of the most competitive exams in the country.',
    example_usage:
      'He scored high in NEET and secured an MBBS seat at a government college.',
    hindi_full_form: 'राष्ट्रीय पात्रता सह प्रवेश परीक्षा',
    related_acronyms: ['JEE', 'CBSE', 'GATE'],
    tags: ['neet', 'medical entrance', 'mbbs', 'nta', 'education'],
    faq: [
      {
        question: 'What is the full form of NEET?',
        answer: 'NEET stands for National Eligibility cum Entrance Test.',
      },
      {
        question: 'Who conducts NEET?',
        answer: 'NEET is conducted by the National Testing Agency (NTA).',
      },
      {
        question: 'What is NEET used for?',
        answer:
          'NEET is the entrance test for undergraduate medical and dental courses (MBBS and BDS) in India.',
      },
    ],
    search_volume_estimate: 85000,
  },
  {
    acronym: 'JEE',
    full_form: 'Joint Entrance Examination',
    category: 'Education',
    description:
      'JEE is the national engineering entrance exam, held in two stages — JEE Main and JEE Advanced. JEE Main is the gateway to NITs and other institutes, while JEE Advanced determines admission to the prestigious IITs. It is taken by over a million students every year.',
    example_usage:
      'She cleared JEE Advanced and joined the Computer Science programme at an IIT.',
    hindi_full_form: 'संयुक्त प्रवेश परीक्षा',
    related_acronyms: ['NEET', 'GATE', 'CBSE'],
    tags: ['jee', 'engineering entrance', 'iit', 'nit', 'education'],
    faq: [
      {
        question: 'What is the full form of JEE?',
        answer: 'JEE stands for Joint Entrance Examination.',
      },
      {
        question: 'What is the difference between JEE Main and JEE Advanced?',
        answer:
          'JEE Main is for NITs and qualifies you for JEE Advanced, which is for admission to the IITs.',
      },
      {
        question: 'How many times can you attempt JEE?',
        answer:
          'JEE Main can be attempted across consecutive years; JEE Advanced allows a limited number of attempts.',
      },
    ],
    search_volume_estimate: 75000,
  },
  {
    acronym: 'CBSE',
    full_form: 'Central Board of Secondary Education',
    category: 'Education',
    description:
      'CBSE is a national board of education in India for public and private schools, controlled by the Government of India. It prescribes the syllabus and conducts the Class 10 and Class 12 board examinations followed by thousands of affiliated schools across the country and abroad.',
    example_usage:
      'The CBSE Class 12 results were announced on the board’s official website.',
    hindi_full_form: 'केंद्रीय माध्यमिक शिक्षा बोर्ड',
    related_acronyms: ['NEET', 'JEE'],
    tags: ['cbse', 'school board', 'board exam', 'education'],
    faq: [
      {
        question: 'What is the full form of CBSE?',
        answer: 'CBSE stands for Central Board of Secondary Education.',
      },
      {
        question: 'Which classes have CBSE board exams?',
        answer: 'CBSE conducts board examinations for Class 10 and Class 12.',
      },
      {
        question: 'Is CBSE a national or state board?',
        answer: 'CBSE is a national board governed by the Government of India.',
      },
    ],
    search_volume_estimate: 45000,
  },
  {
    acronym: 'GATE',
    full_form: 'Graduate Aptitude Test in Engineering',
    category: 'Education',
    description:
      'GATE is a national exam that tests the comprehensive understanding of undergraduate subjects in engineering and science. A good GATE score is used for admission to M.Tech programmes at IITs and NITs, and increasingly for recruitment by public-sector undertakings (PSUs).',
    example_usage:
      'A strong GATE score helped him get shortlisted for a PSU engineering job.',
    hindi_full_form: 'इंजीनियरिंग में स्नातक अभिक्षमता परीक्षा',
    related_acronyms: ['JEE', 'NEET'],
    tags: ['gate', 'm.tech', 'psu', 'engineering', 'education'],
    faq: [
      {
        question: 'What is the full form of GATE?',
        answer: 'GATE stands for Graduate Aptitude Test in Engineering.',
      },
      {
        question: 'What is a GATE score used for?',
        answer:
          'It is used for M.Tech admissions at IITs/NITs and for recruitment by many PSUs.',
      },
      {
        question: 'Who conducts GATE?',
        answer:
          'GATE is jointly conducted by the IITs and the Indian Institute of Science (IISc).',
      },
    ],
    search_volume_estimate: 38000,
  },

  // ─── Medical & Health ──────────────────────────────────────
  {
    acronym: 'AIIMS',
    full_form: 'All India Institute of Medical Sciences',
    category: 'Medical',
    description:
      'AIIMS is a group of autonomous public medical colleges and hospitals of national importance. The flagship institute in New Delhi is among the most respected medical centres in India, known for affordable treatment, advanced research, and highly competitive admissions.',
    example_usage:
      'The patient was referred to AIIMS Delhi for specialised cardiac care.',
    hindi_full_form: 'अखिल भारतीय आयुर्विज्ञान संस्थान',
    related_acronyms: ['ICU', 'MRI', 'NEET'],
    tags: ['aiims', 'hospital', 'medical college', 'health'],
    faq: [
      {
        question: 'What is the full form of AIIMS?',
        answer: 'AIIMS stands for All India Institute of Medical Sciences.',
      },
      {
        question: 'How do you get admission to AIIMS for MBBS?',
        answer: 'MBBS admission to AIIMS is now through the NEET exam.',
      },
      {
        question: 'Where is the main AIIMS located?',
        answer: 'The original and flagship AIIMS is located in New Delhi.',
      },
    ],
    search_volume_estimate: 42000,
  },
  {
    acronym: 'MRI',
    full_form: 'Magnetic Resonance Imaging',
    category: 'Medical',
    description:
      'MRI is a medical imaging technique that uses strong magnetic fields and radio waves to produce detailed pictures of the inside of the body. It is especially useful for examining the brain, spine, joints, and soft tissues, and does not use ionising radiation.',
    example_usage:
      'The doctor ordered an MRI of the knee to check for a ligament tear.',
    hindi_full_form: 'चुंबकीय अनुनाद इमेजिंग',
    related_acronyms: ['ICU', 'AIIMS', 'BP'],
    tags: ['mri', 'imaging', 'diagnostics', 'health'],
    faq: [
      {
        question: 'What is the full form of MRI?',
        answer: 'MRI stands for Magnetic Resonance Imaging.',
      },
      {
        question: 'Is an MRI scan safe?',
        answer:
          'MRI is generally safe and uses no ionising radiation, but metal implants must be disclosed beforehand.',
      },
      {
        question: 'How is MRI different from a CT scan?',
        answer:
          'MRI uses magnets and radio waves and excels at soft tissue; CT uses X-rays and is faster for bone and trauma.',
      },
    ],
    search_volume_estimate: 28000,
  },
  {
    acronym: 'ICU',
    full_form: 'Intensive Care Unit',
    category: 'Medical',
    description:
      'An ICU is a special hospital department that provides intensive treatment and continuous monitoring to patients with severe or life-threatening illnesses and injuries. It is staffed by specially trained doctors and nurses and equipped with advanced life-support machines.',
    example_usage:
      'After the surgery, he was kept in the ICU for two days of observation.',
    hindi_full_form: 'गहन चिकित्सा इकाई',
    related_acronyms: ['MRI', 'AIIMS', 'BP'],
    tags: ['icu', 'critical care', 'hospital', 'health'],
    faq: [
      {
        question: 'What is the full form of ICU?',
        answer: 'ICU stands for Intensive Care Unit.',
      },
      {
        question: 'When is a patient admitted to the ICU?',
        answer:
          'When they need close monitoring and life support for a serious or unstable condition.',
      },
      {
        question: 'What is the difference between ICU and ward?',
        answer:
          'An ICU offers continuous monitoring and advanced support; a general ward is for stable, recovering patients.',
      },
    ],
    search_volume_estimate: 26000,
  },
  {
    acronym: 'BP',
    full_form: 'Blood Pressure',
    category: 'Medical',
    description:
      'Blood pressure is the force of circulating blood against the walls of the arteries, recorded as two numbers — systolic over diastolic. Persistently high blood pressure (hypertension) is a major risk factor for heart disease and stroke, making regular checks important.',
    example_usage:
      'The nurse measured his BP and found it slightly above the normal range.',
    hindi_full_form: 'रक्तचाप',
    related_acronyms: ['ICU', 'MRI', 'AIIMS'],
    tags: ['blood pressure', 'hypertension', 'health', 'bp'],
    faq: [
      {
        question: 'What is the full form of BP?',
        answer: 'In a medical context, BP stands for Blood Pressure.',
      },
      {
        question: 'What is a normal BP reading?',
        answer: 'A reading around 120/80 mmHg is generally considered normal for adults.',
      },
      {
        question: 'What does high BP mean?',
        answer:
          'Consistently high blood pressure is called hypertension and raises the risk of heart disease and stroke.',
      },
    ],
    search_volume_estimate: 33000,
  },

  // ─── Technology ────────────────────────────────────────────
  {
    acronym: 'API',
    full_form: 'Application Programming Interface',
    category: 'Tech',
    description:
      'An API is a set of rules that lets one software program talk to another. It defines how requests and responses should be structured, so developers can use features or data from another service — like payments, maps, or weather — without knowing its internal code.',
    example_usage:
      'The app uses a weather API to show the forecast on the home screen.',
    hindi_full_form: 'अनुप्रयोग प्रोग्रामिंग इंटरफ़ेस',
    related_acronyms: ['HTTP', 'RAM', 'GPS'],
    tags: ['api', 'software', 'integration', 'developer'],
    faq: [
      {
        question: 'What is the full form of API?',
        answer: 'API stands for Application Programming Interface.',
      },
      {
        question: 'What is an API used for?',
        answer:
          'It lets one application use the data or features of another in a structured, secure way.',
      },
      {
        question: 'What is a REST API?',
        answer:
          'A REST API is a common style of web API that uses standard HTTP methods like GET and POST.',
      },
    ],
    search_volume_estimate: 48000,
  },
  {
    acronym: 'HTTP',
    full_form: 'HyperText Transfer Protocol',
    category: 'Tech',
    description:
      'HTTP is the protocol that web browsers and servers use to exchange information on the World Wide Web. When you open a website, your browser sends an HTTP request and the server returns the page. Its secure version, HTTPS, encrypts this exchange.',
    example_usage:
      'The browser sends an HTTP request every time you load a web page.',
    hindi_full_form: 'हाइपरटेक्स्ट ट्रांसफर प्रोटोकॉल',
    related_acronyms: ['API', 'GPS', 'RAM'],
    tags: ['http', 'web', 'protocol', 'internet'],
    faq: [
      {
        question: 'What is the full form of HTTP?',
        answer: 'HTTP stands for HyperText Transfer Protocol.',
      },
      {
        question: 'What is the difference between HTTP and HTTPS?',
        answer:
          'HTTPS is HTTP with encryption (TLS), which keeps the data exchanged with a website private.',
      },
      {
        question: 'What does HTTP do?',
        answer: 'It defines how browsers request and receive web pages from servers.',
      },
    ],
    search_volume_estimate: 31000,
  },
  {
    acronym: 'RAM',
    full_form: 'Random Access Memory',
    category: 'Tech',
    description:
      'RAM is the short-term memory a computer or phone uses to hold data and programs that are currently in use. It is fast but temporary — its contents are lost when the device powers off. More RAM generally lets a device run more apps smoothly at once.',
    example_usage:
      'I bought a phone with 8 GB of RAM so it can handle many apps at once.',
    hindi_full_form: 'रैंडम एक्सेस मेमोरी',
    related_acronyms: ['API', 'HTTP', 'GPS'],
    tags: ['ram', 'memory', 'hardware', 'computer'],
    faq: [
      {
        question: 'What is the full form of RAM?',
        answer: 'RAM stands for Random Access Memory.',
      },
      {
        question: 'What is the difference between RAM and storage?',
        answer:
          'RAM holds data in active use and is temporary; storage (like an SSD) keeps data permanently.',
      },
      {
        question: 'Does more RAM make a device faster?',
        answer:
          'More RAM helps a device run more apps at once smoothly, but it is only one factor in overall speed.',
      },
    ],
    search_volume_estimate: 29000,
  },
  {
    acronym: 'GPS',
    full_form: 'Global Positioning System',
    category: 'Tech',
    description:
      'GPS is a satellite-based navigation system that tells a receiver its exact location anywhere on Earth. Smartphones use it for maps, ride-hailing, and delivery tracking by calculating position from signals sent by a network of orbiting satellites.',
    example_usage:
      'The delivery app used GPS to track the rider on the map in real time.',
    hindi_full_form: 'वैश्विक स्थिति प्रणाली',
    related_acronyms: ['API', 'HTTP', 'RAM'],
    tags: ['gps', 'navigation', 'location', 'satellite'],
    faq: [
      {
        question: 'What is the full form of GPS?',
        answer: 'GPS stands for Global Positioning System.',
      },
      {
        question: 'How does GPS work?',
        answer:
          'A GPS receiver calculates its position using timing signals from multiple satellites overhead.',
      },
      {
        question: 'Does GPS need the internet?',
        answer:
          'GPS itself does not need the internet, but map apps use data to load maps and traffic.',
      },
    ],
    search_volume_estimate: 34000,
  },

  // ─── General ───────────────────────────────────────────────
  {
    acronym: 'PDF',
    full_form: 'Portable Document Format',
    category: 'General',
    description:
      'PDF is a file format created by Adobe that preserves a document’s fonts, images, and layout exactly, no matter what device or software opens it. It is the standard for sharing forms, e-books, admit cards, and official documents that should not be altered.',
    example_usage:
      'I downloaded my exam admit card as a PDF and took a printout.',
    hindi_full_form: 'पोर्टेबल डॉक्यूमेंट फॉर्मेट',
    related_acronyms: ['GST', 'PAN', 'GDP'],
    tags: ['pdf', 'document', 'file format', 'general'],
    faq: [
      {
        question: 'What is the full form of PDF?',
        answer: 'PDF stands for Portable Document Format.',
      },
      {
        question: 'Why are PDFs so widely used?',
        answer:
          'A PDF looks the same on every device and is hard to alter, which makes it ideal for official documents.',
      },
      {
        question: 'Can a PDF be edited?',
        answer:
          'PDFs can be edited with special software, but they are designed mainly to preserve a fixed layout.',
      },
    ],
    search_volume_estimate: 52000,
  },
  {
    acronym: 'GDP',
    full_form: 'Gross Domestic Product',
    category: 'General',
    description:
      'GDP is the total monetary value of all finished goods and services produced within a country over a period, usually a year. It is the headline measure of the size and health of an economy, and its growth rate is closely watched by policymakers and investors.',
    example_usage:
      'Economists revised their estimate of India’s GDP growth for the year.',
    hindi_full_form: 'सकल घरेलू उत्पाद',
    related_acronyms: ['GST', 'RBI', 'PAN'],
    tags: ['gdp', 'economy', 'growth', 'general'],
    faq: [
      {
        question: 'What is the full form of GDP?',
        answer: 'GDP stands for Gross Domestic Product.',
      },
      {
        question: 'What does GDP measure?',
        answer:
          'It measures the total value of goods and services produced within a country in a given period.',
      },
      {
        question: 'Why is GDP important?',
        answer: 'GDP is the main indicator of an economy’s size and how fast it is growing.',
      },
    ],
    search_volume_estimate: 36000,
  },
  {
    acronym: 'GST',
    full_form: 'Goods and Services Tax',
    category: 'General',
    description:
      'GST is a single indirect tax levied on the supply of goods and services across India. Introduced in 2017, it replaced a web of central and state taxes with one unified system, with rates split into slabs and revenue shared between the centre and the states.',
    example_usage:
      'The restaurant bill showed the food charge plus GST at the applicable rate.',
    hindi_full_form: 'वस्तु एवं सेवा कर',
    related_acronyms: ['GDP', 'PAN', 'RBI'],
    tags: ['gst', 'tax', 'indirect tax', 'general'],
    faq: [
      {
        question: 'What is the full form of GST?',
        answer: 'GST stands for Goods and Services Tax.',
      },
      {
        question: 'When was GST introduced in India?',
        answer: 'GST came into effect on 1 July 2017.',
      },
      {
        question: 'What taxes did GST replace?',
        answer:
          'It replaced many central and state indirect taxes such as VAT, service tax, and excise duty.',
      },
    ],
    search_volume_estimate: 46000,
  },
  {
    acronym: 'PAN',
    full_form: 'Permanent Account Number',
    category: 'General',
    description:
      'A PAN is a unique ten-character alphanumeric identifier issued by the Income Tax Department to every taxpayer in India. It is required for filing income-tax returns, opening bank accounts, and high-value transactions, and serves as a key proof of identity.',
    example_usage:
      'You need to quote your PAN when filing your income-tax return.',
    hindi_full_form: 'स्थायी खाता संख्या',
    related_acronyms: ['GST', 'GDP', 'PDF'],
    tags: ['pan', 'income tax', 'identity', 'general'],
    faq: [
      {
        question: 'What is the full form of PAN?',
        answer: 'PAN stands for Permanent Account Number.',
      },
      {
        question: 'Who issues PAN cards in India?',
        answer: 'PAN is issued by the Income Tax Department of India.',
      },
      {
        question: 'Where is a PAN required?',
        answer:
          'It is needed for tax returns, opening bank accounts, and many high-value financial transactions.',
      },
    ],
    search_volume_estimate: 44000,
  },
];

const NOW = '2026-06-14T00:00:00.000Z';

export const MOCK_ACRONYMS: AcronymRow[] = SEED.map((s, i) => ({
  id: `mock-${String(i + 1).padStart(4, '0')}`,
  acronym: s.acronym,
  full_form: s.full_form,
  category: s.category,
  description: s.description,
  example_usage: s.example_usage,
  hindi_full_form: s.hindi_full_form,
  hindi_description: null,
  faq: s.faq,
  related_acronyms: s.related_acronyms,
  tags: s.tags,
  slug: acronymSlug(s.acronym),
  search_volume_estimate: s.search_volume_estimate,
  is_published: true,
  is_reviewed: true,
  meta_title: `${s.acronym} Full Form | ${s.full_form}`,
  meta_description: `${s.acronym} full form is ${s.full_form}. ${s.description.slice(0, 90)}`.slice(0, 160),
  created_at: NOW,
  updated_at: NOW,
}));
