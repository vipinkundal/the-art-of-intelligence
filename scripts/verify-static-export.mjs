import fs from "node:fs";
import path from "node:path";
const root = path.join(process.cwd(), "out");
const routes = JSON.parse(fs.readFileSync("content/generated/legacy-routes.json", "utf8"));
const documents = JSON.parse(fs.readFileSync("content/generated/lessons.json", "utf8"));
const errors = [];
const files = ["index.html", "lessons/index.html", "terms/index.html", ...documents.map((d) => d.legacyPath.slice(1))];
for (const name of files) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) { errors.push(`Missing output: ${name}`); continue; }
  const html = fs.readFileSync(file, "utf8");
  if (!/<main\b/.test(html) || !/<h1\b/.test(html)) errors.push(`Missing main content: ${name}`);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
    if (href.startsWith("#") && !ids.has(href.slice(1))) errors.push(`Unresolved anchor in ${name}: ${href}`);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const pathname = href.split(/[?#]/)[0];
    const target = path.join(root, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
    if (!fs.existsSync(target)) errors.push(`Unresolved local link in ${name}: ${href}`);
    else if (href.includes("#") && target.endsWith(".html")) {
      const fragment = decodeURIComponent(href.slice(href.indexOf("#") + 1));
      const targetIds = new Set([...fs.readFileSync(target, "utf8").matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
      if (fragment && !targetIds.has(fragment)) errors.push(`Unresolved destination anchor in ${name}: ${href}`);
    }
  }
}
for (const route of routes) if (!fs.existsSync(path.join(root, route))) errors.push(`Legacy output missing: ${route}`);
if (errors.length) { console.error([...new Set(errors)].join("\n")); process.exitCode = 1; }
else console.log(`Export verified: ${files.length} content pages, ${routes.length}/${routes.length} legacy addresses; all rendered local links and fragment anchors resolve.`);
