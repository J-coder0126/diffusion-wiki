---
type: paper
sources: [DDIM, DDPM]
updated: 2026-11-18
---
# DDIM：Denoising Diffusion Implicit Models（Song, Meng & Ermon, 2020）

## 一句話
DDIM 不用重新訓練，就能讓已訓練好的 DDPM 用少很多的步數生成圖片，速度快 10–50 倍。[DDIM §5.1]

## 要解決的問題
DDPM 生成一張圖要模擬上千步的馬可夫鏈，比 GAN 慢很多。[DDIM §1]
例如在一張 2080 Ti 上，DDPM 生成 5 萬張 32×32 圖片約需 20 小時，GAN 不到一分鐘。[DDIM §1]

## 方法
- 把 DDPM 的馬可夫前向過程推廣成一族**非馬可夫**（non-Markovian）前向過程，它們的訓練目標和 DDPM 相同。[DDIM §3][DDIM §3.1]
- 因為訓練目標一樣，可以**直接沿用訓練好的 DDPM 模型**，只改取樣方式。[DDIM §4][DDIM §5]
- 取樣時用參數 σ（或 η）控制隨機性：η = 1 等同 DDPM，η = 0 時生成過程完全確定（deterministic），這個特例命名為 DDIM。[DDIM §4.1][DDIM §5]
- 加速方法：只在 1…T 的一個子序列上取樣（例如只走 20 或 50 步），不必重新訓練。[DDIM §4.2]
- DDIM 的更新式可視為求解一個常微分方程（ODE）的 Euler 方法，因此也能把圖片反向編碼成 x_T。[DDIM §4.3]

## 關鍵公式
$$
x_{t-1} = \sqrt{\alpha_{t-1}}\underbrace{\Big(\tfrac{x_t-\sqrt{1-\alpha_t}\,\epsilon_\theta(x_t)}{\sqrt{\alpha_t}}\Big)}_{\text{預測的 }x_0} + \underbrace{\sqrt{1-\alpha_{t-1}-\sigma_t^2}\,\epsilon_\theta(x_t)}_{\text{指向 }x_t\text{ 的方向}} + \underbrace{\sigma_t\,\epsilon_t}_{\text{隨機雜訊}}
$$
> 白話：每一步先用網路猜出原圖，再朝下一個雜訊等級走過去；σ 設成 0 就沒有隨機性。

## 主要結果
- 步數少時 DDIM（η = 0）品質最好：CIFAR10 只用 20 步 FID 6.84，DDPM 同樣 20 步則差很多。[DDIM Tab. 1][DDIM §5.1]
- 20–100 步的 DDIM 品質就接近 1000 步模型，相當於 10–50 倍加速。[DDIM §5.1]
- 一致性：同一個 x_T 用不同步數生成，高層特徵幾乎一樣，所以 x_T 可當作有意義的潛在編碼。[DDIM §5.2]
- 可以在 x_T 上做語意內插，也能把圖片編碼後重建，誤差隨步數增加而下降。[DDIM §5.3][DDIM §5.4][DDIM Tab. 2]

## 限制
- ⚠ 說法不一：完整 1000 步時，DDPM（σ̂ 版本）FID 3.17 反而略優於 DDIM 的 4.04；DDIM 的優勢主要在少步數。[DDIM Tab. 1][DDIM §5.1][DDPM Tab. 1]
- 使用更多步數、甚至連續時間的訓練效果，論文留待未來研究。[DDIM §4.2]

## 相關頁面
- [[ddpm]]
- [[ddpm-vs-ddim]]
- [[sampling-steps]]
- [[forward-process]]
