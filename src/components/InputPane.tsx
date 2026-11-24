import { useRef, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  FileCode2,
  FileUp,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { INDUSTRY_OPTIONS } from '../data/demoData';
import type { IndustryId, LocalDiagnostics, ValidationErrors } from '../types/ats';

interface InputPaneProps {
  selectedIndustry: IndustryId;
  customIndustry: string;
  jobDescription: string;
  resumeText: string;
  uploadedFileName: string | null;
  diagnostics: LocalDiagnostics;
  validationErrors: ValidationErrors;
  isLoading: boolean;
  onIndustryChange: (industry: IndustryId) => void;
  onCustomIndustryChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onResumeTextChange: (value: string) => void;
  onResumeFileLoaded: (content: string, fileName: string) => void;
  onLoadDemo: () => void;
  onClear: () => void;
  onAnalyze: () => void;
}

export function InputPane({
  selectedIndustry,
  customIndustry,
  jobDescription,
  resumeText,
  uploadedFileName,
  diagnostics,
  validationErrors,
  isLoading,
  onIndustryChange,
  onCustomIndustryChange,
  onJobDescriptionChange,
  onResumeTextChange,
  onResumeFileLoaded,
  onLoadDemo,
  onClear,
  onAnalyze,
}: InputPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const hasAnyInput = jobDescription.trim().length > 0 || resumeText.trim().length > 0;

  const readTextFile = (file: File) => {
    setFileError(null);
    const validExt = /\.(txt|md|markdown|json|rtf)$/i.test(file.name);
    if (!validExt && !file.type.startsWith('text/')) {
      setFileError('Please upload a plain-text resume (.txt or .md) or paste text directly.');
      return;
    }
    if (file.size > 512 * 1024) {
      setFileError('File is too large (max 512 KB for text resumes).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      if (!content.trim()) {
        setFileError('The selected file appears to be empty.');
        return;
      }
      onResumeFileLoaded(content, file.name);
    };
    reader.onerror = () => {
      setFileError('Could not read the selected file.');
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readTextFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readTextFile(file);
    }
  };

  return (
    <section
      aria-label="Target Industry, Job Description, and Resume Input"
      className="flex flex-col rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-colors duration-200 sm:p-6 dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none"
    >
      {/* Pane Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-4 dark:border-[#1E293B]">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-[#F0F6FC]">
            Analysis Inputs
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
            Tailor your resume to any profession or industry.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            disabled={isLoading}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-blue-300 hover:bg-blue-50/70 hover:text-[#2563EB] disabled:opacity-50 dark:border-[#2A3A52] dark:bg-[#162033] dark:text-[#E6EDF3] dark:hover:border-blue-400/60 dark:hover:bg-[#1B263B] dark:hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <FileCode2 className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
            <span>Load Demo Data</span>
          </button>

          {hasAnyInput && (
            <button
              type="button"
              onClick={() => {
                setFileError(null);
                onClear();
              }}
              disabled={isLoading}
              aria-label="Clear both input fields"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 text-xs font-medium text-slate-500 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-slate-300 hover:text-slate-800 disabled:opacity-50 dark:border-[#1E293B] dark:text-[#94A3B8] dark:hover:border-[#334663] dark:hover:text-[#F0F6FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Inputs Form */}
      <form
        className="mt-4 flex flex-1 flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onAnalyze();
        }}
        noValidate
      >
        {/* Target Industry / Job Role Selector */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor="industry-select"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-[#E6EDF3]"
            >
              <Briefcase className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
              <span>Target Industry / Job Role</span>
            </label>
            <span className="hidden text-xs text-slate-500 sm:inline dark:text-[#94A3B8]">
              Adapts demo &amp; AI criteria
            </span>
          </div>

          <div className="relative">
            <select
              id="industry-select"
              name="targetIndustry"
              value={selectedIndustry}
              onChange={(e) => onIndustryChange(e.target.value as IndustryId)}
              disabled={isLoading}
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 pl-3.5 pr-10 text-sm font-medium text-slate-900 transition-colors duration-150 hover:border-slate-300 focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 disabled:opacity-60 dark:border-[#243247] dark:bg-[#0B0F17] dark:text-[#E6EDF3] dark:hover:border-[#334663] dark:focus:border-blue-400 dark:focus:bg-[#0B0F17]"
            >
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-[#64748B]"
              aria-hidden="true"
            />
          </div>

          {selectedIndustry === 'custom' && (
            <div className="pt-0.5">
              <label htmlFor="custom-industry-input" className="sr-only">
                Custom industry or target job role
              </label>
              <input
                id="custom-industry-input"
                type="text"
                value={customIndustry}
                onChange={(e) => onCustomIndustryChange(e.target.value)}
                disabled={isLoading}
                placeholder="e.g., Supply Chain Management, Corporate Law, Architecture..."
                aria-invalid={Boolean(validationErrors.targetIndustry)}
                aria-describedby={validationErrors.targetIndustry ? 'industry-error' : undefined}
                className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 disabled:opacity-60 dark:bg-[#0B0F17] dark:text-[#E6EDF3] dark:placeholder:text-[#64748B] ${
                  validationErrors.targetIndustry
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/70'
                    : 'border-slate-200 focus:border-[#2563EB] focus:ring-[#2563EB]/20 dark:border-[#243247] dark:focus:border-blue-400'
                }`}
              />
              {validationErrors.targetIndustry && (
                <p
                  id="industry-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{validationErrors.targetIndustry}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Job Description Textarea */}
        <div className="flex flex-col">
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="jd-input"
              className="text-sm font-medium text-slate-800 dark:text-[#E6EDF3]"
            >
              Job Description (JD)
            </label>
            <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-[#94A3B8]">
              {diagnostics.jdWordCount.toLocaleString()} words
            </span>
          </div>
          <textarea
            id="jd-input"
            name="jobDescription"
            rows={5}
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            disabled={isLoading}
            placeholder="Paste the target job description, responsibilities, and qualifications here..."
            aria-invalid={Boolean(validationErrors.jobDescription)}
            aria-describedby={validationErrors.jobDescription ? 'jd-error' : undefined}
            className={`w-full resize-y rounded-lg border bg-slate-50/60 px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2 disabled:opacity-60 dark:bg-[#0B0F17] dark:text-[#E6EDF3] dark:placeholder:text-[#64748B] dark:focus:bg-[#0B0F17] ${
              validationErrors.jobDescription
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/70 dark:focus:border-rose-400'
                : 'border-slate-200 focus:border-[#2563EB] focus:ring-[#2563EB]/20 dark:border-[#243247] dark:focus:border-blue-400'
            }`}
          />
          {validationErrors.jobDescription && (
            <p
              id="jd-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{validationErrors.jobDescription}</span>
            </p>
          )}
        </div>

        {/* Candidate Resume / CV Textarea + File Upload */}
        <div className="flex flex-col">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="resume-input"
              className="text-sm font-medium text-slate-800 dark:text-[#E6EDF3]"
            >
              Candidate Resume / CV
            </label>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#94A3B8]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 font-medium text-[#2563EB] transition-colors duration-150 hover:text-[#1D4ED8] disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:underline"
              >
                <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Upload .txt / .md</span>
              </button>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {diagnostics.resumeWordCount.toLocaleString()} words
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.markdown,text/plain,text/markdown"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Upload resume text file"
            />
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isLoading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative rounded-lg transition-colors duration-150 ${
              isDragging
                ? 'ring-2 ring-[#2563EB] ring-offset-2 ring-offset-white dark:ring-offset-[#111827]'
                : ''
            }`}
          >
            <textarea
              id="resume-input"
              name="resumeText"
              rows={7}
              value={resumeText}
              onChange={(e) => {
                setFileError(null);
                onResumeTextChange(e.target.value);
              }}
              disabled={isLoading}
              placeholder="Paste your resume text here, or drag and drop a .txt / .md resume file..."
              aria-invalid={Boolean(validationErrors.resumeText)}
              aria-describedby={validationErrors.resumeText ? 'resume-error' : undefined}
              className={`w-full resize-y rounded-lg border bg-slate-50/60 px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2 disabled:opacity-60 dark:bg-[#0B0F17] dark:text-[#E6EDF3] dark:placeholder:text-[#64748B] dark:focus:bg-[#0B0F17] ${
                validationErrors.resumeText
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/70 dark:focus:border-rose-400'
                  : 'border-slate-200 focus:border-[#2563EB] focus:ring-[#2563EB]/20 dark:border-[#243247] dark:focus:border-blue-400'
              }`}
            />
          </div>

          {fileError && (
            <p
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{fileError}</span>
            </p>
          )}

          {validationErrors.resumeText && (
            <p
              id="resume-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{validationErrors.resumeText}</span>
            </p>
          )}

          {/* Clean unboxed local pre-scan metadata */}
          {diagnostics.resumeWordCount > 0 && (
            <div
              data-testid="local-diagnostics"
              className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-[#94A3B8]"
            >
              {uploadedFileName && (
                <>
                  <span
                    className="max-w-[190px] truncate font-mono text-[#2563EB] dark:text-blue-300"
                    title={uploadedFileName}
                  >
                    {uploadedFileName}
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="font-mono tabular-nums text-slate-700 dark:text-[#CBD5E1]">
                {diagnostics.detectedSections.length}/5 sections
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-[#CBD5E1]">
                {diagnostics.quantifiedMetricsCount} metrics
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-700 dark:text-[#CBD5E1]">
                {diagnostics.actionVerbCount} verbs
              </span>
            </div>
          )}
        </div>

        {/* Primary Action Button (Royal Blue #2563EB) */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm whitespace-nowrap transition-all duration-150 hover:bg-[#1D4ED8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#111827]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Analyzing Resume (AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Analyze Resume (AI)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
