import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampScore,
  classifyApiError,
  computeLocalDiagnostics,
  countWords,
  formatReportAsMarkdown,
  getMatchLabelForScore,
  getScoreTierMeta,
  normalizeAnalysisResult,
  validateInputs,
} from './atsAnalyzer';
import {
  INDUSTRY_DEMO_DATA,
  INDUSTRY_OPTIONS,
  getDemoProfileForIndustry,
  resolveTargetIndustryLabel,
} from '../data/demoData';

test('validateInputs flags empty, short, and missing custom industry inputs accurately', () => {
  const emptyErrors = validateInputs('', '   ');
  assert.ok(emptyErrors.jobDescription);
  assert.ok(emptyErrors.resumeText);

  const customError = validateInputs(
    INDUSTRY_DEMO_DATA.custom.jobDescription,
    INDUSTRY_DEMO_DATA.custom.resume,
    { isCustomIndustry: true, customIndustry: '   ' }
  );
  assert.ok(customError.targetIndustry);

  const shortErrors = validateInputs('Too short JD', 'Too short resume');
  assert.match(shortErrors.jobDescription ?? '', /too short/i);
  assert.match(shortErrors.resumeText ?? '', /too short/i);
});

test('all multi-industry demo profiles pass validation and produce rich local diagnostics', () => {
  assert.equal(INDUSTRY_OPTIONS.length, 7);

  for (const option of INDUSTRY_OPTIONS) {
    const profile = getDemoProfileForIndustry(option.id);
    const errors = validateInputs(profile.jobDescription, profile.resume);
    assert.deepEqual(errors, {}, `Demo profile ${option.id} should be valid`);

    const diagnostics = computeLocalDiagnostics(
      profile.jobDescription,
      profile.resume
    );
    assert.equal(diagnostics.jdWordCount, countWords(profile.jobDescription));
    assert.equal(diagnostics.resumeWordCount, countWords(profile.resume));
    assert.ok(diagnostics.jdWordCount >= 80, `${option.id} JD should be substantial`);
    assert.ok(diagnostics.resumeWordCount >= 120, `${option.id} resume should be substantial`);
    assert.ok(diagnostics.detectedSections.length >= 4, `${option.id} sections detected`);
    assert.ok(diagnostics.quantifiedMetricsCount >= 3, `${option.id} metrics detected`);
    assert.ok(diagnostics.actionVerbCount >= 4, `${option.id} verbs detected`);
  }
});

test('resolveTargetIndustryLabel resolves presets and custom roles cleanly', () => {
  assert.equal(resolveTargetIndustryLabel('digital-marketing', ''), 'Digital Marketing');
  assert.equal(resolveTargetIndustryLabel('healthcare', 'Ignored'), 'Healthcare');
  assert.equal(resolveTargetIndustryLabel('custom', 'Biomedical Engineering'), 'Biomedical Engineering');
  assert.equal(resolveTargetIndustryLabel('custom', '   '), 'Custom Profession / Role');
});

test('clampScore and match label tiers map boundaries deterministically', () => {
  assert.equal(clampScore(120), 100);
  assert.equal(clampScore(-12), 0);
  assert.equal(clampScore(87.6), 88);
  assert.equal(clampScore('invalid', 50), 50);

  assert.equal(getMatchLabelForScore(88), 'Strong Match');
  assert.equal(getMatchLabelForScore(74), 'Good Fit');
  assert.equal(getMatchLabelForScore(60), 'Moderate Match');
  assert.equal(getMatchLabelForScore(42), 'Needs Optimization');

  assert.equal(getScoreTierMeta(90).tone, 'emerald');
  assert.equal(getScoreTierMeta(75).tone, 'blue');
  assert.equal(getScoreTierMeta(58).tone, 'amber');
  assert.equal(getScoreTierMeta(40).tone, 'rose');
});

test('normalizeAnalysisResult preserves Hard/Soft skill types, industry, and universal categories', () => {
  const normalized = normalizeAnalysisResult(
    {
      roleTitle: 'Senior Digital Marketing Manager',
      atsScore: 105,
      executiveSummary: 'Strong paid acquisition track record with HubSpot attribution gaps.',
      breakdown: {
        keywordAlignment: 82.4,
        experienceRelevance: 91,
        impactMetrics: -5,
        atsFormatting: 94,
      },
      missingKeywords: [
        {
          keyword: 'HubSpot CRM',
          importance: 'Critical',
          skillType: 'Hard Skill',
          context: 'Highlight CRM lifecycle automation.',
        },
        {
          keyword: 'hubspot crm',
          importance: 'Recommended',
          skillType: 'Hard Skill',
          context: 'Duplicate removed.',
        },
        {
          keyword: 'Executive Storytelling',
          importance: 'Recommended',
          skillType: 'Soft Skill',
          context: 'Emphasize board-level ROI presentations.',
        },
      ],
      matchedKeywords: ['Google Ads', 'GA4', 'ga4', 'SEMrush'],
      improvements: [
        {
          title: 'Quantify Pipeline Attribution Impact',
          category: 'Impact & Metrics',
          priority: 'High',
          suggestion: 'Connect MQL growth directly to closed-won revenue.',
          exampleRewrite: 'Scaled paid search MQLs by 48% YoY, contributing $3.2M in qualified pipeline.',
        },
      ],
      interviewQuestions: [
        {
          question: 'Q1',
          focusArea: 'Multi-Touch Attribution',
          category: 'Role Expertise',
          whyAsked: 'Tests attribution rigor.',
          strongAnswerTips: ['Compare first-touch vs linear models'],
        },
        {
          question: 'Q2',
          focusArea: 'CRO Experiments',
          category: 'Strategy & Scenario',
          whyAsked: 'Tests funnel optimization.',
          strongAnswerTips: ['Mention statistical significance'],
        },
        {
          question: 'Q3',
          focusArea: 'Sales Alignment',
          category: 'Behavioral',
          whyAsked: 'Tests cross-functional partnership.',
          strongAnswerTips: ['Use STAR method'],
        },
        {
          question: 'Q4 dropped',
          focusArea: 'Extra',
          category: 'Behavioral',
          whyAsked: 'Extra',
          strongAnswerTips: [],
        },
      ],
    },
    'Digital Marketing'
  );

  assert.equal(normalized.targetIndustry, 'Digital Marketing');
  assert.equal(normalized.atsScore, 100);
  assert.equal(normalized.breakdown.keywordAlignment, 82);
  assert.equal(normalized.breakdown.impactMetrics, 0);
  assert.equal(normalized.missingKeywords.length, 2);
  assert.equal(normalized.missingKeywords[0].skillType, 'Hard Skill');
  assert.equal(normalized.missingKeywords[1].skillType, 'Soft Skill');
  assert.deepEqual(normalized.matchedKeywords, ['Google Ads', 'GA4', 'SEMrush']);
  assert.equal(normalized.interviewQuestions.length, 3);

  const md = formatReportAsMarkdown(normalized);
  assert.match(md, /\*\*Industry:\*\* Digital Marketing/);
  assert.match(md, /\*\*HubSpot CRM\*\* \(Critical · Hard Skill\)/);
  assert.match(md, /\*\*Executive Storytelling\*\* \(Recommended · Soft Skill\)/);
});

test('classifyApiError maps missing API keys, HTTP 429 rate limits, auth errors, and network failures', () => {
  const missingKey = classifyApiError(503, {
    code: 'MISSING_API_KEY',
    error: 'GEMINI_API_KEY is not configured on the server.',
  });
  assert.equal(missingKey.code, 'MISSING_API_KEY');
  assert.match(missingKey.title, /API key not configured/i);
  assert.ok(missingKey.hint);

  const rateLimited = classifyApiError(429, {
    code: 'RATE_LIMIT',
    error: 'Rate limit reached (HTTP 429).',
    retryAfterSeconds: 20,
  });
  assert.equal(rateLimited.code, 'RATE_LIMIT');
  assert.equal(rateLimited.retryAfterSeconds, 20);
  assert.match(rateLimited.title, /429/);

  const authError = classifyApiError(403, {
    code: 'AUTH_ERROR',
    error: 'PERMISSION_DENIED',
  });
  assert.equal(authError.code, 'AUTH_ERROR');

  const networkError = classifyApiError(null);
  assert.equal(networkError.code, 'NETWORK_ERROR');
});
