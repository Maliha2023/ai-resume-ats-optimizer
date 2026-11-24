import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  scopeLabel?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const scope = this.props.scopeLabel ?? 'application';

    return (
      <div
        role="alert"
        data-testid="error-boundary-fallback"
        className="flex min-h-[280px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06)] dark:border-[#1E293B] dark:bg-[#111827] dark:text-[#E6EDF3]"
      >
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-[#F0F6FC]">
            Something went wrong in the {scope}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-[#94A3B8]">
            Your resume and job description stay private in your browser. You can safely reset this view without losing the workspace.
          </p>
          {this.state.errorMessage && (
            <p className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600 dark:border-[#1E293B] dark:bg-[#0B0F17] dark:text-[#94A3B8]">
              {this.state.errorMessage}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#1D4ED8] dark:bg-blue-500 dark:hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Recover View</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
