import type { MetadataRoute } from "next";
import { caseSlugs } from "@/content/cases";
import { profile } from "@/content/profile";

const TOOL_PATHS = [
  "aspect-ratio", "base64", "bg-remover", "code-beautifier", "color-blindness",
  "cron-helper", "csv-json", "data-converter", "exif-reader", "favicon-generator",
  "gitignore-generator", "gradient-generator", "hash-generator", "image-color-picker",
  "image-compressor", "image-forge", "json-formatter", "jwt-decoder", "lorem-ipsum",
  "markdown-editor", "nba-scores", "palette-extractor", "password-generator", "qr-code",
  "readme-generator", "regex-tester", "snippet-generator", "svg-to-datauri", "text-diff",
  "text-encryptor", "unix-timestamp", "video-crunch", "word-counter",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: profile.site, lastModified, priority: 1 },
    { url: `${profile.site}/work`, lastModified, priority: 0.9 },
    ...caseSlugs.map((slug) => ({
      url: `${profile.site}/work/${slug}`,
      lastModified,
      priority: 0.8,
    })),
    { url: `${profile.site}/experience`, lastModified, priority: 0.7 },
    { url: `${profile.site}/stack`, lastModified, priority: 0.6 },
    { url: `${profile.site}/contact`, lastModified, priority: 0.6 },
    { url: `${profile.site}/tools`, lastModified, priority: 0.5 },
    ...TOOL_PATHS.map((tool) => ({
      url: `${profile.site}/tools/${tool}`,
      lastModified,
      priority: 0.3,
    })),
  ];
}
