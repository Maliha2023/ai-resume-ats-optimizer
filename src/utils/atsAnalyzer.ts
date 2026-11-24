import type {
  AnalysisResult,
  ApiErrorCode,
  ApiErrorState,
  ImprovementCategory,
  ImprovementPriority,
  InterviewCategory,
  KeywordImportance,
  LocalDiagnostics,
  MatchLabel,
  SkillType,
  ValidationErrors,
} from '../types/ats.ts';

const SECTION_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  { label: 'Summary', regex: /\b(summary|profile|objective|about)\b/i },
  { label: 'Skills', regex: /\b(skills|technologies|tech stack|competencies|tools|software)\b/i },
  { label: 'Experience', regex: /\b(experience|employment|work history|career)\b/i },
  { label: 'Projects', regex: /\b(projects|portfolio|publications|campaigns|certifications?)\b/i },
  { label: 'Education', regex: /\b(education|university|college|b\.?s\.?|b\.?a\.?|b\.?f\.?a\.?|bachelor|master|degree|mba)\b/i },
];

const STRONG_ACTION_VERBS = [
  'accelerated',
  'analyzed',
  'architected',
  'audited',
  'automated',
  'built',
  'collaborated',
  'conducted',
  'coordinated',
  'created',
  'delivered',
  'designed',
  'developed',
  'directed',
  'engineered',
  'executed',
  'facilitated',
  'illustrated',
  'implemented',
  'improved',
  'increased',
  'integrated',
  'launched',
  'led',
  'managed',
  'mentored',
  'migrated',
  'negotiated',
  'optimized',
  'orchestrated',
  'organized',
  'partnered',
  'prepared',
  'produced',
  'reconciled',
  'redesigned',
  'reduced',
  'resolved',
  'scaled',
  'spearheaded',
  'standardized',
  'streamlined',
  'supervised',
  'trained',
  'validated',
  'verified',
];

export const MIN_INPUT_LENGTH = 40;
export const MAX_INPUT_LENGTH = 25000;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function validateInputs(
  jobDescription: string,
  resumeText: string,
  options?: { isCustomIndustry?: boolean; customIndustry?: string }
): ValidationErrors {
  const errors: ValidationErrors = {};
  const jd = jobDescription.trim();
  const resume = resumeText.trim();

  if (options?.isCustomIndustry && !(options.customIndustry ?? '').trim()) {
    errors.targetIndustry = 'Enter your custom industry or target job role.';
  }

  if (!jd) {
    errors.jobDescription = 'Paste a target Job Description to benchmark against.';
  } else if (jd.length < MIN_INPUT_LENGTH) {
    errors.jobDescription = `Job Description is too short (minimum ${MIN_INPUT_LENGTH} characters for accurate ATS analysis).`;
  } else if (jd.length > MAX_INPUT_LENGTH) {
    errors.jobDescription = `Job Description exceeds the ${MAX_INPUT_LENGTH.toLocaleString()} character limit.`;
  }

  if (!resume) {
    errors.resumeText = 'Paste your Resume / CV or upload a text file to analyze.';
  } else if (resume.length < MIN_INPUT_LENGTH) {
    errors.resumeText = `Resume content is too short (minimum ${MIN_INPUT_LENGTH} characters).`;
  } else if (resume.length > MAX_INPUT_LENGTH) {
    errors.resumeText = `Resume exceeds the ${MAX_INPUT_LENGTH.toLocaleString()} character limit.`;
  }

  return errors;
}

export function computeLocalDiagnostics(
  jobDescription: string,
  resumeText: string
): LocalDiagnostics {
  const jdWordCount = countWords(jobDescription);
  const resumeWordCount = countWords(resumeText);

  const detectedSections = SECTION_PATTERNS.filter(({ regex }) =>
    regex.test(resumeText)
  ).map(({ label }) => label);

  // Count quantified impact tokens like 38%, 320+, $1.4M, 3.8x, <200ms, 14 months, 4 years
  const metricMatches =
    resumeText.match(
      /(?:\b\d+(?:\.\d+)?(?:\s*(?:%|\+)(?!\w)|\s*(?:x|ms|s|hrs?|hours?|days?|weeks?|months?|years?|k|m)\b)|\$\d[\d,.]*[kmb]?\b)/gi
    ) ?? [];

  const lowerResume = resumeText.toLowerCase();
  const actionVerbCount = STRONG_ACTION_VERBS.reduce((count, verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return count + (regex.test(lowerResume) ? 1 : 0);
  }, 0);

  return {
    jdWordCount,
    resumeWordCount,
    detectedSections,
    quantifiedMetricsCount: metricMatches.length,
    actionVerbCount,
  };
}

export function clampScore(value: unknown, fallback = 0): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

export function getMatchLabelForScore(score: number): MatchLabel {
  if (score >= 85) return 'Strong Match';
  if (score >= 70) return 'Good Fit';
  if (score >= 55) return 'Moderate Match';
  return 'Needs Optimization';
}

export interface ScoreTierMeta {
  label: MatchLabel;
  tone: 'emerald' | 'blue' | 'amber' | 'rose';
  guidance: string;
}

export function getScoreTierMeta(score: number): ScoreTierMeta {
  const clamped = clampScore(score);
  if (clamped >= 85) {
    return {
      label: 'Strong Match',
      tone: 'emerald',
      guidance: 'High ATS pass probability. Focus on closing final niche keyword gaps.',
    };
  }
  if (clamped >= 70) {
    return {
      label: 'Good Fit',
      tone: 'blue',
      guidance: 'Solid core alignment. Incorporating missing critical skills will elevate ranking.',
    };
  }
  if (clamped >= 55) {
    return {
      label: 'Moderate Match',
      tone: 'amber',
      guidance: 'Relevant foundation, but several key JD requirements need explicit evidence.',
    };
  }
  return {
    label: 'Needs Optimization',
    tone: 'rose',
    guidance: 'Substantial keyword and role-alignment gaps detected. Tailor bullets before applying.',
  };
}

const VALID_IMPORTANCE: KeywordImportance[] = ['Critical', 'Recommended'];
const VALID_SKILL_TYPES: SkillType[] = ['Hard Skill', 'Soft Skill'];
const VALID_CATEGORIES: ImprovementCategory[] = [
  'Impact & Metrics',
  'ATS Formatting',
  'Domain Expertise',
  'Keyword Integration',
];
const VALID_PRIORITIES: ImprovementPriority[] = ['High', 'Medium'];
const VALID_INTERVIEW_CATEGORIES: InterviewCategory[] = [
  'Role Expertise',
  'Strategy & Scenario',
  'Behavioral',
];

function mapImprovementCategory(value: unknown): ImprovementCategory {
  if (VALID_CATEGORIES.includes(value as ImprovementCategory)) {
    return value as ImprovementCategory;
  }
  if (value === 'Technical Depth') {
    return 'Domain Expertise';
  }
  return 'Impact & Metrics';
}

function mapInterviewCategory(value: unknown): InterviewCategory {
  if (VALID_INTERVIEW_CATEGORIES.includes(value as InterviewCategory)) {
    return value as InterviewCategory;
  }
  if (value === 'Technical') return 'Role Expertise';
  if (value === 'Architecture & Strategy' || value === 'System & QA Strategy') {
    return 'Strategy & Scenario';
  }
  return 'Role Expertise';
}

export function normalizeAnalysisResult(
  raw: unknown,
  fallbackIndustry = 'General Profession'
): AnalysisResult {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const atsScore = clampScore(obj.atsScore, 72);
  const rawBreakdown =
    obj.breakdown && typeof obj.breakdown === 'object'
      ? (obj.breakdown as Record<string, unknown>)
      : {};

  const breakdown = {
    keywordAlignment: clampScore(rawBreakdown.keywordAlignment, atsScore),
    experienceRelevance: clampScore(rawBreakdown.experienceRelevance, atsScore),
    impactMetrics: clampScore(rawBreakdown.impactMetrics, atsScore),
    atsFormatting: clampScore(rawBreakdown.atsFormatting, atsScore),
  };

  const seenMissing = new Set<string>();
  const missingKeywords = Array.isArray(obj.missingKeywords)
    ? obj.missingKeywords
        .map((item) => {
          const rec = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
          const keyword = String(rec.keyword ?? '').trim();
          const importance = VALID_IMPORTANCE.includes(rec.importance as KeywordImportance)
            ? (rec.importance as KeywordImportance)
            : 'Critical';
          const skillType = VALID_SKILL_TYPES.includes(rec.skillType as SkillType)
            ? (rec.skillType as SkillType)
            : 'Hard Skill';
          const context = String(rec.context ?? '').trim();
          return { keyword, importance, skillType, context };
        })
        .filter((item) => {
          if (!item.keyword) return false;
          const key = item.keyword.toLowerCase();
          if (seenMissing.has(key)) return false;
          seenMissing.add(key);
          return true;
        })
    : [];

  const seenMatched = new Set<string>();
  const matchedKeywords = Array.isArray(obj.matchedKeywords)
    ? obj.matchedKeywords
        .map((k) => String(k ?? '').trim())
        .filter((k) => {
          if (!k) return false;
          const lower = k.toLowerCase();
          if (seenMatched.has(lower)) return false;
          seenMatched.add(lower);
          return true;
        })
    : [];

  const improvements = Array.isArray(obj.improvements)
    ? obj.improvements
        .map((item) => {
          const rec = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
          return {
            title: String(rec.title ?? '').trim(),
            category: mapImprovementCategory(rec.category),
            priority: VALID_PRIORITIES.includes(rec.priority as ImprovementPriority)
              ? (rec.priority as ImprovementPriority)
              : 'High',
            suggestion: String(rec.suggestion ?? '').trim(),
            exampleRewrite: String(rec.exampleRewrite ?? '').trim(),
          };
        })
        .filter((item) => item.title && item.suggestion)
    : [];

  const interviewQuestions = Array.isArray(obj.interviewQuestions)
    ? obj.interviewQuestions
        .slice(0, 3)
        .map((item) => {
          const rec = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
          const tips = Array.isArray(rec.strongAnswerTips)
            ? rec.strongAnswerTips.map((t) => String(t ?? '').trim()).filter(Boolean)
            : [];
          return {
            question: String(rec.question ?? '').trim(),
            focusArea: String(rec.focusArea ?? 'Core Competency').trim(),
            category: mapInterviewCategory(rec.category),
            whyAsked: String(rec.whyAsked ?? '').trim(),
            strongAnswerTips: tips,
          };
        })
        .filter((item) => item.question)
    : [];

  const targetIndustry =
    String(obj.targetIndustry ?? fallbackIndustry).trim() || fallbackIndustry;

  return {
    targetIndustry,
    roleTitle: String(obj.roleTitle ?? 'Target Role').trim() || 'Target Role',
    atsScore,
    matchLabel: getMatchLabelForScore(atsScore),
    executiveSummary:
      String(obj.executiveSummary ?? '').trim() ||
      'Analysis completed against the target job requirements.',
    breakdown,
    missingKeywords,
    matchedKeywords,
    improvements,
    interviewQuestions,
  };
}

export function formatReportAsMarkdown(result: AnalysisResult): string {
  const lines: string[] = [
    `# ATS Optimization Report — ${result.roleTitle}`,
    `**Industry:** ${result.targetIndustry}`,
    `**ATS Match Score:** ${result.atsScore}% (${result.matchLabel})`,
    '',
    `> ${result.executiveSummary}`,
    '',
    '## Score Breakdown',
    `- Keyword Alignment: ${result.breakdown.keywordAlignment}%`,
    `- Experience Relevance: ${result.breakdown.experienceRelevance}%`,
    `- Quantified Impact: ${result.breakdown.impactMetrics}%`,
    `- ATS Formatting: ${result.breakdown.atsFormatting}%`,
    '',
    '## Industry-Specific Missing Keywords',
    ...result.missingKeywords.map(
      (k) => `- **${k.keyword}** (${k.importance} · ${k.skillType}): ${k.context}`
    ),
    '',
    '## Professional AI Improvement Suggestions',
    ...result.improvements.map(
      (imp, idx) =>
        `${idx + 1}. **${imp.title}** [${imp.priority} · ${imp.category}]\n   ${imp.suggestion}${
          imp.exampleRewrite ? `\n   - Example: "${imp.exampleRewrite}"` : ''
        }`
    ),
    '',
    '## Tailored Interview Questions',
    ...result.interviewQuestions.map(
      (q, idx) =>
        `${idx + 1}. **${q.question}** (${q.category} · ${q.focusArea})\n   - Why asked: ${q.whyAsked}\n${q.strongAnswerTips
          .map((tip) => `   - Talking point: ${tip}`)
          .join('\n')}`
    ),
  ];

  return lines.join('\n');
}

export function classifyApiError(
  status: number | null,
  payload?: { code?: string; error?: string; retryAfterSeconds?: number }
): ApiErrorState {
  const rawCode = payload?.code;
  const rawMessage = payload?.error?.trim();

  if (status === null) {
    return {
      code: 'NETWORK_ERROR',
      title: 'Connection interrupted',
      message:
        rawMessage ||
        'Could not reach the ATS analysis server. Check your internet connection and try again.',
      hint: 'Your inputs remain safely preserved in the form.',
    };
  }

  if (
    rawCode === 'MISSING_API_KEY' ||
    /GEMINI_API_KEY is not configured|API key is not configured/i.test(rawMessage ?? '')
  ) {
    return {
      code: 'MISSING_API_KEY',
      title: 'Gemini API key not configured',
      message:
        rawMessage ||
        'The server could not locate a configured Gemini API key to run AI analysis.',
      hint: 'Configure GEMINI_API_KEY in Settings > Secrets (or in your local .env file when running from GitHub).',
    };
  }

  if (
    status === 429 ||
    rawCode === 'RATE_LIMIT' ||
    /rate limit|RESOURCE_EXHAUSTED|429/i.test(rawMessage ?? '')
  ) {
    const retryAfter =
      typeof payload?.retryAfterSeconds === 'number' &&
      Number.isFinite(payload.retryAfterSeconds) &&
      payload.retryAfterSeconds > 0
        ? Math.min(120, Math.round(payload.retryAfterSeconds))
        : 15;
    return {
      code: 'RATE_LIMIT',
      title: 'Rate limit reached (HTTP 429)',
      message:
        rawMessage ||
        'Too many AI analysis requests were sent in a short period. Please wait briefly before retrying.',
      hint: 'If you are on a free-tier quota, upgrading to a billing-enabled API key in Settings > Secrets increases throughput.',
      retryAfterSeconds: retryAfter,
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    rawCode === 'AUTH_ERROR' ||
    /API_KEY_INVALID|PERMISSION_DENIED|authentication failed/i.test(rawMessage ?? '')
  ) {
    return {
      code: 'AUTH_ERROR',
      title: 'API authentication failed',
      message:
        rawMessage ||
        'The configured Gemini API key was rejected or lacks permission for this model.',
      hint: 'Verify that GEMINI_API_KEY is valid in Settings > Secrets (or your .env file).',
    };
  }

  if (
    status === 503 ||
    rawCode === 'SERVICE_UNAVAILABLE' ||
    /high demand|temporarily|UNAVAILABLE/i.test(rawMessage ?? '')
  ) {
    return {
      code: 'SERVICE_UNAVAILABLE',
      title: 'AI service temporarily busy',
      message:
        rawMessage ||
        'The AI model is currently experiencing elevated traffic. Please retry in a few seconds.',
    };
  }

  const normalizedCode: ApiErrorCode =
    rawCode === 'UNKNOWN_ERROR' ? 'UNKNOWN_ERROR' : 'UNKNOWN_ERROR';

  return {
    code: normalizedCode,
    title: 'Analysis could not be completed',
    message:
      rawMessage || `Analysis request failed with status ${status}. Please try again.`,
  };
}
