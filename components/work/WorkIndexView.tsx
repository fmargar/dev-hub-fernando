"use client";

import { useI18n } from "@/i18n";
import { getCases } from "@/content/cases";
import { WorkIndexList } from "@/components/work/WorkIndexList";

export function WorkIndexView() {
  const { t, locale } = useI18n();
  const cases = getCases(locale);

  return (
    <div className="container-page py-16 md:py-24">
      <header className="measure">
        <h1 className="display-1">{t.work.title}</h1>
        <p className="body-copy mt-6">{t.work.intro}</p>
      </header>

      <WorkIndexList cases={cases} />
    </div>
  );
}
