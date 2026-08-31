"""
TrueVoice RawBoost Data Augmentation Engine
Reference: Tak et al., "RawBoost: A Raw Data Boosting and Augmentation Method Applied to ASV Anti-Spoofing", ICASSP 2022.
Implements:
1. Linear and non-linear convolutive noise via FIR notch filtering & Hammerstein harmonic generation.
2. Impulsive signal-dependent additive noise (clipping / microphone non-linearities).
3. Stationary signal-independent coloured additive noise.
"""

import numpy as np
from scipy.signal import lfilter, firwin


class RawBoostEngine:
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate

    def apply_convolutive_noise(self, x: np.ndarray, num_notches: int = 4, max_order: int = 3) -> np.ndarray:
        """
        Algorithm 1: Linear and non-linear convolutive noise with Hammerstein harmonic expansion.
        Models transmission channel frequency responses and amplifier non-linearities.
        """
        n_samples = len(x)
        if n_samples < 64:
            return x

        # Design multi-band notch FIR filter
        nyquist = 0.5 * self.sample_rate
        # Generate random notch frequencies
        bands = np.sort(np.random.uniform(300, 7500, size=(num_notches, 2)))
        bands = np.clip(bands, 100, nyquist - 100)

        # Generate FIR filter
        num_taps = 31
        fir_coeff = np.zeros(num_taps)
        fir_coeff[num_taps // 2] = 1.0  # Delta function baseline

        for low, high in bands:
            if high > low + 50:
                pass_zero = True
                notch = firwin(num_taps, [low / nyquist, high / nyquist], pass_zero=pass_zero)
                fir_coeff = np.convolve(fir_coeff, notch, mode='same')

        fir_coeff = fir_coeff / (np.sum(np.abs(fir_coeff)) + 1e-12)

        # Apply 1st-order linear filter
        y_linear = lfilter(fir_coeff, [1.0], x)

        # Hammerstein non-linear expansion for higher harmonics (2f0, 3f0)
        y_total = y_linear.copy()
        for j in range(2, max_order + 1):
            gain_db = np.random.uniform(-18.0, -8.0)
            gain_lin = 10.0 ** (gain_db / 20.0)
            # Non-linear power expansion
            x_nonlinear = np.power(x, j)
            y_harmonic = lfilter(fir_coeff, [1.0], x_nonlinear) * gain_lin
            y_total += y_harmonic

        # Normalize to avoid overflow
        max_val = np.max(np.abs(y_total)) + 1e-12
        return (y_total / max_val * 0.9).astype(np.float32)

    def apply_impulsive_noise(self, x: np.ndarray, p_rel: float = 0.05, gain: float = 1.5) -> np.ndarray:
        """
        Algorithm 2: Impulsive signal-dependent additive noise.
        Models packet dropouts, microphone clipping, and quantization spikes.
        """
        n_samples = len(x)
        num_impulses = int(n_samples * p_rel)
        if num_impulses < 1:
            return x

        indices = np.random.choice(n_samples, size=num_impulses, replace=False)
        u = np.random.uniform(0.01, 1.0, size=num_impulses)
        signs = np.random.choice([-1.0, 1.0], size=num_impulses)
        # Logarithmic distribution: -log(r)
        noise_vals = -np.log(u) * signs

        y = x.copy()
        y[indices] += gain * noise_vals * x[indices]

        max_val = np.max(np.abs(y)) + 1e-12
        return (y / max_val * 0.9).astype(np.float32)

    def apply_stationary_coloured_noise(self, x: np.ndarray, snr_db: float = 20.0) -> np.ndarray:
        """
        Algorithm 3: Stationary signal-independent coloured additive noise.
        Models background telephony channel thermal noise.
        """
        n_samples = len(x)
        white_noise = np.random.normal(0, 1.0, n_samples)

        # Colour the noise with lowpass / bandpass FIR
        num_taps = 21
        fir_coeff = firwin(num_taps, 0.4)
        coloured_noise = lfilter(fir_coeff, [1.0], white_noise)

        # Scale according to SNR
        signal_power = np.mean(x ** 2) + 1e-12
        noise_power = np.mean(coloured_noise ** 2) + 1e-12
        target_noise_power = signal_power / (10.0 ** (snr_db / 10.0))
        scale = np.sqrt(target_noise_power / noise_power)

        y = x + scale * coloured_noise
        max_val = np.max(np.abs(y)) + 1e-12
        return (y / max_val * 0.9).astype(np.float32)

    def apply_telephony_codec_simulation(self, x: np.ndarray, codec: str = "OPUS", packet_loss_rate: float = 0.05) -> np.ndarray:
        """
        Simulates Real-World Telecommunication Degradations:
        Codecs: OPUS (Hybrid LPC+CELT), AMR-WB (ACELP), SILK (LPC), EVS, Speex, G.711 (A-law/u-law).
        Applies packet loss concealment (PLC) and bandpass limits.
        """
        n_samples = len(x)
        y = x.copy()

        # Bandwidth constraints per codec
        if codec == "AMR-WB" or codec == "Speex":
            # 50 Hz - 7000 Hz bandpass
            fir_coeff = firwin(31, [100 / 8000, 6800 / 8000], pass_zero=False)
            y = lfilter(fir_coeff, [1.0], y)
        elif codec == "G.711":
            # 300 Hz - 3400 Hz narrowband telephone PSTN
            fir_coeff = firwin(31, [300 / 8000, 3400 / 8000], pass_zero=False)
            y = lfilter(fir_coeff, [1.0], y)
            # 8-bit A-law compression simulation
            y = np.clip(y, -0.99, 0.99)
            y = np.round(y * 128.0) / 128.0
        elif codec == "OPUS":
            # Wideband Opus (high fidelity with subtle MDCT quantization)
            y = y + np.random.normal(0, 0.002, n_samples)
        elif codec == "EVS":
            # 3GPP Enhanced Voice Services ACELP mode
            fir_coeff = firwin(21, 0.85)
            y = lfilter(fir_coeff, [1.0], y)

        # Packet Loss Simulation with Packet Loss Concealment (PLC)
        if packet_loss_rate > 0.0:
            frame_len = 320  # 20ms frame at 16kHz
            num_frames = n_samples // frame_len
            for f in range(num_frames):
                if np.random.uniform(0, 1) < packet_loss_rate:
                    start = f * frame_len
                    end = start + frame_len
                    if f > 0:
                        # PLC: simple autoregressive repeat with 3dB energy decay
                        y[start:end] = y[start - frame_len : start] * 0.707
                    else:
                        y[start:end] = 0.0

        max_val = np.max(np.abs(y)) + 1e-12
        return (y / max_val * 0.9).astype(np.float32)
