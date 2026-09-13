import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAndSanitizeSchemeData,
  parseSchemeWithGemini
} from '../services/schemeParser.js';

describe('Gemini Scheme Parser Service Tests', () => {
  it('should validate and sanitize raw parsed JSON correctly', () => {
    const rawAiOutput = {
      name: 'Stand-Up India Scheme',
      nameHi: 'स्टैंड-अप इंडिया',
      sponsoringBody: 'Ministry of Finance',
      level: 'central',
      state: null,
      description: 'Facilitates bank loans between 10 lakh and 1 Crore.',
      descriptionHi: null,
      eligibilityRules: [
        {
          field: 'category',
          operator: 'in',
          value: ['SC', 'ST'],
          ruleType: 'hard',
          label: 'Applicant must be SC or ST'
        },
        {
          field: 'annualIncome',
          operator: 'lte',
          value: 300000,
          ruleType: 'soft',
          label: 'Income ceiling'
        },
        {
          // Invalid operator - must be filtered out!
          field: 'age',
          operator: 'like_regex',
          value: 18,
          label: 'Invalid rule'
        }
      ],
      benefits: {
        type: 'loan',
        amount: null,
        ceiling: 10000000,
        subsidyPercent: 15,
        description: 'Composite loan up to 1 Crore',
        descriptionHi: null
      },
      documentsRequired: [
        { name: 'Aadhaar Card', mandatory: true },
        { name: 'Caste Certificate', mandatory: false }
      ],
      applicationLink: 'https://www.standupmitra.in'
    };

    const sanitized = validateAndSanitizeSchemeData(
      rawAiOutput,
      'https://myscheme.gov.in/schemes/stand-up-india'
    );

    assert.strictEqual(sanitized.name, 'Stand-Up India Scheme');
    assert.strictEqual(sanitized.level, 'central');
    assert.strictEqual(sanitized.state, null);
    assert.strictEqual(sanitized.sourceUrl, 'https://myscheme.gov.in/schemes/stand-up-india');
    assert.strictEqual(sanitized.version, 1);
    assert.strictEqual(sanitized.isActive, true);

    // Ensure invalid operator rule was filtered out
    assert.strictEqual(sanitized.eligibilityRules.length, 2);
    assert.strictEqual(sanitized.eligibilityRules[0].field, 'category');
    assert.strictEqual(sanitized.eligibilityRules[1].field, 'annualIncome');

    // Ensure benefits structure
    assert.strictEqual(sanitized.benefits.type, 'loan');
    assert.strictEqual(sanitized.benefits.ceiling, 10000000);
    assert.strictEqual(sanitized.benefits.subsidyPercent, 15);

    // Ensure documents
    assert.strictEqual(sanitized.documentsRequired.length, 2);
    assert.strictEqual(sanitized.documentsRequired[0].mandatory, true);
    assert.strictEqual(sanitized.documentsRequired[1].mandatory, false);
  });

  it('should set missing fields strictly to null and not invent values', () => {
    const sparseRaw = {
      name: 'Sparse Scheme',
      description: 'A scheme with no extra info.'
    };

    const sanitized = validateAndSanitizeSchemeData(sparseRaw, 'https://example.gov.in');

    assert.strictEqual(sanitized.name, 'Sparse Scheme');
    assert.strictEqual(sanitized.nameHi, null);
    assert.strictEqual(sanitized.state, null);
    assert.strictEqual(sanitized.descriptionHi, null);
    assert.strictEqual(sanitized.applicationLink, null);
    assert.strictEqual(sanitized.eligibilityRules.length, 0);
    assert.strictEqual(sanitized.documentsRequired.length, 0);
  });

  it('should enforce state name when scheme is state-level', () => {
    const stateScheme = {
      name: 'Rajasthan Youth Scheme',
      level: 'state',
      state: 'Rajasthan',
      description: 'For youth in Rajasthan'
    };

    const sanitized = validateAndSanitizeSchemeData(stateScheme, 'https://rajasthan.gov.in');
    assert.strictEqual(sanitized.level, 'state');
    assert.strictEqual(sanitized.state, 'Rajasthan');
  });

  it('should throw an informative error when GEMINI_API_KEY is not set', async () => {
    const origKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      await parseSchemeWithGemini({
        cleanText: 'Some scheme text',
        title: 'Title'
      });
      assert.fail('Should have thrown error for missing GEMINI_API_KEY');
    } catch (err) {
      assert.match(err.message, /GEMINI_API_KEY is not configured/);
    } finally {
      process.env.GEMINI_API_KEY = origKey;
    }
  });

  it('should throw an error when scraped data is empty', async () => {
    process.env.GEMINI_API_KEY = 'test_key';
    try {
      await parseSchemeWithGemini({});
      assert.fail('Should have thrown error for empty scraped data');
    } catch (err) {
      assert.match(err.message, /Scraped content text or HTML is required/);
    }
  });
});
