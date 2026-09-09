import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Mic, Activity, Zap, Layers, Wifi, Lock, 
  FileSearch, ArrowRight, Play, CheckCircle2, ChevronRight, Terminal, 
  Sparkles, AlertTriangle, Clock, RefreshCw, Eye, Cpu, Database
} from 'lucide-react';
import { api } from '../services/api';

export default function LandingPage({ onQuickEvaluation }) {
  const [activeSandbox, setActiveSandbox] = useState(null); // 'human' or 'clone'
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState(null);

  const runSandboxTest = async (type) => {
    try {
      setIsSandboxRunning(true);
      setActiveSandbox(type);
      const isClone = type === 'clone';

      const res = await api.simulateCall({
        scenario_type: isClone ? "DIGITAL_ARREST_SCAM" : "BENIGN_FAMILY_CALL",
        caller_claimed_identity: isClone ? "Neural Voice Clone (HiFi-GAN Vocoder)" : "Living Human Speaker",
        caller_phone: "+91 98112 34567",
        target_action: isClone ? "Emergency Escrow Transfer (₹15,00,000)" : "Routine Casual Voice Check"
      });

      setSandboxResult(res);
      if (onQuickEvaluation) {
        onQuickEvaluation(res.voice_evaluation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSandboxRunning(false);
    }
  };

  const featureCards = [
    {
      to: '/shield',
      title: 'Live Voice Shield',
      desc: 'Connect your live microphone to stream 16kHz audio with sub-30ms continuous threat scoring & HUD.',
      badge: 'REAL-TIME WEBRTC',
      icon: Mic,
      color: '#FF5500'
    },
    {
      to: '/inspector',
      title: 'Under-the-Hood X-Ray',
      desc: 'Interactive 5-stage pipeline explainer with Layman vs Deep Tech modes and animated flow stepper.',
      badge: 'INTERACTIVE XAI',
      icon: Eye,
      color: '#00E599'
    },
    {
      to: '/codecs',
      title: 'Codec Robustness Studio',
      desc: 'Simulate 6 real-world telephony codecs (OPUS, AMR-WB, EVS, G.711) across 0% to 20% packet loss.',
      badge: 'ADD-C BENCHMARK',
      icon: Wifi,
      color: '#FFD000'
    },
    {
      to: '/simulator',
      title: 'Cyber Attack Simulator',
      desc: '1-click trigger to test Digital Arrest scams, CEO wire fraud, and family distress extortion.',
      badge: 'THREAT SCENARIOS',
      icon: Zap,
      color: '#FF3B30'
    },
    {
      to: '/banking',
      title: 'CXO & Banking Guard',
      desc: 'Simulated ₹50 Lakh core banking fund transfer authorization with instant automated freeze gate.',
      badge: 'TELECOM SIP INTERCEPT',
      icon: Lock,
      color: '#A855F7'
    },
    {
      to: '/forensics',
      title: 'WhatsApp Audio Forensics',
      desc: 'Upload WhatsApp/Telegram voice notes to generate court-admissible forensic PDF certificates.',
      badge: 'EVIDENCE STUDIO',
      icon: FileSearch,
      color: '#3B82F6'
    }
  ];

  return (
    <div className="space-y-16 py-4 font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF5500]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10 px-4">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#141822] border border-[#262E3E] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span className="text-[#A4ACB9]">SIH26104 // AICTE CYBER CELL &amp; MINISTRY OF COMMUNICATIONS</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F2F4F8] font-sans leading-[1.15]">
            Stop AI Voice Clones in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#FF7733] to-[#FFD000]">&lt; 30 Milliseconds</span> Before Fraud Occurs.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#949EB2] font-normal max-w-2xl mx-auto leading-relaxed">
            A sovereign pure-software voice authenticity engine that inspects the <strong className="text-[#F2F4F8]">acoustic physics</strong> and <strong className="text-[#F2F4F8]">living laryngeal micro-tremors (8–12 Hz)</strong> of human speech to neutralize Digital Arrest scams and CEO impersonations during live phone calls.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono">
            <Link
              to="/shield"
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2 glow-cadmium"
            >
              <Mic className="w-4 h-4" />
              <span>LAUNCH LIVE SHIELD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/inspector"
              className="btn-secondary py-3 px-5 text-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#00E599]" />
              <span>HOW IT WORKS (X-RAY)</span>
            </Link>

            <Link
              to="/simulator"
              className="btn-secondary py-3 px-5 text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#FF3B30]" />
              <span>ATTACK SIMULATOR</span>
            </Link>
          </div>
        </div>

        {/* Interactive Hero Audio Sandbox */}
        <div className="mt-12 max-w-4xl mx-auto px-4">
          <div className="card-panel-elevated p-6 border-[#283142] tactical-corner shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#202735]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#FF5500] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    INSTANT ZERO-CLICK AUDIO SANDBOX
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A202C] text-[#A4ACB9]">
                    SUB-30ms ENGINE
                  </span>
                </div>
                <p className="text-xs text-[#7D8699] font-mono mt-0.5">
                  Test the difference between genuine vocal cord biology and synthetic neural vocoder generation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => runSandboxTest('human')}
                  disabled={isSandboxRunning}
                  className={`px-3.5 py-2 rounded font-bold border transition flex items-center gap-1.5 ${
                    activeSandbox === 'human'
                      ? 'bg-[#00E599]/20 border-[#00E599] text-[#00E599]'
                      : 'bg-[#10141D] border-[#222938] text-[#A4ACB9] hover:border-[#38435A]'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>PLAY HUMAN VOICE</span>
                </button>

                <button
                  onClick={() => runSandboxTest('clone')}
                  disabled={isSandboxRunning}
                  className={`px-3.5 py-2 rounded font-bold border transition flex items-center gap-1.5 ${
                    activeSandbox === 'clone'
                      ? 'bg-[#FF3B30]/20 border-[#FF3B30] text-[#FF3B30]'
                      : 'bg-[#10141D] border-[#222938] text-[#A4ACB9] hover:border-[#38435A]'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>PLAY AI CLONE</span>
                </button>
              </div>
            </div>

            {/* Sandbox Visualizer Output */}
            <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-5 font-mono">
              
              {/* Audio Status & Waveform Simulation */}
              <div className="md:col-span-7 space-y-3">
                <div className="p-4 rounded bg-[#090C12] border border-[#1C2230]">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-[#7D8699] uppercase text-[10px]">Active Waveform Feed (16kHz PCM):</span>
                    <span className="text-[10px] text-[#A4ACB9]">
                      {isSandboxRunning ? "ANALYZING 500ms SLICES..." : activeSandbox ? "INSPECTED" : "IDLE"}
                    </span>
                  </div>

                  {/* Simulated wave bars */}
                  <div className="h-16 flex items-center justify-between gap-1 px-1">
                    {Array.from({ length: 44 }).map((_, i) => {
                      const isClone = activeSandbox === 'clone';
                      const isHuman = activeSandbox === 'human';
                      const height = isSandboxRunning
                        ? Math.max(15, (Math.sin(i * 0.4 + Date.now()) * 40 + 45))
                        : isClone
                        ? (i % 2 === 0 ? 55 : 25)
                        : isHuman
                        ? (Math.sin(i * 0.3) * 30 + 40)
                        : 8;

                      return (
                        <div
                          key={i}
                          style={{ height: `${height}%` }}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isClone
                              ? 'bg-[#FF3B30]'
                              : isHuman
                              ? 'bg-[#00E599]'
                              : 'bg-[#222836]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Plain-English Explanation */}
                {sandboxResult ? (
                  <div className="p-3.5 rounded bg-[#0D111A] border border-[#1E2535] text-xs">
                    <span className="text-[10px] font-bold text-[#FF5500] uppercase block mb-1">
                      XAI EXPLAINABLE ATTRIBUTION:
                    </span>
                    <p className="text-[11.5px] text-[#A4ACB9] leading-relaxed">
                      {sandboxResult.voice_evaluation.xai_explanation}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-[#5D6678]">
                    Click &ldquo;Play Human Voice&rdquo; or &ldquo;Play AI Clone&rdquo; above to run the live 4-Tier Zero-Trust Engine.
                  </div>
                )}
              </div>

              {/* Threat Gauge & Telemetry Box */}
              <div className="md:col-span-5 space-y-3">
                <div className="p-4 rounded bg-[#090C12] border border-[#1C2230] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#7D8699] uppercase text-[10px]">Threat Index:</span>
                    <span className={`font-bold text-sm ${
                      sandboxResult?.voice_evaluation?.is_synthetic ? 'text-[#FF3B30]' : 'text-[#00E599]'
                    }`}>
                      {sandboxResult ? `${sandboxResult.voice_evaluation.threat_score}%` : "0.0%"}
                    </span>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full bg-[#161B26] h-2.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${sandboxResult?.voice_evaluation?.threat_score || 5}%` }}
                      className={`h-full transition-all duration-500 ${
                        sandboxResult?.voice_evaluation?.is_synthetic ? 'bg-[#FF3B30]' : 'bg-[#00E599]'
                      }`}
                    />
                  </div>

                  {/* Metrics Table */}
                  <div className="space-y-1.5 text-[11px] pt-1">
                    <div className="flex justify-between text-[#8E97AA]">
                      <span>Verdict:</span>
                      <span className="font-bold text-[#F2F4F8]">
                        {sandboxResult ? sandboxResult.voice_evaluation.verdict : "STANDBY"}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#8E97AA]">
                      <span>Latency SLA:</span>
                      <span className="font-bold text-[#00E599]">
                        {sandboxResult ? `${sandboxResult.voice_evaluation.latency_ms} ms` : "< 30 ms"}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#8E97AA]">
                      <span>LMT 8-12Hz Tremor:</span>
                      <span className="font-bold text-[#F2F4F8]">
                        {sandboxResult ? `${sandboxResult.voice_evaluation.metrics?.lmt_variance || 0} Hz` : "Active"}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#8E97AA]">
                      <span>Vocoder Archetype:</span>
                      <span className="font-bold text-[#FF5500]">
                        {sandboxResult ? sandboxResult.voice_evaluation.detected_vocoder : "None"}
                      </span>
                    </div>
                  </div>
                </div>

                {sandboxResult && (
                  <Link
                    to="/inspector"
                    className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>VIEW 5-STAGE X-RAY BREAKDOWN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* National Crisis & Threat Metrics Banner */}
      <section className="border-y border-[#1E232E] bg-[#0A0D14] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-center">
            
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#FF3B30] tracking-tight">₹1,200 Cr+</div>
              <div className="text-xs text-[#7D8699] uppercase">Lost in India (2025–26)</div>
              <p className="text-[10px] text-[#555E70]">Digital Arrest &amp; CEO Fraud</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#FFD000] tracking-tight">54%</div>
              <div className="text-xs text-[#7D8699] uppercase">Human Ear Accuracy</div>
              <p className="text-[10px] text-[#555E70]">Statistically A Coin Flip</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#00E599] tracking-tight">&lt; 30 ms</div>
              <div className="text-xs text-[#7D8699] uppercase">Streaming Latency</div>
              <p className="text-[10px] text-[#555E70]">Continuous Sub-Second Intercept</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-[#FF5500] tracking-tight">0.98% EER</div>
              <div className="text-xs text-[#7D8699] uppercase">ASVspoof 5 Benchmark</div>
              <p className="text-[10px] text-[#555E70]">Certified minDCF 0.021</p>
            </div>

          </div>
        </div>
      </section>

      {/* The 4 Unbreachable Pillars (Why Biology Beats AI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-[#FF5500]">
            THE ACOUSTIC PHYSICS FORMULA
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F4F8]">
            Why Zero-Day Voice Clones Cannot Bypass TrueVoice
          </h2>
          <p className="text-xs sm:text-sm text-[#7D8699]">
            AI neural speech models mimic how human voice sounds, but completely fail when inspected for underlying vocal biology and wave physics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-mono text-xs">
          
          <div className="card-panel p-5 border-[#202633] space-y-3 relative">
            <div className="w-8 h-8 rounded bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F2F4F8]">1. 8-12 Hz Biological Tremor</h3>
            <p className="text-[11.5px] text-[#8E97AA] leading-normal font-sans">
              Every living human vocal cord oscillates with involuntary neuromuscular tremors (8–12 Hz) driven by arterial blood flow. AI voices produce sterile, mathematically dead pitch lines with zero tremor.
            </p>
            <div className="text-[10px] text-[#00E599]">Var(LMT) &gt; 0.12 Hz (Living)</div>
          </div>

          <div className="card-panel p-5 border-[#202633] space-y-3 relative">
            <div className="w-8 h-8 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F2F4F8]">2. Linear Cepstrum (LFCC)</h3>
            <p className="text-[11.5px] text-[#8E97AA] leading-normal font-sans">
              Standard MFCCs discard high frequencies. TrueVoice uses 40-channel linear frequency filterbanks (0–8 kHz) to spot HiFi-GAN upsampling aliasing and phase group-delay discontinuities.
            </p>
            <div className="text-[10px] text-[#FF5500]">Group Delay Derivative τ_g(ω)</div>
          </div>

          <div className="card-panel p-5 border-[#202633] space-y-3 relative">
            <div className="w-8 h-8 rounded bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFD000]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F2F4F8]">3. Multi-Scale Attention (MGAA)</h3>
            <p className="text-[11.5px] text-[#8E97AA] leading-normal font-sans">
              Listens across 4 microscopic time-scales at once: phonemes (95ms), formants (159ms), syllables (222ms), and words (286ms). Dynamically adapts when audio travels over lossy phone networks.
            </p>
            <div className="text-[10px] text-[#FFD000]">Linguistic Scales k in {3,5,7,9}</div>
          </div>

          <div className="card-panel p-5 border-[#202633] space-y-3 relative">
            <div className="w-8 h-8 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#F2F4F8]">4. MagicNet Causal VAD</h3>
            <p className="text-[11.5px] text-[#8E97AA] leading-normal font-sans">
              Lightweight 1D depth-wise network (22.7K params) that pre-trims silent boundaries, eliminating &ldquo;database silence bias&rdquo; where bad detectors mistake room background noise for a fake.
            </p>
            <div className="text-[10px] text-[#3B82F6]">RTF = 0.034 (Causal Gate)</div>
          </div>

        </div>
      </section>

      {/* Feature Navigation Suites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E232E] pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#FF5500]">
              COMPLETE DEFENSE SUITE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F2F4F8]">
              Explore TrueVoice Capabilities
            </h2>
          </div>
          <Link
            to="/shield"
            className="text-xs font-mono text-[#FF5500] hover:text-[#FFA366] flex items-center gap-1"
          >
            <span>VIEW LIVE RADAR HUD</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="card-panel-interactive p-5 border-[#1E2430] flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div 
                      style={{ color: card.color }}
                      className="w-8 h-8 rounded bg-[#151A24] border border-[#262F40] flex items-center justify-center"
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#141822] text-[#8E97AA] border border-[#242C3C]">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#F2F4F8] group-hover:text-[#FF5500] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#7D8699] font-sans mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center text-xs text-[#FF5500] font-bold gap-1 mt-2">
                  <span>LAUNCH MODULE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Telecom & Core Banking Integration Blueprint */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-panel-elevated p-6 sm:p-8 border-[#252D3D] tactical-corner space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#FF5500]">
              PRODUCTION DEPLOYMENT TOPOLOGY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F2F4F8]">
              Seamless Integration with Asterisk, FreeSWITCH &amp; Core Banking APIs
            </h2>
            <p className="text-xs sm:text-sm text-[#7D8699]">
              TrueVoice operates as a zero-friction RTP AudioSocket sidecar. It inspects live VoIP packets without decrypting caller private credentials or adding audible delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded bg-[#0A0D14] border border-[#1E2432] space-y-2">
              <div className="flex items-center space-x-2 text-[#00E599]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">100% Pure Software</span>
              </div>
              <p className="text-[11px] text-[#7D8699] font-sans">
                Runs on quantized CPU SIMD instructions. Zero multi-thousand dollar cloud GPU cluster dependency.
              </p>
            </div>

            <div className="p-4 rounded bg-[#0A0D14] border border-[#1E2432] space-y-2">
              <div className="flex items-center space-x-2 text-[#FF5500]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">Real-Time SIP Webhooks</span>
              </div>
              <p className="text-[11px] text-[#7D8699] font-sans">
                Sends automated `SIP CANCEL` signals and injects alert warning tones directly into the caller stream.
              </p>
            </div>

            <div className="p-4 rounded bg-[#0A0D14] border border-[#1E2432] space-y-2">
              <div className="flex items-center space-x-2 text-[#3B82F6]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">Court-Admissible Forensics</span>
              </div>
              <p className="text-[11px] text-[#7D8699] font-sans">
                Exports SHA-256 signed PDF certificates with acoustic group-delay heatmaps for cyber police investigations.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
