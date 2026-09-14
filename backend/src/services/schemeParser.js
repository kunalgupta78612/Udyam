import { GoogleGenerativeAI } from '@google/generative-ai';

const ALLOWED_FIELDS = [
  'category',
  'gender',
  'age',
  'annualIncome',
  'businessStage',
  'sector',
  'state',
  'ruralOrUrban',
  'isPwD',
  'isTransgender',
  'hasCollateral',
  'qualification'
];

const ALLOWED_OPERATORS = [
  'eq',
  'neq',
  'in',
  'notIn',
  'lte',
  'gte',
  'lt',
  'gt',
  'between',
  'exists'
];

const ALLOWED_BENEFIT_TYPES = [
  'loan',
  'subsidy',
  'grant',
  'training',
  'composite',
  'other'
];

const PARSER_SYSTEM_PROMPT = `
You are a precise, deterministic data extraction assistant for Indian Government schemes.
Your task is to extract structured scheme criteria from the provided raw web page text or HTML.

CRITICAL CONSTRAINTS:
1. ONLY extract information directly and explicitly stated in the source text.
2. If any piece of information or field is not stated in the source, set it strictly to null.
3. NEVER invent, hallucinate, assume, or extrapolate any eligibility rules or thresholds.
4. NEVER decide or evaluate eligibility. You are an extractor, NOT a rule engine.
5. All eligibility rules MUST map directly to the standardized fields and operators listed below.

STANDARDIZED RULE FIELDS:
- "category" -> SC, ST, OBC, EWS, General
- "gender" -> male, female, other
- "age" -> number in years
- "annualIncome" -> number in INR
- "businessStage" -> idea, startup_less_1yr, early_1_3yr, established
- "sector" -> manufacturing, services, trading, agriculture, artisan, other
- "state" -> Indian state/UT name
- "ruralOrUrban" -> rural, urban
- "isPwD" -> true or false
- "isTransgender" -> true or false
- "hasCollateral" -> true or false
- "qualification" -> string (e.g. "8th pass", "graduate")

STANDARDIZED OPERATORS:
- "eq": exact equality
- "neq": not equal
- "in": value is in a list of allowed values
- "notIn": value is not in a list
- "lte": less than or equal to threshold
- "gte": greater than or equal to threshold
- "lt": strictly less than
- "gt": strictly greater than
- "between": inclusive range [min, max]
- "exists": boolean check

RULE TYPES:
- "hard": Mandatory demographic requirement (e.g., must be SC/ST, must be female, must be citizen).
- "soft": Flexible economic requirement where small margins can be permitted (e.g. annual income ceiling, age ceiling).

OUTPUT FORMAT:
Return a single, strictly valid JSON object conforming to this schema (no markdown, no extra commentary):
{
  "name": "Scheme Name in English",
  "nameHi": "Scheme Name in Hindi or null",
  "sponsoringBody": "Ministry / Department Name",
  "level": "central" | "state",
  "state": "State Name if state level, else null",
  "description": "Comprehensive English overview",
  "descriptionHi": "Hindi overview or null",
  "eligibilityRules": [
    {
      "field": "one of allowed fields",
      "operator": "one of allowed operators",
      "value": "target value, number, or array",
      "ruleType": "hard" | "soft",
      "label": "Human readable English rule label",
      "labelHi": "Human readable Hindi rule label or null"
    }
  ],
  "benefits": {
    "type": "loan" | "subsidy" | "grant" | "training" | "composite" | "other",
    "amount": null,
    "ceiling": 1000000,
    "subsidyPercent": 25,
    "description": "English description of benefits",
    "descriptionHi": "Hindi description or null"
  },
  "documentsRequired": [
    {
      "name": "Document name in English",
      "nameHi": "Document name in Hindi or null",
      "mandatory": true
    }
  ],
  "applicationLink": "URL string or null"
}
`;

/**
 * Sanitizes and validates the raw JSON returned by the AI against the Scheme schema
 *
 * @param {Object} rawData - Parsed JSON object from Gemini
 * @param {string} sourceUrl - Source URL of the scraped scheme
 * @returns {Object} Validated scheme object
 */
export const validateAndSanitizeSchemeData = (rawData, sourceUrl) => {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Parser output is not a valid object.');
  }

  const name = rawData.name ? String(rawData.name).trim() : null;
  if (!name) {
    throw new Error('Scheme name could not be extracted from the content.');
  }

  const sponsoringBody = rawData.sponsoringBody
    ? String(rawData.sponsoringBody).trim()
    : 'Government of India';

  const level = rawData.level === 'state' ? 'state' : 'central';
  const state = level === 'state' ? (rawData.state ? String(rawData.state).trim() : null) : null;

  const description = rawData.description
    ? String(rawData.description).trim()
    : 'Government scheme criteria and benefits.';

  // Filter and sanitize eligibility rules
  const sanitizedRules = [];
  if (Array.isArray(rawData.eligibilityRules)) {
    rawData.eligibilityRules.forEach((rule) => {
      if (
        rule &&
        typeof rule === 'object' &&
        ALLOWED_FIELDS.includes(rule.field) &&
        ALLOWED_OPERATORS.includes(rule.operator) &&
        rule.value !== undefined &&
        rule.value !== null
      ) {
        sanitizedRules.push({
          field: rule.field,
          operator: rule.operator,
          value: rule.value,
          ruleType: rule.ruleType === 'soft' ? 'soft' : 'hard',
          label: rule.label ? String(rule.label).trim() : `${rule.field} ${rule.operator} ${rule.value}`,
          labelHi: rule.labelHi ? String(rule.labelHi).trim() : null
        });
      }
    });
  }

  // Sanitize benefits
  const rawBenefits = rawData.benefits || {};
  const benefits = {
    type: ALLOWED_BENEFIT_TYPES.includes(rawBenefits.type)
      ? rawBenefits.type
      : 'composite',
    amount:
      typeof rawBenefits.amount === 'number' && rawBenefits.amount >= 0
        ? rawBenefits.amount
        : null,
    ceiling:
      typeof rawBenefits.ceiling === 'number' && rawBenefits.ceiling >= 0
        ? rawBenefits.ceiling
        : null,
    subsidyPercent:
      typeof rawBenefits.subsidyPercent === 'number' &&
      rawBenefits.subsidyPercent >= 0 &&
      rawBenefits.subsidyPercent <= 100
        ? rawBenefits.subsidyPercent
        : null,
    description: rawBenefits.description
      ? String(rawBenefits.description).trim()
      : 'Financial assistance and support under the scheme.',
    descriptionHi: rawBenefits.descriptionHi
      ? String(rawBenefits.descriptionHi).trim()
      : null
  };

  // Sanitize documentsRequired
  const documentsRequired = [];
  if (Array.isArray(rawData.documentsRequired)) {
    rawData.documentsRequired.forEach((doc) => {
      if (doc && doc.name) {
        documentsRequired.push({
          name: String(doc.name).trim(),
          nameHi: doc.nameHi ? String(doc.nameHi).trim() : null,
          mandatory: doc.mandatory !== false
        });
      }
    });
  }

  return {
    name,
    nameHi: rawData.nameHi ? String(rawData.nameHi).trim() : null,
    sponsoringBody,
    level,
    state,
    description,
    descriptionHi: rawData.descriptionHi ? String(rawData.descriptionHi).trim() : null,
    eligibilityRules: sanitizedRules,
    benefits,
    documentsRequired,
    applicationLink: rawData.applicationLink ? String(rawData.applicationLink).trim() : null,
    sourceUrl: sourceUrl || rawData.sourceUrl || '',
    isActive: true,
    version: 1
  };
};

/**
 * Extracts structured scheme data from scraped content using Google Gemini API
 *
 * @param {Object} scrapedData - Output from schemeScraper.js ({ cleanText, title, sourceUrl })
 * @param {Object} [options={}] - Optional model config
 * @returns {Promise<Object>} Structured Scheme data matching the Scheme model
 */
export const parseSchemeWithGemini = async (scrapedData, options = {}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add a valid Google Gemini API key to backend/.env'
    );
  }

  if (!scrapedData || (!scrapedData.cleanText && !scrapedData.cleanHtmlSnippet)) {
    throw new Error('Scraped content text or HTML is required for AI parsing.');
  }

  const modelName = options.model || process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1 // Low temperature for deterministic extraction
    },
    systemInstruction: PARSER_SYSTEM_PROMPT
  });

  const contentPrompt = `
Official Source URL: ${scrapedData.sourceUrl || 'Unknown'}
Page Title: ${scrapedData.title || 'Unknown'}

SOURCE CONTENT:
${scrapedData.cleanText || scrapedData.cleanHtmlSnippet}
`;

  const result = await model.generateContent(contentPrompt);
  const response = await result.response;
  const rawText = response.text();

  // Parse JSON response safely
  let rawParsedData;
  try {
    // Remove markdown code block fences if present
    const cleanedJson = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    rawParsedData = JSON.parse(cleanedJson);
  } catch (err) {
    throw new Error(`Gemini response could not be parsed as JSON: ${err.message}. Response was: ${rawText.substring(0, 200)}`);
  }

  // Validate and sanitize data to guarantee schema conformity
  return validateAndSanitizeSchemeData(rawParsedData, scrapedData.sourceUrl);
};
