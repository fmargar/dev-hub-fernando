import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { getSkills } from "@/content/profile";
import { TOOLS, toolSlugs } from "@/content/tools";
import { es } from "@/i18n/translations/es";
import { en } from "@/i18n/translations/en";
import { de } from "@/i18n/translations/de";

const LOCALES = { es, en, de } as const;

describe("skills — mismo esqueleto en los tres idiomas", () => {
  const es_ = getSkills("es");
  const en_ = getSkills("en");
  const de_ = getSkills("de");

  it("declara los mismos grupos, en el mismo orden, en es/en/de", () => {
    const idsEs = es_.map((g) => g.id);
    expect(en_.map((g) => g.id)).toEqual(idsEs);
    expect(de_.map((g) => g.id)).toEqual(idsEs);
  });

  it("cada grupo tiene el mismo número de items en los tres idiomas", () => {
    const countsEs = es_.map((g) => g.items.length);
    expect(en_.map((g) => g.items.length)).toEqual(countsEs);
    expect(de_.map((g) => g.items.length)).toEqual(countsEs);
  });
});

describe("tools.list — a prueba de reordenar TOOLS", () => {
  it("tiene una entrada por cada slug de content/tools.ts, en los tres idiomas", () => {
    const expected = [...toolSlugs].sort();
    for (const [locale, dict] of Object.entries(LOCALES)) {
      const keys = Object.keys(dict.tools.list).sort();
      expect(keys, `locale ${locale}`).toEqual(expected);
    }
  });

  it("todo slug de TOOLS existe como directorio en app/tools/, y viceversa", () => {
    const toolsDir = join(__dirname, "..", "app", "tools");
    const dirs = readdirSync(toolsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect([...toolSlugs].sort()).toEqual(dirs);
  });

  it("no hay slugs duplicados en TOOLS", () => {
    expect(new Set(toolSlugs).size).toBe(TOOLS.length);
  });
});

