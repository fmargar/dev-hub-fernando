"use client";

import { useEffect, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { useI18n } from "@/i18n";

interface ContributionsResponse {
  data: Activity[];
  updatedAt: string;
}

// Rampa de 5 pasos del acento; el nivel 1 (actividad más baja que no es cero)
// llega a 3:1 de contraste contra --bg en ambos temas (WCAG 1.4.11, es
// gráfico, no texto). El nivel 0 es --line, no forma parte de la rampa: "sin
// actividad" no necesita distinguirse por contraste.
const THEME = {
  light: ["#e2e6ef", "#a9b6f5", "#6f84ee", "#4560e8", "#2340e0"],
  dark: ["#242a45", "#33408a", "#4f5fc4", "#6f80ec", "#8c9dff"],
};

export function GithubActivity() {
  const { t, locale } = useI18n();
  const [result, setResult] = useState<ContributionsResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/github-contributions")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: ContributionsResponse) => {
        if (cancelled) return;
        setResult(json);
        // Date.now() es impuro para el render (regla del compilador de
        // React); aquí se llama dentro de un callback async, no en el
        // cuerpo del componente ni de forma síncrona en el efecto.
        setIsStale(Date.now() - new Date(json.updatedAt).getTime() > 48 * 60 * 60 * 1000);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "es" ? "es-ES" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <div>
      <p className="measure text-[0.9375rem] leading-relaxed text-[var(--fg-muted)]">
        {t.experience.activity.caption}
      </p>

      {/* Altura reservada para que la carga no desplace el resto de la página. */}
      <div className="surface-flat mt-6 min-h-[9.5rem] overflow-x-auto p-6">
        {!result && !failed && (
          <ActivityCalendar
            data={[]}
            loading
            theme={THEME}
            blockSize={11}
            blockMargin={4}
            showColorLegend={false}
            showTotalCount={false}
          />
        )}

        {failed && (
          <p className="text-sm text-[var(--fg-muted)]">{t.common.error}</p>
        )}

        {result && (
          <ActivityCalendar
            data={result.data}
            theme={THEME}
            blockSize={11}
            blockMargin={4}
            labels={{
              totalCount: t.experience.activity.totalCount,
              legend: { less: t.experience.activity.legendLess, more: t.experience.activity.legendMore },
            }}
            renderBlock={(block, activity) => {
              const label = t.experience.activity.tooltip
                .replace("{{count}}", String(activity.count))
                .replace("{{date}}", dateFormatter.format(new Date(activity.date)));
              return (
                <g>
                  {block}
                  <title>{label}</title>
                </g>
              );
            }}
          />
        )}
      </div>

      {result && isStale && (
        <p className="data mt-3 text-[var(--fg-subtle)]">{t.experience.activity.stale}</p>
      )}
    </div>
  );
}
