#!/usr/bin/env node
// ⑨ 渲染檢查（靜態部分）：node scripts/check-deck.js <slug>
// 溢出檢查需在瀏覽器開 deck.html 執行 window.checkOverflow()。
const fs = require("fs"), path = require("path");
const { outDir, readDrafts, stripTags } = require("./slides-lib");
const dir = outDir(process.argv[2]);
const html = fs.readFileSync(path.join(dir, "deck.html"), "utf8");
const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const slides = html.split('<section class="slide"').slice(1);
const probs = [];
if (slides.length < 6 || slides.length > 8) probs.push(`deck 有 ${slides.length} 頁（規格 6–8）`);
const drafts = readDrafts(dir);
if (drafts.length !== slides.length) probs.push(`deck ${slides.length} 頁，drafts ${drafts.length} 頁，不一致`);
drafts.forEach((d, k) => {
  const s = decode(slides[k] || "");
  for (const t of [d.title, ...d.bullets.map(stripTags), ...d.plain.map(stripTags), d.formula].filter(Boolean))
    if (!s.includes(t)) probs.push(`第 ${k + 1} 頁：渲染後找不到原稿文字「${t.slice(0, 20)}…」（渲染改了字？）`);
  if (!/class="src" href="https:\/\/github\.com\//.test(slides[k] || "")) probs.push(`第 ${k + 1} 頁：沒有連到 wiki 的出處`);
  if (/href="#"/.test(slides[k] || "")) probs.push(`第 ${k + 1} 頁：出處連結指向不存在的 wiki 頁`);
});
if (probs.length) { console.log(`✗ 渲染檢查：${probs.length} 個問題`); probs.forEach((p) => console.log("  - " + p)); process.exit(1); }
console.log(`✓ 渲染檢查（靜態）通過：${slides.length} 頁，文字與原稿一致，出處都連到 wiki`);
