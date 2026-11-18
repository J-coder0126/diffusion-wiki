#!/usr/bin/env node
// ⑥ 逐頁稿檢查：node scripts/check-drafts.js <slug> [NN]
const fs = require("fs"), path = require("path");
const { outDir, readDrafts, cardsOf, stripTags, numbersOf } = require("./slides-lib");
const dir = outDir(process.argv[2]);
const only = process.argv[3];
const drafts = readDrafts(dir).filter((d) => !only || d.file.startsWith(only));
const cardText = (c) => { const f = path.join(dir, "cards", c + ".md"); return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null; };
const VISUALS = ["noise-strip", "latent-pipeline", "timeline", "none"];
const probs = [];
const all = readDrafts(dir);
if (!only && (all.length < 6 || all.length > 8)) probs.push(`頁數 ${all.length}，規格是 6–8 頁`);
for (const d of drafts) {
  const tag = `drafts/${d.file}`;
  if (!d.title) probs.push(`${tag}：缺標題`);
  if (d.title.length > 22) probs.push(`${tag}：標題 ${d.title.length} 字（上限 22）`);
  if (d.bullets.length < 1 || d.bullets.length > 4) probs.push(`${tag}：重點 ${d.bullets.length} 個（規格 1–4）`);
  if (!VISUALS.includes(d.visual)) probs.push(`${tag}：未知 visual「${d.visual}」`);
  for (const item of [...d.bullets, ...d.plain]) {
    const cs = cardsOf(item), body = stripTags(item);
    if (!cs.length) { probs.push(`${tag}：沒有出處 → ${body.slice(0, 30)}…`); continue; }
    if (body.length > 60) probs.push(`${tag}：重點 ${body.length} 字（上限 60，避免溢出）→ ${body.slice(0, 20)}…`);
    const texts = cs.map(cardText);
    cs.forEach((c, i) => { if (texts[i] === null) probs.push(`${tag}：引用不存在的卡片 ${c}`); });
    const joined = texts.filter(Boolean).join("\n");
    for (const n of numbersOf(item)) if (!joined.includes(n)) probs.push(`${tag}：數字 ${n} 在卡片 ${cs.join(",")} 中找不到 → ${body.slice(0, 30)}…`);
  }
}
if (probs.length) { console.log(`✗ 逐頁稿檢查：${probs.length} 個問題`); probs.forEach((p) => console.log("  - " + p)); process.exit(1); }
console.log(`✓ 逐頁稿檢查通過：${drafts.length} 頁`);
