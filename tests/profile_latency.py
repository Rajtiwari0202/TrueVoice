import sys
import os
import time
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from dsp.audio_features import AudioFeatureExtractor
from dsp.laryngeal_microtremor import LaryngealMicrotremorAnalyzer
from dsp.glottal_analyzer import GlottalFlowAnalyzer
from models.aasist_classifier import AASISTDeepfakeClassifier

sample_rate = 16000
audio = np.random.normal(0, 0.2, 8000).astype(np.float32)

feat = AudioFeatureExtractor(sample_rate=sample_rate)
lmt = LaryngealMicrotremorAnalyzer(sample_rate=sample_rate)
glottal = GlottalFlowAnalyzer(sample_rate=sample_rate)
model = AASISTDeepfakeClassifier(sample_rate=sample_rate)

for step, fn in [
    ("Spectral Descriptors", lambda: feat.compute_spectral_descriptors(audio)),
    ("LFCC", lambda: feat.compute_lfcc(audio)),
    ("Phase Group Delay", lambda: feat.compute_phase_group_delay_anomaly(audio)),
    ("LMT Pitch & Tremor", lambda: lmt.analyze_microtremor(audio)),
    ("Glottal IAIF", lambda: glottal.extract_glottal_flow(audio)),
]:
    t0 = time.perf_counter()
    fn()
    t1 = time.perf_counter()
    print(f"{step}: {(t1 - t0)*1000:.2f} ms")
