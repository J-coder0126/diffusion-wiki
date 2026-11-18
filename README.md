# 擴散模型 LLM Wiki ＋ 教學 HTML 簡報

依 Karpathy 的 LLM Wiki 構想，用「先討論、後生成」建立的擴散模型知識庫，並以 **Graph workflow** 從 Wiki 產生教學簡報「擴散模型是什麼？」。

- 📊 **簡報**：`output/what-is-diffusion/deck.html`（GitHub Pages：`https://j-coder0126.github.io/diffusion-wiki/`）
- 📚 **Wiki 目錄**：[wiki/index.md](wiki/index.md)（建議用 Obsidian 開啟 `wiki/` 資料夾瀏覽）
- 📐 **規則**：[AGENTS.md](AGENTS.md)（Claude Code 透過 `CLAUDE.md` 的 `@AGENTS.md` 共用）
- 🔀 **Workflow**：[workflows/slides.md](workflows/slides.md)

## 結構
```
raw/                 5 篇論文（PDF 不進 git，連結見 raw/sources.md）
wiki/                18 頁：5 論文頁、7 概念頁、3 比較頁、時間軸＋index＋log
docs/01-需求訪談紀錄.md   先討論、後生成：10 題訪談與需求摘要
docs/02-執行紀錄.md       每次 lint／檢查關卡的問題與 workflow 調整
workflows/slides.md  Wiki → 簡報的 graph 規格
scripts/             lint 與各檢查關卡腳本
output/what-is-diffusion/  簡報 graph 每一關的產出（sources → cards → outline → drafts → review → deck → report）
```

## 收錄論文
DDPM（2020）、DDIM（2020）、LDM（2022）、CFG（2022）、DiT（2023）

## 指令
```bash
node scripts/lint.js                          # Wiki lint（pre-commit 也會自動跑）
git config core.hooksPath .githooks           # 啟用 lint 沒過就擋 commit
```
簡報 workflow 指令見 AGENTS.md 第 10 節。
