import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const pagesDir = path.join(contentDir, "pages");

function assertSafeSlugKey(key: string): void {
  if (!/^[a-zA-Z0-9/_-]+$/.test(key) || key.includes("..")) {
    throw new Error(`Invalid page key: ${key}`);
  }
}

/** URL segments → filename key (e.g. `['about']` → `about`; `[]` → `home`). */
export function slugSegmentsToPageKey(
  segments: string[] | undefined,
): string {
  if (!segments?.length) return "home";
  const key = segments.join("/");
  assertSafeSlugKey(key);
  return key;
}

export function listPageKeys(): string[] {
  if (!fs.existsSync(pagesDir)) return [];
  return fs
    .readdirSync(pagesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function readPageJsonRaw(pageKey: string): string {
  assertSafeSlugKey(pageKey);
  const file = path.join(pagesDir, `${pageKey}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Page not found: ${pageKey}`);
  }
  return fs.readFileSync(file, "utf8");
}

export function readBrandJsonRaw(): string {
  const file = path.join(contentDir, "brand.json");
  return fs.readFileSync(file, "utf8");
}

export function readNavigationJsonRaw(): string {
  const file = path.join(contentDir, "navigation.json");
  if (!fs.existsSync(file)) {
    throw new Error("Missing content/navigation.json");
  }
  return fs.readFileSync(file, "utf8");
}
