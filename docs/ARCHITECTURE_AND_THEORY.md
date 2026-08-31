# 🔬 TrueVoice: Theoretical Physics & Mathematical Architecture

### Problem Statement: `SIH26104` (AICTE Cyber Security Cell / Ministry of Communications)
**Subject:** Real-Time AI Voice Clone Detection and Neural Speech Impersonation Defense.

---

## 1. Mathematical Breakdown of Biological Speech vs. Neural Vocoders

### 1.1 Involuntary Laryngeal Micro-Tremor (LMT)
Every living human possesses an involuntary neuromuscular oscillation of the laryngeal vocal cords at $8 - 12\text{ Hz}$. This physiological tremor is driven by intrinsic motor-unit firing patterns and blood pulsation in the neck tissues.

$$\text{Pitch Contour: } F_0(t) = \bar{F}_0 + \Delta F_{\text{prosodic}}(t) + \delta_{\text{LMT}}(t) + \epsilon_{\text{jitter}}(t)$$

Where $\delta_{\text{LMT}}(t)$ is the bandpass-filtered micro-tremor:
$$\delta_{\text{LMT}}(t) = \text{Butterworth}_{4\text{th}}[8\text{ Hz} - 12\text{ Hz}](F_0(t) - \bar{F}_0)$$

**Biological Humanity Metric:**
$$\sigma^2_{\text{LMT}} = \text{Var}(\delta_{\text{LMT}}(t))$$
* **Living Human Phonation:** $\sigma^2_{\text{LMT}} \ge 0.12\text{ Hz}$
* **Neural TTS (ElevenLabs, XTTS v2, VALL-E):** $\sigma^2_{\text{LMT}} \le 0.018\text{ Hz}$ (Near-zero variance due to deterministic spline/diffusion pitch tracks).

---

### 1.2 Linear Frequency Cepstral Coefficients (LFCC)
Standard Mel-Frequency Cepstral Coefficients (MFCCs) use non-linear logarithmic filter spacing that clusters filters at low frequencies, severely attenuating the $4\text{ kHz} - 8\text{ kHz}$ band. However, **neural vocoders (HiFi-GAN, BigVGAN, MelGAN) leave periodic aliasing artifacts specifically in high frequencies**.

TrueVoice uses a 40-channel linear triangular filterbank spanning $0\text{ Hz}$ to $8000\text{ Hz}$:

$$\text{LFCC}[m] = \sum_{k=0}^{M-1} \log(S[k]) \cdot \cos\left( \frac{\pi m (2k + 1)}{2M} \right)$$

---

### 1.3 High-Frequency Phase Group Delay
Generative diffusion and autoregressive vocoders reconstruct waveforms from magnitude representations. The derivative of the phase spectrum (Group Delay) reveals phase discontinuity spikes:

$$\tau_g(\omega) = -\frac{d \phi(\omega)}{d\omega} = -\frac{d}{d\omega} \text{arg}(X(\omega))$$

Neural vocoders exhibit excessive phase group delay variance $\text{Var}(\tau_g) > 0.40$ in high frequencies.

---

### 1.4 Glottal Iterative Adaptive Inverse Filtering (IAIF)
Natural phonation involves asymmetric glottal airflow pulses where the opening phase is slower than the closing phase, accompanied by turbulent breath noise.

$$\text{GlottalFlow}(z) = X(z) \cdot \frac{1}{A_{\text{VocalTract}}(z)} \cdot \frac{1}{1 - 0.97 z^{-1}}$$

TrueVoice extracts the **Breath Aspiration Turbulence Ratio** and **Glottal Pulse Symmetry Index** to identify synthetic, rigid pulses.

---

## 2. The 4-Tier Early-Exit Zero-Trust Pipeline

```
┌────────────────────────────────────────────────────────┐
│ TIER 1: VAD & Energy Gate (< 2ms)                      │
│ Exits immediately on silence or low-energy pauses.     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ TIER 2: DSP LFCC & Phase Group Delay (< 8ms)           │
│ Detects vocoder aliasing in 4-8 kHz band.              │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ TIER 3: AASIST Neural Graph Classifier (< 20ms)        │
│ Evaluates SincNet parametric time-domain filterbanks.  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ TIER 4: LMT Micro-Tremor & Rolling Bayesian Score (< 10ms)│
│ Integrates biological tremor with Explainable AI.      │
└────────────────────────────────────────────────────────┘
```
