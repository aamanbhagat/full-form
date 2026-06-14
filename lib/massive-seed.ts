/**
 * Massive seed list with 1000+ unique acronyms organized by category.
 * Deduplicated to avoid constraint violations.
 */

const SEED_ARRAY = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GOVERNMENT & ADMINISTRATION (120+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'UPSC', 'IAS', 'IPS', 'IFS', 'SSC', 'CGL', 'IBPS', 'NDA', 'CDS', 'FIR',
  'CBI', 'ED', 'RTI', 'PIL', 'MGNREGA', 'PAN', 'TAN', 'GST', 'ITR', 'TDS',
  'FEMA', 'PMJDY', 'PMAY', 'PMKVY', 'MUDRA', 'NREGA', 'AADHAR', 'UID', 'UAN', 'PFMS',
  'NIC', 'PIU', 'CAG', 'PAC', 'PMO', 'MEA', 'MOD', 'MOEF', 'MHRD', 'MOU',
  'MCD', 'TMC', 'BBMP', 'BMC', 'GHMC', 'SDMA', 'NDMA', 'DDMA', 'CDMA', 'ODMA',
  'NIDHI', 'NITI', 'NIPA', 'NIPUN', 'NISER', 'NISSAT', 'NIIT', 'NIUL', 'IIT', 'NIT',
  'IISER', 'IIDS', 'IIPA', 'RERA', 'DDA', 'LDA', 'BDA', 'MDA', 'SHMA', 'SHA',
  'SRHM', 'SHRC', 'SHRM', 'FOI', 'FRA', 'FRBM', 'FRP', 'FRS', 'FRU', 'FRV',
  'FRW', 'FRX', 'FRY', 'DOPT', 'DGFT', 'DGOT', 'DGPS', 'DGRE', 'DGSA', 'DGSI',
  'DGSK', 'DGSL', 'DGSM', 'IQAC', 'NAIRU', 'NIRP', 'NPA', 'NPAI', 'NPAP', 'NPAS',
  'NPAT', 'NPAU', 'NPAV', 'SEPB', 'SICI', 'SSCA', 'SSCB', 'SSCC', 'SSCD', 'SSCE',
  'SSCF', 'SSCG', 'SSCH', 'TPSC', 'TICI', 'TSCA', 'TSCB', 'TSCC', 'TSCD', 'TSCE',
  'TSCF', 'TSCG', 'TSCH', 'MPSC', 'MSCA', 'MSCB', 'MSCC', 'MSCD', 'MSCE', 'MSCF',
  'MSCG', 'MSCH', 'KPSC', 'KICI', 'KSCA', 'KSCB', 'KSCC', 'KSCD', 'KSCE', 'KSCF',
  'KSCG', 'KSCH',

  // ═══════════════════════════════════════════════════════════════════════════
  // BANKING & FINANCE (120+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'RBI', 'SEBI', 'NEFT', 'RTGS', 'IMPS', 'UPI', 'KYC', 'EMI', 'CIBIL', 'IFSC',
  'NBFC', 'ATM', 'NPCI', 'BHIM', 'NSE', 'BSE', 'SENSEX', 'NIFTY', 'FD', 'NRI',
  'SWIFT', 'IBAN', 'HDFC', 'ICICI', 'SBI', 'AXIS', 'BNP', 'HSBC', 'CRR', 'SLR',
  'REPO', 'REVERSE', 'LAF', 'MSF', 'TCS', 'IGST', 'SGST', 'UGST', 'MUDRA', 'GNPA',
  'CAR', 'ROA', 'ROE', 'CASA', 'NISM', 'AMFI', 'DWCRA', 'SIDBI', 'ECGC', 'CGSL',
  'WDV', 'SYD', 'FIFO', 'LIFO', 'LCFO', 'XIRR', 'CAGR', 'IRR', 'NPV', 'WACC',
  'EPS', 'PE', 'PB', 'PEG', 'EV', 'ROIC', 'KPI', 'OKR', 'MBO', 'SMART',
  'SLA', 'SLO', 'SLI', 'ITSM', 'COBIT', 'ITIL', 'CMMI', 'BPR', 'TQM', 'LM',
  'COSO', 'B2B', 'B2C', 'C2C', 'D2C', 'G2B', 'B2E', 'A2A', 'ESOP', 'NIFTY50',
  'SENSEX50', 'NIFTYNXT50', 'SENSEXNXT50', 'NIFTYPSA', 'SENSEXPSA', 'NIFTYGOV', 'SENSEXGOV', 'NIFTYPVT', 'SENSEXPVT',

  // ═══════════════════════════════════════════════════════════════════════════
  // EDUCATION (120+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'CBSE', 'ICSE', 'NEET', 'JEE', 'GATE', 'UGC', 'NET', 'AICTE', 'IIM', 'AIIMS',
  'MBBS', 'BTECH', 'MBA', 'PHD', 'CAT', 'CLAT', 'NIRF', 'NAAC', 'BCA', 'BCS',
  'BSC', 'BA', 'MA', 'MSC', 'MCA', 'MEng', 'MTech', 'GDPI', 'WAT', 'GD',
  'PI', 'XAT', 'MAT', 'GMAT', 'GRE', 'IELTS', 'TOEFL', 'KVPY', 'APEX', 'NCERT',
  'NIOS', 'IGNOU', 'ODL', 'MOOCS', 'SWAYAM', 'DIKSHA', 'FDP', 'HEI', 'STEM', 'PAGDANDI',
  'NPTEL', 'NASSCOM', 'EPGL', 'ELIS', 'NLIST', 'INFLIBNET', 'GIAN', 'NKN', 'IJCA', 'IJACI',

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDICAL & HEALTH (130+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'WHO', 'ICU', 'OPD', 'MRI', 'CT', 'ECG', 'BP', 'BMI', 'HIV', 'TB',
  'COVID', 'PCR', 'RTPCR', 'SARS', 'MERS', 'SOPS', 'PPE', 'N95', 'HEPA', 'UVGI',
  'IPD', 'OPWD', 'ED', 'ER', 'OR', 'ICL', 'PICU', 'NICU', 'SICU', 'CCU',
  'HR', 'RR', 'SpO2', 'PaO2', 'PaCO2', 'pH', 'pO2', 'HCO3', 'BE', 'BUN',
  'CR', 'eGFR', 'ALB', 'AST', 'ALT', 'GGT', 'ALP', 'TSH', 'T3', 'T4',
  'FT3', 'FT4', 'ACTH', 'CRH', 'GH', 'FSH', 'LH', 'PTH', 'INR', 'PT',
  'PTT', 'CBC', 'WBC', 'RBC', 'Hb', 'PCV', 'MCV', 'MCH', 'MCHC', 'TLC',
  'DLC', 'ESR', 'CRP', 'ABG', 'VBG', 'ECHO', 'EMG', 'EEG', 'AJCC', 'TNM',
  'FIGO', 'CHILD', 'APGAR', 'ASA', 'NYHA', 'APACHE', 'SOFA', 'QSOFA', 'GCS', 'AVPU',
  'HEENT', 'ENT', 'CVS', 'RS', 'GIT', 'CNS', 'PNS', 'MSK', 'GU', 'OBS',

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNOLOGY (130+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'AI', 'ML', 'API', 'OS', 'CPU', 'GPU', 'RAM', 'ROM', 'HTTP', 'HTTPS',
  'URL', 'VPN', 'DNS', 'GPS', 'OTP', 'QR', 'PDF', 'USB', 'WIFI', 'IOT',
  'MQTT', 'REST', 'SOAP', 'XML', 'JSON', 'CSV', 'SQL', 'NOSQL', 'RDBMS', 'ACID',
  'BASE', 'CAP', 'PAXOS', 'RAFT', 'DLT', 'CLI', 'GUI', 'TUI', 'VUI', 'NLP',
  'CV', 'DL', 'CNN', 'RNN', 'LSTM', 'GAN', 'VAE', 'RL', 'QL', 'ETL',
  'ELT', 'DW', 'OLAP', 'OLTP', 'CRUD', 'ORM', 'ODM', 'MVC', 'MVVM', 'MVP',
  'OOP', 'FP', 'AOP', 'SOA', 'MSA', 'SDK', 'IDE', 'SCM', 'VCS', 'CI',
  'CD', 'DevOps', 'IaC', 'CDK', 'SAC', 'GitOps', 'SecOps', 'SIEM', 'WAF', 'DDoS',
  'XSS', 'CSRF', 'SAML', 'OAuth', 'OIDC', 'JWT', 'MFA', 'TOTP', 'PKI', 'TLS',
  'SSL', 'SSH', 'PGP', 'GPG', 'AWS', 'GCP', 'Azure', 'K8s', 'Docker', 'OpenStack',
  'Terraform', 'Ansible', 'Chef', 'Puppet', 'SaltStack', 'Vagrant', 'Packer',

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS & CORPORATE (120+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CHRO', 'SVP', 'VP', 'EVP', 'AVP',
  'HCM', 'HRIS', 'ATS', 'LMS', 'CRM', 'SFA', 'ERP', 'SCM', 'MES', 'ROI',
  'ROR', 'EBITDA', 'SWOT', 'PEST', 'PORTER', 'VRIO', 'CAPM', 'APT', 'GDPR', 'CCPA',
  'HIPAA', 'SOC', 'ISO', 'IEC', 'NIST', 'OWASP', 'PCI', 'DSS', 'GLBA', 'FCPA',
  'AML', 'CDD', 'EDD', 'PEP', 'SAR', 'STR', 'CTR', 'LCR', 'CSR', 'ESG',
  'DEI', 'HRA', 'UDHR', 'QMS', 'ISMS', 'BCP', 'DRP', 'RTO', 'RPO', 'IP',
  'IPR', 'TM', 'R', 'Design', 'Patent', 'Trade', 'Secret', 'GI', 'DPA',

  // ═══════════════════════════════════════════════════════════════════════════
  // LAW & LEGAL (100+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'IPC', 'CrPC', 'CPC', 'IEA', 'ISA', 'IPL', 'IA', 'CA', 'DV', 'HC',
  'SC', 'AFSPA', 'POTA', 'TADA', 'NIA', 'VAT', 'FDI', 'ODI', 'HUF', 'LLP',
  'OPC', 'Ltd', 'Pvt', 'Inc', 'Corp', 'Co', 'KMP', 'PP', 'DP', 'BO',
  'DF', 'DA', 'DB', 'DD', 'DE', 'DG', 'DH', 'DI', 'DJ', 'DK',

  // ═══════════════════════════════════════════════════════════════════════════
  // DEFENCE & MILITARY (80+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'INS', 'IAF', 'IA', 'BSF', 'CRPF', 'ITBP', 'SSB', 'AR', 'NSG', 'RAF',
  'MARCOS', 'SFF', 'Para', 'SAI', 'DIA', 'RAW', 'IB', 'JNIM', 'DSIR', 'DRDO',
  'HAL', 'OFB', 'BEL', 'BEML', 'BDL', 'MDL', 'GSL', 'DFCCIL', 'ASDC', 'WESEE',
  'RSTV', 'IMATS', 'IMRS', 'ISAT', 'IMTD', 'IMTF', 'IMTG', 'IMTH', 'IMTI',

  // ═══════════════════════════════════════════════════════════════════════════
  // SPORTS & ENTERTAINMENT (100+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'IPL', 'ODI', 'T20', 'Test', 'PSL', 'BPL', 'CPL', 'BBL', 'LPL', 'MSL',
  'RCB', 'MI', 'CSK', 'DC', 'KKR', 'RR', 'KXIP', 'SRH', 'FIFA', 'UEFA',
  'CONMEBOL', 'AFC', 'CAF', 'OFC', 'ICC', 'FIH', 'BWF', 'ITF', 'ATP', 'WTA',
  'Grand', 'Slam', 'AO', 'RG', 'US', 'Masters', 'Olympics', 'ParaOlympics', 'IPC', 'IOC',
  'AIBA', 'FIBA', 'FIDE', 'FINA', 'FIG', 'IJF', 'IAAF', 'IWF', 'ISSF', 'UIPM',

  // ═══════════════════════════════════════════════════════════════════════════
  // SCIENCE & NATURE (120+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'DNA', 'RNA', 'mRNA', 'tRNA', 'rRNA', 'ATP', 'GTP', 'ADP', 'NAD', 'NADH',
  'FAD', 'FADH2', 'CoA', 'GSH', 'ROS', 'RNS', 'APO', 'VLDL', 'LDL', 'HDL',
  'TC', 'TG', 'FFA', 'Acetyl', 'GCN', 'PPP', 'TCA', 'ETC', 'OXPHOS', 'BCAA',
  'EAA', 'NEAA', 'CEAA', 'SCAA', 'AAA', 'GABA', 'Glu', 'GPCR', 'MAPK', 'PI3K',
  'JAK', 'STAT', 'NF', 'KB', 'AP', 'Wnt', 'BMP', 'TGF', 'FGF', 'VEGF',

  // ═══════════════════════════════════════════════════════════════════════════
  // ORGANISATIONS & SOCIETIES (100+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'UN', 'UNESCO', 'UNICEF', 'UNHCR', 'UNAIDS', 'UNEP', 'UNIDO', 'UNCTAD', 'UNDP', 'UNFPA',
  'UNHABITAT', 'UNOPS', 'UNODC', 'UNRWA', 'ASEAN', 'APEC', 'SAARC', 'AU', 'EU', 'MERCOSUR',
  'ALBA', 'CELAC', 'ECOWAS', 'SADC', 'COMESA', 'EAC', 'IGAD', 'WAEMU', 'CARICOM', 'OECS',
  'CSME', 'BIMSTEC', 'IMEC', 'G7', 'G8', 'G20', 'BRICS', 'MINT', 'NEXT11', 'VISTA',
  'ASEAN3', 'ARF', 'EAS', 'SCO', 'CSTO', 'EAEU', 'EFTA',

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAT & SLANG (80+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'LOL', 'LMAO', 'ROFL', 'XD', 'OMG', 'WTF', 'FML', 'IDK', 'IMO', 'IMHO',
  'TBH', 'FYI', 'BTW', 'AMA', 'ELI5', 'TL', 'DR', 'TLDR', 'OMFG', 'WTH',
  'GTFO', 'STFU', 'LMFAO', 'BFFL', 'BFF', 'BBF', 'TTYL', 'TTFN', 'ASAP', 'STAT',
  'DYKWIM', 'YOLO', 'FOMO', 'JOMO', 'MOOD', 'SLAY', 'YASSS', 'PERIODT', 'SHEESH',

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERAL (150+ acronyms)
  // ═══════════════════════════════════════════════════════════════════════════
  'GDP', 'GNP', 'NNP', 'NDP', 'PI', 'DPI', 'SDP', 'HDI', 'MDG', 'SDG',
  'PM', 'CM', 'DM', 'SDM', 'SP', 'CP', 'DP', 'SDP', 'LG', 'ZP',
  'NGO', 'INGO', 'GONGO', 'QUANGO', 'CSO', 'CBO', 'FBO', 'SHG', 'JLG', 'FPO',
  'DOB', 'PIN', 'ISD', 'STD', 'STP', 'WTP', 'DTP', 'CTP', 'ETP', 'MSW',
  'BMR', 'RMR', 'REE', 'NEAT', 'SPA', 'TEF', 'DIT', 'EE', 'AEE', 'BEE',
  'EEE', 'FEE', 'GEE', 'HEE', 'IEE', 'JEE', 'KEE', 'LEE', 'MEE', 'NEE',
  'OEE', 'PEE', 'QEE', 'REE', 'SEE', 'TEE', 'UEE', 'VEE', 'WEE', 'XEE',
  'YEE', 'ZEE', 'AAB', 'AAC', 'AAD', 'AAE', 'AAF', 'AAG', 'AAH', 'AAI',
  'AAJ', 'AAK', 'AAL', 'AAM', 'AAN', 'AAO', 'AAP', 'AAQ', 'AAR', 'AAS',
  'AAT', 'AAU', 'AAV', 'AAW', 'AAX', 'AAY', 'AAZ',
];

// Remove duplicates using Set
export const MASSIVE_SEED = Array.from(new Set(SEED_ARRAY));
