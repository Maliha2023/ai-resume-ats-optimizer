import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface LoadingDashboardProps {
  targetIndustry: string;
}

const STAGES = [
  'Parsing resume structure and measurable achievements',
  'Auditing industry-specific hard and soft skill coverage',
  'Calculating ATS match score and rewrite recommendations',
  'Crafting 3 role-specific interview questions',
];

export function LoadingDashboard({ targetIndustry }: LoadingDashboardProps) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 950);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="loading-dashboard"
      className="space-y-5"
    >
      {/* Active Stage Progress */}
      <div className="rounded-xl border border-purple-200/80 bg-[#FCFBFF] p-6 shadow-[0_1px_3px_rgba(91,33,182,0.06)] dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none">
        <div className="flex items-center gap-3 border-b border-purple-100 pb-4 dark:border-[#1E293B]">
          <Loader2
            className="h-5 w-5 shrink-0 animate-spin text-[#6D28D9] dark:text-violet-400"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#F0F6FC]">
              Running ATS Evaluation · {targetIndustry}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Benchmarking role keywords, impact metrics, and interview readiness...
            </p>
          </div>
        </div>

        <ol className="mt-4 space-y-2.5">
          {STAGES.map((stage, idx) => {
            const done = idx < activeStage;
            const current = idx === activeStage;
            return (
              <li
                key={stage}
                className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                  done
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : current
                      ? 'font-medium text-slate-900 dark:text-[#F0F6FC]'
                      : 'text-slate-400 dark:text-[#64748B]'
                }`}
              >
                {done ? (
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                ) : current ? (
                  <Loader2
                    className="h-3.5 w-3.5 shrink-0 animate-spin text-[#6D28D9] dark:text-violet-400"
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="inline-block h-3.5 w-3.5 text-center font-mono text-[10px] text-slate-400 dark:text-[#475569]"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                )}
                <span>{stage}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Geometry-matched Skeleton Cards */}
      <div className="rounded-xl border border-purple-200/80 bg-[#FCFBFF] p-6 shadow-[0_1px_3px_rgba(91,33,182,0.06)] dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-[148px] w-[148px] shrink-0 animate-pulse rounded-full border-[10px] border-purple-200/80 bg-[#F5F2FF] dark:border-[#1E293B] dark:bg-[#0B0F17]" />
          <div className="w-full space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-purple-200/60 dark:bg-[#1E293B]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-purple-200/60 dark:bg-[#1E293B]" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="h-6 animate-pulse rounded bg-purple-100/90 dark:bg-[#1E293B]" />
              <div className="h-6 animate-pulse rounded bg-purple-100/90 dark:bg-[#1E293B]" />
              <div className="h-6 animate-pulse rounded bg-purple-100/90 dark:bg-[#1E293B]" />
              <div className="h-6 animate-pulse rounded bg-purple-100/90 dark:bg-[#1E293B]" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-purple-200/80 bg-[#FCFBFF] p-6 shadow-[0_1px_3px_rgba(91,33,182,0.06)] dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none">
        <div className="h-5 w-48 animate-pulse rounded bg-purple-200/60 dark:bg-[#1E293B]" />
        <div className="flex flex-wrap gap-2">
          <div className="h-9 w-24 animate-pulse rounded-full bg-purple-100/90 dark:bg-[#1E293B]" />
          <div className="h-9 w-32 animate-pulse rounded-full bg-purple-100/90 dark:bg-[#1E293B]" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-purple-100/90 dark:bg-[#1E293B]" />
          <div className="h-9 w-36 animate-pulse rounded-full bg-purple-100/90 dark:bg-[#1E293B]" />
        </div>
      </div>
    </div>
  );
}
