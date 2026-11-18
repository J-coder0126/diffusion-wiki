#!/usr/bin/env node
// ③ 證據卡：node scripts/make-cards.js <slug>
// 從 sources.md 列出的 wiki 頁面「原文擷取」帶出處的事實行，不經 AI 改寫。
const fs = require("fs"), path = require("path");
const { outDir, wikiPages, readSources } = require("./slides-lib");
const dir = outDir(process.argv[2]);
const pages = wikiPages();
const cardsDir = path.join(dir, "cards");
fs.mkdirSync(cardsDir, { recursive: true });
for (const name of readSources(dir)) {
  const lines = fs.readFileSync(pages.get(name), "utf8").split(/\r?\n/);
  const title = (lines.find((l) => l.startsWith("# ")) || "# " + name).slice(2);
  let section = "", inMath = false, mathBuf = [];
  const out = [`# 證據卡：${title}`, "", `> 來源頁面：wiki/${path.relative(path.join(__dirname, "..", "wiki"), pages.get(name)).replace(/\/g, "/")}（原文擷取，不改寫）`, ""];
  for (const raw of lines) {
    const l = raw.trim();
    if (l.startsWith("#")) { section = l.replace(/^#+\s*/, ""); continue; }
    if (section === "相關頁面" || !section) continue;
    if (l.startsWith("$$")) { if (inMath) { out.push("$$ " + mathBuf.join(" ") + " $$"); mathBuf = []; } inMath = !inMath; continue; }
    if (inMath) { mathBuf.push(l); continue; }
    if (/\[(DDPM|DDIM|LDM|CFG|DiT) /.test(l) || l.startsWith("> 白話")) out.push(l.startsWith("- ") || l.startsWith(">") || l.startsWith("|") ? l : "- " + l);
  }
  fs.writeFileSync(path.join(cardsDir, name + ".md"), out.join("\n") + "\n");
  console.log(`  卡片 ${name}.md：${out.length - 4} 行`);
}
