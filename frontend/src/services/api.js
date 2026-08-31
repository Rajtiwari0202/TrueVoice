/**
 * TrueVoice Frontend API & Real-Time Audio Streaming Client
 */

const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8000';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/api/voice/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getBenchmarkStats() {
    const res = await fetch(`${API_BASE}/api/voice/benchmark-stats`);
    if (!res.ok) throw new Error('Benchmark stats failed');
    return res.json();
  },

  async simulateCall(scenario) {
    const res = await fetch(`${API_BASE}/api/voice/simulate-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario)
    });
    if (!res.ok) throw new Error('Call simulation failed');
    return res.json();
  },

  async analyzeChunk(audioB64, clientId = "web_caller", callContext = "LIVE_MIC_STREAM") {
    const res = await fetch(`${API_BASE}/api/voice/analyze-chunk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio_b64: audioB64,
        client_id: clientId,
        call_context: callContext
      })
    });
    if (!res.ok) throw new Error('Chunk analysis failed');
    return res.json();
  },

  async analyzeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/voice/analyze-file`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Forensic file analysis failed');
    return res.json();
  }
};

/**
 * Captures live microphone audio using Web Audio API, downsamples to 16kHz Float32 PCM,
 * and streams 500ms chunks with sub-50ms latency.
 */
export class LiveVoiceStreamer {
  constructor(onEvaluation, onStatusChange) {
    this.onEvaluation = onEvaluation;
    this.onStatusChange = onStatusChange;
    this.audioContext = null;
    this.mediaStream = null;
    this.isStreaming = false;
    this.buffer = [];
    this.targetSampleRate = 16000;
    this.isProcessingChunk = false;
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.isStreaming = true;

      if (this.onStatusChange) this.onStatusChange({ connected: true, streaming: true });

      processor.onaudioprocess = async (e) => {
        if (!this.isStreaming) return;
        const inputData = e.inputBuffer.getChannelData(0);
        
        const downsampled = this._downsampleBuffer(inputData, this.audioContext.sampleRate, this.targetSampleRate);
        for (let i = 0; i < downsampled.length; i++) {
          this.buffer.push(downsampled[i]);
        }

        const CHUNK_SIZE = 8000; // 500ms at 16kHz
        if (this.buffer.length >= CHUNK_SIZE && !this.isProcessingChunk) {
          this.isProcessingChunk = true;
          const chunk = new Float32Array(this.buffer.slice(0, CHUNK_SIZE));
          this.buffer = this.buffer.slice(4000); // 50% overlap

          const uint8 = new Uint8Array(chunk.buffer);
          let binary = '';
          const len = uint8.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const b64 = btoa(binary);

          try {
            const evalResult = await api.analyzeChunk(b64, "live_microphone", "LIVE_CALL_WEBRTC");
            if (this.onEvaluation && this.isStreaming) {
              this.onEvaluation(evalResult);
            }
          } catch (err) {
            console.error("Chunk transmission error:", err);
          } finally {
            this.isProcessingChunk = false;
          }
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);

    } catch (err) {
      console.error("Microphone capture error:", err);
      if (this.onStatusChange) this.onStatusChange({ connected: false, streaming: false, error: err.message });
      throw err;
    }
  }

  stop() {
    this.isStreaming = false;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.onStatusChange) this.onStatusChange({ connected: false, streaming: false });
  }

  _downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) return buffer;
    if (outSampleRate > sampleRate) return buffer;
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }
}
