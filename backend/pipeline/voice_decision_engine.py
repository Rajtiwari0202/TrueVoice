"""
TrueVoice 4-Tier Real-Time Voice Authenticity Decision Engine (Research-Enhanced)
Integrates:
1. MagicNet Causal VAD (Suppresses Database Silence Bias)
2. DSP LFCC + Phase Group Delay + Glottal IAIF
3. Multi-Granularity Adaptive Attention (MGAA - Shi et al. 2025) across scales k in {3, 5, 7, 9}
4. Scalable AASIST-MHA with Trainable Soft Fusion (Viakhirev et al. 2025)
5. Biological 8-12Hz Laryngeal Micro-Tremor (LMT) Tracker
6. ASVspoof 5 minDCF Cost Evaluator
"""

import time
import numpy as np
from dsp.audio_features import AudioFeatureExtractor
from dsp.laryngeal_microtremor import LaryngealMicrotremorAnalyzer
from dsp.glottal_analyzer import GlottalFlowAnalyzer
from dsp.mgaa_attention import MultiGranularityAttentionEngine
from dsp.magicnet_vad import MagicNetVAD
from models.aasist_classifier import AASISTDeepfakeClassifier
from pipeline.explainable_xai import VoiceXAIExplainer


class VoiceDecisionEngine:
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.vad = MagicNetVAD(sample_rate=sample_rate)
        self.feature_extractor = AudioFeatureExtractor(sample_rate=sample_rate)
        self.lmt_analyzer = LaryngealMicrotremorAnalyzer(sample_rate=sample_rate)
        self.glottal_analyzer = GlottalFlowAnalyzer(sample_rate=sample_rate)
        self.mgaa_engine = MultiGranularityAttentionEngine(channels=20)
        self.neural_classifier = AASISTDeepfakeClassifier(sample_rate=sample_rate)
        self.xai_explainer = VoiceXAIExplainer()

        self.history_scores = []
        self.max_history = 6

        # Warm-up pass to pre-compile SciPy/NumPy FFT C-extensions
        dummy_audio = np.sin(2 * np.pi * 200 * np.linspace(0, 0.5, 8000)).astype(np.float32)
        self.process_audio_chunk(dummy_audio, client_id="warmup")
        self.history_scores.clear()

    def process_audio_chunk(self, audio_data: np.ndarray, client_id: str = "caller_01", call_context: str = "VOIP_INCOMING") -> dict:
        """
        Executes the 4-Tier Zero-Trust Audio Pipeline on a 500ms streaming chunk.
        """
        start_time = time.perf_counter()

        if audio_data.dtype != np.float32 and audio_data.dtype != np.float64:
            if audio_data.dtype == np.int16:
                audio_data = audio_data.astype(np.float32) / 32768.0
            else:
                audio_data = audio_data.astype(np.float32)

        # ----------------------------------------------------
        # TIER 1: MagicNet Causal VAD (Silence Bias Suppression) (< 2ms)
        # ----------------------------------------------------
        vad_res = self.vad.process(audio_data)
        if not vad_res["has_speech"] and client_id != "warmup":
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "verdict": "ALLOW",
                "action": "SILENCE_PASSTHROUGH",
                "tier": "Tier 1 (MagicNet VAD Gate)",
                "threat_score": 0.0,
                "confidence_pct": 99.0,
                "is_synthetic": False,
                "detected_vocoder": "AMBIENT_SILENCE",
                "humanity_index": 100.0,
                "min_dcf_cost": 0.005,
                "latency_ms": duration_ms,
                "xai_explanation": "MagicNet VAD: Ambient silence or non-speech frame. Zero synthetic activity detected.",
                "metrics": {
                    "speech_ratio": vad_res["speech_ratio"],
                    "mean_f0_hz": 0.0,
                    "lmt_variance": 0.0,
                    "phase_anomaly": 0.0,
                    "dominant_granularity": "Global Context"
                }
            }

        active_audio = vad_res["trimmed_audio"]

        # ----------------------------------------------------
        # TIER 2: DSP LFCC, Phase Group Delay & Glottal IAIF (< 8ms)
        # ----------------------------------------------------
        dsp_descriptors = self.feature_extractor.compute_spectral_descriptors(active_audio)
        lfcc = self.feature_extractor.compute_lfcc(active_audio)
        phase_delay = self.feature_extractor.compute_phase_group_delay_anomaly(active_audio)
        glottal_res = self.glottal_analyzer.extract_glottal_flow(active_audio)

        # ----------------------------------------------------
        # TIER 3: MGAA Attention & Scalable AASIST-MHA (< 15ms)
        # ----------------------------------------------------
        mgaa_res = self.mgaa_engine.compute_mgaa_fusion(lfcc)
        neural_res = self.neural_classifier.predict_spoof_probability(
            active_audio, lfcc, phase_delay, dsp_descriptors, mgaa_res=mgaa_res
        )

        # ----------------------------------------------------
        # TIER 4: Biological LMT Micro-Tremor & Bayesian Fusion (< 10ms)
        # ----------------------------------------------------
        lmt_res = self.lmt_analyzer.analyze_microtremor(active_audio)

        # Integrated Risk Score
        neural_prob = neural_res["deepfake_probability"]
        humanity_norm = lmt_res["humanity_score"] / 100.0
        phase_norm = min(1.0, phase_delay * 10.0)

        raw_threat_prob = (
            0.50 * neural_prob +
            0.35 * (1.0 - humanity_norm) +
            0.15 * phase_norm
        )

        threat_score = round(float(np.clip(raw_threat_prob * 100.0, 1.0, 99.9)), 1)

        # Multi-frame smoothing
        self.history_scores.append(threat_score)
        if len(self.history_scores) > self.max_history:
            self.history_scores.pop(0)

        smoothed_threat_score = round(float(np.mean(self.history_scores)), 1)

        is_synthetic = smoothed_threat_score >= 65.0
        verdict = "BLOCK" if is_synthetic else "ALLOW"
        action = "INTERCEPT_SYNTHETIC_CLONE" if is_synthetic else "VERIFIED_GENUINE_SPEECH"

        xai_explanation = self.xai_explainer.generate_explanation(
            dsp_descriptors, lmt_res, glottal_res, neural_res, smoothed_threat_score
        )

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "verdict": verdict,
            "action": action,
            "tier": "Tier 4 (MGAA + AASIST + LMT Fusion)",
            "threat_score": smoothed_threat_score,
            "confidence_pct": round(smoothed_threat_score if is_synthetic else (100.0 - smoothed_threat_score), 1),
            "is_synthetic": is_synthetic,
            "detected_vocoder": neural_res["detected_vocoder"],
            "humanity_index": lmt_res["humanity_score"],
            "lmt_active": lmt_res["lmt_active"],
            "min_dcf_cost": neural_res.get("min_dcf_cost", 0.05),
            "latency_ms": duration_ms,
            "client_id": client_id,
            "call_context": call_context,
            "mgaa_granularity": mgaa_res["dominant_granularity"],
            "xai_explanation": xai_explanation,
            "metrics": {
                "rms_energy": dsp_descriptors["rms_energy"],
                "mean_f0_hz": lmt_res["mean_f0_hz"],
                "lmt_variance": lmt_res["lmt_variance"],
                "jitter_percent": lmt_res["jitter_percent"],
                "shimmer_percent": lmt_res["shimmer_percent"],
                "phase_anomaly": round(phase_delay, 4),
                "spectral_rolloff_hz": dsp_descriptors["spectral_rolloff_hz"],
                "glottal_verdict": glottal_res["glottal_verdict"],
                "mgaa_branch_weights": mgaa_res["branch_weights"]
            }
        }
