"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/i18n";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-head">
      <div className="container-page">
        <h1 className="display-2">{t.errors.genericTitle}</h1>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
          {t.errors.genericDesc}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-secondary h-10 min-h-0 text-sm">
            {t.errors.retryCta}
          </button>
          <Link href="/" className="btn btn-secondary h-10 min-h-0 text-sm">
            {t.errors.homeCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
