"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "@/i18n";
import { useLocalizedHref } from "@/lib/locale-paths";

// Compartido entre app/(root)/error.tsx y app/[locale]/error.tsx, mismo
// motivo que NotFoundView: cada grupo necesita su propio error.tsx para
// heredar el <html>/<body> de su layout raíz.
export function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  const toLocale = useLocalizedHref();

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
          <Link href={toLocale("/")} className="btn btn-secondary h-10 min-h-0 text-sm">
            {t.errors.homeCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
