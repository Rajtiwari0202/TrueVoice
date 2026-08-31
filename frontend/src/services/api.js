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
 * and streams 500ms chunks via WebSocket.
 */
export class LiveVoiceStreamer {
  constructor(onEvaluation, onStatusChange) {
    this.onEvaluation = onEvaluation;
    this.onStatusChange = onStatusChange;
    this.audioContext = null;
    this.mediaStream = null;
    this.socket = null;
    this.isStreaming = false;
    this.buffer = [];
    this.targetSampleRate = 16000;
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // ScriptProcessor for real-time PCM chunk extraction
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      // Connect WebSocket
      this.socket = new WebSocket(`${WS_BASE}/ws/voice-stream`);
      
      this.socket.onopen = () => {
        this.isStreaming = true;
        if (this.onStatusChange) this.onStatusChange({ connected: true, streaming: true });
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'EVALUATION_EVENT' && this.onEvaluation) {
            this.onEvaluation(payload.data);
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };

      this.socket.onclose = () => {
        this.isStreaming = false;
        if (this.onStatusChange) this.onStatusChange({ connected: false, streaming: false });
      };

      processor.onaudioprocess = (e) => {
        if (!this.isStreaming || this.socket?.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Downsample input to 16kHz
        const downsampled = this._downsampleBuffer(inputData, this.audioContext.sampleRate, this.targetSampleRate);
        for (let i = 0; i < downsampled.length; i++) {
          this.buffer.push(downsampled[i]);
        }

        // When buffer reaches 500ms (8000 samples at 16kHz)
        const CHUNK_SIZE = 8000;
        if (this.buffer.length >= CHUNK_SIZE) {
          const chunk = new Float32Array(this.buffer.slice(0, CHUNK_SIZE));
          // Slide forward with 50% overlap (4000 samples)
          this.buffer = this.buffer.slice(4000);

          // Convert Float32Array to Base64
          const uint8 = new Uint8Array(chunk.buffer);
          let binary = '';
          const len = uint8.byteLength;
          for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const b64 = btoa(binary);

          this.socket.send(JSON.stringify({
            type: 'AUDIO_CHUNK',
            audio_b64: b64
          }));
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
    if (this.socket) {
      this.socket.close();
    }
    if (this.onStatusChange) this.onStatusChange({ connected: false, streaming: false });
  }

  _downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      return buffer;
    }
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
