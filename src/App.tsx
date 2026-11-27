/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  getDemoProfileForIndustry,
  resolveTargetIndustryLabel,
} from './data/demoData';
import type {
  AnalysisResult,
  ApiErrorState,
  IndustryId,
  ValidationErrors,
} from './types/ats';
import {
  classifyApiError,
  computeLocalDiagnostics,
  formatReportAsMarkdown,
  validateInputs,
} from './utils/atsAnalyzer';
import { TopBar, type ThemeMode } from './components/TopBar';
import { InputPane } from './components/InputPane';
import { ScoreCard } from './components/ScoreCard';
import { MissingKeywordsCard } from './components/MissingKeywordsCard';
import { ImprovementsCard } from './components/ImprovementsCard';
import { InterviewQuestionsCard } from './components/InterviewQuestionsCard';
import { LoadingDashboard } from './components/LoadingDashboard';
import { EmptyDashboard } from './components/EmptyDashboard';
import { ApiErrorAlert } from './components/ApiErrorAlert';
import { ErrorBoundary } from './components/ErrorBoundary';

const THEME_STORAGE_KEY = 'ats-optimizer-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // Ignore storage read errors in restricted iframes
  }
  return 'light';
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryId>('software-engineering');
  const [customIndustry, setCustomIndustry] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiErrorState | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  const diagnostics = useMemo(
    () => computeLocalDiagnostics(jobDescription, resumeText),
    [jobDescription, resumeText]
  );

  const targetIndustryLabel = useMemo(
    () => resolveTargetIndustryLabel(selectedIndustry, customIndustry),
    [selectedIndustry, customIndustry]
  );

  const activeDemoProfile = useMemo(
    () => getDemoProfileForIndustry(selectedIndustry),
    [selectedIndustry]
  );

  const hasInputsReady =
    jobDescription.trim().length >= 40 && resumeText.trim().length >= 40;

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleIndustryChange = (nextIndustry: IndustryId) => {
    setSelectedIndustry(nextIndustry);
    if (validationErrors.targetIndustry) {
      setValidationErrors((prev) => ({ ...prev, targetIndustry: undefined }));
    }
  };

  const handleCustomIndustryChange = (value: string) => {
    setCustomIndustry(value);
    if (validationErrors.targetIndustry) {
      setValidationErrors((prev) => ({ ...prev, targetIndustry: undefined }));
    }
  };

  const handleLoadDemo = () => {
    const profile = getDemoProfileForIndustry(selectedIndustry);
    setJobDescription(profile.jobDescription);
    setResumeText(profile.resume);
    setUploadedFileName(profile.fileName);
    if (selectedIndustry === 'custom' && !customIndustry.trim()) {
      setCustomIndustry('Operations & Project Management');
    }
    setValidationErrors({});
    setApiError(null);
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setJobDescription('');
    setResumeText('');
    setUploadedFileName(null);
    setValidationErrors({});
    setApiError(null);
    setResult(null);
    setIsLoading(false);
  };

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    if (validationErrors.jobDescription) {
      setValidationErrors((prev) => ({ ...prev, jobDescription: undefined }));
    }
  };

  const handleResumeTextChange = (value: string) => {
    setResumeText(value);
    if (uploadedFileName) {
      setUploadedFileName(null);
    }
    if (validationErrors.resumeText) {
      setValidationErrors((prev) => ({ ...prev, resumeText: undefined }));
    }
  };

  const handleResumeFileLoaded = (content: string, fileName: string) => {
    setResumeText(content);
    setUploadedFileName(fileName);
    setValidationErrors((prev) => ({ ...prev, resumeText: undefined }));
  };

  const handleAnalyze = async () => {
    const errors = validateInputs(jobDescription, resumeText, {
      isCustomIndustry: selectedIndustry === 'custom',
      customIndustry,
    });
    if (errors.targetIndustry || errors.jobDescription || errors.resumeText) {
      setValidationErrors(errors);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setValidationErrors({});
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetIndustry: targetIndustryLabel,
          jobDescription,
          resumeText,
        }),
        signal: controller.signal,
      });

      const payload = (await response.json().catch(() => ({}))) as {
        analysis?: AnalysisResult;
        code?: string;
        error?: string;
        retryAfterSeconds?: number;
        validationErrors?: ValidationErrors;
      };

      if (!response.ok || !payload.analysis) {
        if (payload.validationErrors) {
          setValidationErrors(payload.validationErrors);
        }
        setApiError(classifyApiError(response.status, payload));
        return;
      }

      setResult(payload.analysis);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof Error ? err.message : undefined;
      setApiError(classifyApiError(null, { error: message }));
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false);
      }
    }
  };

  const handleExportReport = async () => {
    if (!result) return;
    const markdown = formatReportAsMarkdown(result);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedReport(true);
      window.setTimeout(() => setCopiedReport(false), 2200);
    } catch {
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ats-optimization-report.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      id="top"
      className="flex min-h-screen flex-col bg-gradient-to-b from-[#F5F2FF] via-[#F2EDFF] to-[#ECE5FF]/85 text-[#1E1B2E] transition-colors duration-200 dark:bg-none dark:bg-[#0B0F17] dark:text-[#E6EDF3]"
    >
      <TopBar
        theme={theme}
        hasResult={Boolean(result)}
        isLoading={isLoading}
        copiedReport={copiedReport}
        onToggleTheme={handleToggleTheme}
        onLoadDemo={handleLoadDemo}
        onExportReport={handleExportReport}
      />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Pane: Input Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-[76px] lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto">
            <InputPane
              selectedIndustry={selectedIndustry}
              customIndustry={customIndustry}
              jobDescription={jobDescription}
              resumeText={resumeText}
              uploadedFileName={uploadedFileName}
              diagnostics={diagnostics}
              validationErrors={validationErrors}
              isLoading={isLoading}
              onIndustryChange={handleIndustryChange}
              onCustomIndustryChange={handleCustomIndustryChange}
              onJobDescriptionChange={handleJobDescriptionChange}
              onResumeTextChange={handleResumeTextChange}
              onResumeFileLoaded={handleResumeFileLoaded}
              onLoadDemo={handleLoadDemo}
              onClear={handleClear}
              onAnalyze={handleAnalyze}
            />
          </div>

          {/* Right Pane: AI Results Dashboard */}
          <div
            aria-label="AI Results Dashboard"
            className="space-y-6 lg:col-span-7"
          >
            {apiError && !isLoading && (
              <ApiErrorAlert
                error={apiError}
                onRetry={handleAnalyze}
                onDismiss={() => setApiError(null)}
              />
            )}

            <ErrorBoundary
              scopeLabel="results dashboard"
              onReset={() => {
                setResult(null);
                setApiError(null);
              }}
            >
              {isLoading ? (
                <LoadingDashboard targetIndustry={targetIndustryLabel} />
              ) : result ? (
                <motion.div
                  key={`${result.targetIndustry}-${result.roleTitle}-${result.atsScore}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                  data-testid="results-dashboard"
                >
                  <ScoreCard result={result} />
                  <MissingKeywordsCard
                    targetIndustry={result.targetIndustry}
                    missingKeywords={result.missingKeywords}
                    matchedKeywords={result.matchedKeywords}
                  />
                  <ImprovementsCard
                    targetIndustry={result.targetIndustry}
                    improvements={result.improvements}
                  />
                  <InterviewQuestionsCard
                    roleTitle={result.roleTitle}
                    questions={result.interviewQuestions}
                  />
                </motion.div>
              ) : (
                <EmptyDashboard
                  selectedIndustryLabel={targetIndustryLabel}
                  sampleRoleLabel={activeDemoProfile.sampleRoleLabel}
                  hasInputsReady={hasInputsReady}
                  onLoadDemo={handleLoadDemo}
                  onAnalyze={handleAnalyze}
                />
              )}
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <footer className="border-t border-purple-200/75 bg-[#FAF8FF]/80 transition-colors duration-200 dark:border-[#1E293B] dark:bg-[#0B0F17]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-600 sm:px-6 lg:px-8 dark:text-[#64748B]">
          <span>AI Resume &amp; ATS Optimizer Pro</span>
          <span>Universal ATS benchmarking across every profession &amp; industry</span>
        </div>
      </footer>
    </div>
  );
}
