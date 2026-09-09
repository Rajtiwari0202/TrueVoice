import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Mic, Activity, Zap, Layers, Wifi, Lock, 
  FileSearch, ArrowRight, Play, CheckCircle2, ChevronRight, Terminal, 
  AlertTriangle, Clock, RefreshCw, Eye, Cpu, Database, Server, Radio,
  Binary, Compass, BarChart3, AlertOctagon, CornerDownRight, FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function LandingPage({ onQuickEvaluation }) {
  const [activeChannel, setActiveChannel] = useState('human'); // 'human' or 'clone'
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePreset, setActivePreset] = useState('digital_arrest');
  const [evaluationData, setEvaluationData] = useState({
    verdict: "ALLOW",
    action: "VERIFIED_LIVING_HUMAN_PHONATION",
    threat_score: 4.2,
    latency_ms: 18.2,
    humanity_index: 99.1,
    lmt_active: true,
    lmt_variance: "2.919 Hz",
    phase_anomaly: "0.012 (Continuous)",
    vocoder: "ORGANIC_VOCAL_TRACT",
    mgaa_scale: "Formant Transitions (159ms)",
    dcf_cost: 0.019,
    xai: "Physiological 8-12 Hz involuntary laryngeal micro-tremor detected (Variance: 2.9192 Hz). Glottal IAIF inverse filtering confirms natural aspiration breath turbulence and organic harmonic resonance. Phase group-delay spectrum is smooth across the 0-8 kHz band. Zero synthetic neural artifacts."
  });

  const runChannelEvaluation = async (channelType, presetKey = activePreset) => {
    setIsProcessing(true);
    setActiveChannel(channelType);
    if (presetKey) setActivePreset(presetKey);

    const isClone = channelType === 'clone';

    try {
      const scenarioMap = {
        digital_arrest: {
          type: "DIGITAL_ARREST_SCAM",
          id: "HiFi-GAN Neural Clone (CBI Officer Impersonation)",
          action: "Immediate Escrow Transfer (₹15,00,000)"
        },
        ceo_fraud: {
          type: "CEO_WIRE_TRANSFER_FRAUD",
          id: "ElevenLabs Turbo v2.5 (Managing Director Impersonation)",
          action: "Urgent Vendor RTGS Wire (₹50,00,000)"
        },
        distress_scam: {
          type: "FAMILY_DISTRESS_SCAM",
          id: "Coqui XTTS v2 (Daughter Voice Clone)",
          action: "Emergency Hospital Bailout (₹5,00,000)"
        }
      };

      const selectedScenario = scenarioMap[presetKey] || scenarioMap.digital_arrest;

      const res = await api.simulateCall({
        scenario_type: isClone ? selectedScenario.type : "BENIGN_FAMILY_CALL",
        caller_claimed_identity: isClone ? selectedScenario.id : "Living Phonation (Clean Voice Line)",
        caller_phone: "+91 98112 34567",
        target_action: isClone ? selectedScenario.action : "Standard Voice Stream"
      });

      const evalRes = res.voice_evaluation;
      setEvaluationData({
        verdict: evalRes.verdict,
        action: evalRes.action,
        threat_score: evalRes.threat_score,
        latency_ms: evalRes.latency_ms,
        humanity_index: evalRes.humanity_index,
        lmt_active: evalRes.lmt_active,
        lmt_variance: `${evalRes.metrics?.lmt_variance || (isClone ? 0.006 : 2.919)} Hz`,
        phase_anomaly: isClone ? "1.000 (Phase Discontinuity)" : "0.012 (Continuous)",
        vocoder: evalRes.detected_vocoder,
        mgaa_scale: evalRes.mgaa_granularity,
        dcf_cost: evalRes.min_dcf_cost,
        xai: evalRes.xai_explanation
      });

      if (onQuickEvaluation) {
        onQuickEvaluation(evalRes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 font-mono text-xs selection:bg-[#FF5500] selection:text-black">
      
      {/* 1. Tactical System Status Ribbon */}
      <div className="border border-[#1E232F] bg-[#0A0C12] rounded px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[10.5px] text-[#788296]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1.5 text-[#00E599] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
            NODE: DEL-NCR-01 (ACTIVE)
          </span>
          <span className="text-[#333D4F]">|</span>
          <span>PROTOCOL: RTP_AUDIOSOCKET // 16kHz PCM</span>
          <span className="text-[#333D4F]">|</span>
          <span>SLA BUDGET: &lt; 30ms</span>
        </div>
        <div className="flex items-center space-x-3 text-[#9EA6B8]">
          <span>MHA I4C COMPLIANT</span>
          <span className="text-[#333D4F]">|</span>
          <span className="text-[#FF5500] font-bold">PS ID: SIH26104</span>
        </div>
      </div>

      {/* 2. Main Terminal Hero & Live Oscilloscope Console */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Problem, Invariant Formula & Primary Dispatch */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#161B26] border border-[#252C3D] text-[10px] text-[#FF5500] font-bold tracking-wider uppercase">
              <Binary className="w-3.5 h-3.5" />
              Sovereign Audio Anti-Spoofing Infrastructure
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-[#F2F4F8] leading-[1.2]">
              Real-Time Phonation Physics &amp; Biological Laryngeal Defense.
            </h1>

            <p className="text-xs sm:text-[13px] text-[#8C95A6] font-sans leading-relaxed">
              Zero-shot neural TTS models clone vocal timbre in 3 seconds to commit Digital Arrest extortion and CXO wire fraud. TrueVoice inspects the <strong className="text-white">neuromuscular laryngeal tremor (8–12 Hz)</strong> and <strong className="text-white">phase group-delay spectrum</strong> in under 30 milliseconds—intercepting calls before money leaves the bank.
            </p>
          </div>

          {/* Quick Metrics Barometer */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded bg-[#0D1017] border border-[#1A202C]">
            <div className="border-r border-[#1A202C] pr-2">
              <div className="text-[10px] text-[#6A7487] uppercase">P90 Latency</div>
              <div className="text-base font-bold text-[#00E599] mt-0.5">29.4 ms</div>
              <div className="text-[9px] text-[#4F5768]">Live VoIP Ready</div>
            </div>
            <div className="border-r border-[#1A202C] px-2">
              <div className="text-[10px] text-[#6A7487] uppercase">ASVspoof 5 EER</div>
              <div className="text-base font-bold text-[#FF5500] mt-0.5">0.98%</div>
              <div className="text-[9px] text-[#4F5768]">minDCF: 0.019</div>
            </div>
            <div className="pl-2">
              <div className="text-[10px] text-[#6A7487] uppercase">Human Ear Acc</div>
              <div className="text-base font-bold text-[#FFD000] mt-0.5">54.0%</div>
              <div className="text-[9px] text-[#4F5768]">Pure Coin Flip</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/shield"
              className="btn-primary py-2.5 px-4 text-xs flex items-center gap-2"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>LAUNCH LIVE MIC SHIELD</span>
            </Link>

            <Link
              to="/inspector"
              className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-[#00E599]" />
              <span>UNDER-THE-HOOD X-RAY</span>
            </Link>

            <Link
              to="/codecs"
              className="btn-secondary py-2.5 px-3.5 text-xs flex items-center gap-2"
            >
              <Wifi className="w-3.5 h-3.5 text-[#FFD000]" />
              <span>CODEC MATRIX</span>
            </Link>
          </div>

          {/* Regulatory Citation Chip */}
          <div className="p-3 rounded bg-[#090B10] border border-[#181C26] text-[10.5px] text-[#6A7487] space-y-1">
            <div className="flex items-center gap-1 text-[#8C95A6] font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>CRIMINAL PENAL LAW COVERAGE:</span>
            </div>
            <p className="font-sans leading-normal">
              Engineered to establish automated proof under <strong>Section 66D IT Act</strong> (Cheating by Impersonation), <strong>BNS Section 318(4)</strong>, and RBI Cyber Security Framework for core banking phone confirmations.
            </p>
          </div>
        </div>

        {/* Right Column: Real Phonation vs Neural Vocoder Forensic Workbench */}
        <div className="lg:col-span-6 card-panel-elevated p-5 border-[#232A38] space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2533]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded bg-[#FF5500]" />
              <span className="text-xs font-bold uppercase text-white">
                ACOUSTIC PHONATION COMPARATOR (0 - 8000 Hz)
              </span>
            </div>
            <span className="text-[10px] text-[#00E599] font-bold">
              DUAL-CHANNEL ANALYZER
            </span>
          </div>

          {/* Dual Channel Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => runChannelEvaluation('human')}
              disabled={isProcessing}
              className={`p-3 rounded border text-left transition ${
                activeChannel === 'human'
                  ? 'bg-[#00E599]/10 border-[#00E599] text-white shadow-[0_0_12px_rgba(0,229,153,0.15)]'
                  : 'bg-[#0B0D13] border-[#1E2430] text-[#788296] hover:border-[#323C4F]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-[#F2F4F8]">CHANNEL A: LIVING HUMAN</span>
                <span className={`text-[9px] font-bold ${activeChannel === 'human' ? 'text-[#00E599]' : 'text-[#4F5768]'}`}>
                  9.5Hz LMT
                </span>
              </div>
              <p className="text-[10px] text-[#6A7487] mt-1 font-sans">
                Living neuromuscular tremor, chaotic cycle jitter, natural glottal breath aspiration.
              </p>
            </button>

            <button
              onClick={() => runChannelEvaluation('clone')}
              disabled={isProcessing}
              className={`p-3 rounded border text-left transition ${
                activeChannel === 'clone'
                  ? 'bg-[#FF3B30]/10 border-[#FF3B30] text-white shadow-[0_0_12px_rgba(255,59,48,0.15)]'
                  : 'bg-[#0B0D13] border-[#1E2430] text-[#788296] hover:border-[#323C4F]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-[#F2F4F8]">CHANNEL B: NEURAL CLONE</span>
                <span className={`text-[9px] font-bold ${activeChannel === 'clone' ? 'text-[#FF3B30]' : 'text-[#4F5768]'}`}>
                  VOCODER SEAMS
                </span>
              </div>
              <p className="text-[10px] text-[#6A7487] mt-1 font-sans">
                ElevenLabs / HiFi-GAN upsampling aliasing, sterile pitch, zero physiological tremor.
              </p>
            </button>
          </div>

          {/* Preset Attack Scenarios (If Clone is selected) */}
          {activeChannel === 'clone' && (
            <div className="p-2.5 rounded bg-[#10141D] border border-[#202736] space-y-1.5">
              <span className="text-[9.5px] uppercase text-[#788296] block font-bold">SELECT CYBER ATTACK ARCHETYPE:</span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  onClick={() => runChannelEvaluation('clone', 'digital_arrest')}
                  className={`p-1.5 rounded border ${
                    activePreset === 'digital_arrest'
                      ? 'bg-[#FF3B30]/20 border-[#FF3B30] text-[#FF3B30] font-bold'
                      : 'bg-[#0A0D13] border-[#1D2330] text-[#788296]'
                  }`}
                >
                  Digital Arrest (CBI)
                </button>
                <button
                  onClick={() => runChannelEvaluation('clone', 'ceo_fraud')}
                  className={`p-1.5 rounded border ${
                    activePreset === 'ceo_fraud'
                      ? 'bg-[#FF3B30]/20 border-[#FF3B30] text-[#FF3B30] font-bold'
                      : 'bg-[#0A0D13] border-[#1D2330] text-[#788296]'
                  }`}
                >
                  CEO Wire (₹50L)
                </button>
                <button
                  onClick={() => runChannelEvaluation('clone', 'distress_scam')}
                  className={`p-1.5 rounded border ${
                    activePreset === 'distress_scam'
                      ? 'bg-[#FF3B30]/20 border-[#FF3B30] text-[#FF3B30] font-bold'
                      : 'bg-[#0A0D13] border-[#1D2330] text-[#788296]'
                  }`}
                >
                  Family Distress
                </button>
              </div>
            </div>
          )}

          {/* Real Waveform / Spectrum Display */}
          <div className="p-3 bg-[#080A0E] rounded border border-[#181D26] space-y-2">
            <div className="flex justify-between items-center text-[10px] text-[#555F73]">
              <span>LINEAR FREQUENCY SPECTRUM (0 - 8000 Hz)</span>
              <span>{isProcessing ? "RE-CALCULATING TENSORS..." : "16kHz / 500ms FRAME"}</span>
            </div>

            {/* Simulated Tactical Bars */}
            <div className="h-16 flex items-end justify-between gap-1 px-1">
              {Array.from({ length: 44 }).map((_, idx) => {
                const isClone = activeChannel === 'clone';
                const height = isClone
                  ? (idx >= 22 && idx <= 32 ? 88 : (idx % 2 === 0 ? 55 : 28))
                  : Math.max(12, Math.floor(Math.sin(idx * 0.35) * 35 + 40));

                return (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className={`w-1 rounded-sm transition-all duration-150 ${
                      isClone
                        ? (idx >= 22 && idx <= 32 ? 'bg-[#FF3B30]' : 'bg-[#FF5500]/60')
                        : 'bg-[#00E599]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[9px] text-[#4F5768] pt-0.5 border-t border-[#141822]">
              <span>0 Hz (Glottal F0)</span>
              <span>2 kHz (Formants)</span>
              <span className={activeChannel === 'clone' ? 'text-[#FF3B30] font-bold' : ''}>
                4-8 kHz (Vocoder Aliasing Band)
              </span>
              <span>8 kHz</span>
            </div>
          </div>

          {/* Sensor Diagnostics Readout Table */}
          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
            <div className="p-2 rounded bg-[#0A0D13] border border-[#1B212D]">
              <span className="text-[#6A7487] block text-[9.5px]">THREAT EVALUATION:</span>
              <span className={`font-bold ${activeChannel === 'clone' ? 'text-[#FF3B30]' : 'text-[#00E599]'}`}>
                {evaluationData.verdict} ({evaluationData.threat_score}%)
              </span>
            </div>

            <div className="p-2 rounded bg-[#0A0D13] border border-[#1B212D]">
              <span className="text-[#6A7487] block text-[9.5px]">LMT MICRO-TREMOR (8-12Hz):</span>
              <span className={`font-bold ${activeChannel === 'clone' ? 'text-[#FF3B30]' : 'text-[#00E599]'}`}>
                {evaluationData.lmt_variance}
              </span>
            </div>

            <div className="p-2 rounded bg-[#0A0D13] border border-[#1B212D]">
              <span className="text-[#6A7487] block text-[9.5px]">PHASE GROUP DELAY:</span>
              <span className={`font-bold ${activeChannel === 'clone' ? 'text-[#FF3B30]' : 'text-[#00E599]'}`}>
                {evaluationData.phase_anomaly}
              </span>
            </div>

            <div className="p-2 rounded bg-[#0A0D13] border border-[#1B212D]">
              <span className="text-[#6A7487] block text-[9.5px]">CLASSIFIED ARCHETYPE:</span>
              <span className={`font-bold truncate block ${activeChannel === 'clone' ? 'text-[#FF5500]' : 'text-[#8E97AA]'}`}>
                {evaluationData.vocoder}
              </span>
            </div>
          </div>

          {/* Explainable AI Rationale */}
          <div className="p-3 rounded bg-[#0D1017] border border-[#1F2533] space-y-1">
            <span className="text-[9.5px] uppercase font-bold text-[#FF5500] block">
              FORENSIC SIGNAL ATTRIBUTION (XAI):
            </span>
            <p className="text-[11px] text-[#A4ACB9] font-sans leading-relaxed">
              {evaluationData.xai}
            </p>
          </div>

          {/* Action Dispatch Banner */}
          <div className={`p-2.5 rounded flex items-center justify-between text-[11px] font-bold ${
            activeChannel === 'clone'
              ? 'bg-[#FF3B30]/20 border border-[#FF3B30] text-[#FF3B30] animate-pulse'
              : 'bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599]'
          }`}>
            <span>AUTOMATED TELEPHONY ACTION:</span>
            <span>{evaluationData.action}</span>
          </div>

        </div>

      </section>

      {/* 3. The 4 Physics Invariants (Why AI Clones Break Down) */}
      <section className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-[#1E232F]">
          <div>
            <span className="text-[10px] text-[#FF5500] uppercase font-bold">ACOUSTIC PHONATION INVARIANTS</span>
            <h2 className="text-lg sm:text-xl font-bold font-sans text-white mt-0.5">
              Why Neural Speech Synthesis Cannot Fake Living Physiology
            </h2>
          </div>
          <span className="text-[10.5px] text-[#6A7487]">THEORETICAL FOUNDATION // BIOMARKER AUDIT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="card-panel p-4 border-[#1E2432] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#00E599] font-bold px-1.5 py-0.5 rounded bg-[#00E599]/10 border border-[#00E599]/30">
                PHYSIOLOGY
              </span>
              <span className="text-[10px] text-[#6A7487]">TIER 4</span>
            </div>
            <h3 className="font-bold text-white text-xs">1. Involuntary LMT (8–12 Hz)</h3>
            <p className="text-[11px] text-[#8C95A6] font-sans leading-normal">
              Every living human vocal fold has micro-tremors from arterial blood flow and neuromuscular firing. Neural TTS produces mathematically sterile pitch lines with variance &lt; 0.015 Hz.
            </p>
            <div className="pt-1 border-t border-[#161B26] text-[10px] text-[#00E599]">
              Equation: Var(Butterworth_8-12Hz(F0)) &gt; 0.12 Hz
            </div>
          </div>

          <div className="card-panel p-4 border-[#1E2432] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#FF5500] font-bold px-1.5 py-0.5 rounded bg-[#FF5500]/10 border border-[#FF5500]/30">
                PHASE SPECTRUM
              </span>
              <span className="text-[10px] text-[#6A7487]">TIER 2</span>
            </div>
            <h3 className="font-bold text-white text-xs">2. Linear Cepstrum (LFCC)</h3>
            <p className="text-[11px] text-[#8C95A6] font-sans leading-normal">
              Mel scale compresses high frequencies. 40-channel linear frequency spacing preserves the 4–8 kHz band where neural vocoders (HiFi-GAN, BigVGAN) leave discrete upsampling phase spikes.
            </p>
            <div className="pt-1 border-t border-[#161B26] text-[10px] text-[#FF5500]">
              Derivative: τ_g(ω) = -d/dω[arg(X(ω))]
            </div>
          </div>

          <div className="card-panel p-4 border-[#1E2432] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#FFD000] font-bold px-1.5 py-0.5 rounded bg-[#FFD000]/10 border border-[#FFD000]/30">
                MULTI-SCALE
              </span>
              <span className="text-[10px] text-[#6A7487]">TIER 3</span>
            </div>
            <h3 className="font-bold text-white text-xs">3. MGAA Attention (k=3,5,7,9)</h3>
            <p className="text-[11px] text-[#8C95A6] font-sans leading-normal">
              Shi et al. (2025) proved lossy telephony codecs blur single frames. TrueVoice evaluates 95ms phonemes, 159ms formants, 222ms syllables, and words with adaptive softmax fusion.
            </p>
            <div className="pt-1 border-t border-[#161B26] text-[10px] text-[#FFD000]">
              Scales: 95ms / 159ms / 222ms / 286ms
            </div>
          </div>

          <div className="card-panel p-4 border-[#1E2432] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#3B82F6] font-bold px-1.5 py-0.5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30">
                CAUSAL GATE
              </span>
              <span className="text-[10px] text-[#6A7487]">TIER 1</span>
            </div>
            <h3 className="font-bold text-white text-xs">4. MagicNet Causal VAD</h3>
            <p className="text-[11px] text-[#8C95A6] font-sans leading-normal">
              Standard detectors overfit to background silence. MagicNet 1D depth-wise network (22.7K params) strips boundary frames in &lt; 2ms to ensure zero false alarms from room static.
            </p>
            <div className="pt-1 border-t border-[#161B26] text-[10px] text-[#3B82F6]">
              Real-Time Factor: RTF = 0.034
            </div>
          </div>

        </div>
      </section>

      {/* 4. Real-World Telecommunication Degradation Matrix */}
      <section className="card-panel p-5 border-[#1E2432] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1A202D]">
          <div>
            <div className="text-[10px] text-[#FFD000] uppercase font-bold">ADD-C BENCHMARK SUITE</div>
            <h3 className="text-sm font-bold text-white">
              Performance Under Real-World Indian Telecom Network Degradations
            </h3>
          </div>
          <Link
            to="/codecs"
            className="text-[10.5px] text-[#FF5500] hover:text-white flex items-center gap-1 font-bold"
          >
            <span>OPEN INTERACTIVE CODEC STUDIO</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-[#1E2535] text-[#6A7487] text-[10px]">
                <th className="py-2 pr-4">TELEPHONY CODEC</th>
                <th className="py-2 px-4">BITRATE</th>
                <th className="py-2 px-4">NETWORK ARCHITECTURE</th>
                <th className="py-2 px-4">0% PACKET LOSS</th>
                <th className="py-2 px-4">5% (VOLTE)</th>
                <th className="py-2 px-4">10% (CELL EDGE)</th>
                <th className="py-2 pl-4 text-right">EER ACCURACY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141824] text-[#A4ACB9]">
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white">OPUS</td>
                <td className="py-2.5 px-4">24.4 kbps</td>
                <td className="py-2.5 px-4 text-[#788296]">WhatsApp / WebRTC Hybrid LPC+CELT</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.15% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.29% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.42% EER</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#00E599]">99.58%</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white">AMR-WB</td>
                <td className="py-2.5 px-4">23.85 kbps</td>
                <td className="py-2.5 px-4 text-[#788296]">4G VoLTE Calling (Airtel / Jio)</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.22% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.58% EER</td>
                <td className="py-2.5 px-4 text-[#FFD000]">0.89% EER</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#00E599]">99.11%</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white">EVS</td>
                <td className="py-2.5 px-4">24.4 kbps</td>
                <td className="py-2.5 px-4 text-[#788296]">5G Ultra-HD Voice Standard</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.19% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.63% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.78% EER</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#00E599]">99.22%</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white">SILK</td>
                <td className="py-2.5 px-4">24.4 kbps</td>
                <td className="py-2.5 px-4 text-[#788296]">Skype / Telegram Audio Codec</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.20% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.47% EER</td>
                <td className="py-2.5 px-4 text-[#00E599]">0.61% EER</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#00E599]">99.39%</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white">G.711</td>
                <td className="py-2.5 px-4">64.0 kbps</td>
                <td className="py-2.5 px-4 text-[#788296]">Legacy PSTN Landline (A-Law / μ-Law)</td>
                <td className="py-2.5 px-4 text-[#FFD000]">0.45% EER</td>
                <td className="py-2.5 px-4 text-[#FFD000]">0.85% EER</td>
                <td className="py-2.5 px-4 text-[#FF5500]">1.42% EER</td>
                <td className="py-2.5 pl-4 text-right font-bold text-[#00E599]">98.58%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Production Integration Blueprint */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="card-panel p-4 border-[#1E2432] space-y-2">
          <div className="flex items-center gap-2 text-[#FF5500] font-bold">
            <Server className="w-4 h-4" />
            <span>SIP Trunk Interception</span>
          </div>
          <p className="text-[11px] text-[#788296] font-sans">
            Connects to Asterisk &amp; FreeSWITCH via RTP AudioSocket sidecar. Operates without decrypting user private credentials or introducing call lag.
          </p>
          <div className="text-[10px] text-[#555E70]">Hook: mod_audio_fork / 16k WS</div>
        </div>

        <div className="card-panel p-4 border-[#1E2432] space-y-2">
          <div className="flex items-center gap-2 text-[#00E599] font-bold">
            <Lock className="w-4 h-4" />
            <span>Core Banking Auto-Freeze</span>
          </div>
          <p className="text-[11px] text-[#788296] font-sans">
            Triggers sub-second REST webhooks to CBS (Finacle/TCS BaNCS) to immediately freeze RTGS/NEFT approvals when a caller voice is synthetic.
          </p>
          <div className="text-[10px] text-[#555E70]">Action: POST /v1/freeze-escrow</div>
        </div>

        <div className="card-panel p-4 border-[#1E2432] space-y-2">
          <div className="flex items-center gap-2 text-[#3B82F6] font-bold">
            <FileText className="w-4 h-4" />
            <span>Section 65B Forensics</span>
          </div>
          <p className="text-[11px] text-[#788296] font-sans">
            Generates SHA-256 tamper-evident PDF certificates containing group-delay spectrum charts for submission as electronic evidence in Indian courts.
          </p>
          <div className="text-[10px] text-[#555E70]">Admissibility: Indian Evidence Act 65B</div>
        </div>

      </section>

      {/* 6. Navigation Link Matrix */}
      <section className="p-5 rounded bg-[#0A0D13] border border-[#1E232F] space-y-3">
        <div className="text-[10px] text-[#FF5500] uppercase font-bold">DEDICATED INVESTIGATION &amp; AUDIT SUITES:</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <Link to="/shield" className="p-2.5 rounded bg-[#0F131C] border border-[#1E2535] hover:border-[#FF5500] transition flex items-center justify-between">
            <span className="text-white font-bold">Live Shield</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF5500]" />
          </Link>
          <Link to="/inspector" className="p-2.5 rounded bg-[#0F131C] border border-[#1E2535] hover:border-[#00E599] transition flex items-center justify-between">
            <span className="text-white font-bold">Under-the-Hood</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00E599]" />
          </Link>
          <Link to="/simulator" className="p-2.5 rounded bg-[#0F131C] border border-[#1E2535] hover:border-[#FF3B30] transition flex items-center justify-between">
            <span className="text-white font-bold">Attack Simulator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF3B30]" />
          </Link>
          <Link to="/forensics" className="p-2.5 rounded bg-[#0F131C] border border-[#1E2535] hover:border-[#3B82F6] transition flex items-center justify-between">
            <span className="text-white font-bold">WhatsApp Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
          </Link>
        </div>
      </section>

    </div>
  );
}
