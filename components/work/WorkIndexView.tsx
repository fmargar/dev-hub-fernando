"use client";

import { useI18n } from "@/i18n";
import { getCasesByTrack } from "@/content/cases";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";

export function WorkIndexView() {
  const { t, locale } = useI18n();
  const { professional, personal } = getCasesByTrack(locale);

  return (
    <>
      <div className="drawer-front">
        <div className="container-page flex flex-wrap items-center gap-5 py-6">
          <span className="drawer-pull" aria-hidden="true" />
          <span className="drawer-plate">{t.work.title}</span>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {t.work.intro}
          </p>
        </div>
      </div>

      <div className="container-page section">
        <WorkIndexGroup
          label={t.work.groups.professional}
          note={t.work.groups.professionalNote}
          cases={professional}
          lead
        />
        <WorkIndexGroup
          label={t.work.groups.personal}
          note={t.work.groups.personalNote}
          cases={personal}
        />
      </div>
    </>
  );
}
