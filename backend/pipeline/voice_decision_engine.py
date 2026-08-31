"""
TrueVoice 4-Tier Real-Time Voice Authenticity Decision Engine
Module: Orchestrates DSP Acoustic Physics, AASIST Neural Inference, and Biological LMT Micro-Tremor Verification.
Latency SLA: Sub-45ms End-to-End Processing on 500ms Sliding Window Audio Chunks.
"""

import time
import numpy as np
from dsp.audio_features import AudioFeatureExtractor
from dsp.laryngeal_microtremor import LaryngealMicrotremorAnalyzer
from dsp.glottal_analyzer import GlottalFlowAnalyzer
from models.aasist_classifier import AASISTDeepfakeClassifier
from pipeline.explainable_xai import VoiceXAIExplainer


class VoiceDecisionEngine:
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.feature_extractor = AudioFeatureExtractor(sample_rate=sample_rate)
        self.lmt_analyzer = LaryngealMicrotremorAnalyzer(sample_rate=sample_rate)
        self.glottal_analyzer = GlottalFlowAnalyzer(sample_rate=sample_rate)
        self.neural_classifier = AASISTDeepfakeClassifier(sample_rate=sample_rate)
        self.xai_explainer = VoiceXAIExplainer()

        # Rolling multi-frame buffer for temporal smoothing
        self.history_scores = []
        self.max_history = 6

    def process_audio_chunk(self, audio_data: np.ndarray, client_id: str = "caller_01", call_context: str = "VOIP_INCOMING") -> dict:
        """
        Executes the 4-Tier Zero-Trust Audio Pipeline on an incoming 500ms audio chunk.
        """
        start_time = time.perf_counter()

        # Ensure float32 normalized [-1.0, 1.0]
        if audio_data.dtype != np.float32 and audio_data.dtype != np.float64:
            if audio_data.dtype == np.int16:
                audio_data = audio_data.astype(np.float32) / 32768.0
            else:
                audio_data = audio_data.astype(np.float32)

        # ----------------------------------------------------
        # TIER 1: Fast Energy & Voice Activity Detection (VAD) Gate (< 2ms)
        # ----------------------------------------------------
        rms = float(np.sqrt(np.mean(np.square(audio_data))))
        if rms < 0.003:
            # Ambient silence or background pause
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "verdict": "ALLOW",
                "action": "SILENCE_PASSTHROUGH",
                "tier": "Tier 1 (VAD Gate)",
                "threat_score": 0.0,
                "confidence_pct": 99.0,
                "is_synthetic": False,
                "detected_vocoder": "AMBIENT_SILENCE",
                "humanity_index": 100.0,
                "latency_ms": duration_ms,
                "xai_explanation": "Ambient silence or conversational pause detected. Zero acoustic activity.",
                "metrics": {
                    "rms_energy": round(rms, 5),
                    "mean_f0_hz": 0.0,
                    "lmt_variance": 0.0,
                    "phase_anomaly": 0.0
                }
            }

        # ----------------------------------------------------
        # TIER 2: DSP LFCC, Phase Group Delay & Glottal IAIF (< 8ms)
        # ----------------------------------------------------
        dsp_descriptors = self.feature_extractor.compute_spectral_descriptors(audio_data)
        lfcc = self.feature_extractor.compute_lfcc(audio_data)
        phase_delay = self.feature_extractor.compute_phase_group_delay_anomaly(audio_data)
        glottal_res = self.glottal_analyzer.extract_glottal_flow(audio_data)

        # ----------------------------------------------------
        # TIER 3: AASIST / SincNet Neural Anti-Spoofing Model (< 20ms)
        # ----------------------------------------------------
        neural_res = self.neural_classifier.predict_spoof_probability(
            audio_data, lfcc, phase_delay, dsp_descriptors
        )

        # ----------------------------------------------------
        # TIER 4: Biological Laryngeal Micro-Tremor & Bayesian Decision (< 10ms)
        # ----------------------------------------------------
        lmt_res = self.lmt_analyzer.analyze_microtremor(audio_data)

        # Integrated Risk Score Calculation
        # P(fake) = 0.50 * Neural + 0.35 * (1 - Humanity_Norm) + 0.15 * Phase_Delay
        neural_prob = neural_res["deepfake_probability"]
        humanity_norm = lmt_res["humanity_score"] / 100.0
        phase_norm = min(1.0, phase_delay * 10.0)

        raw_threat_prob = (
            0.50 * neural_prob +
            0.35 * (1.0 - humanity_norm) +
            0.15 * phase_norm
        )

        threat_score = round(float(np.clip(raw_threat_prob * 100.0, 1.0, 99.9)), 1)

        # Rolling Bayesian Temporal Smoothing across chunks
        self.history_scores.append(threat_score)
        if len(self.history_scores) > self.max_history:
            self.history_scores.pop(0)

        smoothed_threat_score = round(float(np.mean(self.history_scores)), 1)

        # Decision Threshold: >= 65.0% Threat -> BLOCK / ALARM
        is_synthetic = smoothed_threat_score >= 65.0
        verdict = "BLOCK" if is_synthetic else "ALLOW"
        action = "INTERCEPT_SYNTHETIC_CLONE" if is_synthetic else "VERIFIED_GENUINE_SPEECH"

        if is_synthetic:
            tier_label = "Tier 4 (Bayesian Fusion & Biological Verification)"
        else:
            tier_label = "Tier 4 (Acoustic & Biometric Verified)"

        # Generate Explainable AI Attribution
        xai_explanation = self.xai_explainer.generate_explanation(
            dsp_descriptors, lmt_res, glottal_res, neural_res, smoothed_threat_score
        )

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return {
            "verdict": verdict,
            "action": action,
            "tier": tier_label,
            "threat_score": smoothed_threat_score,
            "confidence_pct": round(smoothed_threat_score if is_synthetic else (100.0 - smoothed_threat_score), 1),
            "is_synthetic": is_synthetic,
            "detected_vocoder": neural_res["detected_vocoder"],
            "humanity_index": lmt_res["humanity_score"],
            "lmt_active": lmt_res["lmt_active"],
            "latency_ms": duration_ms,
            "client_id": client_id,
            "call_context": call_context,
            "xai_explanation": xai_explanation,
            "metrics": {
                "rms_energy": dsp_descriptors["rms_energy"],
                "mean_f0_hz": lmt_res["mean_f0_hz"],
                "lmt_variance": lmt_res["lmt_variance"],
                "jitter_percent": lmt_res["jitter_percent"],
                "shimmer_percent": lmt_res["shimmer_percent"],
                "phase_anomaly": round(phase_delay, 4),
                "spectral_rolloff_hz": dsp_descriptors["spectral_rolloff_hz"],
                "glottal_verdict": glottal_res["glottal_verdict"]
            }
        }
