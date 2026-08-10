"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getSkills } from "@/content/profile";
import { TECH } from "@/content/tech";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";

/**
 * Caja de 18px reservada siempre, con icono o sin él: si el registro de
 * content/tech.ts no tiene entrada para el id, el texto de al lado no debe
 * desalinearse respecto a las filas que sí llevan icono.
 *
 * Los logos de marca son SVG monocromos en currentColor, pero un <img>/next/image
 * trata el SVG como recurso externo: currentColor no hereda el color de la
 * página, solo el de la raíz del propio fichero. Se pintan con la técnica de
 * mask-image (fondo currentColor recortado por la silueta del SVG) para que sí
 * seas del color del texto en ambos temas, sin mantener variantes claro/oscuro.
 */
function Logo({ id }: { id: string }) {
  const entry = TECH[id];

  return (
    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[var(--fg-muted)]">
      {entry?.kind === "brand" && (
        <span
          aria-hidden="true"
          className="block h-[18px] w-[18px] bg-current"
          style={{
            WebkitMaskImage: `url(${entry.src})`,
            maskImage: `url(${entry.src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
      )}
      {entry?.kind === "glyph" && <entry.icon size={16} strokeWidth={1.75} aria-hidden="true" />}
    </span>
  );
}

function EvidenceLink({ slug, label }: { slug: string; label: string }) {
  const [arrowRef, arrowHover] = useHoverIcon();

  return (
    <Link href={`/work/${slug}`} {...arrowHover} className="action mt-6 text-sm">
      {label}
      <Icon>
        <ArrowNarrowRightIcon ref={arrowRef} size={16} strokeWidth={1.75} />
      </Icon>
    </Link>
  );
}

export function StackView() {
  const { t, locale } = useI18n();
  const skills = getSkills(resolveContentLocale(locale));

  return (
    <>
      <div className="page-head">
        <div className="container-page">
          <h1 className="display-1">{t.stackPage.title}</h1>
          <p className="lead measure mt-5">{t.stackPage.intro}</p>
        </div>
      </div>

      <div className="container-page section">
        {skills.map((group) => (
          <section key={group.id} className="mt-16 first:mt-0">
            <div className="grid gap-6 md:grid-cols-[13rem_1fr] md:gap-12">
              <h2 className="display-3 md:pt-1">{group.label}</h2>
              <div>
                <ul className="grid gap-x-10 border-t border-[var(--line)] sm:grid-cols-2">
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 border-b border-[var(--line)] py-3.5 text-[0.9375rem]"
                    >
                      <Logo id={item.id} />
                      {item.label}
                    </li>
                  ))}
                </ul>
                {group.evidence && (
                  <EvidenceLink slug={group.evidence.caseSlug} label={group.evidence.label} />
                )}
              </div>
            </div>
          </section>
        ))}

        <section className="mt-20 border-t border-[var(--line)] pt-14">
          <h2 className="display-2">{t.stackPage.principlesTitle}</h2>
          <ol className="measure mt-7">
            {t.stackPage.principles.map((principle: string, i: number) => (
              <li
                key={i}
                className="border-b border-[var(--line)] py-5 text-[0.9375rem] leading-relaxed text-[var(--fg-muted)] last:border-b-0"
              >
                {principle}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
