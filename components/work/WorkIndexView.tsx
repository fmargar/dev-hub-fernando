"use client";

import { useI18n } from "@/i18n";
import { getCaseNumbers, getCasesByTrack } from "@/content/cases";
import { WorkIndexGroup } from "@/components/work/WorkIndexList";

export function WorkIndexView() {
  const { t, locale } = useI18n();
  const { professional, personal } = getCasesByTrack(locale);
  const numbers = getCaseNumbers(locale);

  return (
    <div className="container-page section">
      <header className="page-grid">
        <div className="rail">
          <p className="eyebrow">{t.work.title}</p>
        </div>
        <div className="rail-body">
          <h1 className="display-1">{t.work.title}</h1>
          <p className="lead mt-6 measure">{t.work.intro}</p>
        </div>
      </header>

      <div className="mt-16">
        <WorkIndexGroup
          label={t.work.groups.professional}
          note={t.work.groups.professionalNote}
          cases={professional}
          numbers={numbers}
        />
        <WorkIndexGroup
          label={t.work.groups.personal}
          note={t.work.groups.personalNote}
          cases={personal}
          numbers={numbers}
        />
      </div>
    </div>
  );
}
