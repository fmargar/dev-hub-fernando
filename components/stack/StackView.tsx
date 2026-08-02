"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getSkills } from "@/content/profile";

/**
 * Logotipos disponibles en /public. Los que tienen dos variantes se sirven
 * según el material sobre el que se apoyan; el resto valen en ambos.
 */
const LOGOS: Record<string, { src?: string; light?: string; dark?: string }> = {
  PHP: { src: "/php.svg" },
  "Laravel 12": { src: "/laravel.svg" },
  Symfony: { light: "/symfonynegro.svg", dark: "/symfonyblanco.svg" },
  Java: { src: "/java.svg" },
  "React 18 / 19": { src: "/react.svg" },
  "Next.js": { light: "/nextnegro.svg", dark: "/nextblanco.svg" },
  TypeScript: { src: "/typescript.svg" },
  "JavaScript (ES6+)": { src: "/javascript.svg" },
  "Tailwind CSS": { src: "/tailwind.svg" },
  PostgreSQL: { src: "/postgresql.svg" },
  MySQL: { src: "/mysql.svg" },
  MariaDB: { src: "/mariadb.svg" },
  Docker: { src: "/docker.svg" },
  Portainer: { src: "/portainer.svg" },
  Nginx: { src: "/nginx.svg" },
  "Ubuntu Server": { src: "/ubuntu.svg" },
  Cloudflare: { src: "/cloudflare.svg" },
  "Git / GitHub": { light: "/githubnegro.svg", dark: "/githubblanco.svg" },
};

/** Sobre la ficha el fondo siempre es claro, así que manda la variante oscura. */
function Logo({ name }: { name: string }) {
  const logo = LOGOS[name];
  if (!logo) return null;
  const src = logo.src ?? logo.light;
  if (!src) return null;
  return <Image src={src} alt="" width={17} height={17} className="shrink-0" unoptimized />;
}

export function StackView() {
  const { t, locale } = useI18n();
  const skills = getSkills(resolveContentLocale(locale));

  return (
    <>
      <div className="drawer-front">
        <div className="container-page flex flex-wrap items-center gap-5 py-6">
          <span className="drawer-pull" aria-hidden="true" />
          <span className="drawer-plate">{t.stackPage.title}</span>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {t.stackPage.intro}
          </p>
        </div>
      </div>

      <div className="container-page section grid gap-8">
        {skills.map((group) => (
          <section key={group.id}>
            <h2 className="divider-card">{group.label}</h2>
            <div className="file">
              <div className="file-body">
                <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 border-b border-[var(--card-rule)] py-3 text-sm"
                    >
                      <Logo name={item} />
                      {item}
                    </li>
                  ))}
                </ul>

                {group.evidence && (
                  <Link
                    href={`/work/${group.evidence.caseSlug}`}
                    className="link-quiet mt-5 inline-flex items-center gap-1.5 text-sm"
                  >
                    {group.evidence.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        ))}

        <section>
          <h2 className="divider-card">{t.stackPage.principlesTitle}</h2>
          <div className="file">
            <div className="file-body">
              <ul className="measure">
                {t.stackPage.principles.map((principle: string, i: number) => (
                  <li
                    key={i}
                    className="border-b border-[var(--card-rule)] py-4 text-[0.9375rem] leading-relaxed last:border-b-0"
                  >
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
