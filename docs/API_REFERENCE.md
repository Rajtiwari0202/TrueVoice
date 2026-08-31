# 📡 TrueVoice API Reference

## Base URLs
* **REST API:** `http://localhost:8000`
* **WebSocket Stream:** `ws://localhost:8000/ws/voice-stream`

---

## 1. System Health & Telemetry
`GET /api/voice/health`

### Response:
```json
{
  "status": "ONLINE",
  "service": "TrueVoice Real-Time Audio Defense Engine",
  "version": "2.0.0",
  "sample_rate_hz": 16000,
  "models_active": [
    "AASIST (Spectro-Temporal Graph Attention)",
    "SincNet Parametric Time-Domain Filterbanks",
    "LFCC Linear Frequency Cepstral Analyzer",
    "YIN Laryngeal Micro-Tremor (8-12Hz Bandpass)"
  ],
  "hardware_acceleration": "CPU (Quantized INT8/FP16 SIMD)",
  "telemetry": {
    "total_chunks_processed": 104,
    "clones_intercepted": 52,
    "human_verified_chunks": 52,
    "clone_intercept_rate_pct": 50.0,
    "active_streams": 1
  }
}
```

---

## 2. Ground-Truth Benchmark Evaluation
`GET /api/voice/benchmark-stats`

### Response:
```json
{
  "total_samples_evaluated": 100,
  "human_samples": 50,
  "synthetic_clone_samples": 50,
  "accuracy_pct": 95.0,
  "precision_pct": 94.2,
  "recall_pct": 96.0,
  "f1_score_pct": 95.1,
  "roc_auc": 0.992,
  "equal_error_rate_eer_pct": 1.15,
  "latency": {
    "avg_ms": 18.5,
    "p50_ms": 14.2,
    "p90_ms": 32.0,
    "p99_ms": 48.1,
    "sla_compliant_sub_100ms": true
  }
}
```

---

## 3. Real-Time Telephony Call Simulation
`POST /api/voice/simulate-call`

### Request Body:
```json
{
  "scenario_type": "DIGITAL_ARREST_SCAM",
  "caller_claimed_identity": "CBI Inspector Rajesh Sharma",
  "caller_phone": "+91 98112 34567",
  "target_action": "Emergency Escrow Transfer (₹15,00,000)"
}
```

### Response:
```json
{
  "voice_evaluation": {
    "verdict": "BLOCK",
    "action": "INTERCEPT_SYNTHETIC_CLONE",
    "threat_score": 80.6,
    "is_synthetic": true,
    "detected_vocoder": "HiFi-GAN / BigVGAN (Neural Vocoder)",
    "humanity_index": 2.0,
    "latency_ms": 6.86,
    "xai_explanation": "AI SYNTHETIC VOICE CLONE DETECTED [Threat Score: 80.6%]. Absence of physiological 8-12Hz laryngeal micro-tremors..."
  },
  "automated_defense_action": {
    "status": "CALL_FLAGGED_SYNTHETIC",
    "action_taken": "IMMEDIATE_TRANSACTION_FREEZE",
    "risk_level": "CRITICAL"
  }
}
```

---

## 4. WebSocket Audio Streaming
`WS /ws/voice-stream`

### Handshake:
Send 500ms 16kHz Float32 PCM audio chunks in base64 format:
```json
{
  "type": "AUDIO_CHUNK",
  "audio_b64": "..."
}
```

### Stream Event:
```json
{
  "type": "EVALUATION_EVENT",
  "data": {
    "verdict": "ALLOW",
    "threat_score": 5.9,
    "latency_ms": 14.2,
    "humanity_index": 99.5
  },
  "timestamp": 1787123984.21
}
```
