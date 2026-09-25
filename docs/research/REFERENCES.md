# 📚 TrueVoice Scientific Literature & Architecture Mapping

This document provides formal academic citations, algorithmic summaries, and exact slide mappings for the research papers forming the foundational pillars of the **TrueVoice** Sovereign Voice Clone Defense Engine (Smart India Hackathon 2026, Problem Statement 26104).

---

## 🎯 Primary Presentation References (Slide-Mapped)

### [1] RawNet2: End-to-End Raw-Waveform Anti-Spoofing
* **Authors:** Hemlata Tak, Jose Patino, Massimiliano Todisco, Andreas Nautsch, Nicholas Evans, Anthony Larcher
* **Publication:** *ICASSP 2021 - 2021 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)*, Toronto, ON, Canada, 2021, pp. 6369–6373.
* **DOI:** [10.1109/ICASSP39728.2021.9414234](https://doi.org/10.1109/ICASSP39728.2021.9414234)
* **Local Paper File:** [`docs/research/primary_references/01_RawNet2_AntiSpoofing_Tak2021.pdf`](primary_references/01_RawNet2_AntiSpoofing_Tak2021.pdf)
* **Slide Location:** **ZONE 2 ➔ STAGE 3: Acoustic / Spectral Analysis (Model: RawNet2)**
* **Core Scientific Contribution:**
  1. Direct end-to-end processing of raw audio waveforms using **SincNet parameterized bandpass filterbanks**, bypassing lossy time-frequency transforms (STFT/MFCC).
  2. Residual blocks with **Feature Map Scaling (FMS)** that learn channel-dependent weights to suppress speaker variability while amplifying synthetic vocoder artifacts.
  3. Establishes the baseline EER benchmark on ASVspoof 2019 Logical Access (LA) evaluated in TrueVoice's telemetry benchmark harness.
* **TrueVoice Implementation:** `backend/models/aasist_classifier.py` (Parametric SincNet filterbanks: 70 bands, 10–8000 Hz) and `backend/models/synthetic_benchmarks.py`.

---

### [2] Attention-Enhanced DenseNet-BiLSTM for Prosodic & Replay Spoof Detection
* **Authors:** Lin Huang, Chi-Man Pun
* **Publication:** *IEEE/ACM Transactions on Audio, Speech, and Language Processing*, vol. 28, pp. 1813–1825, 2020.
* **DOI:** [10.1109/TASLP.2020.2998870](https://doi.org/10.1109/TASLP.2020.2998870)
* **Slide Location:** **ZONE 2 ➔ STAGE 3: Prosody / Behavioral Analysis (Model: DenseNet-BiLSTM + Attention)**
* **Core Scientific Contribution:**
  1. Combines **Segment-Based Linear Filter Bank (LFB)** features with a deep **DenseNet-BiLSTM** temporal network to capture multi-scale prosodic cadence and spectral energy distribution.
  2. Self-attention mechanism dynamically re-weights speech segments containing transient acoustic discontinuities and vocoder phase anomalies.
  3. Achieves robust discrimination against playback and synthesized speech without suffering from long-range temporal decay.
* **TrueVoice Implementation:** `backend/dsp/mgaa_attention.py` (Multi-granularity attention spanning $k=3, 5, 7, 9$ kernels) and `backend/dsp/glottal_analyzer.py`.

---

### [3] Dynamic Multi-Scale Channel Attention for Voiceprint Libraries
* **Authors:** Yan Ding, Dong-Zheng Liang, Shao-Wei Zhang, Zhi Wang
* **Publication:** *2025 10th International Conference on Cloud Computing and Big Data Analytics (ICCCBDA)*, Chengdu, China, 2025, pp. 111–116.
* **DOI:** [10.1109/ICCCBDA64898.2025.11030514](https://doi.org/10.1109/ICCCBDA64898.2025.11030514)
* **Slide Location:** **ZONE 2 ➔ STAGE 3: Cross-Session Consistency Check (Voiceprint Library Construction)**
* **Core Scientific Contribution:**
  1. Temporal dynamic multi-scale channel attention fusion to build noise-invariant **biometric voiceprint libraries**.
  2. Dynamically adjusts convolutional receptive fields to model cross-session acoustic variations (e.g. caller fatigue, microphone difference, background acoustic shifts).
  3. Minimizes intra-class speaker variance while maintaining sharp inter-class boundaries against impersonation attempts.
* **TrueVoice Implementation:** `backend/models/speaker_verifier.py` (Enrolled baseline voiceprints, 192-dimensional vector clustering, cosine verification).

---

### [4] Joint ASV & Prosody Analysis for Synthetic Speech Detection
* **Authors:** Lorenzo Attorresi, Davide Salvi, Clara Borrelli, Paolo Bestagini, Stefano Tubaro
* **Publication:** *Pattern Recognition, Computer Vision, and Image Processing. ICPR 2022 Workshops*, Lecture Notes in Computer Science (LNCS), vol. 13644, Springer, Cham, 2023.
* **DOI:** [10.1007/978-3-031-37742-6_21](https://doi.org/10.1007/978-3-031-37742-6_21)
* **Slide Location:** **THEORETICAL FOUNDATION: Dual-Tier Verification (ASV + Prosody Fusion)**
* **Core Scientific Contribution:**
  1. Demonstrates that evaluating deepfake artifacts alone is insufficient: **identity consistency (ASV)** must be fused with **biological prosody analysis** to counter high-fidelity zero-shot voice cloning.
  2. Analyzes fundamental frequency ($F_0$) contours, energy fluctuations, and syllable durations alongside speaker embeddings.
  3. Fuses decision probabilities to detect impersonation attacks where an attacker's voice has been transformed into a legitimate executive's timbre.
* **TrueVoice Implementation:** `backend/pipeline/voice_decision_engine.py` (Multi-tier fusion combining AASIST neural logits, LMT neuromuscular variance, and ASV speaker cosine similarity).

---

### [5] Robust Prosody Modeling for Synthetic Speech Detection
* **Authors:** Ariel Cohen, Denis Shyrman, Aleksandr Solonskyi, Roman Frenkel, Arkady Krishtul, Oren Gal
* **Publication:** *Speech Communication*, Volume 174, 103283, 2025.
* **DOI:** [10.1016/j.specom.2025.103283](https://doi.org/10.1016/j.specom.2025.103283)
* **Slide Location:** **ZONE 2 ➔ STAGE 3: Neuromuscular Invariance & Micro-Tremor Profiling**
* **Core Scientific Contribution:**
  1. Novel prosody feature representations invariant to channel compression and background noise.
  2. Demonstrates that while diffusion and neural vocoders (HiFi-GAN, BigVGAN) accurately generate short-time spectral envelopes, they fail to replicate natural **neuromuscular micro-variations** and autonomic nervous system jitter in vocal fold tissue.
  3. Provides mathematical proof for sub-band tremor extraction as an insurmountable biological barrier for real-time generative speech synthesis.
* **TrueVoice Implementation:** `backend/dsp/laryngeal_microtremor.py` (8–12Hz bandpass filtering, central difference variance $\sigma^2_{	ext{LMT}}$ thresholding at $0.015	ext{ Hz}$).

---

## 🏛️ Supporting Core Deepfake Architecture Papers

The following peer-reviewed papers are cataloged in [`docs/research/core_deepfake_models/`](core_deepfake_models/):

| File Name | Paper Title & Authors | Key Architectural Role |
|---|---|---|
| `Scalable_AASIST_MHA_Viakhirev2025.pdf` | *Towards Scalable AASIST: Refining Graph Attention for Speech Deepfake Detection* (Viakhirev et al., 2025) | Replaced complex graph attention (HS-GAL) with **Multi-Head Self-Attention (MHA)** and soft cross-modal fusion, dropping EER to $0.83\%$. |
| `AASIST_GraphAttention_Jung2022.pdf` | *AASIST: Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks* (Jung et al., ICASSP 2022) | Foundational spectro-temporal graph attention network modeling joint frequency-time dependencies. |
| `RawBoost_DataAugmentation_Tak2022.pdf` | *RawBoost: A Raw Data Boosting and Augmentation Method for Speech Deepfake Detection* (Tak et al., 2022) | **Hammerstein non-linear modeling**, impulsive signal-dependent noise, and coloured additive noise for telephony codec invariance. |
| `Telephony_Degradation_Benchmarking_Shi2025.pdf` | *Benchmarking Audio Deepfake Detection Robustness in Real-world Communication Scenarios* (Shi et al., 2025) | Comprehensive benchmark suite across 6 codecs (Opus, Silk, AMR-WB, G.711) and 5 packet loss rates ($0\%$ to $20\%$). |

---

## 📑 Technical Architecture & Project Specifications

Located in [`docs/research/technical_specifications/`](technical_specifications/):

1. **`ScalableAASIST_Engineering_Report.pdf`**: Internal systems engineering report covering the 6-stage real-time streaming pipeline, causal MagicNet VAD, and minDCF focal loss tuning.
2. **`VoiceCloning_Detection_PRD_Report.pdf`**: Product Requirements Document (PRD) detailing English and Hindi real-time communication (RTC) telephony protection, Section 65B legal evidence custody, and DPDP Act 2023 compliance.

---

## 🗺️ Slide Stage to Research Paper Mapping Matrix

```
┌──────────────────────────────────────┬────────────────────────────────────────────────────────┬───────────────────────────────────────────┐
│ Slide Zone / Stage                   │ Primary Academic Citation                              │ TrueVoice Engineered Component            │
├──────────────────────────────────────┼────────────────────────────────────────────────────────┼───────────────────────────────────────────┤
│ Zone 1: Call Initiation (SIPREC)     │ RFC 7865 / WebRTC AudioWorklet Streamer                │ `frontend/src/services/api.js` (WebAudio) │
│ Zone 2: Media Normalization & VAD    │ Jia et al. (MagicNet VAD 2024, 22.7K params)           │ `backend/dsp/magicnet_vad.py`             │
│ Zone 2: Acoustic/Spectral Analysis   │ [1] Tak et al. (RawNet2) + Viakhirev (Scalable AASIST) │ `backend/models/aasist_classifier.py`     │
│ Zone 2: Prosody/Behavioral Analysis  │ [2] Huang & Pun (DenseNet-BiLSTM) + [5] Cohen (Prosody)│ `backend/dsp/laryngeal_microtremor.py`    │
│ Zone 2: Cross-Session Check (ASV)    │ [3] Ding et al. (Voiceprint) + [4] Attorresi (ASV+Pros)│ `backend/models/speaker_verifier.py`      │
│ Zone 3: Continuous Risk Scoring      │ Rolling Bayesian Fusion Engine                         │ `backend/pipeline/risk_policy.py`         │
│ Zone 3: Contextual Enrichment        │ I4C NCRP Blacklist & Telephony Metadata Parser        │ `backend/pipeline/contextual_risk_enricher│
│ Stage 6: Tiered Action Gate          │ Pre-Transaction CBS Wire Freeze & SIP Alert Tone       │ `backend/pipeline/alert_dispatcher.py`    │
│ Stage 7: Privacy & Ephemeral RAM     │ DPDP Act 2023 (Volatile RAM Zeroing: np.fill(0))       │ `backend/pipeline/privacy_compliance.py`  │
│ Stage 8: Forensic Ledger Output      │ SHA-256 Chained Merkle Root & Sec 65B Certificate     │ `backend/pipeline/forensic_blockchain_ledg│
└──────────────────────────────────────┴────────────────────────────────────────────────────────┴───────────────────────────────────────────┘
```
