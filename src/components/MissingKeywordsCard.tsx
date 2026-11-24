import { useState } from 'react';
import { AlertTriangle, Check, Copy, PlusCircle } from 'lucide-react';
import type { MissingKeyword, SkillType } from '../types/ats';

interface MissingKeywordsCardProps {
  targetIndustry: string;
  missingKeywords: MissingKeyword[];
  matchedKeywords: string[];
}

type SkillFilter = 'All' | SkillType;

const SKILL_FILTERS: Array<{ value: SkillFilter; label: string }> = [
  { value: 'All', label: 'All Skills' },
  { value: 'Hard Skill', label: 'Hard Skills' },
  { value: 'Soft Skill', label: 'Soft Skills' },
];

export function MissingKeywordsCard({
  targetIndustry,
  missingKeywords,
  matchedKeywords,
}: MissingKeywordsCardProps) {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('All');
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(
    missingKeywords[0]?.keyword ?? null
  );
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const visibleKeywords = missingKeywords.filter((item) =>
    skillFilter === 'All' ? true : item.skillType === skillFilter
  );

  const activeItem =
    visibleKeywords.find((item) => item.keyword === selectedKeyword) ??
    visibleKeywords[0] ??
    null;

  const criticalCount = missingKeywords.filter((k) => k.importance === 'Critical').length;

  const handleSelectAndCopy = async (item: MissingKeyword) => {
    setSelectedKeyword(item.keyword);
    try {
      await navigator.clipboard.writeText(item.keyword);
      setCopiedKeyword(item.keyword);
      window.setTimeout(() => {
        setCopiedKeyword((prev) => (prev === item.keyword ? null : prev));
      }, 1800);
    } catch {
      // Clipboard API may be restricted in some contexts; selection still works.
    }
  };

  return (
    <section
      id="keywords"
      aria-labelledby="keywords-heading"
      className="scroll-mt-20 rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-colors duration-200 sm:p-6 dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-[#1E293B]">
        <div>
          <h2 id="keywords-heading" className="text-lg font-semibold text-slate-900 dark:text-[#F0F6FC]">
            Industry-Specific Missing Keywords
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
            Critical hard &amp; soft skills missing for{' '}
            <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{targetIndustry}</span>
            {' · '}
            <span className="font-mono text-rose-600 tabular-nums dark:text-rose-400">
              {criticalCount} critical
            </span>
          </p>
        </div>

        {/* Hard / Soft skill segmented filter */}
        <div
          role="group"
          aria-label="Filter missing keywords by skill type"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1 dark:border-[#1E293B] dark:bg-[#0B0F17]"
        >
          {SKILL_FILTERS.map((opt) => {
            const active = skillFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSkillFilter(opt.value)}
                aria-pressed={active}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-[#1E293B] dark:text-[#F0F6FC] dark:shadow-none'
                    : 'text-slate-600 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#E6EDF3]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {visibleKeywords.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-[#94A3B8]">
          {missingKeywords.length === 0
            ? 'No major missing keywords detected against this job description.'
            : `No missing ${skillFilter.toLowerCase()}s detected. Switch back to All Skills to inspect all gaps.`}
        </p>
      ) : (
        <>
          {/* Soft Tinted Pill Badges for Missing Hard & Soft Skills */}
          <div
            data-testid="missing-keywords-list"
            className="mt-5 flex flex-wrap gap-2"
            role="group"
            aria-label="Missing keyword badges"
          >
            {visibleKeywords.map((item) => {
              const isCritical = item.importance === 'Critical';
              const isSelected = activeItem?.keyword === item.keyword;
              const isCopied = copiedKeyword === item.keyword;

              return (
                <button
                  key={item.keyword}
                  type="button"
                  onClick={() => handleSelectAndCopy(item)}
                  aria-pressed={isSelected}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isCritical
                      ? isSelected
                        ? 'border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-400 dark:bg-rose-500/25 dark:text-rose-100'
                        : 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100/80 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:border-rose-400 dark:hover:bg-rose-500/20'
                      : isSelected
                        ? 'border-blue-400 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-500/25 dark:text-blue-100'
                        : 'border-blue-200 bg-blue-50/90 text-[#1D4ED8] hover:border-blue-300 hover:bg-blue-100/80 dark:border-blue-400/35 dark:bg-blue-500/15 dark:text-blue-200 dark:hover:border-blue-400 dark:hover:bg-blue-500/25'
                  }`}
                >
                  {isCritical ? (
                    <AlertTriangle
                      className="h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <PlusCircle
                      className="h-3.5 w-3.5 shrink-0 text-[#2563EB] dark:text-blue-400"
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-mono">{item.keyword}</span>
                  {isCopied ? (
                    <Check
                      className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy className="h-3 w-3 shrink-0 opacity-50" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Placement Context for Selected Keyword */}
          {activeItem && (
            <div className="mt-4 flex flex-col gap-1 border-t border-slate-200/80 pt-4 text-sm dark:border-[#1E293B]">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-semibold text-slate-900 dark:text-[#F0F6FC]">
                  {activeItem.keyword}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#475569]">
                  ·
                </span>
                <span
                  className={
                    activeItem.importance === 'Critical'
                      ? 'font-medium text-rose-600 dark:text-rose-400'
                      : 'font-medium text-[#2563EB] dark:text-blue-400'
                  }
                >
                  {activeItem.importance} Priority
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#475569]">
                  ·
                </span>
                <span className="text-slate-600 dark:text-[#94A3B8]">
                  {activeItem.skillType}
                </span>
                {copiedKeyword === activeItem.keyword && (
                  <>
                    <span aria-hidden="true" className="text-slate-300 dark:text-[#475569]">
                      ·
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Copied to clipboard
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-[#CBD5E1]">
                {activeItem.context}
              </p>
            </div>
          )}
        </>
      )}

      {/* Matched Keywords (clean unboxed inline text) */}
      {matchedKeywords.length > 0 && (
        <div className="mt-5 border-t border-slate-200/80 pt-4 dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Matched Keywords ({matchedKeywords.length})</span>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-relaxed text-slate-500 dark:text-[#94A3B8]">
            {matchedKeywords.map((kw, index) => (
              <span key={kw} className="inline-flex items-center gap-2">
                <span className="font-mono text-slate-700 dark:text-[#CBD5E1]">{kw}</span>
                {index < matchedKeywords.length - 1 && (
                  <span aria-hidden="true" className="text-slate-300 dark:text-[#334155]">
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </section>
  );
}
