"""
TrueVoice Core Pipeline Verification & Latency SLA Unit Tests
"""

import sys
import os
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from pipeline.voice_decision_engine import VoiceDecisionEngine
from models.synthetic_benchmarks import SyntheticAudioBenchmarkGenerator


def test_truevoice_pipeline():
    engine = VoiceDecisionEngine(sample_rate=16000)
    generator = SyntheticAudioBenchmarkGenerator(sample_rate=16000)

    print("--- 1. Testing Authentic Human Sample ---")
    human_audio = generator.generate_human_sample(duration_sec=0.5, base_f0=150.0)
    res_human = engine.process_audio_chunk(human_audio, client_id="test_human")
    print(f"Human Verdict: {res_human['verdict']} | Threat Score: {res_human['threat_score']}% | Latency: {res_human['latency_ms']}ms")
    print(f"XAI: {res_human['xai_explanation']}\n")

    assert res_human["verdict"] == "ALLOW", "Expected Human sample to be ALLOWED"
    assert res_human["latency_ms"] < 100.0, "Latency must be < 100ms"

    print("--- 2. Testing AI Cloned Speech Sample (HiFi-GAN) ---")
    clone_audio = generator.generate_cloned_sample(duration_sec=0.5, vocoder_type="HiFi-GAN")
    res_clone = engine.process_audio_chunk(clone_audio, client_id="test_clone")
    print(f"Clone Verdict: {res_clone['verdict']} | Threat Score: {res_clone['threat_score']}% | Latency: {res_clone['latency_ms']}ms")
    print(f"Detected Vocoder: {res_clone['detected_vocoder']}")
    print(f"XAI: {res_clone['xai_explanation']}\n")

    assert res_clone["verdict"] == "BLOCK", "Expected AI Clone sample to be BLOCKED"

    print("--- 3. Running 100-Sample Ground-Truth Benchmark ---")
    benchmark = generator.run_ground_truth_benchmark(engine)
    print(f"Total Evaluated: {benchmark['total_samples_evaluated']}")
    print(f"Accuracy: {benchmark['accuracy_pct']}%")
    print(f"ROC-AUC: {benchmark['roc_auc']}")
    print(f"Equal Error Rate (EER): {benchmark['equal_error_rate_eer_pct']}%")
    print(f"P90 Latency: {benchmark['latency']['p90_ms']}ms")
    print(f"SLA Compliant: {benchmark['latency']['sla_compliant_sub_100ms']}")

    assert benchmark["accuracy_pct"] >= 95.0, "Accuracy must be >= 95%"
    print("\n[SUCCESS] All TrueVoice pipeline unit tests passed successfully!")


if __name__ == "__main__":
    test_truevoice_pipeline()
