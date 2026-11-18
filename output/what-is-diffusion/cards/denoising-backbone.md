# 證據卡：去噪網路骨幹（Denoising Backbone）

> 來源頁面：wiki/concepts/denoising-backbone.md（原文擷取，不改寫）

- 去噪網路骨幹是負責「看加噪圖、猜雜訊」的神經網路本體，從 DDPM 的 U-Net 發展到 DiT 的 Transformer。[DDPM §4][DiT §1]
- 網路要同時知道「現在是第幾步」：DDPM 用 Transformer 的正弦位置編碼把時間步 t 送進網路，所有時間步共用參數。[DDPM §4]
- DDPM 的 U-Net 源自 PixelCNN++，主要由卷積的 ResNet 區塊組成，並在 16×16 解析度加自注意力。[DDPM §4][DiT §1]
- LDM 認為 U-Net 對空間結構的歸納偏誤，讓它在潛在空間不必激進壓縮。[LDM §3]
- DiT 證明這個歸納偏誤不是必要的，標準 Transformer 也能取代 U-Net。[DiT §1]
- **DDPM（2020）**：U-Net ＋ group normalization ＋ 自注意力。[DDPM §4]
- **LDM（2022）**：時間條件 U-Net，加交叉注意力接收文字等條件。[LDM §3.2][LDM §3.3]
- **DiT（2023）**：把潛在表示切成 patch 的 Transformer，Gflops 越高品質越好。[DiT §3.2][DiT §5]
- ⚠ 說法不一：LDM 把 U-Net 的歸納偏誤視為優點[LDM §3]；DiT 則主張 U-Net 的歸納偏誤對擴散模型表現並非關鍵。[DiT §1]
