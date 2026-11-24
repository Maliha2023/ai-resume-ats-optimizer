export type MatchLabel =
  | 'Strong Match'
  | 'Good Fit'
  | 'Moderate Match'
  | 'Needs Optimization';

export type KeywordImportance = 'Critical' | 'Recommended';

export type SkillType = 'Hard Skill' | 'Soft Skill';

export type IndustryId =
  | 'software-engineering'
  | 'digital-marketing'
  | 'human-resources'
  | 'finance-accounting'
  | 'healthcare'
  | 'graphic-design'
  | 'custom';

export type ImprovementCategory =
  | 'Impact & Metrics'
  | 'ATS Formatting'
  | 'Domain Expertise'
  | 'Keyword Integration';

export type ImprovementPriority = 'High' | 'Medium';

export type InterviewCategory =
  | 'Role Expertise'
  | 'Strategy & Scenario'
  | 'Behavioral';

export interface ScoreBreakdown {
  keywordAlignment: number;
  experienceRelevance: number;
  impactMetrics: number;
  atsFormatting: number;
}

export interface MissingKeyword {
  keyword: string;
  importance: KeywordImportance;
  skillType: SkillType;
  context: string;
}

export interface ImprovementSuggestion {
  title: string;
  category: ImprovementCategory;
  priority: ImprovementPriority;
  suggestion: string;
  exampleRewrite: string;
}

export interface MockInterviewQuestion {
  question: string;
  focusArea: string;
  category: InterviewCategory;
  whyAsked: string;
  strongAnswerTips: string[];
}

export interface AnalysisResult {
  targetIndustry: string;
  roleTitle: string;
  atsScore: number;
  matchLabel: MatchLabel;
  executiveSummary: string;
  breakdown: ScoreBreakdown;
  missingKeywords: MissingKeyword[];
  matchedKeywords: string[];
  improvements: ImprovementSuggestion[];
  interviewQuestions: MockInterviewQuestion[];
}

export interface LocalDiagnostics {
  jdWordCount: number;
  resumeWordCount: number;
  detectedSections: string[];
  quantifiedMetricsCount: number;
  actionVerbCount: number;
}

export interface ValidationErrors {
  targetIndustry?: string;
  jobDescription?: string;
  resumeText?: string;
}

export type ApiErrorCode =
  | 'MISSING_API_KEY'
  | 'AUTH_ERROR'
  | 'RATE_LIMIT'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ApiErrorState {
  code: ApiErrorCode;
  title: string;
  message: string;
  hint?: string;
  retryAfterSeconds?: number;
}
