/**
 * Generate acronym content and insert it (unpublished) into Supabase.
 *
 *   npm run generate                 # uses the massive seed list (1000+ acronyms)
 *   npm run generate -- RBI SEBI UPI # generate specific acronyms
 *
 * Falls back to mock content when DEEPSEEK_API_KEY is unset, and to a dry run
 * (no writes) when SUPABASE_SERVICE_ROLE_KEY is unset.
 */
import fs from 'node:fs';
import { processAcronym } from '../lib/generate';
import { isSupabaseServiceConfigured } from '../lib/supabase-server';
import { activeProvider, isLlmConfigured } from '../lib/llm';
import { MASSIVE_SEED_10K } from '../lib/massive-seed-10k';
import { WORLD_STATES_SEED } from '../lib/world-states-seed';

const DEFAULT_SEED = [
  // Banking & Finance (50+)
  'RBI', 'SEBI', 'NEFT', 'RTGS', 'IMPS', 'UPI', 'KYC', 'EMI', 'CIBIL', 'IFSC',
  'NBFC', 'ATM', 'NPCI', 'BHIM', 'NSE', 'BSE', 'SENSEX', 'NIFTY', 'FD', 'NRI',
  'SWIFT', 'IBAN', 'HDFC', 'ICICI', 'SBI', 'AXIS', 'BNP', 'HSBC', 'CIBIL', 'FEMA',
  'CRR', 'SLR', 'REPO', 'REVERSE', 'LAF', 'MSF', 'TDS', 'TCS', 'GST', 'IGST',
  'SGST', 'UGST', 'CESS', 'MUDRA', 'NPA', 'GNPA', 'CAR', 'ROA', 'ROE', 'CASA',
  'NISM', 'AMFI', 'FEMA', 'DWCRA', 'SIDBI', 'ECGC', 'CGSL', 'WDV', 'SYD', 'FIFO',

  // Government & Exams (60+)
  'UPSC', 'IAS', 'IPS', 'IFS', 'SSC', 'CGL', 'IBPS', 'NDA', 'CDS', 'FIR',
  'CBI', 'ED', 'RTI', 'PIL', 'MGNREGA', 'PAN', 'TAN', 'GST', 'ITR', 'TDS',
  'FEMA', 'PMJDY', 'PMAY', 'PMKVY', 'MUDRA', 'NREGA', 'AADHAR', 'AADHAAR', 'EID', 'UID',
  'UAN', 'UAN', 'PFMS', 'RTGS', 'NEFT', 'IMPS', 'NIC', 'PIU', 'CAG', 'PAC',
  'LOK', 'RAJYA', 'VIDHAN', 'SANSAD', 'MCD', 'TMC', 'BBMP', 'BMC', 'GHMC', 'PMO',
  'MEA', 'MoD', 'MOEF', 'MHRD', 'MoU', 'IIT', 'NIT', 'IIM', 'AICTE', 'UGC',

  // Education (60+)
  'CBSE', 'ICSE', 'NEET', 'JEE', 'GATE', 'UGC', 'NET', 'AICTE', 'IIT', 'NIT',
  'IIM', 'AIIMS', 'MBBS', 'BTECH', 'MBA', 'PHD', 'CAT', 'CLAT', 'NIRF', 'NAAC',
  'BCA', 'BCS', 'BSC', 'BA', 'MA', 'MSC', 'MCA', 'MEng', 'BTech', 'MTech',
  'GDPI', 'WAT', 'GD', 'PI', 'XAT', 'MAT', 'GMAT', 'GRE', 'IELTS', 'TOEFL',
  'KVPY', 'KVPY', 'APEX', 'NCERT', 'NIOS', 'IGNOU', 'ODL', 'MOOCs', 'SWAYAM', 'DIKSHA',
  'FDP', 'HEI', 'STEM', 'PAGDANDI', 'NPTEL', 'NPTELHRD', 'NASSCOM', 'E-PG', 'NMEICT', 'ELIS',

  // Medical & Health (70+)
  'WHO', 'ICU', 'OPD', 'MRI', 'CT', 'ECG', 'BP', 'BMI', 'HIV', 'TB',
  'COVID', 'PCR', 'RTPCR', 'SARS', 'MERS', 'SOPS', 'PPE', 'N95', 'HEPA', 'UVGI',
  'IPD', 'OPWD', 'ED', 'ER', 'OR', 'ICL', 'PICU', 'NICU', 'SICU', 'CCU',
  'BP', 'HR', 'RR', 'SpO2', 'PaO2', 'PaCO2', 'pH', 'pO2', 'HCO3', 'BE',
  'BUN', 'CR', 'eGFR', 'ALB', 'AST', 'ALT', 'GGT', 'ALP', 'TSH', 'T3',
  'T4', 'FT3', 'FT4', 'ACTH', 'CRH', 'GH', 'FSH', 'LH', 'TSH', 'PTH',
  'INR', 'PT', 'PTT', 'CBC', 'WBC', 'RBC', 'Hb', 'PCV', 'MCV', 'MCH',
  'MCHC', 'TLC', 'DLC', 'ESR', 'CRP', 'ABG', 'VBG', 'ECHO', 'EMG', 'EEG',
  'AJCC', 'TNM', 'FIGO', 'CHILD', 'APGAR', 'ASA', 'NYHA', 'APACHE', 'SOFA', 'QSOFA',

  // Technology (80+)
  'AI', 'ML', 'API', 'OS', 'CPU', 'GPU', 'RAM', 'ROM', 'HTTP', 'HTTPS',
  'URL', 'VPN', 'DNS', 'GPS', 'OTP', 'QR', 'PDF', 'USB', 'WIFI', 'IOT',
  'IoT', 'MQTT', 'REST', 'SOAP', 'XML', 'JSON', 'CSV', 'SQL', 'NOSQL', 'RDBMS',
  'ACID', 'BASE', 'CAP', 'PAXOS', 'RAFT', 'DLT', 'CLI', 'GUI', 'TUI', 'VUI',
  'NLP', 'CV', 'DL', 'CNN', 'RNN', 'LSTM', 'GAN', 'VAE', 'RL', 'QL',
  'DB', 'ETL', 'ELT', 'DW', 'OLAP', 'OLTP', 'CRUD', 'ORM', 'ODM', 'MVC',
  'MVVM', 'MVP', 'OOP', 'FP', 'AOP', 'SOA', 'MSA', 'API', 'SDK', 'IDE',
  'SCM', 'VCS', 'CI', 'CD', 'DevOps', 'IaC', 'CDK', 'SAC', 'GitOps', 'SecOps',
  'SIEM', 'WAF', 'DDoS', 'XSS', 'SQL', 'CSRF', 'CORS', 'SAML', 'OAuth', 'OIDC',
  'JWT', 'MFA', 'TOTP', 'OTP', 'PKI', 'TLS', 'SSL', 'SSH', 'PGP', 'GPG',
  'AWS', 'GCP', 'Azure', 'K8s', 'Docker', 'OpenStack', 'Terraform', 'Ansible', 'Chef', 'Puppet',

  // Business & Corporate (50+)
  'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CHRO', 'SVP', 'VP', 'EVP', 'AVP',
  'HR', 'HCM', 'HRIS', 'ATS', 'LMS', 'CRM', 'SFA', 'ERP', 'SCM', 'MES',
  'B2B', 'B2C', 'C2C', 'D2C', 'G2B', 'B2E', 'A2A', 'ROI', 'ROR', 'NPV',
  'IRR', 'WACC', 'CAGR', 'EBITDA', 'EPS', 'P/E', 'P/B', 'PEG', 'EV', 'ROIC',
  'KPI', 'OKR', 'MBO', 'SMART', 'SWOT', 'PEST', 'PORTER', 'VRIO', 'CAPM', 'APT',
  'BPR', 'TQM', 'LM', 'SLA', 'SLO', 'SLI', 'ITSM', 'COBIT', 'ITIL', 'CMMI',

  // Legal & Compliance (40+)
  'IP', 'IPR', 'TM', 'R', 'Copyright', 'Patent', 'Design', 'Trade', 'Secret', 'GI',
  'DPA', 'GDPR', 'CCPA', 'HIPAA', 'SOC', 'ISO', 'IEC', 'NIST', 'OWASP', 'PCI',
  'DSS', 'GLBA', 'FCPA', 'AML', 'KYC', 'CDD', 'EDD', 'PEP', 'SAR', 'STR',
  'CTR', 'LCR', 'CSR', 'ESG', 'DEI', 'HRA', 'UDHR', 'ICCPR', 'ICESCR', 'CAT',

  // Military & Defense (30+)
  'ICJ', 'UNCLOS', 'AFI', 'AFR', 'AFT', 'AFH', 'AIR', 'NOTAM', 'RVSM', 'CFIT',
  'ACAS', 'TCAS', 'GPWS', 'EGPWS', 'A/C', 'Helo', 'ADS', 'ADS-B', 'Mode', 'SFAR',

  // Sports & Entertainment (40+)
  'IPL', 'ODI', 'T20', 'Test', 'PSL', 'BPL', 'CPL', 'BBL', 'LPL', 'MSL',
  'IPL', 'RCB', 'MI', 'CSK', 'DC', 'KKR', 'RR', 'KXIP', 'SRH', 'RR',
  'FIFA', 'UEFA', 'CONMEBOL', 'AFC', 'CAF', 'OFC', 'ICC', 'FIH', 'BWF', 'ITF',
  'ATP', 'WTA', 'Grand', 'Slam', 'AO', 'RG', 'Wimbledon', 'US', 'Masters', 'Olympics',

  // Science & Nature (50+)
  'DNA', 'RNA', 'mRNA', 'tRNA', 'rRNA', 'ATP', 'GTP', 'ADP', 'NAD', 'NADH',
  'FAD', 'FADH2', 'CoA', 'GSH', 'ROS', 'RNS', 'APO', 'Apo', 'VLDL', 'LDL',
  'HDL', 'TC', 'TG', 'FFA', 'Acetyl', 'GCN', 'mGCN', 'PPP', 'TCA', 'ETC',
  'OXPHOS', 'ATP', 'Kcal', 'CHO', 'Protein', 'Fat', 'Carbs', 'Protein', 'BCAA', 'EAA',
  'NEAA', 'CEAA', 'SCAA', 'AAA', 'AAB', 'AAC', 'AAD', 'AAE', 'AAF', 'AAG',

  // General (100+)
  'GDP', 'GNP', 'NNP', 'NDP', 'PI', 'DPI', 'SDP', 'HDI', 'MDG', 'SDG',
  'UN', 'UNESCO', 'UNICEF', 'UNHCR', 'UNAIDS', 'UNEP', 'UNIDO', 'UNOC', 'UNCTAD', 'UNDP',
  'UNEP', 'UNHCR', 'UNFPA', 'UNHABITAT', 'UNOPS', 'UNODC', 'UNRWA', 'UNSMIS', 'UNSOS', 'UNSOM',
  'ASEAN', 'APEC', 'SAARC', 'AU', 'EU', 'MERCOSUR', 'PTIC', 'ALBA', 'CELAC', 'ECOWAS',
  'SADC', 'COMESA', 'EAC', 'IGAD', 'WAEMU', 'CARICOM', 'OECS', 'CSME', 'BIMSTEC', 'SAARC',
  'PM', 'CM', 'DM', 'SDM', 'SP', 'CP', 'DP', 'SDP', 'LG', 'ZP',
  'NGO', 'INGO', 'GONGO', 'QUANGO', 'CSO', 'CBO', 'FBO', 'SHG', 'JLG', 'FPO',
  'DOB', 'PIN', 'ISD', 'STD', 'STP', 'WTP', 'DTP', 'CTP', 'ETP', 'MSW',
];

const BATCH_SIZE = 250; // 250 parallel requests per batch
const BATCH_DELAY_MS = 6000; // 250 req / 6s = 2500/min, matching the DeepSeek rate limit
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const FULL_SEED = Array.from(new Set([...MASSIVE_SEED_10K, ...WORLD_STATES_SEED]));

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const list = args.length > 0 ? args : FULL_SEED;

  console.log(
    `Model: ${isLlmConfigured() ? `live (${activeProvider()})` : 'mock'} | ` +
      `Supabase: ${isSupabaseServiceConfigured() ? 'live (writes)' : 'dry run'}`,
  );
  console.log(`Processing ${list.length} acronyms (${BATCH_SIZE} parallel batches)…\n`);

  const errorLog = fs.createWriteStream('generation-errors.log', { flags: 'a' });
  const tally = { ok: 0, skipped: 0, mock: 0, error: 0 };
  let processed = 0;

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const batch = list.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((acronym) => processAcronym(acronym)));

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const acronym = batch[j];
      tally[result.status] += 1;
      processed++;

      if (result.status === 'error') {
        console.error(`FAIL ${acronym}: ${result.message}`);
        errorLog.write(`${new Date().toISOString()} | ${acronym} | ${result.message}\n`);
      } else {
        const label =
          result.status === 'ok'
            ? result.content?.full_form ?? ''
            : result.status;
        console.log(`[${processed}/${list.length}] ${result.status.toUpperCase().padEnd(7)} ${acronym} ${label}`);
      }
    }

    if (i + BATCH_SIZE < list.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  errorLog.end();
  console.log(
    `\nDone. ok=${tally.ok} skipped=${tally.skipped} mock=${tally.mock} error=${tally.error}`,
  );
  if (!isSupabaseServiceConfigured()) {
    console.log('Dry run — set SUPABASE_SERVICE_ROLE_KEY to persist drafts.');
  } else {
    console.log('Drafts saved as unpublished. Approve them in /admin.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
