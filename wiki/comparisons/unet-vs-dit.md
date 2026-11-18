---
type: comparison
sources: [DDPM, LDM, DiT]
updated: 2026-11-18
---
# U-Net vs Diffusion Transformer（DiT）

## 一句話
U-Net 是擴散模型最早的去噪骨幹；DiT 改用 Transformer，並展現「算力越大、品質越好」的擴展性。[DDPM §4][DiT §1][DiT §5]

## 對照表
| 面向 | U-Net | DiT | 出處 |
|---|---|---|---|
| 基本組成 | 卷積 ResNet 區塊＋部分自注意力 | 標準 Transformer 區塊 | [DDPM §4][DiT §3.2] |
| 輸入方式 | 整張（潛在）圖 | 切成 p×p patch 的 token 序列 | [DiT §3.2] |
| 條件注入 | 交叉注意力（LDM） | adaLN-Zero 最佳 | [LDM §3.3][DiT §5] |
| 擴展方式 | — | 加深加寬或縮小 patch，Gflops 越高 FID 越低 | [DiT §5] |
| ImageNet 256×256 最佳 FID | 被 DiT 超越 | 2.27（DiT-XL/2 ＋ CFG） | [DiT §5.1] |

## 怎麼選
- 依 DiT 的結果，想靠放大模型提升品質時，Transformer 骨幹的擴展性較明確。[DiT §5]
- DiT 的實驗只涵蓋類別條件 ImageNet，其他任務的結論論文沒有驗證。[DiT §4]

## 相關頁面
- [[dit]]
- [[denoising-backbone]]
- [[ldm]]
