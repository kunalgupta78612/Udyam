// Maps spoken Hindi words to structured values for intake form
const voiceMapper = {
  // Categories
  'अनुसूचित जाति': 'SC',
  'एससी': 'SC',
  'scheduled caste': 'SC',
  'अनुसूचित जनजाति': 'ST',
  'एसटी': 'ST',
  'scheduled tribe': 'ST',
  'ओबीसी': 'OBC',
  'अन्य पिछड़ा वर्ग': 'OBC',
  'other backward class': 'OBC',
  'सामान्य': 'General',
  'general': 'General',
  'जनरल': 'General',
  'ईडब्ल्यूएस': 'EWS',

  // Gender
  'पुरुष': 'male',
  'male': 'male',
  'महिला': 'female',
  'female': 'female',
  'अन्य': 'other',
  'other': 'other',

  // Yes/No
  'हाँ': true,
  'हां': true,
  'yes': true,
  'नहीं': false,
  'no': false,

  // Areas
  'ग्रामीण': 'rural',
  'rural': 'rural',
  'शहरी': 'urban',
  'urban': 'urban',

  // Sectors
  'विनिर्माण': 'manufacturing',
  'manufacturing': 'manufacturing',
  'सेवाएं': 'services',
  'services': 'services',
  'व्यापार': 'trading',
  'trading': 'trading',
  'कृषि': 'agriculture',
  'agriculture': 'agriculture',
  'कारीगर': 'artisan',
  'artisan': 'artisan',
};

export function mapVoiceToValue(spokenText) {
  if (!spokenText) return null;
  const lower = spokenText.trim().toLowerCase();
  
  // Check direct mapping
  for (const [key, value] of Object.entries(voiceMapper)) {
    if (lower.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Try to parse numbers
  const num = parseInt(spokenText.replace(/[^\d]/g, ''), 10);
  if (!isNaN(num)) return num;
  
  return spokenText;
}

export default voiceMapper;
