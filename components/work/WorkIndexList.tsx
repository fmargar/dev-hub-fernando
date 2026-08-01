"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/types";
import { useI18n } from "@/i18n";

/**
 * Índice numerado de trabajo. Es el patrón principal del sitio: se usa igual en
 * la home (solo los destacados) y en /work (todos).
 */
export function WorkIndexList({ cases }: { cases: CaseStudy[] }) {
  const { t } = useI18n();

  return (
    <ol className="mt-10">
      {cases.map((item, index) => (
        <li key={item.slug} className="index-row">
          <Link href={`/work/${item.slug}`} className="group block py-7 md:py-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
              <span className="index-number md:w-10 md:shrink-0 md:pt-1.5">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="display-3 group-hover:text-[var(--primary)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground measure">{item.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.stack.slice(0, 5).map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                  {item.stack.length > 5 && (
                    <span className="tag">+{item.stack.length - 5}</span>
                  )}
                </div>
              </div>

              <div className="md:w-56 md:shrink-0 md:text-right">
                <p className="text-sm">{item.client}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{item.year}</p>
                <span className="mt-3 hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-[var(--primary)] transition-colors">
                  {t.work.read}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
