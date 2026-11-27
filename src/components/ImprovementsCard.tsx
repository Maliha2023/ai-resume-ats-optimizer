import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ImprovementSuggestion } from '../types/ats';

interface ImprovementsCardProps {
  targetIndustry: string;
  improvements: ImprovementSuggestion[];
}

type FilterOption = 'All' | 'High' | 'Impact & Metrics' | 'ATS Formatting';

const FILTER_OPTIONS: Array<{ value: FilterOption; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'High', label: 'High Priority' },
  { value: 'Impact & Metrics', label: 'Impact & Metrics' },
  { value: 'ATS Formatting', label: 'Formatting' },
];

export function ImprovementsCard({
  targetIndustry,
  improvements,
}: ImprovementsCardProps) {
  const [filter, setFilter] = useState<FilterOption>('All');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filtered = improvements.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'High') return item.priority === 'High';
    return item.category === filter;
  });

  const handleCopyRewrite = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      window.setTimeout(() => {
        setCopiedIdx((prev) => (prev === idx ? null : prev));
      }, 1800);
    } catch {
      // Ignore clipboard permission errors silently
    }
  };

  return (
    <section
      id="suggestions"
      aria-labelledby="suggestions-heading"
      className="scroll-mt-20 rounded-xl border border-purple-200/80 bg-[#FCFBFF] p-5 shadow-[0_1px_3px_rgba(91,33,182,0.06)] transition-colors duration-200 sm:p-6 dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4 dark:border-[#1E293B]">
        <div>
          <h2 id="suggestions-heading" className="text-lg font-semibold text-slate-900 dark:text-[#F0F6FC]">
            Professional AI Improvement Suggestions
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
            Actionable edits tailored to{' '}
            <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{targetIndustry}</span>{' '}
            hiring standards.
          </p>
        </div>

        {/* Functional interactive filter controls */}
        <div
          role="group"
          aria-label="Filter suggestions"
          className="flex flex-wrap items-center gap-1 rounded-lg border border-purple-200/80 bg-[#F1ECFF] p-1 dark:border-[#1E293B] dark:bg-[#0B0F17]"
        >
          {FILTER_OPTIONS.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={active}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] ${
                  active
                    ? 'bg-[#FCFBFF] text-slate-900 shadow-xs dark:bg-[#1E293B] dark:text-[#F0F6FC] dark:shadow-none'
                    : 'text-slate-600 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#E6EDF3]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500 dark:text-[#94A3B8]">
          No suggestions match this filter. Switch back to{' '}
          <span className="font-medium text-slate-800 dark:text-[#E6EDF3]">All</span> to view all
          recommendations.
        </p>
      ) : (
        <ol className="mt-2 divide-y divide-purple-100 dark:divide-[#1E293B]">
          {filtered.map((item, idx) => (
            <li key={`${item.title}-${idx}`} className="py-5 first:pt-4 last:pb-1">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-[#6D28D9] tabular-nums dark:text-violet-400"
                >
                  {String(idx + 1).padStart(2, '0')}.
                </span>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-[#F0F6FC]">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#94A3B8]">
                      <span
                        className={
                          item.priority === 'High'
                            ? 'font-medium text-amber-700 dark:text-amber-400'
                            : 'text-slate-500 dark:text-[#94A3B8]'
                        }
                      >
                        {item.priority} Priority
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-[#CBD5E1]">
                    {item.suggestion}
                  </p>

                  {item.exampleRewrite && (
                    <div className="mt-2.5 flex items-start justify-between gap-3 rounded-lg border border-purple-200/75 bg-[#F5F2FF]/80 px-3.5 py-2.5 dark:border-[#1E293B] dark:bg-[#0B0F17]">
                      <div className="min-w-0 space-y-1">
                        <span className="block text-[11px] font-semibold text-[#6D28D9] dark:text-violet-400">
                          Example Rewrite
                        </span>
                        <p className="text-xs leading-relaxed text-slate-800 dark:text-[#E6EDF3]">
                          “{item.exampleRewrite}”
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyRewrite(item.exampleRewrite, idx)}
                        aria-label={`Copy example rewrite for ${item.title}`}
                        className="inline-flex min-h-[32px] shrink-0 items-center gap-1 rounded-md border border-purple-200/90 bg-[#FCFBFF] px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs whitespace-nowrap transition-colors duration-150 hover:border-purple-300 hover:text-[#6D28D9] dark:border-[#243247] dark:bg-[#111827] dark:text-[#CBD5E1] dark:shadow-none dark:hover:border-violet-400/60 dark:hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
