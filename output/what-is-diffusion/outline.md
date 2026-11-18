# ④ 大綱：擴散模型是什麼？（8 頁）

> 只用 cards/ 的內容。教學順序：先建立直覺（加噪／去噪）→ 再講訓練 → 生成 → 三個改進（快、省、可控）→ 骨幹與總結。

| 頁 | 標題 | 這頁要讓讀者懂什麼 | 用到的卡片 | 視覺 |
|---|---|---|---|---|
| 01 | 擴散模型是什麼？ | 一句話定義＋五篇論文的時間軸 | timeline, ddpm | timeline |
| 02 | 前向過程：把圖變成雜訊 | 加噪是固定的、不用學；任一步可一次算出 | forward-process | noise-strip |
| 03 | 網路學什麼？猜雜訊 | 訓練目標就是猜出加入的雜訊（L_simple） | noise-prediction | none |
| 04 | 反向過程：從雜訊生成圖片 | 從純雜訊一步步去噪；DDPM 的成果與代價 | ddpm, sampling-steps | none |
| 05 | 太慢怎麼辦？DDIM | 同一個模型、少步數、確定性取樣 | ddpm-vs-ddim, sampling-steps | none |
| 06 | 省算力：潛在擴散 | 先壓縮再擴散，Stable Diffusion 的基礎 | latent-diffusion | latent-pipeline |
| 07 | 讓文字控制畫面 | 條件生成（交叉注意力）＋無分類器引導 | conditioning, guidance | none |
| 08 | 骨幹演進與總結 | U-Net → Transformer；全課重點回顧 | denoising-backbone, timeline | none |
