import { useState } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';
import type { MockInterviewQuestion } from '../types/ats';

interface InterviewQuestionsCardProps {
  roleTitle: string;
  questions: MockInterviewQuestion[];
}

export function InterviewQuestionsCard({
  roleTitle,
  questions,
}: InterviewQuestionsCardProps) {
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({
    0: true,
  });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyQuestion = async (question: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedIdx(idx);
      window.setTimeout(() => {
        setCopiedIdx((prev) => (prev === idx ? null : prev));
      }, 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <section
      id="interview"
      aria-labelledby="interview-heading"
      className="scroll-mt-20 rounded-xl border border-purple-200/80 bg-[#FCFBFF] p-5 shadow-[0_1px_3px_rgba(91,33,182,0.06)] transition-colors duration-200 sm:p-6 dark:border-[#1E293B] dark:bg-[#111827] dark:shadow-none"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-purple-100 pb-4 dark:border-[#1E293B]">
        <div>
          <h2 id="interview-heading" className="text-lg font-semibold text-slate-900 dark:text-[#F0F6FC]">
            Tailored Interview Questions
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-[#94A3B8]">
            High-impact questions calibrated for{' '}
            <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{roleTitle}</span>.
          </p>
        </div>

        <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-[#94A3B8]">
          {questions.length} tailored prompts
        </span>
      </div>

      <ol
        data-testid="interview-questions-list"
        className="mt-2 divide-y divide-purple-100 dark:divide-[#1E293B]"
      >
        {questions.map((item, idx) => {
          const isExpanded = Boolean(expandedIndices[idx]);
          return (
            <li key={`${item.focusArea}-${idx}`} className="py-5 first:pt-4 last:pb-1">
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-[#6D28D9] tabular-nums dark:text-violet-400"
                >
                  Q{idx + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-[#94A3B8]">
                    <span className="font-medium text-[#6D28D9] dark:text-violet-300">
                      {item.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.focusArea}</span>
                  </div>

                  <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-900 dark:text-[#F0F6FC]">
                    {item.question}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleIndex(idx)}
                      aria-expanded={isExpanded}
                      className="inline-flex min-h-[32px] items-center gap-1.5 text-xs font-medium text-[#6D28D9] transition-colors duration-150 hover:text-[#5B21B6] dark:text-violet-400 dark:hover:text-violet-300 focus-visible:outline-none focus-visible:underline"
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-150 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>{isExpanded ? 'Hide Prep Guide' : 'Show Prep Guide'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyQuestion(item.question, idx)}
                      aria-label={`Copy interview question ${idx + 1}`}
                      className="inline-flex min-h-[32px] items-center gap-1 text-xs font-medium text-slate-500 transition-colors duration-150 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-[#E6EDF3] focus-visible:outline-none focus-visible:underline"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy Question</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3.5 space-y-3 rounded-lg border border-purple-200/75 bg-[#F5F2FF]/80 p-4 text-xs leading-relaxed dark:border-[#1E293B] dark:bg-[#0B0F17]">
                      {item.whyAsked && (
                        <div>
                          <span className="font-medium text-slate-500 dark:text-[#94A3B8]">
                            Why interviewers ask this:
                          </span>
                          <p className="mt-1 text-slate-700 dark:text-[#CBD5E1]">
                            {item.whyAsked}
                          </p>
                        </div>
                      )}

                      {item.strongAnswerTips.length > 0 && (
                        <div>
                          <span className="font-semibold text-[#6D28D9] dark:text-violet-400">
                            Strong answer talking points:
                          </span>
                          <ul className="mt-1.5 space-y-1.5 text-slate-800 dark:text-[#E6EDF3]">
                            {item.strongAnswerTips.map((tip, tipIdx) => (
                              <li key={tipIdx} className="flex items-start gap-2">
                                <span
                                  aria-hidden="true"
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6D28D9] dark:bg-violet-400"
                                />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
