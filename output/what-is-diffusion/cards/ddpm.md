# 證據卡：DDPM：Denoising Diffusion Probabilistic Models（Ho, Jain & Abbeel, 2020）

> 來源頁面：wiki/papers/ddpm.md（原文擷取，不改寫）

- DDPM 證明擴散模型（diffusion model）能產生高品質圖片：先把圖片逐步加噪成純雜訊，再訓練神經網路一步步把雜訊去掉。[DDPM §1]
- 擴散模型在此之前就已被提出，定義簡單、訓練也有效率，但還沒有人證明它能生成高品質樣本。[DDPM §1]
- 作者想知道：只要選對參數化方式與訓練目標，擴散模型能不能和 GAN 等生成模型一樣好。[DDPM §1][DDPM §3]
- 擴散模型是一條參數化的馬可夫鏈（Markov chain），用變分推論（variational inference）訓練，學習把「逐步加噪」的擴散過程反過來。[DDPM §1]
- **前向過程**（forward process）固定不學習：依照變異數排程 β₁…β_T 逐步加入高斯雜訊；任一步 x_t 都能直接由 x₀ 一次算出。詳見 [[forward-process]]。[DDPM §2][DDPM §3.1]
- **反向過程**（reverse process）是要學的部分：從 x_T ~ N(0, I) 出發，每一步用高斯分佈 p_θ(x_{t−1}|x_t) 往回走。[DDPM §2]
- 關鍵設計是讓網路**預測加進去的雜訊 ε**，而不是直接預測平均值；這樣訓練目標就變成簡單的均方誤差，並和多尺度的去噪分數匹配（denoising score matching）等價。詳見 [[noise-prediction]]。[DDPM §3.2][DDPM §3.4]
- 反向過程的變異數固定為常數，不學習。[DDPM §3.2]
- 網路採用類似 PixelCNN++ 的 U-Net，加 group normalization，時間步 t 用 Transformer 的正弦位置編碼輸入，並在 16×16 解析度加自注意力。[DDPM §4]
- 實驗設定 T = 1000，β 從 10⁻⁴ 線性增加到 0.02。[DDPM §4]
$$ q(x_t \mid x_0) = \mathcal{N}\big(x_t;\ \sqrt{\bar\alpha_t}\,x_0,\ (1-\bar\alpha_t)\,I\big),\quad \alpha_t = 1-\beta_t,\ \bar\alpha_t=\prod_{s=1}^{t}\alpha_s $$
> 白話：第 t 步的加噪圖 = 原圖乘上一個縮小的係數，再加上對應強度的高斯雜訊，不用真的一步步加。
$$ L_{\text{simple}}(\theta) = \mathbb{E}_{t,x_0,\epsilon}\Big[\big\|\epsilon - \epsilon_\theta\big(\sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\epsilon,\ t\big)\big\|^2\Big] $$
> 白話：隨機挑一個時間步，把圖加噪，叫網路猜出加了什麼雜訊，猜錯多少就罰多少。
- 無條件 CIFAR10：Inception Score 9.46、FID 3.17，當時為最佳 FID。[DDPM Tab. 1]
- 256×256 LSUN 的樣本品質和 ProgressiveGAN 相近；LSUN Church FID 7.89、Bedroom FID 4.90。[DDPM §4.1][DDPM Fig. 3]
- 消融實驗：用 L_simple 訓練「預測 ε」的版本，樣本品質明顯優於「預測平均值」；學習反向變異數則會讓訓練不穩定。[DDPM §4.2][DDPM Tab. 2]
- 生成過程可解讀為「漸進式有損解壓縮」：大部分編碼長度都花在人眼看不出的細節上。[DDPM §4.3]
- 對數概似（log likelihood）不如其他以概似為基礎的模型。[DDPM §1][DDPM §4.3]
- 生成時要跑完 T = 1000 步，每一步都要一次網路計算。[DDPM §4]
