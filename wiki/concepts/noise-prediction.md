---
type: concept
sources: [DDPM]
updated: 2026-11-18
---
# 預測雜訊（Noise Prediction, ε-prediction）

## 一句話
預測雜訊是擴散模型最常見的訓練方式：給網路一張加噪圖和時間步，要它猜出當初加進去的雜訊 ε。[DDPM §3.2]

## 說明
- 反向過程的網路可以預測三種東西：前向後驗的平均值、雜訊 ε、或原圖 x₀。[DDPM §3.2]
- DDPM 發現預測 x₀ 在早期實驗中樣本品質較差，因此改為預測 ε。[DDPM §3.2]
- 預測 ε 的參數化讓訓練目標等價於多個雜訊尺度下的去噪分數匹配，取樣過程則類似 Langevin 動力學。[DDPM §3.2]
- DDPM 實際使用去掉權重的簡化目標 L_simple，它會降低「小雜訊、容易去噪」時間步的權重，讓網路專注在較難的大雜訊步。[DDPM §3.4]
- 消融實驗中，預測 ε 搭配 L_simple 的樣本品質最好。[DDPM §4.2][DDPM Tab. 2]

## 關鍵公式
$$
L_{\text{simple}} = \mathbb{E}_{t,x_0,\epsilon}\big[\|\epsilon - \epsilon_\theta(x_t, t)\|^2\big]
$$
> 白話：網路猜的雜訊和真正加入的雜訊越接近越好，就是一個均方誤差。

## 各論文的看法
- **DDPM（2020）**：提出預測 ε ＋ L_simple，並指出它比預測平均值或 x₀ 更好。[DDPM §3.2][DDPM §4.2]

## 相關頁面
- [[ddpm]]
- [[forward-process]]
