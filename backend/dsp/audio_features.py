"""
TrueVoice Audio DSP Feature Extractor
Module: Linear Frequency Cepstral Coefficients (LFCC), IMFCC, Phase Group Delay & Spectral Descriptors.
Engineered for Sub-10ms Acoustic Ingestion on 16kHz PCM Audio Streams.
"""

import numpy as np
from scipy.fftpack import dct
from scipy.signal import spectrogram, lfilter


class AudioFeatureExtractor:
    def __init__(self, sample_rate: int = 16000, n_fft: int = 512, hop_length: int = 160, num_lfcc: int = 20):
        self.sample_rate = sample_rate
        self.n_fft = n_fft
        self.hop_length = hop_length
        self.num_lfcc = num_lfcc
        self.linear_filterbank = self._build_linear_filterbank(num_filters=40)
        self.inverted_mel_filterbank = self._build_inverted_mel_filterbank(num_filters=40)

    def _build_linear_filterbank(self, num_filters: int = 40) -> np.ndarray:
        """Constructs linearly spaced triangular filterbanks across 0 to Nyquist (8 kHz)."""
        fft_bins = self.n_fft // 2 + 1
        filterbank = np.zeros((num_filters, fft_bins))
        linear_points = np.linspace(0, fft_bins - 1, num_filters + 2).astype(int)

        for i in range(num_filters):
            start, center, end = linear_points[i], linear_points[i + 1], linear_points[i + 2]
            if center > start:
                filterbank[i, start:center] = (np.arange(start, center) - start) / (center - start)
            if end > center:
                filterbank[i, center:end] = (end - np.arange(center, end)) / (end - center)

        return filterbank

    def _build_inverted_mel_filterbank(self, num_filters: int = 40) -> np.ndarray:
        """Constructs Inverted Mel filterbanks to emphasize high-frequency synthetic artifacts."""
        fft_bins = self.n_fft // 2 + 1
        filterbank = np.zeros((num_filters, fft_bins))
        # High resolution in high frequencies, low resolution in low frequencies
        inverted_indices = np.geomspace(1, fft_bins, num_filters + 2)
        inverted_indices = (fft_bins + 1) - inverted_indices
        inverted_indices = np.sort(np.clip(inverted_indices, 0, fft_bins - 1).astype(int))

        for i in range(num_filters):
            start, center, end = inverted_indices[i], inverted_indices[i + 1], inverted_indices[i + 2]
            if center > start:
                filterbank[i, start:center] = (np.arange(start, center) - start) / (center - start + 1e-6)
            if end > center:
                filterbank[i, center:end] = (end - np.arange(center, end)) / (end - center + 1e-6)

        return filterbank

    def compute_lfcc(self, audio: np.ndarray) -> np.ndarray:
        """Computes Linear Frequency Cepstral Coefficients (LFCC) - Gold Standard for Neural Vocoder Detection."""
        if len(audio) < self.n_fft:
            audio = np.pad(audio, (0, self.n_fft - len(audio)))

        # STFT
        _, _, stft_matrix = spectrogram(audio, fs=self.sample_rate, nperseg=self.n_fft, noverlap=self.n_fft - self.hop_length, mode='magnitude')
        power_spectrum = np.square(stft_matrix)

        # Apply Linear Filterbank
        filterbank_energy = np.dot(self.linear_filterbank, power_spectrum)
        filterbank_energy = np.maximum(filterbank_energy, 1e-12)
        log_energy = np.log(filterbank_energy)

        # Discrete Cosine Transform (DCT-II)
        lfcc = dct(log_energy, type=2, axis=0, norm='ortho')[:self.num_lfcc, :]
        return lfcc

    def compute_phase_group_delay_anomaly(self, audio: np.ndarray) -> float:
        """
        Detects phase discontinuity & vocoder group delay jitter.
        Synthesized vocoders (HiFi-GAN, WaveNet) produce unnatural phase shifts in 4-8 kHz band.
        """
        if len(audio) < self.n_fft:
            return 0.0

        # Compute STFT with complex values
        num_frames = (len(audio) - self.n_fft) // self.hop_length + 1
        if num_frames < 1:
            return 0.0

        window = np.hanning(self.n_fft)
        phase_discontinuities = []

        for i in range(min(num_frames, 10)):
            frame = audio[i * self.hop_length : i * self.hop_length + self.n_fft] * window
            fft_complex = np.fft.rfft(frame)
            phase = np.angle(fft_complex)
            # High-frequency band (top 50% bins)
            hf_phase = phase[len(phase)//2 :]
            # Phase second derivative (group delay variation)
            d2_phase = np.diff(np.diff(hf_phase))
            phase_discontinuities.append(np.var(d2_phase))

        return float(np.mean(phase_discontinuities)) if phase_discontinuities else 0.0

    def compute_spectral_descriptors(self, audio: np.ndarray) -> dict:
        """Extracts high-level acoustic descriptors (Spectral Centroid, Rolloff, Flux, Zero-Crossing Rate)."""
        if len(audio) < self.n_fft:
            audio = np.pad(audio, (0, self.n_fft - len(audio)))

        # Zero Crossing Rate
        zcr = float(np.mean(np.abs(np.diff(np.sign(audio)))) / 2.0)

        # RMS Energy
        rms = float(np.sqrt(np.mean(np.square(audio))))

        # Magnitude Spectrum
        fft_mag = np.abs(np.fft.rfft(audio * np.hanning(len(audio))))
        freqs = np.fft.rfftfreq(len(audio), 1.0 / self.sample_rate)

        # Spectral Centroid
        sum_mag = np.sum(fft_mag) + 1e-12
        centroid = float(np.sum(freqs * fft_mag) / sum_mag)

        # Spectral Rolloff (85% energy point)
        cum_energy = np.cumsum(fft_mag)
        rolloff_idx = np.searchsorted(cum_energy, 0.85 * cum_energy[-1])
        rolloff = float(freqs[min(rolloff_idx, len(freqs) - 1)])

        # High Frequency Energy Ratio (4 kHz to 8 kHz vs Total)
        hf_mask = freqs >= 4000
        hf_energy_ratio = float(np.sum(fft_mag[hf_mask] ** 2) / (np.sum(fft_mag ** 2) + 1e-12))

        return {
            "rms_energy": round(rms, 5),
            "zero_crossing_rate": round(zcr, 4),
            "spectral_centroid_hz": round(centroid, 1),
            "spectral_rolloff_hz": round(rolloff, 1),
            "hf_energy_ratio_4k_8k": round(hf_energy_ratio, 4)
        }
