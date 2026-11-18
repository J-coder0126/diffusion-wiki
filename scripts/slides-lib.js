// 簡報 workflow 共用工具
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WIKI = path.join(ROOT, "wiki");

function outDir(slug) {
  if (!slug) { console.error("用法：node scripts/<script>.js <slug>"); process.exit(2); }
  return path.join(ROOT, "output", slug);
}

function wikiPages() {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : []);
  return new Map(walk(WIKI).map((f) => [path.basename(f, ".md"), f]));
}

// sources.md 中以 - [[page]] 列出的頁面
function readSources(dir) {
  const text = fs.readFileSync(path.join(dir, "sources.md"), "utf8");
  return [...text.matchAll(/^- \[\[([^\]]+)\]\]/gm)].map((m) => m[1].trim());
}

function readDrafts(dir) {
  const d = path.join(dir, "drafts");
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => /^\d+\.md$/.test(f)).sort().map((f) => {
    const text = fs.readFileSync(path.join(d, f), "utf8");
    const lines = text.split(/\r?\n/);
    const title = (lines.find((l) => l.startsWith("# ")) || "").slice(2).trim();
    const bullets = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
    const plain = lines.filter((l) => l.startsWith("> 白話")).map((l) => l.replace(/^> 白話[:：]\s*/, "").trim());
    const fm = text.match(/\$\$([\s\S]*?)\$\$/);
    const visual = ((lines.find((l) => l.startsWith("visual:")) || "visual: none").split(":")[1] || "").trim();
    return { file: f, title, bullets, plain, formula: fm ? fm[1].trim() : "", visual };
  });
}

const CARD_TAG = /\{card:([a-z0-9-]+)\}/g;
const cardsOf = (s) => [...s.matchAll(CARD_TAG)].map((m) => m[1]);
const stripTags = (s) => s.replace(CARD_TAG, "").trim();
// 數字（含小數、倍數、×），用來確認數字在卡片中找得到
const numbersOf = (s) => (stripTags(s).match(/\d+(?:\.\d+)?/g) || []).filter((n) => !/^[0-9]$/.test(n));

module.exports = { ROOT, WIKI, outDir, wikiPages, readSources, readDrafts, cardsOf, stripTags, numbersOf };
