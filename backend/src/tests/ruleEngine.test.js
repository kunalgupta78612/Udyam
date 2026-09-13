
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateOperator,
  evaluateRule,
  evaluateScheme,
  matchAllSchemes
} from '../services/ruleEngine.js';

describe('Deterministic Rule Engine Unit Tests (Zero AI)', () => {
  describe('Operator Evaluation Tests', () => {
    it('should correctly evaluate "eq" operator (case-insensitive string and boolean)', () => {
      assert.strictEqual(evaluateOperator('SC', 'eq', 'SC'), true);
      assert.strictEqual(evaluateOperator('female', 'eq', 'Female'), true);
      assert.strictEqual(evaluateOperator('male', 'eq', 'female'), false);
      assert.strictEqual(evaluateOperator(true, 'eq', true), true);
      assert.strictEqual(evaluateOperator(false, 'eq', true), false);
    });

    it('should correctly evaluate "neq" operator', () => {
      assert.strictEqual(evaluateOperator('General', 'neq', 'SC'), true);
      assert.strictEqual(evaluateOperator('SC', 'neq', 'SC'), false);
      assert.strictEqual(evaluateOperator('sc', 'neq', 'SC'), false);
    });

    it('should correctly evaluate "in" operator for list matching', () => {
      assert.strictEqual(evaluateOperator('SC', 'in', ['SC', 'ST']), true);
      assert.strictEqual(evaluateOperator('st', 'in', ['SC', 'ST']), true);
      assert.strictEqual(evaluateOperator('General', 'in', ['SC', 'ST']), false);
    });

    it('should correctly evaluate "notIn" operator for exclusion', () => {
      assert.strictEqual(evaluateOperator('manufacturing', 'notIn', ['trading']), true);
      assert.strictEqual(evaluateOperator('trading', 'notIn', ['trading', 'services']), false);
      assert.strictEqual(evaluateOperator('Trading', 'notIn', ['trading']), false);
    });

    it('should correctly evaluate "lte" operator (numeric less than or equal)', () => {
      assert.strictEqual(evaluateOperator(250000, 'lte', 300000), true);
      assert.strictEqual(evaluateOperator(300000, 'lte', 300000), true);
      assert.strictEqual(evaluateOperator(300001, 'lte', 300000), false);
    });

    it('should correctly evaluate "gte" operator (numeric greater than or equal)', () => {
      assert.strictEqual(evaluateOperator(18, 'gte', 18), true);
      assert.strictEqual(evaluateOperator(25, 'gte', 18), true);
      assert.strictEqual(evaluateOperator(17, 'gte', 18), false);
    });

    it('should correctly evaluate "lt" and "gt" strict comparison operators', () => {
      assert.strictEqual(evaluateOperator(59, 'lt', 60), true);
      assert.strictEqual(evaluateOperator(60, 'lt', 60), false);
      assert.strictEqual(evaluateOperator(61, 'gt', 60), true);
      assert.strictEqual(evaluateOperator(60, 'gt', 60), false);
    });

    it('should correctly evaluate "between" inclusive numeric range operator', () => {
      assert.strictEqual(evaluateOperator(25, 'between', [18, 45]), true);
      assert.strictEqual(evaluateOperator(18, 'between', [18, 45]), true);
      assert.strictEqual(evaluateOperator(45, 'between', [18, 45]), true);
      assert.strictEqual(evaluateOperator(17, 'between', [18, 45]), false);
      assert.strictEqual(evaluateOperator(46, 'between', [18, 45]), false);
    });

    it('should correctly evaluate "exists" presence operator', () => {
      assert.strictEqual(evaluateOperator(true, 'exists', true), true);
      assert.strictEqual(evaluateOperator('Rajasthan', 'exists', true), true);
      assert.strictEqual(evaluateOperator(null, 'exists', true), false);
      assert.strictEqual(evaluateOperator(undefined, 'exists', true), false);
      assert.strictEqual(evaluateOperator('', 'exists', true), false);
    });
  });

  describe('Hard Rule vs Soft Rule Behavior', () => {
    it('should pass hard rule and produce full score when satisfied', () => {
      const profile = { category: 'SC' };
      const rule = {
        field: 'category',
        operator: 'eq',
        value: 'SC',
        ruleType: 'hard',
        label: 'Category must be SC'
      };

      const result = evaluateRule(profile, rule);
      assert.strictEqual(result.passed, true);
      assert.strictEqual(result.partial, false);
      assert.strictEqual(result.score, 1.0);
      assert.match(result.reason, /✓/);
    });

    it('should fail hard rule with score 0 when condition not met', () => {
      const profile = { category: 'General' };
      const rule = {
        field: 'category',
        operator: 'in',
        value: ['SC', 'ST'],
        ruleType: 'hard',
        label: 'Must belong to SC/ST'
      };

      const result = evaluateRule(profile, rule);
      assert.strictEqual(result.passed, false);
      assert.strictEqual(result.partial, false);
      assert.strictEqual(result.score, 0.0);
      assert.match(result.reason, /Mandatory requirement not met/);
    });

    it('should allow soft rule partial match when within 10% numeric tolerance margin', () => {
      // Threshold: 300,000; Applicant: 320,000 (exceeds by ~6.6%, within 10% tolerance)
      const profile = { annualIncome: 320000 };
      const rule = {
        field: 'annualIncome',
        operator: 'lte',
        value: 300000,
        ruleType: 'soft',
        label: 'Income threshold ₹3,00,000'
      };

      const result = evaluateRule(profile, rule);
      assert.strictEqual(result.passed, true);
      assert.strictEqual(result.partial, true);
      assert.strictEqual(result.score, 0.75);
      assert.match(result.reason, /Partial/);
      assert.match(result.reason, /flexibility margin/);
    });

    it('should fail soft rule when far outside 10% tolerance margin', () => {
      // Threshold: 300,000; Applicant: 500,000 (exceeds by 66%, well outside 10%)
      const profile = { annualIncome: 500000 };
      const rule = {
        field: 'annualIncome',
        operator: 'lte',
        value: 300000,
        ruleType: 'soft',
        label: 'Income threshold ₹3,00,000'
      };

      const result = evaluateRule(profile, rule);
      assert.strictEqual(result.passed, false);
      assert.strictEqual(result.partial, false);
      assert.strictEqual(result.score, 0.0);
      assert.match(result.reason, /Soft criteria not met/);
    });

    it('should allow soft rule partial match for age within 2 years margin', () => {
      // Required: 18+; Applicant: 17 (within 2-year margin)
      const profile = { age: 17 };
      const rule = {
        field: 'age',
        operator: 'gte',
        value: 18,
        ruleType: 'soft',
        label: 'Minimum age 18'
      };

      const result = evaluateRule(profile, rule);
      assert.strictEqual(result.passed, true);
      assert.strictEqual(result.partial, true);
      assert.strictEqual(result.score, 0.75);
      assert.match(result.reason, /Within 2 years/);
    });
  });

  describe('Scheme Evaluation & Scoring', () => {
    const mockScheme = {
      _id: 'scheme_123',
      name: 'Stand-Up India',
      slug: 'stand-up-india',
      eligibilityRules: [
        {
          field: 'category',
          operator: 'in',
          value: ['SC', 'ST'],
          ruleType: 'hard',
          label: 'Category must be SC or ST'
        },
        {
          field: 'annualIncome',
          operator: 'lte',
          value: 300000,
          ruleType: 'soft',
          label: 'Annual income up to ₹3,00,000'
        }
      ],
      benefits: { type: 'loan', description: 'Up to 1 Cr loan' },
      sourceUrl: 'https://example.gov.in'
    };

    it('should produce "eligible" (100% score) when all hard and soft rules pass', () => {
      const perfectProfile = {
        category: 'SC',
        annualIncome: 250000
      };

      const evaluation = evaluateScheme(perfectProfile, mockScheme);
      assert.strictEqual(evaluation.isEligible, true);
      assert.strictEqual(evaluation.matchStatus, 'eligible');
      assert.strictEqual(evaluation.matchScore, 100);
      assert.strictEqual(evaluation.hardRulesPassed, true);
      assert.strictEqual(evaluation.whyMatched.length, 2);
      assert.strictEqual(evaluation.whatMissing.length, 0);
    });

    it('should produce "near_miss" (close match score 60-95) when hard rules pass but soft rule is partial', () => {
      const nearMissProfile = {
        category: 'SC',
        annualIncome: 320000 // Exceeds by 6.6%, within 10% soft margin
      };

      const evaluation = evaluateScheme(nearMissProfile, mockScheme);
      assert.strictEqual(evaluation.isEligible, false); // Near miss is not 100% eligible
      assert.strictEqual(evaluation.matchStatus, 'near_miss');
      assert.strictEqual(evaluation.hardRulesPassed, true);
      assert.ok(evaluation.matchScore >= 60 && evaluation.matchScore <= 95);
      assert.ok(evaluation.whyMatched.some((r) => r.partial === true));
    });

    it('should produce "ineligible" (score <= 40) when any hard rule fails', () => {
      const disqualifiedProfile = {
        category: 'General', // Fails hard rule!
        annualIncome: 200000 // Passes soft rule
      };

      const evaluation = evaluateScheme(disqualifiedProfile, mockScheme);
      assert.strictEqual(evaluation.isEligible, false);
      assert.strictEqual(evaluation.matchStatus, 'ineligible');
      assert.strictEqual(evaluation.hardRulesPassed, false);
      assert.ok(evaluation.matchScore <= 40);
      assert.ok(evaluation.whatMissing.some((r) => r.ruleType === 'hard'));
    });
  });

  describe('Ranked Scheme Matching (matchAllSchemes)', () => {
    it('should rank eligible schemes first, near-miss second, and ineligible last', () => {
      const userProfile = {
        category: 'SC',
        age: 28,
        annualIncome: 315000 // Slightly over 3L soft rule
      };

      const schemes = [
        {
          _id: '1',
          name: 'Ineligible Scheme',
          slug: 'ineligible',
          eligibilityRules: [
            { field: 'category', operator: 'eq', value: 'General', ruleType: 'hard', label: 'General only' }
          ]
        },
        {
          _id: '2',
          name: 'Perfect Match Scheme',
          slug: 'perfect-match',
          eligibilityRules: [
            { field: 'category', operator: 'eq', value: 'SC', ruleType: 'hard', label: 'SC only' },
            { field: 'age', operator: 'gte', value: 18, ruleType: 'hard', label: '18+' }
          ]
        },
        {
          _id: '3',
          name: 'Near Miss Scheme',
          slug: 'near-miss',
          eligibilityRules: [
            { field: 'category', operator: 'eq', value: 'SC', ruleType: 'hard', label: 'SC only' },
            { field: 'annualIncome', operator: 'lte', value: 300000, ruleType: 'soft', label: 'Income limit ₹3L' }
          ]
        }
      ];

      const ranked = matchAllSchemes(userProfile, schemes);

      assert.strictEqual(ranked.length, 3);
      assert.strictEqual(ranked[0].slug, 'perfect-match');
      assert.strictEqual(ranked[0].matchStatus, 'eligible');

      assert.strictEqual(ranked[1].slug, 'near-miss');
      assert.strictEqual(ranked[1].matchStatus, 'near_miss');

      assert.strictEqual(ranked[2].slug, 'ineligible');
      assert.strictEqual(ranked[2].matchStatus, 'ineligible');
    });
  });
});
