/**
 * @file ruleEngine.js
 * @desc Pure, deterministic rule engine for matching entrepreneur profiles against government scheme criteria.
 * ZERO LLM / AI — 100% auditable, transparent, deterministic evaluation.
 */

// Default tolerances for soft rule partial matches
const SOFT_MARGINS = {
  PERCENT: 0.10, // 10% threshold flexibility for monetary/general numeric soft rules
  AGE_YEARS: 2   // 2-year age flexibility for soft age constraints
};

/**
 * Normalizes values for comparison (case-insensitive strings, numbers, booleans)
 */
const normalizeValue = (val) => {
  if (typeof val === 'string') return val.trim().toLowerCase();
  return val;
};

/**
 * Evaluates a single operator comparison against user profile value
 *
 * @param {*} userVal - The actual value from the user profile
 * @param {string} operator - eq, neq, in, notIn, lte, gte, lt, gt, between, exists
 * @param {*} ruleVal - The target criteria value defined in the scheme rule
 * @returns {boolean} Whether the operator criteria is satisfied
 */
export const evaluateOperator = (userVal, operator, ruleVal) => {
  if (userVal === undefined || userVal === null) {
    if (operator === 'exists') return ruleVal === false;
    return false;
  }

  const normalizedUser = normalizeValue(userVal);
  const normalizedRule = normalizeValue(ruleVal);

  switch (operator) {
    case 'eq':
      return normalizedUser === normalizedRule;

    case 'neq':
      return normalizedUser !== normalizedRule;

    case 'in': {
      if (!Array.isArray(ruleVal)) return false;
      const ruleList = ruleVal.map(normalizeValue);
      if (Array.isArray(userVal)) {
        return userVal.some((item) => ruleList.includes(normalizeValue(item)));
      }
      return ruleList.includes(normalizedUser);
    }

    case 'notIn': {
      if (!Array.isArray(ruleVal)) return true;
      const ruleList = ruleVal.map(normalizeValue);
      if (Array.isArray(userVal)) {
        return !userVal.some((item) => ruleList.includes(normalizeValue(item)));
      }
      return !ruleList.includes(normalizedUser);
    }

    case 'lte': {
      const uNum = Number(userVal);
      const rNum = Number(ruleVal);
      if (isNaN(uNum) || isNaN(rNum)) return false;
      return uNum <= rNum;
    }

    case 'gte': {
      const uNum = Number(userVal);
      const rNum = Number(ruleVal);
      if (isNaN(uNum) || isNaN(rNum)) return false;
      return uNum >= rNum;
    }

    case 'lt': {
      const uNum = Number(userVal);
      const rNum = Number(ruleVal);
      if (isNaN(uNum) || isNaN(rNum)) return false;
      return uNum < rNum;
    }

    case 'gt': {
      const uNum = Number(userVal);
      const rNum = Number(ruleVal);
      if (isNaN(uNum) || isNaN(rNum)) return false;
      return uNum > rNum;
    }

    case 'between': {
      if (!Array.isArray(ruleVal) || ruleVal.length < 2) return false;
      const uNum = Number(userVal);
      const min = Number(ruleVal[0]);
      const max = Number(ruleVal[1]);
      if (isNaN(uNum) || isNaN(min) || isNaN(max)) return false;
      return uNum >= min && uNum <= max;
    }

    case 'exists': {
      const hasValue = userVal !== undefined && userVal !== null && userVal !== '';
      return ruleVal === true ? hasValue : !hasValue;
    }

    default:
      return false;
  }
};

/**
 * Checks if a failed numeric soft rule qualifies for a partial match within acceptable margin
 *
 * @param {string} field - Field name (e.g. annualIncome, age)
 * @param {*} userVal - User's value
 * @param {string} operator - Operator
 * @param {*} ruleVal - Rule threshold value
 * @returns {{ isPartial: boolean, marginDescription: string }}
 */
export const evaluateSoftMargin = (field, userVal, operator, ruleVal) => {
  const uNum = Number(userVal);
  const rNum = Number(ruleVal);

  if (isNaN(uNum)) return { isPartial: false, marginDescription: '' };

  // Age soft margins (within 2 years)
  if (field === 'age') {
    if (operator === 'gte' && uNum >= rNum - SOFT_MARGINS.AGE_YEARS) {
      return { isPartial: true, marginDescription: `Within ${SOFT_MARGINS.AGE_YEARS} years of required age (${rNum})` };
    }
    if (operator === 'lte' && uNum <= rNum + SOFT_MARGINS.AGE_YEARS) {
      return { isPartial: true, marginDescription: `Within ${SOFT_MARGINS.AGE_YEARS} years of age limit (${rNum})` };
    }
    if (operator === 'between' && Array.isArray(ruleVal) && ruleVal.length >= 2) {
      const min = Number(ruleVal[0]);
      const max = Number(ruleVal[1]);
      if (uNum >= min - SOFT_MARGINS.AGE_YEARS && uNum <= max + SOFT_MARGINS.AGE_YEARS) {
        return { isPartial: true, marginDescription: `Within age flexibility margin (${min} - ${max})` };
      }
    }
  }

  // Monetary / general numeric soft margins (within 10%)
  if (!isNaN(rNum) && rNum > 0) {
    if (operator === 'lte' && uNum <= rNum * (1 + SOFT_MARGINS.PERCENT)) {
      const diffPercent = Math.round(((uNum - rNum) / rNum) * 100);
      return { isPartial: true, marginDescription: `Exceeds threshold by ${diffPercent}% (within 10% flexibility margin)` };
    }
    if (operator === 'gte' && uNum >= rNum * (1 - SOFT_MARGINS.PERCENT)) {
      const diffPercent = Math.round(((rNum - uNum) / rNum) * 100);
      return { isPartial: true, marginDescription: `Below threshold by ${diffPercent}% (within 10% flexibility margin)` };
    }
  }

  return { isPartial: false, marginDescription: '' };
};

/**
 * Evaluates a single rule against user profile
 *
 * @param {Object} profile - User profile object
 * @param {Object} rule - Individual eligibility rule
 * @returns {Object} Evaluation outcome with status, score, and explanation
 */
export const evaluateRule = (profile, rule) => {
  const userVal = profile[rule.field];
  const ruleType = rule.ruleType || 'hard';
  const passed = evaluateOperator(userVal, rule.operator, rule.value);

  if (passed) {
    return {
      field: rule.field,
      passed: true,
      partial: false,
      ruleType,
      userValue: userVal,
      targetValue: rule.value,
      operator: rule.operator,
      score: 1.0,
      label: rule.label,
      labelHi: rule.labelHi || null,
      reason: `${rule.label} ✓`,
      reasonHi: rule.labelHi ? `${rule.labelHi} ✓` : null
    };
  }

  // Rule failed — check if soft rule qualifies for partial match
  if (ruleType === 'soft') {
    const { isPartial, marginDescription } = evaluateSoftMargin(
      rule.field,
      userVal,
      rule.operator,
      rule.value
    );

    if (isPartial) {
      return {
        field: rule.field,
        passed: true,
        partial: true,
        ruleType: 'soft',
        userValue: userVal,
        targetValue: rule.value,
        operator: rule.operator,
        score: 0.75,
        label: rule.label,
        labelHi: rule.labelHi || null,
        reason: `${rule.label} (Partial: ${marginDescription})`,
        reasonHi: rule.labelHi ? `${rule.labelHi} (आंशिक मिलान)` : null
      };
    }

    // Soft rule failed completely without margin
    return {
      field: rule.field,
      passed: false,
      partial: false,
      ruleType: 'soft',
      userValue: userVal,
      targetValue: rule.value,
      operator: rule.operator,
      score: 0.0,
      label: rule.label,
      labelHi: rule.labelHi || null,
      reason: `${rule.label} (Soft criteria not met)`,
      reasonHi: rule.labelHi ? `${rule.labelHi} (मापदंड पूरा नहीं हुआ)` : null
    };
  }

  // Hard rule failed
  return {
    field: rule.field,
    passed: false,
    partial: false,
    ruleType: 'hard',
    userValue: userVal,
    targetValue: rule.value,
    operator: rule.operator,
    score: 0.0,
    label: rule.label,
    labelHi: rule.labelHi || null,
    reason: `${rule.label} (Mandatory requirement not met)`,
    reasonHi: rule.labelHi ? `${rule.labelHi} (अनिवार्य आवश्यकता पूरी नहीं हुई)` : null
  };
};

/**
 * Evaluates a scheme against a user profile
 *
 * @param {Object} profile - User profile object
 * @param {Object} scheme - Scheme document or object
 * @returns {Object} Complete scheme evaluation result
 */
export const evaluateScheme = (profile, scheme) => {
  const rules = scheme.eligibilityRules || [];

  if (rules.length === 0) {
    return {
      schemeId: scheme._id,
      schemeName: scheme.name,
      schemeNameHi: scheme.nameHi || null,
      slug: scheme.slug,
      level: scheme.level,
      state: scheme.state || null,
      sponsoringBody: scheme.sponsoringBody,
      benefits: scheme.benefits,
      documentsRequired: scheme.documentsRequired || [],
      applicationLink: scheme.applicationLink || null,
      sourceUrl: scheme.sourceUrl,
      isEligible: true,
      matchStatus: 'eligible',
      matchScore: 100,
      hardRulesPassed: true,
      passedRulesCount: 0,
      totalRulesCount: 0,
      ruleEvaluations: [],
      whyMatched: ['Open eligibility for all entrepreneurs ✓'],
      whatMissing: []
    };
  }

  const evaluations = rules.map((rule) => evaluateRule(profile, rule));

  let hardRulesPassed = true;
  let totalScoreWeight = 0;
  let earnedScoreWeight = 0;
  let hasPartial = false;

  const whyMatched = [];
  const whatMissing = [];

  evaluations.forEach((evalResult) => {
    // Hard rules have double weight in scoring
    const weight = evalResult.ruleType === 'hard' ? 2 : 1;
    totalScoreWeight += weight;
    earnedScoreWeight += evalResult.score * weight;

    if (evalResult.ruleType === 'hard' && !evalResult.passed) {
      hardRulesPassed = false;
    }

    if (evalResult.partial) {
      hasPartial = true;
    }

    if (evalResult.passed) {
      whyMatched.push({
        label: evalResult.label,
        labelHi: evalResult.labelHi,
        reason: evalResult.reason,
        reasonHi: evalResult.reasonHi,
        partial: evalResult.partial
      });
    } else {
      whatMissing.push({
        label: evalResult.label,
        labelHi: evalResult.labelHi,
        reason: evalResult.reason,
        reasonHi: evalResult.reasonHi,
        ruleType: evalResult.ruleType
      });
    }
  });

  const rawScore = totalScoreWeight > 0 ? (earnedScoreWeight / totalScoreWeight) * 100 : 100;
  let matchScore = Math.round(rawScore);
  let matchStatus;
  let isEligible;

  if (hardRulesPassed) {
    if (whatMissing.length === 0 && !hasPartial) {
      // 100% hard and soft rules met
      matchStatus = 'eligible';
      isEligible = true;
      matchScore = 100;
    } else {
      // All hard rules pass, but some soft rules are partial or missing
      matchStatus = 'near_miss';
      isEligible = false; // Near-miss / close match
      // Score range for near miss: 60 - 95
      matchScore = Math.max(60, Math.min(95, matchScore));
    }
  } else {
    // Hard rule failed
    matchStatus = 'ineligible';
    isEligible = false;
    // Score capped at 40 max for ineligible schemes
    matchScore = Math.min(40, Math.round(matchScore * 0.4));
  }

  return {
    schemeId: scheme._id,
    schemeName: scheme.name,
    schemeNameHi: scheme.nameHi || null,
    slug: scheme.slug,
    level: scheme.level,
    state: scheme.state || null,
    sponsoringBody: scheme.sponsoringBody,
    benefits: scheme.benefits,
    documentsRequired: scheme.documentsRequired || [],
    applicationLink: scheme.applicationLink || null,
    sourceUrl: scheme.sourceUrl,
    isEligible,
    matchStatus,
    matchScore,
    hardRulesPassed,
    passedRulesCount: evaluations.filter((e) => e.passed).length,
    totalRulesCount: rules.length,
    ruleEvaluations: evaluations,
    whyMatched,
    whatMissing
  };
};

/**
 * Matches a user profile across all schemes and sorts deterministically
 *
 * @param {Object} profile - User profile object
 * @param {Array<Object>} schemes - Array of active scheme objects
 * @returns {Array<Object>} Ranked scheme match results
 */
export const matchAllSchemes = (profile, schemes = []) => {
  const results = schemes.map((scheme) => evaluateScheme(profile, scheme));

  // Sort ranked matches:
  // 1. 'eligible' first (by matchScore desc)
  // 2. 'near_miss' second (by matchScore desc)
  // 3. 'ineligible' third (by matchScore desc)
  const statusRank = {
    eligible: 1,
    near_miss: 2,
    ineligible: 3
  };

  return results.sort((a, b) => {
    if (statusRank[a.matchStatus] !== statusRank[b.matchStatus]) {
      return statusRank[a.matchStatus] - statusRank[b.matchStatus];
    }
    return b.matchScore - a.matchScore;
  });
};
