import { Check, Download, FileCode2, Moon, ScanSearch, Sun } from 'lucide-react';

export type ThemeMode = 'light' | 'dark';

interface TopBarProps {
  theme: ThemeMode;
  hasResult: boolean;
  isLoading: boolean;
  copiedReport: boolean;
  onToggleTheme: () => void;
  onLoadDemo: () => void;
  onExportReport: () => void;
}

export function TopBar({
  theme,
  hasResult,
  isLoading,
  copiedReport,
  onToggleTheme,
  onLoadDemo,
  onExportReport,
}: TopBarProps) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 border-b border-purple-200/75 bg-[#FAF8FF]/90 backdrop-blur-md transition-colors duration-200 dark:border-[#1E293B] dark:bg-[#0B0F17]/95">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2.5 px-4 py-3 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2 rounded-md text-sm font-semibold tracking-tight text-slate-900 whitespace-nowrap sm:text-base dark:text-[#F0F6FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
        >
          <ScanSearch
            className="h-5 w-5 shrink-0 text-[#6D28D9] dark:text-violet-400"
            aria-hidden="true"
          />
          <span className="truncate font-[var(--font-display)]">
            AI Resume &amp; ATS Optimizer Pro
          </span>
        </a>

        {/* Zone 2: Clean single-line section navigation links */}
        <nav
          aria-label="Dashboard sections"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-[#94A3B8]"
        >
          <a
            href="#scorecard"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#6D28D9] dark:hover:text-[#F0F6FC] focus-visible:outline-none focus-visible:text-[#6D28D9] dark:focus-visible:text-violet-300"
          >
            Scorecard
          </a>
          <a
            href="#keywords"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#6D28D9] dark:hover:text-[#F0F6FC] focus-visible:outline-none focus-visible:text-[#6D28D9] dark:focus-visible:text-violet-300"
          >
            Keywords
          </a>
          <a
            href="#suggestions"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#6D28D9] dark:hover:text-[#F0F6FC] focus-visible:outline-none focus-visible:text-[#6D28D9] dark:focus-visible:text-violet-300"
          >
            Suggestions
          </a>
          <a
            href="#interview"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#6D28D9] dark:hover:text-[#F0F6FC] focus-visible:outline-none focus-visible:text-[#6D28D9] dark:focus-visible:text-violet-300"
          >
            Interview Prep
          </a>
        </nav>

        {/* Zone 3: Theme toggle + contextual action */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-200/90 bg-[#FCFBFF] text-slate-700 shadow-xs transition-colors duration-150 hover:border-purple-300 hover:bg-purple-50 hover:text-[#6D28D9] dark:border-[#2A3A52] dark:bg-[#131C2B] dark:text-[#CBD5E1] dark:shadow-none dark:hover:border-violet-400/60 dark:hover:bg-[#1B263B] dark:hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-300" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-[#6D28D9]" aria-hidden="true" />
            )}
          </button>

          {hasResult ? (
            <button
              type="button"
              onClick={onExportReport}
              aria-label="Export ATS report as Markdown"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-purple-200/90 bg-[#FCFBFF] px-3 py-2 text-xs font-medium text-slate-700 shadow-xs whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-purple-300 hover:bg-purple-50 hover:text-[#6D28D9] sm:px-4 dark:border-[#2A3A52] dark:bg-[#131C2B] dark:text-[#E6EDF3] dark:shadow-none dark:hover:border-violet-400/60 dark:hover:bg-[#1B263B] dark:hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
            >
              {copiedReport ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-[#6D28D9] dark:text-violet-400" aria-hidden="true" />
                  <span className="sm:hidden">Export</span>
                  <span className="hidden sm:inline">Export Report</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onLoadDemo}
              disabled={isLoading}
              aria-label="Load Sample Profile"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-purple-200/90 bg-[#FCFBFF] px-3 py-2 text-xs font-medium text-slate-700 shadow-xs whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-purple-300 hover:bg-purple-50 hover:text-[#6D28D9] disabled:opacity-50 sm:px-4 dark:border-[#2A3A52] dark:bg-[#131C2B] dark:text-[#E6EDF3] dark:shadow-none dark:hover:border-violet-400/60 dark:hover:bg-[#1B263B] dark:hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
            >
              <FileCode2 className="h-3.5 w-3.5 text-[#6D28D9] dark:text-violet-400" aria-hidden="true" />
              <span className="sm:hidden">Demo</span>
              <span className="hidden sm:inline">Load Sample</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
