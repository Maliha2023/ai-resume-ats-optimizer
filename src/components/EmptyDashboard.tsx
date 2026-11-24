import { FileCode2, Sparkles } from 'lucide-react';

interface EmptyDashboardProps {
  selectedIndustryLabel: string;
  sampleRoleLabel: string;
  hasInputsReady: boolean;
  onLoadDemo: () => void;
  onAnalyze: () => void;
}

const CAPABILITIES = [
  {
    id: 'scorecard',
    index: '01',
    title: 'ATS Match Score & Sub-Metrics',
    description:
      'Accurate percentage match across keyword alignment, role relevance, quantified impact, and ATS-friendly formatting.',
  },
  {
    id: 'keywords',
    index: '02',
    title: 'Industry-Specific Missing Keywords',
    description:
      'Soft-tinted pill badges highlighting critical hard and soft skills missing for your chosen profession, with placement advice.',
  },
  {
    id: 'suggestions',
    index: '03',
    title: 'Professional AI Improvement Suggestions',
    description:
      'Prioritized bullet recommendations with ready-to-copy rewrites calibrated to your industry hiring standards.',
  },
  {
    id: 'interview',
    index: '04',
    title: 'Tailored Interview Questions',
    description:
      'Three high-impact role expertise, scenario, and behavioral interview prompts with structured preparation talking points.',
  },
];

export function EmptyDashboard({
  selectedIndustryLabel,
  sampleRoleLabel,
  hasInputsReady,
  onLoadDemo,
  onAnalyze,
}: EmptyDashboardProps) {
  return (
    <section
      aria-label="AI Results Dashboard Empty State"
      data-testid="empty-dashboard"
      className="flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-colors duration-200 sm:p-8 dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none"
    >
      <div>
        <p className="text-xs font-semibold text-[#2563EB] dark:text-blue-400">
          AI Results Dashboard · {selectedIndustryLabel}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#F0F6FC]">
          Optimize your resume for any role and industry
        </h2>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#94A3B8]">
          Select your target industry on the left, paste a Job Description and Resume, or load
          the sample <span className="font-medium text-slate-800 dark:text-[#E6EDF3]">{sampleRoleLabel}</span>{' '}
          profile to run a full ATS evaluation.
        </p>

        <ol className="mt-7 divide-y divide-slate-200/80 border-y border-slate-200/80 dark:divide-[#1E293B] dark:border-[#1E293B]">
          {CAPABILITIES.map((cap) => (
            <li
              key={cap.index}
              id={cap.id}
              className="scroll-mt-24 flex items-start gap-4 py-4"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-[#2563EB] tabular-nums dark:text-blue-400"
              >
                {cap.index}.
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#E6EDF3]">
                  {cap.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-[#94A3B8]">
                  {cap.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {hasInputsReady ? (
          <button
            type="button"
            onClick={onAnalyze}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm whitespace-nowrap transition-colors duration-150 hover:bg-[#1D4ED8] dark:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Analyze Resume (AI)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLoadDemo}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-2xs whitespace-nowrap transition-colors duration-150 hover:border-blue-300 hover:bg-blue-50/70 hover:text-[#2563EB] dark:border-[#2A3A52] dark:bg-[#162033] dark:text-[#F0F6FC] dark:shadow-none dark:hover:border-blue-400/60 dark:hover:bg-[#1B263B] dark:hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <FileCode2 className="h-4 w-4 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
            <span>Load {sampleRoleLabel} Demo</span>
          </button>
        )}
      </div>
    </section>
  );
}
