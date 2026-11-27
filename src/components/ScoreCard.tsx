import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import type { AnalysisResult } from '../types/ats';
import { getScoreTierMeta } from '../utils/atsAnalyzer';

interface ScoreCardProps {
  result: AnalysisResult;
}

const TONE_STYLES = {
  emerald: {
    strokeClass: 'stroke-emerald-600 dark:stroke-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
    bar: 'bg-emerald-600 dark:bg-emerald-400',
    icon: CheckCircle2,
  },
  blue: {
    strokeClass: 'stroke-[#6D28D9] dark:stroke-violet-400',
    text: 'text-[#6D28D9] dark:text-violet-400',
    bar: 'bg-[#6D28D9] dark:bg-violet-400',
    icon: Info,
  },
  amber: {
    strokeClass: 'stroke-amber-500 dark:stroke-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    bar: 'bg-amber-500 dark:bg-amber-400',
    icon: AlertTriangle,
  },
  rose: {
    strokeClass: 'stroke-rose-600 dark:stroke-rose-400',
    text: 'text-rose-700 dark:text-rose-400',
    bar: 'bg-rose-600 dark:bg-rose-400',
    icon: ShieldAlert,
  },
} as const;

export function ScoreCard({ result }: ScoreCardProps) {
  const tier = getScoreTierMeta(result.atsScore);
  const style = TONE_STYLES[tier.tone];
  const StatusIcon = style.icon;

  const size = 148;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (result.atsScore / 100) * circumference;

  const breakdownRows = [
    { label: 'Keyword Alignment', value: result.breakdown.keywordAlignment },
    { label: 'Experience Relevance', value: result.breakdown.experienceRelevance },
    { label: 'Quantified Impact', value: result.breakdown.impactMetrics },
    { label: 'ATS Formatting', value: result.breakdown.atsFormatting },
  ];

  return (
    <section
      id="scorecard"
      aria-labelledby="scorecard-heading"
      className="scroll-mt-20 rounded-xl border border-purple-200/80 bg-[#FCFBFF] p-5 shadow-[0_1px_3px_rgba(91,33,182,0.06)] transition-colors duration-200 sm:p-6 dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-5 dark:border-[#1E293B]">
        <div>
          <h2 id="scorecard-heading" className="text-lg font-semibold text-slate-900 dark:text-[#F0F6FC]">
            ATS Match Score
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
            <span>{result.targetIndustry}</span>
            <span aria-hidden="true"> · </span>
            <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{result.roleTitle}</span>
          </p>
        </div>

        <div className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.text}`}>
          <StatusIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{result.matchLabel}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Circular Progress Indicator */}
        <div
          data-testid="ats-score-ring"
          className="relative flex shrink-0 items-center justify-center"
          style={{ width: size, height: size }}
          role="img"
          aria-label={`ATS match score: ${result.atsScore} percent, ${result.matchLabel}`}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className="stroke-purple-200/80 dark:stroke-[#1E293B]"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className={style.strokeClass}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums dark:text-[#F0F6FC]">
              {result.atsScore}%
            </span>
            <span className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">ATS Match</span>
          </div>
        </div>

        {/* Executive Summary & Sub-Score Breakdown */}
        <div className="min-w-0 flex-1 space-y-5">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-[#CBD5E1]">
            {result.executiveSummary}
          </p>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {breakdownRows.map((row) => {
              const rowTier = getScoreTierMeta(row.value);
              const rowBarColor = TONE_STYLES[rowTier.tone].bar;
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-[#94A3B8]">{row.label}</span>
                    <span className="font-mono font-medium text-slate-800 tabular-nums dark:text-[#E6EDF3]">
                      {row.value}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-purple-100/90 dark:bg-[#1E293B]"
                    aria-hidden="true"
                  >
                    <motion.div
                      className={`h-full rounded-full ${rowBarColor}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: row.value / 100 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'left center' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
