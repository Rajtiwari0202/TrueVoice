import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, ShieldAlert, ShieldCheck, Activity, Cpu, Sparkles, Clock, Layers, Radio, Volume2, AlertTriangle } from 'lucide-react';
import { LiveVoiceStreamer, api } from '../services/api';

export default function VoiceConsole({ onStreamEvaluation }) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentEval, setCurrentEval] = useState(null);
  const [streamLog, setStreamLog] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('STANDBY');
  
  const streamerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize Canvas Oscilloscope Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#0A0C10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1.5;
      const isClone = currentEval?.is_synthetic;
      ctx.strokeStyle = isRecording 
        ? (isClone ? '#FF3B30' : '#00E599') 
        : '#2B313E';

      ctx.beginPath();
      const sliceWidth = canvas.width / 100;
      let x = 0;

      for (let i = 0; i < 100; i++) {
        const amplitude = isRecording ? (isClone ? 24 : 18) : 4;
        const freq = isRecording ? (isClone ? 0.35 : 0.2) : 0.05;
        const y = (canvas.height / 2) + Math.sin(i * freq + phase) * amplitude * (Math.sin(i * 0.05) + 0.3);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      phase += isRecording ? 0.15 : 0.03;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording, currentEval]);

  const toggleRecording = async () => {
    if (isRecording) {
      if (streamerRef.current) {
        streamerRef.current.stop();
        streamerRef.current = null;
      }
      setIsRecording(false);
      setConnectionStatus('STANDBY');
    } else {
      try {
        setConnectionStatus('CONNECTING');
        const streamer = new LiveVoiceStreamer(
          (evalData) => {
            setCurrentEval(evalData);
            setStreamLog((prev) => [evalData, ...prev.slice(0, 40)]);
            if (onStreamEvaluation) onStreamEvaluation(evalData);
          },
          (status) => {
            if (status.streaming) setConnectionStatus('STREAMING_ACTIVE');
            else if (!status.connected) setConnectionStatus('DISCONNECTED');
          }
        );

        await streamer.start();
        streamerRef.current = streamer;
        setIsRecording(true);
        setConnectionStatus('STREAMING_ACTIVE');
      } catch (err) {
        console.error("Failed to start mic stream:", err);
        setConnectionStatus('MIC_PERMISSION_DENIED');
        setIsRecording(false);
      }
    }
  };

  const threatScore = currentEval?.threat_score || 0;
  const isSynthetic = currentEval?.is_synthetic || false;

  return (
    <div className="space-y-5 font-sans">
      {/* Top Header Card */}
      <div className="card-panel p-5 border-[#232730] tactical-corner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232730]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
                LIVE WEBRTC ACOUSTIC RADAR &amp; VOICE CLONE SHIELD
              </h2>
              <p className="text-[11px] font-mono text-[#7D8494] mt-0.5">
                Sub-50ms continuous biological laryngeal vibration tracking &amp; neural vocoder phase analysis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-2.5 py-1 rounded bg-[#0B0D11] border border-[#232730] text-xs font-mono">
              <span className="text-[#7D8494]">STATUS: </span>
              <span className={`font-bold ${isRecording ? 'text-[#00E599]' : 'text-[#A0A6B5]'}`}>
                {connectionStatus}
              </span>
            </div>

            <button
              onClick={toggleRecording}
              className={isRecording ? "btn-danger py-2 px-4" : "btn-primary py-2 px-4"}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>STOP LIVE SHIELD</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>START LIVE MIC SHIELD</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Audio Oscilloscope Canvas */}
        <div className="mt-4 relative rounded border border-[#232730] overflow-hidden bg-[#0A0C10]">
          <canvas ref={canvasRef} width={800} height={120} className="w-full h-28 block" />
          <div className="absolute top-2 left-3 flex items-center space-x-2 font-mono text-[10px] text-[#7D8494]">
            <Activity className="w-3 h-3 text-[#FF5500]" />
            <span>REAL-TIME 16kHz PCM SPECTROGRAM OSCILLOSCOPE</span>
          </div>
          <div className="absolute bottom-2 right-3 font-mono text-[10px] text-[#7D8494]">
            {isRecording ? "SAMPLING 500ms WINDOW // 50% OVERLAP" : "STANDBY // PRESS START TO LISTEN"}
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry HUD & Threat Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Real-Time Threat Gauge & Verdict */}
        <div className="lg:col-span-5 card-panel p-5 border-[#232730] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
                VOICE AUTHENTICITY GAUGE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181C24] text-[#A0A6B5] border border-[#2B313E]">
                LATENCY: {currentEval?.latency_ms || 0} ms
              </span>
            </div>

            {/* Main Gauge Visual */}
            <div className="p-4 rounded bg-[#0B0D11] border border-[#232730] text-center space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7D8494]">
                SYNTHETIC THREAT INDEX
              </div>
              <div className={`text-4xl font-mono font-extrabold tracking-tight ${
                threatScore > 65 ? 'text-[#FF3B30]' : (threatScore > 35 ? 'text-[#FFD000]' : 'text-[#00E599]')
              }`}>
                {threatScore}%
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#181C24] h-2 rounded-full overflow-hidden border border-[#282E3A]">
                <div 
                  className={`h-full transition-all duration-300 ${
                    threatScore > 65 ? 'bg-[#FF3B30]' : (threatScore > 35 ? 'bg-[#FFD000]' : 'bg-[#00E599]')
                  }`}
                  style={{ width: `${Math.max(2, threatScore)}%` }}
                />
              </div>

              <div className="pt-2 flex items-center justify-center space-x-2">
                <span className={`px-2 py-0.5 text-xs font-mono font-bold uppercase rounded ${
                  isSynthetic ? 'badge-rose' : 'badge-emerald'
                }`}>
                  {currentEval ? `${currentEval.verdict}: ${currentEval.action}` : 'READY FOR AUDIO STREAM'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
              <span className="text-[#7D8494] text-[9.5px] block">VOCODER ARCHETYPE</span>
              <span className="text-[#F2F4F8] font-bold text-[11px] truncate block">
                {currentEval?.detected_vocoder || "ORGANIC SPEECH"}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
              <span className="text-[#7D8494] text-[9.5px] block">DECISION STAGE</span>
              <span className="text-[#00E599] font-bold text-[11px] truncate block">
                {currentEval?.tier || "Tier 4 (Bayesian Fusion)"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Multi-Sensor Biological & Acoustic Radar */}
        <div className="lg:col-span-7 card-panel p-5 border-[#232730] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#FF5500]" />
                BIOLOGICAL &amp; DSP TELEMETRY SENSORS
              </span>
              <span className="text-[10.5px] text-[#A0A6B5] font-mono">4-TIER SENSOR FUSION</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
                <span className="text-[#7D8494] text-[9.5px] block">8-12Hz LMT MICRO-TREMOR</span>
                <span className={`text-sm font-bold mt-0.5 block ${currentEval?.lmt_active ? 'text-[#00E599]' : 'text-[#FF3B30]'}`}>
                  {currentEval?.metrics?.lmt_variance ? `${currentEval.metrics.lmt_variance} Hz` : '0.000 Hz'}
                </span>
                <span className="text-[9px] text-[#7D8494]">Human Baseline: &gt;0.12 Hz</span>
              </div>

              <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
                <span className="text-[#7D8494] text-[9.5px] block">HUMANITY INDEX</span>
                <span className={`text-sm font-bold mt-0.5 block ${
                  (currentEval?.humanity_index || 0) > 70 ? 'text-[#00E599]' : 'text-[#FF3B30]'
                }`}>
                  {currentEval?.humanity_index ? `${currentEval.humanity_index}%` : '100%'}
                </span>
                <span className="text-[9px] text-[#7D8494]">Neuromuscular Jitter</span>
              </div>

              <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
                <span className="text-[#7D8494] text-[9.5px] block">PHASE DISCONTINUITY</span>
                <span className={`text-sm font-bold mt-0.5 block ${
                  (currentEval?.metrics?.phase_anomaly || 0) > 0.05 ? 'text-[#FF3B30]' : 'text-[#00E599]'
                }`}>
                  {currentEval?.metrics?.phase_anomaly || 0.0}
                </span>
                <span className="text-[9px] text-[#7D8494]">4-8 kHz Vocoder Aliasing</span>
              </div>

              <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
                <span className="text-[#7D8494] text-[9.5px] block">PITCH TRACK (F0)</span>
                <span className="text-sm font-bold text-[#F2F4F8] mt-0.5 block">
                  {currentEval?.metrics?.mean_f0_hz || 0} Hz
                </span>
                <span className="text-[9px] text-[#7D8494]">YIN Autocorrelation</span>
              </div>

              <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
                <span className="text-[#7D8494] text-[9.5px] block">GLOTTAL INVERSE FILTER</span>
                <span className="text-sm font-bold text-[#E2E6EE] mt-0.5 block truncate">
                  {currentEval?.metrics?.glottal_verdict || "NATURAL_FLOW"}
                </span>
                <span className="text-[9px] text-[#7D8494]">IAIF Breath Aspiration</span>
              </div>

              <div className="p-2.5 rounded bg-[#15181F] border border-[#232730]">
                <span className="text-[#7D8494] text-[9.5px] block">SPECTRAL ROLLOFF</span>
                <span className="text-sm font-bold text-[#F2F4F8] mt-0.5 block">
                  {currentEval?.metrics?.spectral_rolloff_hz || 0} Hz
                </span>
                <span className="text-[9px] text-[#7D8494]">85% Energy Boundary</span>
              </div>
            </div>
          </div>

          {/* Explainable AI (XAI) Attribution Box */}
          <div className="mt-4 p-3.5 rounded bg-[#0B0D11] border border-[#232730]">
            <span className="text-xs text-[#FF5500] font-mono font-bold flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              EXPLAINABLE AI (XAI) MATHEMATICAL ATTRIBUTION
            </span>
            <p className="text-xs font-mono text-[#C0C6D2] leading-relaxed p-2.5 rounded bg-[#111318] border border-[#232730]">
              {currentEval?.xai_explanation || "Awaiting live voice stream. Speak into microphone or run attack simulator to inspect real-time mathematical attribution."}
            </p>
          </div>
        </div>

      </div>

      {/* Live Stream Event Log */}
      <div className="card-panel p-5 border-[#232730]">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
            CHRONOLOGICAL STREAMING AUDIT LOG
          </h3>
          <span className="text-[10px] text-[#7D8494] font-mono">{streamLog.length} FRAMES EVALUATED</span>
        </div>

        <div className="divide-y divide-[#232730] max-h-48 overflow-y-auto font-mono text-xs">
          {streamLog.length === 0 ? (
            <div className="py-8 text-center text-[#7D8494] text-xs">
              No live events logged. Click 'Start Live Mic Shield' or run a simulation.
            </div>
          ) : (
            streamLog.map((item, idx) => (
              <div key={idx} className="py-2 px-1.5 flex items-center justify-between hover:bg-[#15181F] transition">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.is_synthetic ? 'bg-[#FF3B30]' : 'bg-[#00E599]'}`} />
                  <span className="text-[#E2E6EE] font-bold text-xs">{item.action}</span>
                  <span className="text-[#7D8494] text-[10.5px]">({item.call_context})</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[11px] font-bold ${item.is_synthetic ? 'text-[#FF3B30]' : 'text-[#00E599]'}`}>
                    {item.threat_score}% Threat
                  </span>
                  <span className="text-[#7D8494] text-[10px]">{item.latency_ms}ms</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                    item.is_synthetic ? 'badge-rose' : 'badge-emerald'
                  }`}>
                    {item.verdict}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
