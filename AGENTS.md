# AGENTS.md — 擴散模型 LLM Wiki

> 依 Karpathy 的 LLM Wiki 構想建立。本文件由 `docs/01-需求訪談紀錄.md` 的需求摘要（使用者已確認）生成。
> 所有 AI 代理（Claude Code、Antigravity、Codex…）動手前先讀完本文件。

## 1. 目的與讀者
- 主題：擴散模型（Diffusion Models），從 DDPM 到 DiT。
- 讀者：**學過深度學習的大學生**——懂神經網路、反向傳播、CNN／Transformer，但沒讀過擴散模型論文。
- 用途：①當知識庫查詢 ②作為教學 HTML 簡報的**唯一**知識來源（見 `workflows/slides.md`）。

## 2. 三層結構
```
raw/        事實來源（論文 PDF），唯讀；PDF 不進 git，連結列在 raw/sources.md
wiki/       AI 維護的知識頁（本 Wiki 的主體）
  index.md         所有頁面的目錄（每頁一行摘要）
  log.md           ingest／lint／修改紀錄（只新增，不刪改舊紀錄）
  timeline.md      發展時間軸
  papers/          論文頁：一篇論文一頁
  concepts/        概念頁：跨論文整合一個概念
  comparisons/     比較頁：兩種以上做法的對照
scripts/lint.js    Wiki 自動檢查
workflows/         從 Wiki 產生成品的流程（graph）
```
- **單向事實流**：`raw/` → `wiki/`。wiki 的每個事實都必須能追回 raw/ 中的論文章節；不可用 AI 自己的知識補內容。

## 3. 論文代號（出處只能用這五個）
| 代號 | 論文 | arXiv |
|---|---|---|
| DDPM | Ho et al. 2020, Denoising Diffusion Probabilistic Models | 2006.11239 |
| DDIM | Song et al. 2020, Denoising Diffusion Implicit Models | 2010.02502 |
| LDM | Rombach et al. 2022, High-Resolution Image Synthesis with Latent Diffusion Models | 2112.10752 |
| CFG | Ho & Salimans 2022, Classifier-Free Diffusion Guidance | 2207.12598 |
| DiT | Peebles & Xie 2023, Scalable Diffusion Models with Transformers | 2212.09748 |

新增論文時：在此表加一列、在 `raw/sources.md` 加連結、在 `scripts/lint.js` 的 `PAPERS` 加代號。

## 4. 寫作規則
- **語言**：繁體中文（台灣用語），專有名詞第一次出現附英文，例：前向過程（forward process）。
- **出處（必守）**：每個事實段落／清單項目／表格資料列的結尾標 `[代號 §章節]`，例 `[DDPM §3.2]`、`[LDM §4.3.2]`、附錄寫 `[DDIM App. C]`、表格寫 `[DiT Tab. 4]`。多個來源寫 `[DDPM §3.2][DDIM §4]`。
- **公式**：只寫關鍵公式，放在 `$$ … $$` 區塊；公式下一行以 `> 白話：` 開頭寫一句白話解釋。不寫完整推導。
- **矛盾**：兩篇論文說法不一或後者修正前者時，兩種說法並列，以 `⚠ 說法不一：` 開頭，兩邊各附出處；不可自行判定誰對。
- **連結**：頁面互連用 Obsidian 格式 `[[檔名]]`（不含 .md、不含資料夾），例 `[[ddpm]]`、`[[classifier-free-guidance]]`。
- **檔名**：英文小寫、單字以 `-` 連接。論文頁用代號小寫（`ddpm.md`）；概念頁、比較頁用英文名（`forward-process.md`、`ddpm-vs-ddim.md`）。
- 每段不超過 4 句；寧可少寫，不可捏造數字、章節或結論。

## 5. 頁面樣板
**每頁開頭（YAML front matter）**
```yaml
---
type: paper | concept | comparison
sources: [DDPM, DDIM]     # 本頁用到的論文代號
updated: 2026-11-18
---
```
**論文頁** `wiki/papers/<代號>.md`：`# 標題` → `## 一句話` → `## 要解決的問題` → `## 方法` → `## 關鍵公式`（選填）→ `## 主要結果` → `## 限制` → `## 相關頁面`
**概念頁** `wiki/concepts/<名稱>.md`：`# 標題` → `## 一句話` → `## 說明` → `## 關鍵公式`（選填）→ `## 各論文的看法`（按年份，每篇一項）→ `## 相關頁面`
**比較頁** `wiki/comparisons/<a>-vs-<b>.md`：`# 標題` → `## 一句話` → `## 對照表`（最後一欄是「出處」）→ `## 怎麼選` → `## 相關頁面`
- `## 相關頁面` 只放 `[[連結]]` 清單，不需出處。

## 6. Ingest 流程（一次一篇）
1. 讀 `raw/` 中該論文全文，先列出它涉及的概念。
2. 建立或更新論文頁。
3. 更新相關概念頁（沒有就新建）；若和既有內容衝突，依第 4 節「矛盾」規則並列。
4. 需要時新增或更新比較頁；更新 `timeline.md`。
5. 在 `index.md` 登錄所有新頁面（每頁一行：連結＋一句摘要）。
6. 在 `log.md` 新增一筆：日期、論文、新增／修改了哪些頁面。
7. 執行 `node scripts/lint.js`，**全部通過才能 commit**：`git commit -m "ingest: <代號>"`。

## 7. Lint（`node scripts/lint.js`）
- **斷掉的內部連結**：`[[x]]` 指向不存在的頁面。
- **孤兒頁**：除了 `index.md`、`log.md` 之外，沒有任何頁面連到它。
- **沒有出處的段落**：論文／概念／比較頁中，事實段落、清單項目、表格資料列沒有 `[代號 §…]`（`## 相關頁面`、`> 白話：`、標題、公式除外）。
- 另檢查：出處代號必須是第 3 節的五個之一；front matter 必填。

## 8. AI 必須遵守
- ✅ 只寫 raw/ 論文中有的內容；找不到出處就不寫，並在 log 記「待補」。
- ✅ 修改既有頁面時更新 front matter 的 `updated`，並在 log 留紀錄。
- ❌ 不可修改 `raw/`；不可刪除 `log.md` 舊紀錄。
- ❌ 不可在沒有跑 lint 的情況下 commit。
- ❌ 不可用模型自己的知識補充論文沒說的數字或結論。

## 9. 從 Wiki 產出成品
教學 HTML 簡報依 `workflows/slides.md` 的 graph 執行，**只能使用 wiki/ 的內容**，產出放在 `output/<主題>/`。
