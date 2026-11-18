# 證據卡：前向過程（Forward Process）

> 來源頁面：wiki/concepts/forward-process.md（原文擷取，不改寫）

- 前向過程是把真實圖片一步步加入高斯雜訊、直到變成純雜訊的固定流程，它不需要學習。[DDPM §2][DDPM §3.1]
- 前向過程是一條馬可夫鏈：每一步依變異數 β_t 加一點高斯雜訊，又叫擴散過程（diffusion process）。[DDPM §2]
- 它有一個重要性質：任一步 x_t 都可以由原圖 x₀ 一次算出來，不必真的跑 t 步，所以訓練時可以隨機挑時間步。[DDPM §2]
- DDPM 把 β_t 固定成常數（從 10⁻⁴ 線性增加到 0.02，共 T = 1000 步），因此前向過程完全沒有可學參數。[DDPM §3.1][DDPM §4]
- β 選得夠小，能讓反向過程和前向過程的形式近似，同時讓 x_T 幾乎只剩雜訊。[DDPM §4]
$$ q(x_t \mid x_{t-1}) = \mathcal{N}\big(x_t;\ \sqrt{1-\beta_t}\,x_{t-1},\ \beta_t I\big) $$
> 白話：每一步把上一張圖稍微縮小，再加一點雜訊。
$$ x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\epsilon,\quad \epsilon \sim \mathcal{N}(0, I) $$
> 白話：第 t 步的圖就是「原圖」和「雜訊」按比例混合，t 越大雜訊越多。
- **DDPM（2020）**：前向過程是馬可夫鏈、β 固定，訓練目標只依賴 q(x_t|x₀)。[DDPM §2][DDPM §3.1]
