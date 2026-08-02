"use client";

import { useI18n } from "@/i18n";
import { getCasesByTrack } from "@/content/cases";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";

export function WorkIndexView() {
  const { t, locale } = useI18n();
  const { professional, personal } = getCasesByTrack(locale);

  return (
    <>
      <div className="page-head">
        <div className="container-page">
          <h1 className="display-1">{t.work.title}</h1>
          <p className="lead measure mt-5">{t.work.intro}</p>
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
