// API Client with mock data support
// When backend is ready, set VITE_API_BASE_URL and VITE_USE_MOCKS=false

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

// ============================================
// MOCK DATA — Real Indian Government Schemes
// ============================================
const mockSchemes = [
  {
    _id: '1',
    name: 'Stand-Up India',
    nameHi: 'स्टैंड-अप इंडिया',
    sponsoringBody: 'Department of Financial Services',
    level: 'central',
    state: null,
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch for setting up a greenfield enterprise.',
    eligibilityRules: [
      { field: 'category', operator: 'in', value: ['SC', 'ST'], ruleType: 'hard', label: 'Must be SC or ST category', labelHi: 'SC या ST श्रेणी होनी चाहिए' },
      { field: 'gender', operator: 'eq', value: 'female', ruleType: 'soft', label: 'Preference for women entrepreneurs', labelHi: 'महिला उद्यमियों को प्राथमिकता' },
      { field: 'age', operator: 'gte', value: 18, ruleType: 'hard', label: 'Must be 18 years or older', labelHi: '18 वर्ष या अधिक होना चाहिए' },
      { field: 'businessStage', operator: 'in', value: ['idea', 'startup_less_1yr'], ruleType: 'hard', label: 'Greenfield enterprise (new business)', labelHi: 'नया व्यवसाय' },
    ],
    benefits: { type: 'Composite Loan', amount: 1000000, ceiling: 10000000, subsidyPercent: null, description: 'Bank loan from ₹10 lakh to ₹1 crore' },
    documentsRequired: [
      { name: 'Caste Certificate', nameHi: 'जाति प्रमाण पत्र', mandatory: true },
      { name: 'Identity Proof (Aadhaar/PAN)', nameHi: 'पहचान प्रमाण', mandatory: true },
      { name: 'Business Plan', nameHi: 'व्यवसाय योजना', mandatory: true },
      { name: 'Address Proof', nameHi: 'पता प्रमाण', mandatory: true },
    ],
    applicationLink: 'https://www.standupmitra.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/stand-up-india',
    isActive: true,
    version: 1,
  },
  {
    _id: '2',
    name: 'PMEGP - Prime Minister Employment Generation Programme',
    nameHi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम',
    sponsoringBody: 'Ministry of MSME',
    level: 'central',
    state: null,
    description: 'Generates employment opportunities in rural and urban areas through setting up of new self-employment ventures/projects/micro enterprises.',
    eligibilityRules: [
      { field: 'age', operator: 'gte', value: 18, ruleType: 'hard', label: 'Must be 18 years or older', labelHi: '18 वर्ष या अधिक' },
      { field: 'annualIncome', operator: 'lte', value: 500000, ruleType: 'soft', label: 'Priority for lower income groups', labelHi: 'कम आय वर्ग को प्राथमिकता' },
      { field: 'businessStage', operator: 'in', value: ['idea', 'startup_less_1yr'], ruleType: 'hard', label: 'New enterprise only', labelHi: 'केवल नया उद्यम' },
    ],
    benefits: { type: 'Subsidy', amount: null, ceiling: 2500000, subsidyPercent: 35, description: 'Up to 35% subsidy for SC/ST/Women in urban areas (25% in rural)' },
    documentsRequired: [
      { name: 'Aadhaar Card', nameHi: 'आधार कार्ड', mandatory: true },
      { name: 'Educational Certificate', nameHi: 'शैक्षिक प्रमाण पत्र', mandatory: true },
      { name: 'Project Report', nameHi: 'परियोजना रिपोर्ट', mandatory: true },
      { name: 'Caste Certificate (if applicable)', nameHi: 'जाति प्रमाण पत्र (यदि लागू हो)', mandatory: false },
    ],
    applicationLink: 'https://www.kviconline.gov.in/pmegpeportal/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/pmegp',
    isActive: true,
    version: 1,
  },
  {
    _id: '3',
    name: 'MUDRA Loan - Shishu',
    nameHi: 'मुद्रा ऋण - शिशु',
    sponsoringBody: 'MUDRA/SIDBI',
    level: 'central',
    state: null,
    description: 'Loans up to ₹50,000 for small/micro business units in the initial stages. Part of the Pradhan Mantri MUDRA Yojana.',
    eligibilityRules: [
      { field: 'businessStage', operator: 'in', value: ['idea', 'startup_less_1yr'], ruleType: 'hard', label: 'For new businesses', labelHi: 'नए व्यवसायों के लिए' },
      { field: 'age', operator: 'gte', value: 18, ruleType: 'hard', label: 'Must be 18+', labelHi: '18+ होना चाहिए' },
    ],
    benefits: { type: 'Loan', amount: null, ceiling: 50000, subsidyPercent: null, description: 'Collateral-free loan up to ₹50,000' },
    documentsRequired: [
      { name: 'Identity Proof', nameHi: 'पहचान प्रमाण', mandatory: true },
      { name: 'Address Proof', nameHi: 'पता प्रमाण', mandatory: true },
      { name: 'Business Plan (brief)', nameHi: 'व्यवसाय योजना (संक्षिप्त)', mandatory: false },
    ],
    applicationLink: 'https://www.mudra.org.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/pmmy',
    isActive: true,
    version: 1,
  },
  {
    _id: '4',
    name: 'MUDRA Loan - Kishor',
    nameHi: 'मुद्रा ऋण - किशोर',
    sponsoringBody: 'MUDRA/SIDBI',
    level: 'central',
    state: null,
    description: 'Loans from ₹50,001 to ₹5 lakh for businesses looking to expand.',
    eligibilityRules: [
      { field: 'businessStage', operator: 'in', value: ['startup_less_1yr', 'early_1_3yr'], ruleType: 'hard', label: 'For growing businesses', labelHi: 'बढ़ते व्यवसायों के लिए' },
      { field: 'age', operator: 'gte', value: 18, ruleType: 'hard', label: 'Must be 18+', labelHi: '18+ होना चाहिए' },
    ],
    benefits: { type: 'Loan', amount: 50001, ceiling: 500000, subsidyPercent: null, description: 'Loan from ₹50,001 to ₹5 lakh' },
    documentsRequired: [
      { name: 'Identity Proof', nameHi: 'पहचान प्रमाण', mandatory: true },
      { name: 'Business Registration', nameHi: 'व्यवसाय पंजीकरण', mandatory: true },
      { name: 'Financial Statements', nameHi: 'वित्तीय विवरण', mandatory: true },
    ],
    applicationLink: 'https://www.mudra.org.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/pmmy',
    isActive: true,
    version: 1,
  },
  {
    _id: '5',
    name: 'MUDRA Loan - Tarun',
    nameHi: 'मुद्रा ऋण - तरुण',
    sponsoringBody: 'MUDRA/SIDBI',
    level: 'central',
    state: null,
    description: 'Loans from ₹5 lakh to ₹10 lakh for established micro enterprises.',
    eligibilityRules: [
      { field: 'businessStage', operator: 'in', value: ['early_1_3yr', 'established'], ruleType: 'hard', label: 'For established businesses', labelHi: 'स्थापित व्यवसायों के लिए' },
      { field: 'age', operator: 'gte', value: 18, ruleType: 'hard', label: 'Must be 18+', labelHi: '18+ होना चाहिए' },
    ],
    benefits: { type: 'Loan', amount: 500000, ceiling: 1000000, subsidyPercent: null, description: 'Loan from ₹5 lakh to ₹10 lakh' },
    documentsRequired: [
      { name: 'Identity & Address Proof', nameHi: 'पहचान व पता प्रमाण', mandatory: true },
      { name: 'Business Registration', nameHi: 'व्यवसाय पंजीकरण', mandatory: true },
      { name: 'Last 2 years Balance Sheet', nameHi: 'पिछले 2 वर्ष का बैलेंस शीट', mandatory: true },
      { name: 'IT Returns', nameHi: 'आयकर रिटर्न', mandatory: true },
    ],
    applicationLink: 'https://www.mudra.org.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/pmmy',
    isActive: true,
    version: 1,
  },
  {
    _id: '6',
    name: 'PM SVANidhi',
    nameHi: 'पीएम स्वनिधि',
    sponsoringBody: 'Ministry of Housing & Urban Affairs',
    level: 'central',
    state: null,
    description: 'Micro-credit facility for street vendors to resume their livelihoods affected by COVID-19.',
    eligibilityRules: [
      { field: 'sector', operator: 'in', value: ['trading', 'services'], ruleType: 'hard', label: 'For street vendors/traders', labelHi: 'स्ट्रीट वेंडर/व्यापारियों के लिए' },
      { field: 'ruralOrUrban', operator: 'eq', value: 'urban', ruleType: 'hard', label: 'Urban areas only', labelHi: 'केवल शहरी क्षेत्र' },
    ],
    benefits: { type: 'Micro-credit', amount: null, ceiling: 50000, subsidyPercent: 7, description: 'Working capital loan up to ₹50,000 with 7% interest subsidy' },
    documentsRequired: [
      { name: 'Vending Certificate/Letter', nameHi: 'वेंडिंग प्रमाण पत्र', mandatory: true },
      { name: 'Aadhaar Card', nameHi: 'आधार कार्ड', mandatory: true },
    ],
    applicationLink: 'https://pmsvanidhi.mohua.gov.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/pm-svanidhi',
    isActive: true,
    version: 1,
  },
  {
    _id: '7',
    name: 'NHFDC Schemes for PwD',
    nameHi: 'एनएचएफडीसी दिव्यांग योजनाएं',
    sponsoringBody: 'National Handicapped Finance & Development Corporation',
    level: 'central',
    state: null,
    description: 'Financial assistance for persons with disabilities to start income-generating activities and self-employment ventures.',
    eligibilityRules: [
      { field: 'isPwD', operator: 'eq', value: true, ruleType: 'hard', label: 'Must be a Person with Disability', labelHi: 'दिव्यांग होना आवश्यक' },
      { field: 'annualIncome', operator: 'lte', value: 300000, ruleType: 'hard', label: 'Annual income up to ₹3 lakh', labelHi: 'वार्षिक आय ₹3 लाख तक' },
      { field: 'age', operator: 'between', value: [18, 55], ruleType: 'hard', label: 'Age between 18-55 years', labelHi: 'उम्र 18-55 वर्ष' },
    ],
    benefits: { type: 'Loan', amount: null, ceiling: 2500000, subsidyPercent: null, description: 'Concessional loans up to ₹25 lakh at low interest rates' },
    documentsRequired: [
      { name: 'Disability Certificate (40%+)', nameHi: 'दिव्यांगता प्रमाण पत्र (40%+)', mandatory: true },
      { name: 'Income Certificate', nameHi: 'आय प्रमाण पत्र', mandatory: true },
      { name: 'Project Report', nameHi: 'परियोजना रिपोर्ट', mandatory: true },
    ],
    applicationLink: 'https://nhfdc.nic.in/',
    sourceUrl: 'https://nhfdc.nic.in/schemes',
    isActive: true,
    version: 1,
  },
  {
    _id: '8',
    name: 'SMILE Scheme',
    nameHi: 'स्माइल योजना',
    sponsoringBody: 'Ministry of Social Justice & Empowerment',
    level: 'central',
    state: null,
    description: 'Support for Marginalized Individuals for Livelihood and Enterprise. Provides comprehensive support for transgender persons.',
    eligibilityRules: [
      { field: 'isTransgender', operator: 'eq', value: true, ruleType: 'hard', label: 'Must be transgender', labelHi: 'ट्रांसजेंडर होना आवश्यक' },
    ],
    benefits: { type: 'Grant + Support', amount: null, ceiling: null, subsidyPercent: null, description: 'Skill training, education support, and livelihood assistance' },
    documentsRequired: [
      { name: 'Transgender ID Certificate', nameHi: 'ट्रांसजेंडर पहचान प्रमाण पत्र', mandatory: true },
      { name: 'Aadhaar Card', nameHi: 'आधार कार्ड', mandatory: true },
    ],
    applicationLink: 'https://smile.sjsa.gov.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/smile',
    isActive: true,
    version: 1,
  },
  {
    _id: '9',
    name: 'NSFDC Loan Scheme',
    nameHi: 'एनएसएफडीसी ऋण योजना',
    sponsoringBody: 'National Scheduled Castes Finance & Dev. Corporation',
    level: 'central',
    state: null,
    description: 'Financial support to SC entrepreneurs for income-generating activities and self-employment.',
    eligibilityRules: [
      { field: 'category', operator: 'in', value: ['SC'], ruleType: 'hard', label: 'Must be Scheduled Caste', labelHi: 'अनुसूचित जाति होनी चाहिए' },
      { field: 'annualIncome', operator: 'lte', value: 300000, ruleType: 'hard', label: 'Annual income up to ₹3 lakh', labelHi: 'वार्षिक आय ₹3 लाख तक' },
      { field: 'age', operator: 'between', value: [18, 50], ruleType: 'hard', label: 'Age 18-50 years', labelHi: 'उम्र 18-50 वर्ष' },
    ],
    benefits: { type: 'Loan', amount: null, ceiling: 1500000, subsidyPercent: null, description: 'Concessional loans up to ₹15 lakh at 5% p.a.' },
    documentsRequired: [
      { name: 'SC Caste Certificate', nameHi: 'अनुसूचित जाति प्रमाण पत्र', mandatory: true },
      { name: 'Income Certificate', nameHi: 'आय प्रमाण पत्र', mandatory: true },
      { name: 'Project Proposal', nameHi: 'परियोजना प्रस्ताव', mandatory: true },
    ],
    applicationLink: 'https://nsfdc.nic.in/',
    sourceUrl: 'https://nsfdc.nic.in/schemes',
    isActive: true,
    version: 1,
  },
  {
    _id: '10',
    name: 'CGTMSE - Credit Guarantee Fund',
    nameHi: 'सीजीटीएमएसई - ऋण गारंटी निधि',
    sponsoringBody: 'Ministry of MSME',
    level: 'central',
    state: null,
    description: 'Provides collateral-free credit guarantee to MSMEs for loans up to ₹5 crore.',
    eligibilityRules: [
      { field: 'businessStage', operator: 'in', value: ['startup_less_1yr', 'early_1_3yr', 'established'], ruleType: 'hard', label: 'Must have existing or planned business', labelHi: 'मौजूदा या योजित व्यवसाय होना चाहिए' },
      { field: 'sector', operator: 'in', value: ['manufacturing', 'services'], ruleType: 'hard', label: 'Manufacturing or services sector', labelHi: 'विनिर्माण या सेवा क्षेत्र' },
    ],
    benefits: { type: 'Credit Guarantee', amount: null, ceiling: 50000000, subsidyPercent: null, description: 'Collateral-free credit guarantee for loans up to ₹5 crore' },
    documentsRequired: [
      { name: 'Business Registration', nameHi: 'व्यवसाय पंजीकरण', mandatory: true },
      { name: 'Project Report', nameHi: 'परियोजना रिपोर्ट', mandatory: true },
      { name: 'Financial Statements', nameHi: 'वित्तीय विवरण', mandatory: true },
    ],
    applicationLink: 'https://www.cgtmse.in/',
    sourceUrl: 'https://www.cgtmse.in/',
    isActive: true,
    version: 1,
  },
  {
    _id: '11',
    name: 'Startup India Seed Fund',
    nameHi: 'स्टार्टअप इंडिया सीड फंड',
    sponsoringBody: 'DPIIT',
    level: 'central',
    state: null,
    description: 'Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
    eligibilityRules: [
      { field: 'businessStage', operator: 'in', value: ['idea', 'startup_less_1yr', 'early_1_3yr'], ruleType: 'hard', label: 'Startup stage (not established)', labelHi: 'स्टार्टअप चरण' },
      { field: 'sector', operator: 'notIn', value: ['trading'], ruleType: 'hard', label: 'Not pure trading', labelHi: 'शुद्ध व्यापार नहीं' },
    ],
    benefits: { type: 'Grant + Investment', amount: null, ceiling: 5000000, subsidyPercent: null, description: 'Up to ₹50 lakh as seed fund' },
    documentsRequired: [
      { name: 'DPIIT Recognition Certificate', nameHi: 'डीपीआईआईटी मान्यता प्रमाण पत्र', mandatory: true },
      { name: 'Pitch Deck', nameHi: 'पिच डेक', mandatory: true },
      { name: 'Incorporation Certificate', nameHi: 'निगमन प्रमाण पत्र', mandatory: true },
    ],
    applicationLink: 'https://seedfund.startupindia.gov.in/',
    sourceUrl: 'https://www.startupindia.gov.in/',
    isActive: true,
    version: 1,
  },
  {
    _id: '12',
    name: 'National SC/ST Hub',
    nameHi: 'राष्ट्रीय अनुसूचित जाति/जनजाति हब',
    sponsoringBody: 'Ministry of MSME',
    level: 'central',
    state: null,
    description: 'Provides professional support to SC/ST entrepreneurs through capacity building, market linkage, and financial assistance.',
    eligibilityRules: [
      { field: 'category', operator: 'in', value: ['SC', 'ST'], ruleType: 'hard', label: 'Must be SC or ST', labelHi: 'SC या ST होना चाहिए' },
      { field: 'businessStage', operator: 'in', value: ['startup_less_1yr', 'early_1_3yr', 'established'], ruleType: 'hard', label: 'Must have a business', labelHi: 'व्यवसाय होना चाहिए' },
    ],
    benefits: { type: 'Support Services', amount: null, ceiling: null, subsidyPercent: null, description: 'Mentorship, market access, skill development, and financial linkages' },
    documentsRequired: [
      { name: 'Caste Certificate', nameHi: 'जाति प्रमाण पत्र', mandatory: true },
      { name: 'Udyam Registration', nameHi: 'उद्यम पंजीकरण', mandatory: true },
    ],
    applicationLink: 'https://www.scsthub.in/',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/national-sc-st-hub',
    isActive: true,
    version: 1,
  },
];

// Simple deterministic rule engine (mirror of backend)
function evaluateRule(rule, profile) {
  const profileValue = profile[rule.field];
  if (profileValue === undefined || profileValue === null) {
    return { passed: false, reason: `${rule.field} not provided` };
  }

  switch (rule.operator) {
    case 'eq':
      return { passed: profileValue === rule.value, reason: rule.label };
    case 'neq':
      return { passed: profileValue !== rule.value, reason: rule.label };
    case 'in':
      return { passed: Array.isArray(rule.value) && rule.value.includes(profileValue), reason: rule.label };
    case 'notIn':
      return { passed: Array.isArray(rule.value) && !rule.value.includes(profileValue), reason: rule.label };
    case 'lte':
      return { passed: Number(profileValue) <= Number(rule.value), reason: rule.label };
    case 'gte':
      return { passed: Number(profileValue) >= Number(rule.value), reason: rule.label };
    case 'lt':
      return { passed: Number(profileValue) < Number(rule.value), reason: rule.label };
    case 'gt':
      return { passed: Number(profileValue) > Number(rule.value), reason: rule.label };
    case 'between':
      return { passed: Number(profileValue) >= Number(rule.value[0]) && Number(profileValue) <= Number(rule.value[1]), reason: rule.label };
    case 'exists':
      return { passed: profileValue === rule.value, reason: rule.label };
    default:
      return { passed: false, reason: 'Unknown operator' };
  }
}

function matchProfile(profile, schemes) {
  return schemes
    .filter(s => s.isActive)
    .map(scheme => {
      const results = scheme.eligibilityRules.map(rule => {
        const result = evaluateRule(rule, profile);
        return { ...rule, ...result };
      });

      const hardRules = results.filter(r => r.ruleType === 'hard');
      const softRules = results.filter(r => r.ruleType === 'soft');

      const hardPassed = hardRules.filter(r => r.passed).length;
      const hardTotal = hardRules.length;
      const softPassed = softRules.filter(r => r.passed).length;
      const softTotal = softRules.length;

      const allHardPassed = hardPassed === hardTotal;
      const score = hardTotal > 0 ? (hardPassed / hardTotal) * 80 + (softTotal > 0 ? (softPassed / softTotal) * 20 : 20) : 100;

      let matchType = 'no_match';
      if (allHardPassed) matchType = 'full_match';
      else if (score >= 50) matchType = 'partial_match';

      return {
        scheme,
        matchType,
        score: Math.round(score),
        ruleResults: results,
        passedRules: results.filter(r => r.passed),
        failedRules: results.filter(r => !r.passed),
      };
    })
    .filter(m => m.matchType !== 'no_match')
    .sort((a, b) => {
      if (a.matchType === 'full_match' && b.matchType !== 'full_match') return -1;
      if (b.matchType === 'full_match' && a.matchType !== 'full_match') return 1;
      return b.score - a.score;
    });
}

// Mock saved schemes
let mockSaved = [];
let mockPending = [
  {
    _id: 'p1',
    name: 'CEGSSC Term Loan',
    nameHi: 'सीईजीएसएससी सावधि ऋण',
    sponsoringBody: 'National Safai Karamcharis Finance Corporation',
    sourceUrl: 'https://nsfdc.nic.in/schemes/cegssc',
    scrapedAt: new Date().toISOString(),
    status: 'pending_review',
    parsedData: {
      description: 'Credit enhancement guarantee scheme for SC entrepreneurs.',
      eligibilityRules: [
        { field: 'category', operator: 'in', value: ['SC'], ruleType: 'hard', label: 'SC category only' },
      ],
      benefits: { type: 'Loan Guarantee', description: 'Credit guarantee for loans' },
    },
  },
];

// Simulate API delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// API Client
// ============================================
const apiClient = {
  // Auth
  async login(email, password) {
    if (USE_MOCKS) {
      await delay();
      if (email === 'admin@udyam.in') {
        return { token: 'mock-jwt-admin', user: { _id: 'admin1', name: 'Admin', email, role: 'admin' } };
      }
      return { token: 'mock-jwt-user', user: { _id: 'user1', name: 'Test User', email, role: 'user' } };
    }
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async register(data) {
    if (USE_MOCKS) {
      await delay();
      return { token: 'mock-jwt-user', user: { _id: 'user1', name: data.name, email: data.email, role: 'user' } };
    }
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getMe() {
    if (USE_MOCKS) {
      await delay(200);
      const token = localStorage.getItem('udyam_token');
      if (!token) throw { status: 401, message: 'Not authenticated' };
      const isAdmin = token.includes('admin');
      return { _id: isAdmin ? 'admin1' : 'user1', name: isAdmin ? 'Admin' : 'User', role: isAdmin ? 'admin' : 'user' };
    }
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Profile
  async saveProfile(profile) {
    if (USE_MOCKS) {
      await delay();
      localStorage.setItem('udyam_profile', JSON.stringify(profile));
      return profile;
    }
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getProfile() {
    if (USE_MOCKS) {
      await delay(200);
      const stored = localStorage.getItem('udyam_profile');
      return stored ? JSON.parse(stored) : null;
    }
    const res = await fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Matching
  async getMatches() {
    if (USE_MOCKS) {
      await delay(600);
      const stored = localStorage.getItem('udyam_profile');
      if (!stored) return [];
      const profile = JSON.parse(stored);
      return matchProfile(profile, mockSchemes);
    }
    const res = await fetch(`${API_BASE}/api/match`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Schemes
  async getSchemes() {
    if (USE_MOCKS) {
      await delay(300);
      return mockSchemes;
    }
    const res = await fetch(`${API_BASE}/api/schemes`);
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Saved
  async getSaved() {
    if (USE_MOCKS) {
      await delay(200);
      return mockSaved;
    }
    const res = await fetch(`${API_BASE}/api/saved`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async saveScheme(schemeId) {
    if (USE_MOCKS) {
      await delay();
      const scheme = mockSchemes.find(s => s._id === schemeId);
      if (scheme) {
        const saved = { _id: `saved_${Date.now()}`, scheme, status: 'saved', savedAt: new Date().toISOString() };
        mockSaved.push(saved);
        return saved;
      }
      throw { message: 'Scheme not found' };
    }
    const res = await fetch(`${API_BASE}/api/saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
      body: JSON.stringify({ schemeId }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async updateSavedStatus(savedId, status) {
    if (USE_MOCKS) {
      await delay();
      const idx = mockSaved.findIndex(s => s._id === savedId);
      if (idx >= 0) { mockSaved[idx].status = status; return mockSaved[idx]; }
      throw { message: 'Not found' };
    }
    const res = await fetch(`${API_BASE}/api/saved/${savedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async removeSaved(savedId) {
    if (USE_MOCKS) {
      await delay();
      mockSaved = mockSaved.filter(s => s._id !== savedId);
      return { success: true };
    }
    const res = await fetch(`${API_BASE}/api/saved/${savedId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Admin
  async getAdminSchemes() {
    if (USE_MOCKS) {
      await delay(300);
      return mockSchemes;
    }
    const res = await fetch(`${API_BASE}/api/admin/schemes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getPending() {
    if (USE_MOCKS) {
      await delay(300);
      return mockPending;
    }
    const res = await fetch(`${API_BASE}/api/admin/pending`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async approvePending(id) {
    if (USE_MOCKS) {
      await delay();
      mockPending = mockPending.filter(p => p._id !== id);
      return { success: true };
    }
    const res = await fetch(`${API_BASE}/api/admin/pending/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async rejectPending(id) {
    if (USE_MOCKS) {
      await delay();
      mockPending = mockPending.filter(p => p._id !== id);
      return { success: true };
    }
    const res = await fetch(`${API_BASE}/api/admin/pending/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  async getAnalytics() {
    if (USE_MOCKS) {
      await delay(400);
      return {
        totalSchemes: mockSchemes.length,
        activeSchemes: mockSchemes.filter(s => s.isActive).length,
        totalUsers: 1247,
        totalMatches: 3891,
        pendingReview: mockPending.length,
        topMatchedSchemes: [
          { name: 'MUDRA Shishu', matches: 892 },
          { name: 'PMEGP', matches: 567 },
          { name: 'Stand-Up India', matches: 445 },
          { name: 'PM SVANidhi', matches: 334 },
          { name: 'CGTMSE', matches: 201 },
        ],
        categoryDistribution: { SC: 35, ST: 15, OBC: 25, EWS: 15, General: 10 },
        nearMissReasons: [
          { reason: 'Income too high', count: 234 },
          { reason: 'Age out of range', count: 156 },
          { reason: 'Wrong business stage', count: 123 },
          { reason: 'Category mismatch', count: 89 },
        ],
      };
    }
    const res = await fetch(`${API_BASE}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('udyam_token')}` },
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  // Aliases for Hook compatibility
  async getPublicSchemes(params) { return this.getSchemes(params); },
  async getSchemeById(id) { return this.getScheme(id); },
  async matchSchemes(profile) { return this.getMatches(); },
  async getSavedSchemes() { return this.getSaved(); },
  async toggleSaveScheme(schemeId, status) { return this.saveScheme(schemeId); },
  async updateApplicationStatus(schemeId, status, notes) { return this.updateSavedStatus(schemeId, status); },
  async getCurrentProfile() { return this.getProfile(); },
  async getPendingQueue() { return this.getPending(); },
  async getAdminAnalytics() { return this.getAnalytics(); },
  async getSchemeHistory(id) { return [{ version: 'v1.0', date: '2026-01-01', changes: 'Initial release' }]; },
  async createScheme(data) { return { _id: `sch_${Date.now()}`, ...data }; },
  async updateScheme(id, data) { return { _id: id, ...data }; },
  async reviewPendingScheme(queueId, action, notes, modifiedData) {
    if (action === 'approve') return this.approvePending(queueId);
    return this.rejectPending(queueId);
  },
  async triggerIngestion(sourceUrl, sourceName) {
    return { success: true, message: 'Ingestion initiated', queueId: `rq_${Date.now()}` };
  },
};

export default apiClient;
