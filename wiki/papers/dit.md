---
type: paper
sources: [DiT]
updated: 2026-11-18
---
# DiT：Scalable Diffusion Models with Transformers（Peebles & Xie, 2023）

## 一句話
DiT 把潛在擴散模型裡的 U-Net 換成 Transformer，並證明模型計算量（Gflops）越大，生成品質越好。[DiT §1][DiT §5]

## 要解決的問題
Transformer 已經在語言和視覺辨識取代了各領域的專用架構，但擴散模型仍普遍使用 U-Net。[DiT §1]
作者想釐清：U-Net 的歸納偏誤對擴散模型是不是必要的，以及架構放大時品質如何變化。[DiT §1]

## 方法
- 建立在 LDM 框架上：沿用 Stable Diffusion 的預訓練 VAE（下採樣 8 倍），256×256×3 的圖變成 32×32×4 的潛在表示。[DiT §1][DiT §4]
- **Patchify**：把潛在表示切成 p×p 的小塊，每塊線性嵌入成一個 token；p 越小、token 越多、Gflops 越高。[DiT §3.2]
- 比較四種把時間步 t 和類別 c 送進模型的方式：in-context、交叉注意力、adaLN、adaLN-Zero。[DiT §3.2]
- 模型大小依 ViT 設定分成 S、B、L、XL，命名如 DiT-XL/2（XL 設定、patch 大小 2）。[DiT §3.2]
- 輸出層把每個 token 解碼回雜訊預測與對角共變異數預測。[DiT §3.2]

## 主要結果
- adaLN-Zero 在所有訓練階段的 FID 都優於交叉注意力與 in-context。[DiT §5][DiT Fig. 5]
- 加深加寬模型或縮小 patch（增加 token）都能降低 FID；Gflops 和 FID 高度相關，參數量本身不是決定因素。[DiT §5][DiT Fig. 8]
- 較大的 DiT 用訓練算力更有效率。[DiT §5][DiT Fig. 9]
- 256×256 ImageNet 搭配 CFG，DiT-XL/2 達到 FID 2.27，優於先前所有擴散模型；512×512 為 FID 3.04。[DiT §5.1][DiT Tab. 2]
- 增加取樣步數無法彌補模型計算量的不足。[DiT §5.2]

## 限制
- 實驗只做類別條件的 ImageNet 生成，並在 LDM 的潛在空間進行。[DiT §4]

## 相關頁面
- [[denoising-backbone]]
- [[unet-vs-dit]]
- [[latent-diffusion]]
- [[guidance]]
