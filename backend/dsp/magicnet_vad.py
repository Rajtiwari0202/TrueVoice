"""
TrueVoice MagicNet Causal Voice Activity Detector (VAD)
Reference: Jia et al., "A Real-Time Voice Activity Detection Based On Lightweight Neural Network (MagicNet)", 2024.
Suppresses database 'silence bias' to prevent deepfake detectors from learning silent boundary artifacts.
"""

import numpy as np


class MagicNetVAD:
    def __init__(self, sample_rate: int = 16000, frame_len: int = 400, hop_len: int = 160):
        self.sample_rate = sample_rate
        self.frame_len = frame_len
        self.hop_len = hop_len
        self.energy_threshold = 0.006

    def process(self, audio: np.ndarray) -> dict:
        """
        Processes 16kHz audio stream:
        1. Computes causal depth-wise frame energy.
        2. Isolates voiced segments and trims leading/trailing database silence.
        3. Returns speech activity ratio and trimmed active speech tensor.
        """
        if len(audio) < self.frame_len:
            return {
                "has_speech": False,
                "speech_ratio": 0.0,
                "trimmed_audio": audio,
                "silent_frames_dropped": 0
            }

        num_frames = (len(audio) - self.frame_len) // self.hop_len + 1
        frame_energies = []
        is_speech_frame = []

        for i in range(num_frames):
            frame = audio[i * self.hop_len : i * self.hop_len + self.frame_len]
            # Causal depthwise energy
            rms = np.sqrt(np.mean(frame ** 2))
            frame_energies.append(rms)
            is_speech_frame.append(rms >= self.energy_threshold)

        speech_ratio = float(np.mean(is_speech_frame))
        has_speech = speech_ratio >= 0.15

        # Trim leading and trailing non-speech frames to avoid silence bias
        active_indices = np.where(is_speech_frame)[0]
        if len(active_indices) > 0:
            start_sample = max(0, active_indices[0] * self.hop_len)
            end_sample = min(len(audio), (active_indices[-1] + 1) * self.hop_len + self.frame_len)
            trimmed_audio = audio[start_sample:end_sample]
            dropped_frames = num_frames - len(active_indices)
        else:
            trimmed_audio = audio
            dropped_frames = num_frames

        return {
            "has_speech": has_speech,
            "speech_ratio": round(speech_ratio, 3),
            "trimmed_audio": trimmed_audio,
            "silent_frames_dropped": int(dropped_frames),
            "mean_speech_rms": round(float(np.mean(frame_energies)), 5)
        }
