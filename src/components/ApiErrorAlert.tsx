import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  KeyRound,
  RefreshCw,
  WifiOff,
  X,
} from 'lucide-react';
import type { ApiErrorState } from '../types/ats';

interface ApiErrorAlertProps {
  error: ApiErrorState;
  onRetry: () => void;
  onDismiss: () => void;
}

export function ApiErrorAlert({
  error,
  onRetry,
  onDismiss,
}: ApiErrorAlertProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(
    error.code === 'RATE_LIMIT' ? (error.retryAfterSeconds ?? 15) : 0
  );

  useEffect(() => {
    setSecondsLeft(
      error.code === 'RATE_LIMIT' ? (error.retryAfterSeconds ?? 15) : 0
    );
  }, [error]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const isAmber =
    error.code === 'RATE_LIMIT' || error.code === 'SERVICE_UNAVAILABLE';

  const Icon =
    error.code === 'MISSING_API_KEY' || error.code === 'AUTH_ERROR'
      ? KeyRound
      : error.code === 'RATE_LIMIT'
        ? Clock
        : error.code === 'NETWORK_ERROR'
          ? WifiOff
          : AlertTriangle;

  const containerTone = isAmber
    ? 'border-amber-200 bg-amber-50/90 dark:border-amber-500/40 dark:bg-amber-950/25'
    : 'border-rose-200 bg-rose-50/90 dark:border-rose-500/40 dark:bg-rose-950/25';

  const iconTone = isAmber
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-rose-600 dark:text-rose-400';

  const titleTone = isAmber
    ? 'text-amber-950 dark:text-amber-100'
    : 'text-rose-950 dark:text-rose-100';

  const bodyTone = isAmber
    ? 'text-amber-800 dark:text-amber-200/85'
    : 'text-rose-800 dark:text-rose-200/85';

  const retryButtonTone = isAmber
    ? 'border-amber-300 bg-white text-amber-800 hover:bg-amber-100/70 dark:border-amber-400/40 dark:bg-amber-500/15 dark:text-amber-100 dark:hover:bg-amber-500/25 focus-visible:ring-amber-500'
    : 'border-rose-300 bg-white text-rose-700 hover:bg-rose-100/70 dark:border-rose-400/40 dark:bg-rose-500/15 dark:text-rose-100 dark:hover:bg-rose-500/25 focus-visible:ring-rose-500';

  return (
    <div
      role="alert"
      data-testid="api-error-banner"
      data-error-code={error.code}
      className={`rounded-xl border p-5 transition-colors duration-200 ${containerTone}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Icon
            className={`mt-0.5 h-5 w-5 shrink-0 ${iconTone}`}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h2 className={`text-sm font-semibold ${titleTone}`}>
              {error.title}
            </h2>
            <p className={`mt-1 text-xs leading-relaxed ${bodyTone}`}>
              {error.message}
            </p>
            {error.hint && (
              <p className={`mt-1.5 text-xs leading-relaxed opacity-90 ${bodyTone}`}>
                {error.hint}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            disabled={secondsLeft > 0}
            className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium shadow-2xs whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none focus-visible:outline-none focus-visible:ring-2 ${retryButtonTone}`}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {secondsLeft > 0 ? `Retry in ${secondsLeft}s` : 'Retry Analysis'}
            </span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error alert"
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-black/5 hover:text-slate-800 dark:text-[#94A3B8] dark:hover:bg-white/10 dark:hover:text-[#F0F6FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
