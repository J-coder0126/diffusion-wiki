# 擴散模型 Wiki — 目錄

> 給學過深度學習的大學生。規則見 AGENTS.md；每個事實都附 `[論文 §章節]` 出處。

## 時間軸
- [[timeline]]：擴散模型的發展脈絡

## 論文
- [[ddpm]]：DDPM（2020），預測雜訊的擴散模型，首次達到高品質生成
- [[ddim]]：DDIM（2020），沿用 DDPM 模型、以少步數確定性取樣加速 10–50 倍
- [[ldm]]：LDM（2022），潛在空間擴散＋交叉注意力，Stable Diffusion 的基礎
- [[cfg]]：CFG（2022），無分類器引導，用多樣性換品質
- [[dit]]：DiT（2023），用 Transformer 當去噪骨幹並展現擴展性

## 概念
- [[forward-process]]：前向過程，把圖片逐步加噪成純雜訊
- [[noise-prediction]]：預測雜訊 ε 的訓練方式與 L_simple
- [[sampling-steps]]：取樣步數與生成速度
- [[latent-diffusion]]：在壓縮後的潛在空間做擴散
- [[conditioning]]：條件生成與交叉注意力
- [[guidance]]：引導，取樣時加強條件的影響
- [[denoising-backbone]]：去噪網路骨幹，從 U-Net 到 Transformer

## 比較
- [[ddpm-vs-ddim]]：同一個模型，兩種取樣方式的差異
- [[classifier-guidance-vs-cfg]]：兩種引導方式的差異
- [[unet-vs-dit]]：兩種去噪骨幹的對照
