#!/usr/bin/env node
// ⑧ 渲染 HTML：node scripts/render.js <slug> "<簡報標題>"
// 純程式轉換：drafts/ 的文字原封不動放進 deck.html（AI 不參與，保證不改字）。
"use strict";
const fs = require("fs"), path = require("path");
const { ROOT, outDir, wikiPages, readDrafts, cardsOf, stripTags } = require("./slides-lib");

const slug = process.argv[2];
const deckTitle = process.argv[3] || slug;
const dir = outDir(slug);
const REPO = "https://github.com/J-coder0126/diffusion-wiki/blob/main/";
const pages = wikiPages();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wikiUrl = (c) => pages.has(c) ? REPO + path.relative(ROOT, pages.get(c)).replace(/\\/g, "/") : "#";
const srcTags = (cs) => cs.map((c) => `<a class="src" href="${wikiUrl(c)}" target="_blank" rel="noopener">${esc(c)}</a>`).join("");

// 時間軸視覺：直接讀 wiki/timeline.md 的表格
function timelineVisual() {
  const rows = fs.readFileSync(path.join(ROOT, "wiki", "timeline.md"), "utf8").split(/\r?\n/)
    .filter((l) => /^\| 20\d\d/.test(l)).map((l) => l.split("|").map((s) => s.trim()));
  return `<div class="vis-timeline">${rows.map((r) =>
    `<div class="tl-item"><div class="tl-year">${esc(r[1])}</div><div class="tl-dot"></div><div class="tl-name">${esc(r[2].replace(/\[\[|\]\]/g, "").toUpperCase())}</div></div>`).join("")}</div>`;
}
const VISUALS = {
  none: () => "",
  "noise-strip": () => `<div class="vis-noise" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) =>
    `<div class="nz"><div class="nz-img" style="--n:${i / 4}"></div><span>${["x₀", "x₁", "…", "x_t", "x_T"][i]}</span></div>${i < 4 ? '<div class="nz-arrow">→</div>' : ""}`).join("")}
    <div class="nz-caption"><span>前向：加噪 →</span><span>← 反向：去噪</span></div></div>`,
  "latent-pipeline": () => `<div class="vis-pipe" aria-hidden="true">
    <div class="pp">圖片 x</div><div class="pa">→</div><div class="pp enc">編碼器 E</div><div class="pa">→</div>
    <div class="pp lat">潛在 z<br><small>在這裡加噪／去噪</small></div><div class="pa">→</div><div class="pp enc">解碼器 D</div><div class="pa">→</div><div class="pp">圖片</div></div>`,
  timeline: timelineVisual,
};

const drafts = readDrafts(dir);
const slidesHtml = drafts.map((d, i) => {
  const used = [...new Set([...d.bullets, ...d.plain].flatMap(cardsOf))];
  return `<section class="slide" data-n="${i + 1}">
  <header><span class="kicker">${String(i + 1).padStart(2, "0")} / ${String(drafts.length).padStart(2, "0")}</span><h2>${esc(d.title)}</h2></header>
  <div class="body${d.visual !== "none" ? " has-vis" : ""}">
    <ul class="points">${d.bullets.map((b) => `<li><span>${esc(stripTags(b))}</span>${srcTags(cardsOf(b))}</li>`).join("")}</ul>
    ${d.formula ? `<div class="formula">${esc(d.formula)}</div>` : ""}
    ${d.plain.map((p) => `<p class="plain"><b>白話</b>${esc(stripTags(p))}${srcTags(cardsOf(p))}</p>`).join("")}
    ${(VISUALS[d.visual] || VISUALS.none)()}
  </div>
  <footer>出處（wiki 頁面）：${srcTags(used)}</footer>
</section>`;
}).join("\n");

const html = `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(deckTitle)}</title>
<style>
:root{--bg:#f6f4ee;--paper:#fffdf8;--ink:#1d2330;--muted:#5d6675;--line:#e4dfd3;--accent:#c2572b;--accent2:#2f5bd3;--soft:#fbeee6;--chip:#eef2fc}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#121418;--paper:#1b1e24;--ink:#e8eaee;--muted:#9aa3b0;--line:#2c313a;--accent:#f08a5d;--accent2:#86a8ff;--soft:#2a211c;--chip:#222a3d}}
*{box-sizing:border-box}html,body{margin:0;height:100%;background:var(--bg);color:var(--ink);font-family:"Noto Sans TC","Microsoft JhengHei","PingFang TC",system-ui,sans-serif}
.deck{height:100%;display:grid;place-items:center;padding:16px}
.slide{display:none;width:min(100%,1100px);aspect-ratio:16/9;max-height:calc(100vh - 80px);background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:clamp(18px,3.2vw,44px) clamp(20px,4vw,56px);flex-direction:column;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.06)}
.slide.on{display:flex}
.slide header .kicker{font-size:.8rem;letter-spacing:.12em;color:var(--accent);font-weight:700}
.slide h2{margin:.25em 0 .5em;font-size:clamp(1.3rem,2.9vw,2.3rem);line-height:1.25}
.body{flex:1;display:flex;flex-direction:column;gap:.7em;min-height:0}
.points{margin:0;padding:0;list-style:none;display:grid;gap:.55em}
.points li{font-size:clamp(.95rem,1.75vw,1.3rem);line-height:1.55;padding-left:1.1em;position:relative}
.points li::before{content:"";position:absolute;left:0;top:.62em;width:.45em;height:.45em;border-radius:50%;background:var(--accent)}
.src{display:inline-block;margin-left:.4em;font-size:.62em;vertical-align:middle;padding:.1em .55em;border-radius:99px;background:var(--chip);color:var(--accent2);text-decoration:none;font-family:ui-monospace,Consolas,monospace}
.src:hover{text-decoration:underline}
.formula{font-family:"Cambria Math","Times New Roman",serif;font-size:clamp(1rem,2vw,1.45rem);background:var(--soft);border-radius:12px;padding:.55em .9em;text-align:center;overflow-x:auto;white-space:nowrap}
.plain{margin:0;font-size:clamp(.9rem,1.6vw,1.15rem);color:var(--muted)}
.plain b{color:var(--accent);margin-right:.5em}
footer{border-top:1px solid var(--line);padding-top:.5em;margin-top:.6em;font-size:.75rem;color:var(--muted)}
.vis-noise{display:flex;align-items:center;justify-content:center;gap:.5em;flex-wrap:wrap;margin-top:auto}
.nz{display:flex;flex-direction:column;align-items:center;gap:.25em;font-size:.85rem;color:var(--muted)}
.nz-img{width:clamp(44px,7vw,84px);aspect-ratio:1;border-radius:10px;background:radial-gradient(circle at 35% 40%,#f4b860 0 18%,transparent 19%),radial-gradient(circle at 62% 62%,#5b8def 0 22%,transparent 23%),linear-gradient(135deg,#9fd5b6,#e9c9a8);position:relative;overflow:hidden}
.nz-img::after{content:"";position:absolute;inset:0;opacity:var(--n);background:repeating-conic-gradient(#000 0 8%,#fff 0 16%,#888 0 25%) 0 0/7px 7px;filter:contrast(1.2)}
.nz-arrow{color:var(--muted);font-size:1.2rem}
.nz-caption{width:100%;display:flex;justify-content:space-between;font-size:.8rem;color:var(--accent);max-width:560px}
.vis-pipe{display:flex;align-items:center;justify-content:center;gap:.4em;flex-wrap:wrap;margin-top:auto}
.pp{border:1px solid var(--line);border-radius:12px;padding:.5em .8em;font-size:clamp(.8rem,1.4vw,1rem);background:var(--paper);text-align:center}
.pp.enc{background:var(--chip)}.pp.lat{background:var(--soft);border-color:var(--accent);font-weight:700}.pp small{font-weight:400;color:var(--muted)}
.pa{color:var(--muted)}
.vis-timeline{display:flex;justify-content:space-between;position:relative;margin-top:auto;padding:0 2%}
.vis-timeline::before{content:"";position:absolute;left:2%;right:2%;top:2.05em;height:2px;background:var(--line)}
.tl-item{display:flex;flex-direction:column;align-items:center;gap:.3em;position:relative;z-index:1}
.tl-year{font-size:.8rem;color:var(--muted)}.tl-dot{width:14px;height:14px;border-radius:50%;background:var(--accent);border:3px solid var(--paper)}
.tl-name{font-weight:700;font-size:clamp(.8rem,1.5vw,1.05rem)}
nav.ctl{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;align-items:center;font-size:.85rem;color:var(--muted)}
nav.ctl button{font:inherit;border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:99px;padding:4px 14px;cursor:pointer}
@media (max-width:640px){.slide{aspect-ratio:auto;max-height:none;min-height:70vh}}
@media print{nav.ctl{display:none}.slide{display:flex!important;page-break-after:always;box-shadow:none}}
</style></head>
<body><main class="deck">
${slidesHtml}
</main>
<nav class="ctl"><button id="prev" aria-label="上一頁">←</button><span id="pos"></span><button id="next" aria-label="下一頁">→</button></nav>
<script>
const S=[...document.querySelectorAll('.slide')];let i=Math.max(0,Math.min(S.length-1,(parseInt(location.hash.slice(1))||1)-1));
function show(n){i=Math.max(0,Math.min(S.length-1,n));S.forEach((s,k)=>s.classList.toggle('on',k===i));document.getElementById('pos').textContent=(i+1)+' / '+S.length;history.replaceState(null,'','#'+(i+1));}
document.getElementById('prev').onclick=()=>show(i-1);document.getElementById('next').onclick=()=>show(i+1);
addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key))show(i+1);if(['ArrowLeft','PageUp'].includes(e.key))show(i-1);});
// 渲染檢查用：回傳每頁是否溢出
window.checkOverflow=()=>S.map((s,k)=>{show(k);const b=s.querySelector('.body');return{slide:k+1,overflow:s.scrollHeight>s.clientHeight+1||b.scrollHeight>b.clientHeight+1}});
addEventListener('hashchange',()=>show((parseInt(location.hash.slice(1))||1)-1));
show(i);
</script></body></html>
`;
fs.writeFileSync(path.join(dir, "deck.html"), html);
console.log(`✓ 已渲染 ${drafts.length} 頁 → output/${slug}/deck.html`);
