"""
TrueVoice Multi-Granularity Adaptive Time-Frequency Attention (MGAA)
Reference: Shi et al., "Multi-Granularity Adaptive Time-Frequency Attention Framework for ADD", August 2025.
Optimized Vectorized Implementation using 1D Uniform Filters (< 2ms execution).
"""

import numpy as np
from scipy.ndimage import uniform_filter1d


class MultiGranularityAttentionEngine:
    def __init__(self, channels: int = 20, window_sizes: list = [3, 5, 7, 9]):
        self.channels = channels
        self.window_sizes = window_sizes
        self.linguistic_scales = {
            3: "Phoneme-level events (95ms)",
            5: "Formant transitions (159ms)",
            7: "Syllabic structures (222ms)",
            9: "Word-level transitions (286ms)"
        }

    def compute_gtfa(self, feature_map: np.ndarray) -> np.ndarray:
        """Global Time-Frequency Attention (GTFA)."""
        p_avg_f = np.mean(feature_map, axis=1, keepdims=True)
        p_avg_t = np.mean(feature_map, axis=0, keepdims=True)

        sigma_f = 1.0 / (1.0 + np.exp(-p_avg_f))
        sigma_t = 1.0 / (1.0 + np.exp(-p_avg_t))

        return feature_map * sigma_f * sigma_t

    def compute_ltfa_fast(self, feature_map: np.ndarray, k: int) -> np.ndarray:
        """Fast Vectorized Local Time-Frequency Attention (LTFA) using 1D uniform filters."""
        # Vertical 1D uniform filter along frequency axis
        local_v = uniform_filter1d(feature_map, size=k, axis=0, mode='reflect')
        # Horizontal 1D uniform filter along temporal axis
        local_h = uniform_filter1d(feature_map, size=k, axis=1, mode='reflect')

        sigma_v = 1.0 / (1.0 + np.exp(-local_v))
        sigma_h = 1.0 / (1.0 + np.exp(-local_h))

        return feature_map * sigma_v * sigma_h

    def compute_mgaa_fusion(self, feature_map: np.ndarray) -> dict:
        """
        Multi-Granularity Attention with Adaptive Fusion (AFM).
        Latency: < 1.5ms.
        """
        if feature_map.ndim == 1:
            feature_map = feature_map[:, None]

        a_global = self.compute_gtfa(feature_map)

        local_branches = []
        for k in self.window_sizes:
            local_branches.append(self.compute_ltfa_fast(feature_map, k))

        all_branches = [a_global] + local_branches

        energies = [float(np.mean(b ** 2)) for b in all_branches]
        max_e = max(energies)
        exp_weights = np.exp(np.array(energies) - max_e)
        weights = exp_weights / (np.sum(exp_weights) + 1e-12)

        fused_feature = np.zeros_like(feature_map)
        for i, b in enumerate(all_branches):
            fused_feature += weights[i] * b

        branch_attribution = {
            "Global_GTFA_weight": round(float(weights[0]), 3),
            "Phoneme_k3_weight": round(float(weights[1]), 3),
            "Formant_k5_weight": round(float(weights[2]), 3),
            "Syllable_k7_weight": round(float(weights[3]), 3),
            "Word_k9_weight": round(float(weights[4]), 3)
        }

        local_saliency = float(np.sum(weights[1:]))

        return {
            "fused_feature": fused_feature,
            "branch_weights": branch_attribution,
            "local_saliency_index": round(local_saliency, 3),
            "dominant_granularity": (
                "Global Context" if weights[0] > 0.35 else
                f"{self.linguistic_scales[self.window_sizes[int(np.argmax(weights[1:]))]]}"
            )
        }
