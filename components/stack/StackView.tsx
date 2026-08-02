"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getSkills } from "@/content/profile";
import { Icon, useHoverIcon } from "@/components/ui/hover-icon";
import ArrowNarrowRightIcon from "@/icons/arrow-narrow-right-icon";

/**
 * Logotipos disponibles en /public. Los que tienen dos variantes se sirven
 * según el tema; el resto valen en ambos.
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

/**
 * Los que tienen dos variantes se pintan las dos y se enseña una según el tema:
 * resolverlo en CSS evita el parpadeo de leer el tema después de hidratar.
 */
function Logo({ name }: { name: string }) {
  const logo = LOGOS[name];
  if (!logo) return null;

  if (logo.src) {
    return <Image src={logo.src} alt="" width={18} height={18} className="shrink-0" unoptimized />;
  }
  if (!logo.light || !logo.dark) return null;

  return (
    <>
      <Image
        src={logo.light}
        alt=""
        width={18}
        height={18}
        className="shrink-0 dark:hidden"
        unoptimized
      />
      <Image
        src={logo.dark}
        alt=""
        width={18}
        height={18}
        className="hidden shrink-0 dark:block"
        unoptimized
      />
    </>
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
                      key={item}
                      className="flex items-center gap-3 border-b border-[var(--line)] py-3.5 text-[0.9375rem]"
                    >
                      <Logo name={item} />
                      {item}
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
