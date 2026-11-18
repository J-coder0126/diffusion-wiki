#!/usr/bin/env node
// ② 覆蓋率關卡：node scripts/check-coverage.js <slug>
const { outDir, wikiPages, readSources } = require("./slides-lib");
const dir = outDir(process.argv[2]);
const pages = wikiPages();
const src = readSources(dir);
const missing = src.filter((p) => !pages.has(p));
const ok = src.length >= 3 && missing.length === 0;
if (missing.length) console.log("✗ sources.md 列出不存在的頁面：" + missing.join(", "));
if (src.length < 3) console.log(`✗ 相關頁面只有 ${src.length} 頁（< 3）→ 依停止條件，不硬湊，停下回報使用者`);
if (ok) console.log(`✓ 覆蓋率關卡通過：${src.length} 個 wiki 頁面`);
process.exit(ok ? 0 : 1);
