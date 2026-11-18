#!/usr/bin/env node
// Wiki lint（AGENTS.md 第 7 節）：node scripts/lint.js
"use strict";
const fs = require("fs");
const path = require("path");

const WIKI = path.resolve(__dirname, "..", "wiki");
const PAPERS = ["DDPM", "DDIM", "LDM", "CFG", "DiT"];
const CITE = /\[(DDPM|DDIM|LDM|CFG|DiT) (§|App\. |Tab\. |Fig\. |Eq\. )[^\]]+\]/;
const ANY_CITE = /\[([A-Za-z]+) (§|App\. |Tab\. |Fig\. |Eq\. )[^\]]+\]/g;
const LINK = /\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g;
const EXEMPT_ORPHAN = new Set(["index", "log"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".md") ? [path.join(dir, e.name)] : []);
}

const files = walk(WIKI);
const pages = new Map(files.map((f) => [path.basename(f, ".md"), f]));
const inbound = new Map([...pages.keys()].map((k) => [k, 0]));
const problems = [];
const rel = (f) => path.relative(path.resolve(WIKI, ".."), f).replace(/\\/g, "/");

for (const [name, file] of pages) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  // 連結
  for (const m of text.matchAll(LINK)) {
    const target = m[1].trim();
    if (!pages.has(target)) problems.push(`斷掉的連結  ${rel(file)} → [[${target}]]`);
    else if (target !== name && !EXEMPT_ORPHAN.has(name)) inbound.set(target, inbound.get(target) + 1);
  }

  // 出處代號
  for (const m of text.matchAll(ANY_CITE)) {
    if (!PAPERS.includes(m[1])) problems.push(`未知的論文代號  ${rel(file)}：[${m[1]} …]`);
  }

  // 格式錯誤的出處，例如 [DDIM Abstract]、[DDPM 3.2]
  for (const m of text.matchAll(/\[(DDPM|DDIM|LDM|CFG|DiT) ([^\]]*)\]/g)) {
    if (!CITE.test(m[0])) problems.push(`出處格式錯誤  ${rel(file)}：${m[0]}（應為 §章節／App.／Tab.／Fig.／Eq.）`);
  }

  const isContent =/[\\/](papers|concepts|comparisons)[\\/]/.test(file);
  if (!isContent) continue;

  // front matter
  if (lines[0] !== "---") problems.push(`缺少 front matter  ${rel(file)}`);
  else for (const key of ["type", "sources", "updated"]) {
    const end = lines.indexOf("---", 1);
    if (!lines.slice(1, end).some((l) => l.startsWith(key + ":"))) problems.push(`front matter 缺 ${key}  ${rel(file)}`);
  }

  // 沒有出處的段落
  let inFront = lines[0] === "---", inMath = false, inCode = false, section = "";
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (inFront) { if (i > 0 && line === "---") inFront = false; return; }
    if (line.startsWith("```")) { inCode = !inCode; return; }
    if (line.startsWith("$$")) { if (!(line.length > 2 && line.endsWith("$$"))) inMath = !inMath; return; }
    if (inCode || inMath || !line) return;
    if (line.startsWith("#")) { section = line.replace(/^#+\s*/, ""); return; }
    if (section === "相關頁面") return;
    if (line.startsWith("> 白話")) return;
    if (/^\|?\s*:?-{3,}/.test(line)) return;               // 表格分隔列
    if (line.startsWith("|") && lines[i + 1] && /^\|?\s*:?-{3,}/.test(lines[i + 1].trim())) return; // 表頭
    if (line.replace(/[\s\-*|>]/g, "").length < 6) return;  // 太短（裝飾）
    if (!CITE.test(line)) problems.push(`沒有出處  ${rel(file)}:${i + 1}  ${line.slice(0, 40)}…`);
  });
}

for (const [name, n] of inbound) {
  if (!EXEMPT_ORPHAN.has(name) && n === 0) problems.push(`孤兒頁  ${rel(pages.get(name))}（除 index/log 外沒有頁面連進來）`);
}

if (problems.length) {
  console.log(`✗ lint 發現 ${problems.length} 個問題：`);
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
}
console.log(`✓ lint 全部通過：${pages.size} 頁`);
