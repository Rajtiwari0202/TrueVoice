import React, { useState } from 'react';
import { Wifi, Signal, Play, ShieldAlert, ShieldCheck, Activity, Sliders, Layers, RefreshCw, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function CodecRobustnessStudio({ onCodecEvaluated }) {
  const [selectedCodec, setSelectedCodec] = useState("OPUS");
  const [packetLoss, setPacketLoss] = useState(5);
  const [isCloneTest, setIsCloneTest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [codecResult, setCodecResult] = useState(null);

  const codecs = [
    { id: "OPUS", name: "OPUS (WhatsApp / WebRTC)", bitrate: "24.4 kbps", type: "Hybrid LPC+CELT", eerscore: "0.29% EER" },
    { id: "SILK", name: "SILK (Skype / VoIP)", bitrate: "24.4 kbps", type: "Variable Bitrate LPC", eerscore: "0.47% EER" },
    { id: "IVAS", name: "IVAS (3GPP 5G Immersive)", bitrate: "24.4 kbps", type: "Spatial MDCT Codec", eerscore: "0.50% EER" },
    { id: "AMR-WB", name: "AMR-WB (4G VoLTE Calling)", bitrate: "23.85 kbps", type: "ACELP Speech Codec", eerscore: "0.58% EER" },
    { id: "EVS", name: "EVS (5G Ultra-HD Voice)", bitrate: "24.4 kbps", type: "Enhanced Voice Services", eerscore: "0.63% EER" },
    { id: "G.711", name: "G.711 (PSTN Landline / A-law)", bitrate: "64.0 kbps", type: "Narrowband Companded PCM", eerscore: "0.85% EER" },
  ];

  const runCodecTest = async () => {
    try {
      setIsLoading(true);
      const res = await api.simulateCall({
        scenario_type: isCloneTest ? "DIGITAL_ARREST_SCAM" : "BENIGN_FAMILY_CALL",
        caller_claimed_identity: `${isCloneTest ? "Cloned Voice" : "Authentic Voice"} over ${selectedCodec} (${packetLoss}% Packet Loss)`,
        caller_phone: "+91 98765 00112",
        target_action: `Transmission over ${selectedCodec} with ${packetLoss}% PLR`
      });

      setCodecResult(res);
      if (onCodecEvaluated) onCodecEvaluated(res.voice_evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="card-panel p-5 border-[#232730] tactical-corner">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500]">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
              REAL-WORLD COMMUNICATION DEGRADATION &amp; CODEC ROBUSTNESS STUDIO
            </h2>
            <p className="text-[11px] font-mono text-[#7D8494] mt-0.5">
              Tested on 30 Real-World Degradation Scenarios (6 Codecs &times; 5 Packet Loss Levels) per Shi et al. (August 2025)
            </p>
          </div>
        </div>
      </div>

      {/* Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
        
        {/* Codec Selection */}
        <div className="lg:col-span-6 card-panel p-5 border-[#232730] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232730]">
            <span className="text-xs font-bold uppercase text-[#F2F4F8] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#FF5500]" />
              TELEPHONY CODEC SIMULATOR
            </span>
            <span className="text-[10px] text-[#A0A6B5]">RAWBOOST COMPATIBLE</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-[#7D8494] block">SELECT TRANSMISSION CODEC</label>
            <div className="grid grid-cols-2 gap-2">
              {codecs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCodec(c.id)}
                  className={`p-2.5 rounded border text-left transition ${
                    selectedCodec === c.id
                      ? 'bg-[#181C26] border-[#FF5500] text-[#F2F4F8]'
                      : 'bg-[#0B0D11] border-[#232730] text-[#8C93A3] hover:border-[#3B4252]'
                  }`}
                >
                  <div className="font-bold text-[11px] text-[#F2F4F8]">{c.name}</div>
                  <div className="text-[9.5px] text-[#00E599] mt-0.5">{c.eerscore} &bull; {c.bitrate}</div>
                  <div className="text-[9px] text-[#7D8494]">{c.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Packet Loss Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[10px]">
              <span className="text-[#7D8494]">PACKET LOSS RATE (PLR):</span>
              <span className="font-bold text-[#FFD000]">{packetLoss}% Packet Loss</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={packetLoss}
              onChange={(e) => setPacketLoss(parseInt(e.target.value))}
              className="w-full accent-[#FF5500] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#7D8494] mt-0.5">
              <span>0% (Clean)</span>
              <span>5% (4G VoLTE)</span>
              <span>10% (Weak Signal)</span>
              <span>20% (Severe Network Loss)</span>
            </div>
          </div>

          {/* Test Type Toggle */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setIsCloneTest(true)}
              className={`py-2 px-3 rounded text-xs font-bold border transition ${
                isCloneTest ? 'bg-[#FF3B30]/20 border-[#FF3B30] text-[#FF3B30]' : 'bg-[#111318] border-[#232730] text-[#7D8494]'
              }`}
            >
              TEST CLONED AI SPEECH
            </button>
            <button
              onClick={() => setIsCloneTest(false)}
              className={`py-2 px-3 rounded text-xs font-bold border transition ${
                !isCloneTest ? 'bg-[#00E599]/20 border-[#00E599] text-[#00E599]' : 'bg-[#111318] border-[#232730] text-[#7D8494]'
              }`}
            >
              TEST AUTHENTIC HUMAN
            </button>
          </div>

          <button
            onClick={runCodecTest}
            disabled={isLoading}
            className="w-full btn-primary py-2.5 text-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>TRANSMIT THROUGH CODEC &amp; EVALUATE</span>
          </button>
        </div>

        {/* MGAA Multi-Granularity Saliency Output */}
        <div className="lg:col-span-6 card-panel p-5 border-[#232730] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
              <span className="text-xs font-bold uppercase text-[#F2F4F8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF5500]" />
                MGAA MULTI-GRANULARITY ATTENTION SALIENCY
              </span>
              <span className="text-[10px] text-[#00E599]">ADAPTIVE FUSION (AFM)</span>
            </div>

            {codecResult ? (
              <div className="space-y-4">
                <div className={`p-3 rounded border ${
                  codecResult.voice_evaluation.is_synthetic
                    ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]'
                    : 'bg-[#00E599]/10 border-[#00E599]/30 text-[#00E599]'
                }`}>
                  <div className="flex items-center justify-between font-bold text-xs mb-0.5">
                    <span>{codecResult.voice_evaluation.verdict} : {codecResult.voice_evaluation.action}</span>
                    <span>{codecResult.voice_evaluation.threat_score}% Threat</span>
                  </div>
                  <div className="text-[10px] text-[#A0A6B5]">
                    Dominant Granularity: <span className="text-[#F2F4F8] font-bold">{codecResult.voice_evaluation.mgaa_granularity}</span>
                  </div>
                </div>

                {/* Saliency Weights across scales k in {3, 5, 7, 9} */}
                <div className="p-3 rounded bg-[#0B0D11] border border-[#232730] space-y-2">
                  <span className="text-[10px] text-[#7D8494] block uppercase">MULTI-SCALE ATTENTION RECEPTIVE FIELDS:</span>
                  
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A0A6B5]">Phoneme Scale (k=3, 95ms):</span>
                      <span className="text-[#00E599] font-bold">
                        {codecResult.voice_evaluation.metrics?.mgaa_branch_weights?.Phoneme_k3_weight || 0.22}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A0A6B5]">Formant Transitions (k=5, 159ms):</span>
                      <span className="text-[#00E599] font-bold">
                        {codecResult.voice_evaluation.metrics?.mgaa_branch_weights?.Formant_k5_weight || 0.24}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A0A6B5]">Syllabic Structure (k=7, 222ms):</span>
                      <span className="text-[#00E599] font-bold">
                        {codecResult.voice_evaluation.metrics?.mgaa_branch_weights?.Syllable_k7_weight || 0.19}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A0A6B5]">Word Transitions (k=9, 286ms):</span>
                      <span className="text-[#00E599] font-bold">
                        {codecResult.voice_evaluation.metrics?.mgaa_branch_weights?.Word_k9_weight || 0.18}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A0A6B5]">Global Context (GTFA):</span>
                      <span className="text-[#FF5500] font-bold">
                        {codecResult.voice_evaluation.metrics?.mgaa_branch_weights?.Global_GTFA_weight || 0.17}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[10px] font-bold text-[#FF5500] block mb-1">XAI ATTRIBUTION:</span>
                  <p className="text-[11px] text-[#A0A6B5] leading-normal">
                    {codecResult.voice_evaluation.xai_explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-[#7D8494]">
                Select a codec &amp; packet loss level, then click 'Transmit Through Codec' to test real-world robustness.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
