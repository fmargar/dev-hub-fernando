"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="page-head">
      <div className="container-page">
        <h1 className="display-1">404</h1>
        <p className="lead measure mt-5">{t.errors.notFoundTitle}</p>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
          {t.errors.notFoundDesc}
        </p>
        <Link href="/" className="btn btn-secondary mt-8 h-10 min-h-0 text-sm">
          {t.errors.notFoundCta}
        </Link>
      </div>
    </div>
  );
}
