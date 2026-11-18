---
type: paper
sources: [LDM]
updated: 2026-11-18
---
# LDM：High-Resolution Image Synthesis with Latent Diffusion Models（Rombach et al., 2022）

## 一句話
LDM 先用自編碼器把圖片壓縮到小很多的潛在空間，再在潛在空間裡做擴散，大幅降低運算量；這就是 Stable Diffusion 背後的方法。[LDM §3][LDM §3.2]

## 要解決的問題
在像素空間訓練擴散模型非常昂貴：最強的模型常需要 150–1000 個 V100 GPU 天，推論也因為要反覆計算而很慢。[LDM §1]
擴散模型還會把大量算力花在人眼看不出的細節上。[LDM §1][LDM §3]

## 方法
- **兩階段分離**：先訓練一個「感知壓縮」自編碼器，再在它的潛在空間訓練擴散模型，把「壓縮」和「生成」分開學。[LDM §3]
- 自編碼器用感知損失加上 patch 對抗損失訓練；編碼器 E 把 H×W×3 的圖壓成 h×w×c 的潛在表示 z，下採樣倍率 f = H/h。[LDM §3.1]
- 為了避免潛在空間變異數過大，試了兩種正規化：KL-reg（類似 VAE 的輕微 KL 懲罰）與 VQ-reg（向量量化）。[LDM §3.1]
- 潛在擴散的訓練目標和 DDPM 相同，只是把 x 換成 z = E(x)；去噪網路是時間條件的 U-Net。[LDM §3.2]
- **條件生成**：在 U-Net 中加入交叉注意力（cross-attention），由領域專用編碼器 τ_θ 把文字等條件 y 轉成表示後注入。詳見 [[conditioning]]。[LDM §3.3]
- 文字生圖模型：1.45B 參數、KL 正規化、在 LAION-400M 上訓練，用 BERT tokenizer 和 Transformer 作為 τ_θ。[LDM §4.3.1]

## 關鍵公式
$$
L_{\text{LDM}} = \mathbb{E}_{\mathcal{E}(x),\,y,\,\epsilon,\,t}\big[\|\epsilon - \epsilon_\theta(z_t, t, \tau_\theta(y))\|^2\big]
$$
> 白話：和 DDPM 一樣是猜雜訊，只是在壓縮後的 z 上猜，而且網路還會看到條件 y（例如文字）。

$$
\text{Attention}(Q,K,V)=\text{softmax}\!\Big(\tfrac{QK^\top}{\sqrt d}\Big)V,\quad Q \text{ 來自 } z_t,\ K,V \text{ 來自 } \tau_\theta(y)
$$
> 白話：圖片的每個位置去「查詢」文字的哪些部分跟自己有關，再把那些資訊加進來。

## 主要結果
- 下採樣倍率 f = 4–16 在效率和品質間取得平衡：f = 1（像素空間）訓練很慢，f = 32 壓縮過頭、品質停滯。[LDM §4.1]
- LDM-4、LDM-8 的 FID 明顯優於像素空間模型，同時取樣速度大幅提升。[LDM §4.1]
- CelebA-HQ 無條件生成 FID 5.11，超越先前的概似模型和 GAN。[LDM §4.2][LDM Tab. 1]
- 同一架構可做文字生圖、語意圖生成、超解析度、修補（inpainting）。[LDM §4.3][LDM §4.4][LDM §4.5]

## 限制
- 循序取樣仍比 GAN 慢。[LDM §5]
- 需要像素級高精度的任務，自編碼器的重建能力可能成為瓶頸。[LDM §5]

## 相關頁面
- [[latent-diffusion]]
- [[conditioning]]
- [[ddpm]]
- [[noise-prediction]]
