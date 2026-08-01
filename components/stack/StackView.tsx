"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { resolveContentLocale } from "@/content/cases";
import { getSkills } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Logotipos disponibles en /public. Los que tienen dos variantes se sirven
 * según el tema; el resto son iconos de color que funcionan en ambos.
 */
const LOGOS: Record<string, { src?: string; light?: string; dark?: string }> = {
  "PHP": { src: "/php.svg" },
  "Laravel 12": { src: "/laravel.svg" },
  "Symfony": { light: "/symfonynegro.svg", dark: "/symfonyblanco.svg" },
  "Java": { src: "/java.svg" },
  "React 18 / 19": { src: "/react.svg" },
  "Next.js": { light: "/nextnegro.svg", dark: "/nextblanco.svg" },
  "TypeScript": { src: "/typescript.svg" },
  "JavaScript (ES6+)": { src: "/javascript.svg" },
  "Tailwind CSS": { src: "/tailwind.svg" },
  "PostgreSQL": { src: "/postgresql.svg" },
  "MySQL": { src: "/mysql.svg" },
  "MariaDB": { src: "/mariadb.svg" },
  "Docker": { src: "/docker.svg" },
  "Portainer": { src: "/portainer.svg" },
  "Nginx": { src: "/nginx.svg" },
  "Ubuntu Server": { src: "/ubuntu.svg" },
  "Cloudflare": { src: "/cloudflare.svg" },
  "Git / GitHub": { light: "/githubnegro.svg", dark: "/githubblanco.svg" },
};

function Logo({ name }: { name: string }) {
  const logo = LOGOS[name];
  if (!logo) return null;

  if (logo.light && logo.dark) {
    return (
      <>
        <Image src={logo.light} alt="" width={18} height={18} className="dark:hidden shrink-0" unoptimized />
        <Image src={logo.dark} alt="" width={18} height={18} className="hidden dark:block shrink-0" unoptimized />
      </>
    );
  }
  return <Image src={logo.src!} alt="" width={18} height={18} className="shrink-0" unoptimized />;
}

export function StackView() {
  const { t, locale } = useI18n();
  const skills = getSkills(resolveContentLocale(locale));

  return (
    <div className="container-page py-16 md:py-24">
      <header className="measure">
        <h1 className="display-1">{t.stackPage.title}</h1>
        <p className="body-copy mt-6">{t.stackPage.intro}</p>
      </header>

      <div className="mt-16 space-y-14">
        {skills.map((group) => (
          <Reveal key={group.id}>
            <section>
              <div className="flex items-baseline justify-between gap-6 border-b border-[var(--rule-strong)] pb-3">
                <h2 className="display-3">{group.label}</h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="mt-6 grid border-t border-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 border-b border-[var(--rule)] px-4 py-3.5 text-sm"
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
            </section>
          </Reveal>
        ))}
      </div>

      <section className="mt-20 border-t border-[var(--rule)] pt-12">
        <h2 className="display-2">{t.stackPage.principlesTitle}</h2>
        <ol className="mt-8 measure divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {t.stackPage.principles.map((principle: string, i: number) => (
            <li key={i} className="flex gap-5 py-5">
              <span className="index-number pt-1">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm leading-relaxed">{principle}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
