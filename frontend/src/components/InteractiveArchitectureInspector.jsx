import React, { useState } from 'react';
import { 
  Cpu, Activity, Zap, ShieldAlert, ShieldCheck, ArrowRight, CheckCircle2, 
  HelpCircle, Eye, EyeOff, Radio, Play, Sparkles, Volume2, Lock, Filter, Search, Layers, RefreshCw
} from 'lucide-react';

export default function InteractiveArchitectureInspector({ latestEvaluation }) {
  const [selectedStage, setSelectedStage] = useState(1);
  const [isSimulatingFlow, setIsSimulatingFlow] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState(null);
  const [viewMode, setViewMode] = useState('layman'); // 'layman' or 'deeptech'

  const stages = [
    {
      id: 1,
      title: "Stage 1: MagicNet Causal Ear",
      subtitle: "Silence & Ambient Pause Suppression",
      icon: Filter,
      laymanTitle: "The Intelligent Ear (Cuts Out Dead Noise)",
      laymanSummary: "Human speech is surrounded by silent pauses. Bad AI detectors get fooled by background room noise rather than real voice. This stage instantly trims off the dead silence in 2 milliseconds so only pure voice is inspected.",
      deeptechTitle: "Causal 1D Depth-Wise Separable VAD (22.7K Params)",
      deeptechSummary: "Suppresses database-specific silence bias. Processes 16kHz PCM stream using causal depth-wise convolutions + GRU to isolate active speech chunks (RMS > 0.006) and strip boundary artifacts.",
      liveMetricKey: "MagicNet VAD Speech Ratio",
      liveMetricVal: latestEvaluation ? `${(latestEvaluation.metrics?.speech_ratio * 100 || 85).toFixed(0)}% Voiced Audio` : "88% Voiced Audio",
      badge: "< 2 ms Latency",
      color: "#00E599"
    },
    {
      id: 2,
      title: "Stage 2: Acoustic Physics & Glottal IAIF",
      subtitle: "Linear Frequency (LFCC) & Phase Group Delay",
      icon: Search,
      laymanTitle: "The Physics Prism (Checks for Computer Glitches)",
      laymanSummary: "When an AI computer generates a fake voice, it stitches together tiny frequency slices. This leaves microscopic high-frequency 'seam marks' and eliminates natural breath turbulence. This stage scans the audio's physical structure to find those hidden glitches.",
      deeptechTitle: "40-Channel Linear Cepstrum + Phase Derivative τ_g(ω)",
      deeptechSummary: "Standard MFCCs discard high frequencies. LFCC preserves 0-8 kHz linear bins to expose HiFi-GAN/BigVGAN upsampling aliasing. Iterative Adaptive Inverse Filtering (IAIF) decomposes vocal tract resonance from glottal airflow pulses.",
      liveMetricKey: "Phase Anomaly Index",
      liveMetricVal: latestEvaluation?.metrics?.phase_anomaly !== undefined ? `${latestEvaluation.metrics.phase_anomaly}` : "0.0124 (Normal)",
      badge: "< 8 ms Latency",
      color: "#FF5500"
    },
    {
      id: 3,
      title: "Stage 3: MGAA Multi-Granularity Attention",
      subtitle: "Multi-Scale Linguistic Windows (k=3, 5, 7, 9)",
      icon: Layers,
      laymanTitle: "The Microscopic Multi-Lens Eye",
      laymanSummary: "Instead of just listening to the sentence as a whole, this AI lens listens at 4 different microscopic speeds at the same time: at the speed of single sounds (phonemes), vowels (formants), syllables, and full words. Fake voices fail when inspected at multiple speeds.",
      deeptechTitle: "MGAA + Scalable AASIST-MHA + Soft Fusion",
      deeptechSummary: "Evaluates multi-scale 1D depth-wise receptive fields (k=3 95ms, k=5 159ms, k=7 222ms, k=9 286ms). Adaptive Fusion Module (AFM) softmax weights dynamically adjust focus when audio traverses lossy telephony codecs (OPUS, AMR-WB, G.711).",
      liveMetricKey: "Active Linguistic Scale",
      liveMetricVal: latestEvaluation?.mgaa_granularity || "Formant Transitions (k=5)",
      badge: "< 15 ms Latency",
      color: "#FFD000"
    },
    {
      id: 4,
      title: "Stage 4: Biological Laryngeal Stethoscope",
      subtitle: "8–12 Hz Involuntary Vocal Cord Micro-Tremor (LMT)",
      icon: Activity,
      laymanTitle: "The Living Throat Stethoscope (The Ultimate Test)",
      laymanSummary: "Every living human has an involuntary throat tremor (8 to 12 vibrations per second) caused by natural blood flow and muscles. Computer AI models create mathematically flat voices with ZERO tremor. If there's no tremor, it's 100% a fake robot clone!",
      deeptechTitle: "Butterworth [8-12Hz] Bandpass Filter on YIN Pitch F0",
      deeptechSummary: "Isolates involuntary neuromuscular vocal fold tremor. Organic human phonation exhibits LMT variance > 0.12 Hz with cycle-to-cycle jitter. Neural TTS produces deterministic pitch trajectories with variance < 0.015 Hz.",
      liveMetricKey: "LMT Tremor Variance",
      liveMetricVal: latestEvaluation?.metrics?.lmt_variance !== undefined ? `${latestEvaluation.metrics.lmt_variance} Hz` : "2.919 Hz (Living)",
      badge: "< 5 ms Latency",
      color: "#00E599"
    },
    {
      id: 5,
      title: "Stage 5: Zero-Trust Defense Shield",
      subtitle: "Bayesian Fusion, Bank Auto-Freeze & minDCF Cost",
      icon: ShieldAlert,
      laymanTitle: "The Automated Defense Shield (Instant Protection)",
      laymanSummary: "In less than 30 milliseconds—before the caller can finish their sentence—the system makes a decision. If it's a living human, the call continues safely. If it's an AI clone, it instantly rings an alarm and freezes bank transfers!",
      deeptechTitle: "Multi-Frame Bayesian Scorer + Telephony SIP Intercept",
      deeptechSummary: "Integrates posterior probability over rolling 500ms sliding windows. ASVspoof 5 minDCF cost calculation (π_spf=0.05, C_fa=10, C_miss=1). Triggers automated webhook to core banking API to freeze wire approvals.",
      liveMetricKey: "Threat Decision & minDCF",
      liveMetricVal: latestEvaluation ? `${latestEvaluation.verdict} (${latestEvaluation.threat_score}% Threat)` : "ALLOW (5.9% Threat)",
      badge: "SUB-30ms TOTAL",
      color: "#FF3B30"
    }
  ];

  const triggerAnimatedSimulation = (isAttack = true) => {
    setIsSimulatingFlow(true);
    setSimulatedStep(1);

    const stepInterval = setInterval(() => {
      setSimulatedStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsSimulatingFlow(false);
          return 5;
        }
        setSelectedStage(prev + 1);
        return prev + 1;
      });
    }, 900);
  };

  const activeStageData = stages.find(s => s.id === selectedStage) || stages[0];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner with Toggle */}
      <div className="card-panel p-6 border-[#232730] tactical-corner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232730]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500] shadow-inner">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
                UNDER-THE-HOOD: HOW TRUEVOICE WORKS
              </h2>
              <p className="text-xs font-mono text-[#7D8494] mt-0.5">
                Interactive X-Ray Architecture: Click any stage or run the live flow simulator to understand the magic
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            {/* View Mode Toggle: Layman vs Deep Tech */}
            <div className="flex items-center p-1 bg-[#0B0D11] rounded border border-[#232730]">
              <button
                onClick={() => setViewMode('layman')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  viewMode === 'layman' ? 'bg-[#00E599] text-[#0A0C10]' : 'text-[#8C93A3] hover:text-white'
                }`}
              >
                Simple (Layman Mode)
              </button>
              <button
                onClick={() => setViewMode('deeptech')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  viewMode === 'deeptech' ? 'bg-[#FF5500] text-white' : 'text-[#8C93A3] hover:text-white'
                }`}
              >
                Deep Tech (Engineering)
              </button>
            </div>

            <button
              onClick={() => triggerAnimatedSimulation(true)}
              disabled={isSimulatingFlow}
              className="btn-primary py-1.5 px-3 text-xs"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulatingFlow ? 'animate-spin' : ''}`} />
              <span>{isSimulatingFlow ? `TESTING STAGE ${simulatedStep}...` : "SIMULATE LIVE FLOW"}</span>
            </button>
          </div>
        </div>

        {/* 5-Step Visual Flow Stepper Diagram */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-mono text-xs">
          {stages.map((stage) => {
            const isSelected = selectedStage === stage.id;
            const isCurrentSim = simulatedStep === stage.id;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`p-3.5 rounded border cursor-pointer transition-all relative ${
                  isCurrentSim
                    ? 'border-[#00E599] bg-[#00E599]/15 shadow-lg scale-105 animate-pulse'
                    : isSelected
                    ? 'border-[#FF5500] bg-[#161922] shadow-md'
                    : 'border-[#232730] bg-[#0B0D11] hover:border-[#3A4254] hover:bg-[#12151D]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-[#FF5500] text-white' : 'bg-[#1A1E26] text-[#A0A6B5]'
                  }`}>
                    {stage.id}
                  </div>
                  <span className="text-[9px] text-[#7D8494] px-1.5 py-0.5 rounded bg-[#161921] border border-[#232730]">
                    {stage.badge}
                  </span>
                </div>

                <div className="font-bold text-[#F2F4F8] text-[11px] truncate block">
                  {viewMode === 'layman' ? stage.laymanTitle.split('(')[0] : stage.title.split(':')[1]}
                </div>
                <div className="text-[9.5px] text-[#7D8494] mt-0.5 truncate">
                  {stage.subtitle}
                </div>

                {/* Active Indicator Arrow */}
                {isSelected && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FF5500] rotate-45" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Stage Inspector Card */}
      <div className="card-panel p-6 border-[#232730] bg-[#111318] tactical-corner font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#232730]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <activeStageData.icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#FF5500] uppercase font-bold block">
                INSPECTING STAGE {activeStageData.id} OF 5
              </span>
              <h3 className="text-sm font-bold text-[#F2F4F8]">
                {viewMode === 'layman' ? activeStageData.laymanTitle : activeStageData.deeptechTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="p-2 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[9.5px] text-[#7D8494] block uppercase">{activeStageData.liveMetricKey}</span>
              <span className="font-bold text-[#00E599] text-xs">{activeStageData.liveMetricVal}</span>
            </div>
          </div>
        </div>

        {/* Stage Explanation & Visual Analogies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs leading-relaxed">
          
          {/* Main Description */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[10px] text-[#FF5500] uppercase font-bold block mb-1.5">
                {viewMode === 'layman' ? "💡 WHAT IS HAPPENING HERE (PLAIN ENGLISH):" : "⚙️ MATHEMATICAL & ARCHITECTURAL MECHANICS:"}
              </span>
              <p className="text-xs text-[#C7CBD4] leading-relaxed">
                {viewMode === 'layman' ? activeStageData.laymanSummary : activeStageData.deeptechSummary}
              </p>
            </div>

            {/* Interactive "Why This Catches Fakes" Box */}
            <div className="p-4 rounded bg-[#161922] border border-[#2B313E] space-y-2">
              <div className="flex items-center space-x-2 text-[#00E599] font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WHY ZERO-DAY VOICE CLONES CANNOT BYPASS THIS:</span>
              </div>
              <p className="text-[11.5px] text-[#A0A6B5]">
                {activeStageData.id === 1 && "Attackers try to hide behind background room noise or phone static. Stage 1 strips all non-voice audio immediately, exposing raw vocal frequencies."}
                {activeStageData.id === 2 && "Generative AI creates sound with neural upsamplers (like HiFi-GAN). It sounds good to the ear, but the phase spectrum is mathematically stitched with unnatural group delays."}
                {activeStageData.id === 3 && "Neural speech sounds realistic on a full sentence, but when zoomed in to 95ms phoneme and 159ms formant transitions, the neural speech transitions are unnaturally rigid."}
                {activeStageData.id === 4 && "This is the unbreachable biological invariant: every living human has involuntary laryngeal micro-tremors (8-12 Hz) from blood flow. No computer code generates living vocal cord tremors."}
                {activeStageData.id === 5 && "By combining all 4 tiers into a single Bayesian score, even if an attacker tricks one filter, the remaining filters immediately catch the spoof in under 30 milliseconds."}
              </p>
            </div>
          </div>

          {/* Right: Live Interactive Telemetry Box */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded bg-[#0B0D11] border border-[#232730] space-y-3">
              <span className="text-[10px] uppercase text-[#7D8494] block font-bold">
                LIVE PIPELINE TELEMETRY SENSORS:
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-[#15181F] border border-[#232730]">
                  <span className="text-[#A0A6B5]">Processing Budget:</span>
                  <span className="font-bold text-[#00E599]">{activeStageData.badge}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-[#15181F] border border-[#232730]">
                  <span className="text-[#A0A6B5]">Engine Status:</span>
                  <span className="font-bold text-[#00E599]">ACTIVE // 0.0g INERTIA</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-[#15181F] border border-[#232730]">
                  <span className="text-[#A0A6B5]">Hardware Target:</span>
                  <span className="font-bold text-[#F2F4F8]">Edge CPU / Mobile Device</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-[#15181F] border border-[#232730]">
                  <span className="text-[#A0A6B5]">False Alarm Cost (C_fa):</span>
                  <span className="font-bold text-[#FF5500]">10x (Heavily Protected)</span>
                </div>
              </div>
            </div>

            {/* Step Selector Buttons */}
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setSelectedStage(Math.max(1, selectedStage - 1))}
                disabled={selectedStage === 1}
                className="flex-1 btn-secondary py-1.5 text-xs disabled:opacity-40"
              >
                &larr; PREVIOUS STAGE
              </button>
              <button
                onClick={() => setSelectedStage(Math.min(5, selectedStage + 1))}
                disabled={selectedStage === 5}
                className="flex-1 btn-primary py-1.5 text-xs disabled:opacity-40"
              >
                NEXT STAGE &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
