// States, provinces, territories, and top-level administrative divisions
// from around the globe. Codes are prefixed with the ISO-3166-1 alpha-2
// country code to avoid collisions with country/general acronyms
// (e.g. California -> USCA, Ontario -> CAON, Bavaria -> DEBY).
const WORLD_STATES_ARRAY = [
  // India — states & union territories (28 states + 8 UTs)
  'INAP', 'INAR', 'INAS', 'INBR', 'INCT', 'INGA', 'INGJ', 'INHR', 'INHP', 'INJH',
  'INKA', 'INKL', 'INMP', 'INMH', 'INMN', 'INML', 'INMZ', 'INNL', 'INOR', 'INPB',
  'INRJ', 'INSK', 'INTN', 'INTG', 'INTR', 'INUP', 'INUT', 'INWB',
  'INAN', 'INCH', 'INDH', 'INDL', 'INJK', 'INLA', 'INLD', 'INPY',

  // USA — 50 states + DC
  'USAL', 'USAK', 'USAZ', 'USAR', 'USCA', 'USCO', 'USCT', 'USDE', 'USFL', 'USGA',
  'USHI', 'USID', 'USIL', 'USIN', 'USIA', 'USKS', 'USKY', 'USLA', 'USME', 'USMD',
  'USMA', 'USMI', 'USMN', 'USMS', 'USMO', 'USMT', 'USNE', 'USNV', 'USNH', 'USNJ',
  'USNM', 'USNY', 'USNC', 'USND', 'USOH', 'USOK', 'USOR', 'USPA', 'USRI', 'USSC',
  'USSD', 'USTN', 'USTX', 'USUT', 'USVT', 'USVA', 'USWA', 'USWV', 'USWI', 'USWY',
  'USDC',

  // Canada — 10 provinces + 3 territories
  'CAAB', 'CABC', 'CAMB', 'CANB', 'CANL', 'CANS', 'CAON', 'CAPE', 'CAQC', 'CASK',
  'CANT', 'CANU', 'CAYT',

  // Australia — 6 states + 2 territories
  'AUNSW', 'AUVIC', 'AUQLD', 'AUWA', 'AUSA', 'AUTAS', 'AUACT', 'AUNT',

  // Germany — 16 Bundesländer (ISO 3166-2:DE)
  'DEBW', 'DEBY', 'DEBE', 'DEBB', 'DEHB', 'DEHH', 'DEHE', 'DEMV', 'DENI', 'DENW',
  'DERP', 'DESL', 'DESN', 'DEST', 'DESH', 'DETH',

  // Brazil — 26 states + Federal District
  'BRAC', 'BRAL', 'BRAP', 'BRAM', 'BRBA', 'BRCE', 'BRDF', 'BRES', 'BRGO', 'BRMA',
  'BRMT', 'BRMS', 'BRMG', 'BRPA', 'BRPB', 'BRPR', 'BRPE', 'BRPI', 'BRRJ', 'BRRN',
  'BRRS', 'BRRO', 'BRRR', 'BRSC', 'BRSP', 'BRSE', 'BRTO',

  // Mexico — 31 states + Mexico City (ISO 3166-2:MX 3-letter)
  'MXAGU', 'MXBCN', 'MXBCS', 'MXCAM', 'MXCHP', 'MXCHH', 'MXCOA', 'MXCOL', 'MXCMX', 'MXDUR',
  'MXGUA', 'MXGRO', 'MXHID', 'MXJAL', 'MXMEX', 'MXMIC', 'MXMOR', 'MXNAY', 'MXNLE', 'MXOAX',
  'MXPUE', 'MXQUE', 'MXROO', 'MXSLP', 'MXSIN', 'MXSON', 'MXTAB', 'MXTAM', 'MXTLA', 'MXVER',
  'MXYUC', 'MXZAC',

  // South Africa — 9 provinces
  'ZAEC', 'ZAFS', 'ZAGP', 'ZAKZN', 'ZALP', 'ZAMP', 'ZANC', 'ZANW', 'ZAWC',

  // China — provinces, municipalities & autonomous regions (common 2-letter codes)
  'CNBJ', 'CNTJ', 'CNHE', 'CNSX', 'CNNM', 'CNLN', 'CNJL', 'CNHL', 'CNSH', 'CNJS',
  'CNZJ', 'CNAH', 'CNFJ', 'CNJX', 'CNSD', 'CNHA', 'CNHB', 'CNHN', 'CNGD', 'CNGX',
  'CNHI', 'CNCQ', 'CNSC', 'CNGZ', 'CNYN', 'CNXZ', 'CNSN', 'CNGS', 'CNQH', 'CNNX',
  'CNXJ',

  // Switzerland — 26 cantons
  'CHAG', 'CHAI', 'CHAR', 'CHBE', 'CHBL', 'CHBS', 'CHFR', 'CHGE', 'CHGL', 'CHGR',
  'CHJU', 'CHLU', 'CHNE', 'CHNW', 'CHOW', 'CHSG', 'CHSH', 'CHSO', 'CHSZ', 'CHTG',
  'CHTI', 'CHUR', 'CHVD', 'CHVS', 'CHZG', 'CHZH',

  // United Kingdom — 4 constituent countries
  'GBENG', 'GBSCT', 'GBWLS', 'GBNIR',

  // Indonesia — major provinces
  'IDAC', 'IDBA', 'IDBB', 'IDBT', 'IDBE', 'IDGO', 'IDJA', 'IDJB', 'IDJI', 'IDJK',
  'IDJT', 'IDJW', 'IDKB', 'IDKI', 'IDKR', 'IDKS', 'IDKT', 'IDKU', 'IDLA', 'IDMA',
  'IDMU', 'IDNB', 'IDNT', 'IDPA', 'IDPB', 'IDRI', 'IDSA', 'IDSB', 'IDSG', 'IDSN',
  'IDSR', 'IDST', 'IDSU', 'IDYO',

  // Argentina — 23 provinces + capital (ISO 3166-2:AR, prefixed)
  'ARBA', 'ARCT', 'ARCC', 'ARCN', 'ARCB', 'ARER', 'ARFM', 'ARJY', 'ARLP', 'ARLR',
  'ARMZ', 'ARMN', 'ARNQ', 'ARRN', 'ARSA', 'ARSJ', 'ARSL', 'ARSC', 'ARSF', 'ARSE',
  'ARTF', 'ARTM', 'ARDF',

  // Pakistan — 4 provinces + territories
  'PKPB', 'PKSD', 'PKKP', 'PKBA', 'PKGB', 'PKJK', 'PKIS',

  // Malaysia — 13 states + 3 federal territories
  'MYJHR', 'MYKDH', 'MYKTN', 'MYMLK', 'MYNSN', 'MYPHG', 'MYPRK', 'MYPLS', 'MYPNG', 'MYSBH',
  'MYSWK', 'MYSGR', 'MYTRG', 'MYKUL', 'MYLBN', 'MYPJY',

  // Nigeria — 36 states + FCT
  'NGAB', 'NGAD', 'NGAK', 'NGAN', 'NGBA', 'NGBY', 'NGBE', 'NGBO', 'NGCR', 'NGDE',
  'NGEB', 'NGED', 'NGEK', 'NGEN', 'NGFC', 'NGGO', 'NGIM', 'NGJI', 'NGKD', 'NGKE',
  'NGKN', 'NGKO', 'NGKT', 'NGKW', 'NGLA', 'NGNA', 'NGNI', 'NGOG', 'NGON', 'NGOS',
  'NGOY', 'NGPL', 'NGRI', 'NGSO', 'NGTA', 'NGYO', 'NGZA',

  // United Arab Emirates — 7 emirates
  'AEAZ', 'AEDU', 'AESH', 'AEAJ', 'AEUQ', 'AEFU', 'AERK',
];

export const WORLD_STATES_SEED = Array.from(new Set(WORLD_STATES_ARRAY));
