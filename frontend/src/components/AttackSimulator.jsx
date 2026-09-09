import React, { useState } from 'react';
import { Zap, Play, ShieldAlert, ShieldCheck, AlertOctagon, UserCheck, PhoneCall, DollarSign, Lock } from 'lucide-react';
import { api } from '../services/api';

export default function AttackSimulator({ onAttackEvaluated }) {
  const [loadingScenario, setLoadingScenario] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  const scenarios = [
    {
      id: 'DIGITAL_ARREST_SCAM',
      title: 'Digital Arrest Extortion Call',
      attacker: 'Fake CBI Officer / Police Inspector',
      phone: '+91 98112 34567',
      target: 'Demand ₹15,00,000 to "avoid immediate arrest"',
      vocoder: 'HiFi-GAN Neural Vocoder (Trained on Indian Police Officer Voice)',
      accent: 'Hindi-English Native',
      badge: 'HIGH SEVERITY ATTACK',
      badgeColor: 'badge-rose'
    },
    {
      id: 'CEO_WIRE_FRAUD',
      title: 'CEO / CXO Urgent Wire Fraud',
      attacker: 'Cloned Voice of Managing Director',
      phone: '+91 99887 76655',
      target: 'Authorize ₹50,00,000 vendor payment immediately',
      vocoder: 'ElevenLabs Turbo v2.5 Zero-Shot Clone',
      accent: 'Indian Corporate English',
      badge: 'FINANCIAL THREAT',
      badgeColor: 'badge-rose'
    },
    {
      id: 'FAMILY_DISTRESS_SCAM',
      title: 'Family Member Distress Voice Note',
      attacker: 'Cloned Voice of Son / Daughter',
      phone: '+91 91234 56789',
      target: 'Emergency hospital payment demand',
      vocoder: 'Coqui XTTS v2 Latent Diffusion Vocoder',
      accent: 'Vernacular Mixed Hindi',
      badge: 'SOCIAL ENGINEERING',
      badgeColor: 'badge-rose'
    },
    {
      id: 'BENIGN_FAMILY_CALL',
      title: 'Authentic Human Family Call',
      attacker: 'Legitimate Caller (Living Human)',
      phone: '+91 98765 12340',
      target: 'Normal conversational discussion',
      vocoder: 'Organic Human Vocal Tract (Active LMT 9.4 Hz)',
      accent: 'Natural Indian Human Speech',
      badge: 'SAFE BENIGN CALL',
      badgeColor: 'badge-emerald'
    }
  ];

  const runSimulation = async (scenario) => {
    try {
      setLoadingScenario(scenario.id);
      const res = await api.simulateCall({
        scenario_type: scenario.id,
        caller_claimed_identity: scenario.attacker,
        caller_phone: scenario.phone,
        target_action: scenario.target
      });
      setSimulationResult(res);
      if (onAttackEvaluated) onAttackEvaluated(res.voice_evaluation);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setLoadingScenario(null);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="card-panel p-5 border-[#232730] tactical-corner">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
              LIVE VOICE CLONE CYBER ATTACK SIMULATOR
            </h2>
            <p className="text-[11px] font-mono text-[#7D8494] mt-0.5">
              Inject state-of-the-art neural speech deepfakes vs authentic human voices into the real-time defense pipeline
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((s) => {
          const isSelected = simulationResult?.call_metadata?.scenario_type === s.id;
          const isLoading = loadingScenario === s.id;

          return (
            <div 
              key={s.id}
              className={`card-panel p-4 border transition-all ${
                isSelected ? 'border-[#FF5500] bg-[#141720]' : 'border-[#232730] hover:border-[#353C4D]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232730]">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span className="text-xs font-mono font-bold text-[#F2F4F8]">{s.title}</span>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-[#A0A6B5] mb-4">
                <div><span className="text-[#7D8494]">Claimed Identity:</span> <span className="text-[#F2F4F8]">{s.attacker}</span></div>
                <div><span className="text-[#7D8494]">Target Action:</span> <span className="text-[#F2F4F8]">{s.target}</span></div>
                <div><span className="text-[#7D8494]">Vocoder Tech:</span> <span className="text-[#00E599]">{s.vocoder}</span></div>
                <div><span className="text-[#7D8494]">Accent / Dialect:</span> <span className="text-[#E2E6EE]">{s.accent}</span></div>
              </div>

              <button
                onClick={() => runSimulation(s)}
                disabled={isLoading}
                className="w-full btn-primary py-2 text-xs"
              >
                {isLoading ? (
                  <span>INJECTING AUDIO STREAM...</span>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>LAUNCH SIMULATION ATTACK</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-Time Attack Response Inspection Modal / Panel */}
      {simulationResult && (
        <div className="card-panel p-5 border-[#FF5500]/40 bg-[#12151D] tactical-corner">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[#FF5500]">
              <AlertOctagon className="w-4 h-4" />
              <span>DEFENSE SYSTEM INTERCEPTION REPORT</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#181C24] text-xs font-mono text-[#A0A6B5] border border-[#2B313E]">
              LATENCY: {simulationResult.voice_evaluation.latency_ms} ms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs mb-4">
            <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[#7D8494] text-[10px] block">SECURITY VERDICT</span>
              <span className={`text-base font-bold mt-0.5 block ${
                simulationResult.voice_evaluation.is_synthetic ? 'text-[#FF3B30]' : 'text-[#00E599]'
              }`}>
                {simulationResult.voice_evaluation.verdict}
              </span>
              <span className="text-[10px] text-[#A0A6B5]">{simulationResult.automated_defense_action.status}</span>
            </div>

            <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[#7D8494] text-[10px] block">THREAT INDEX</span>
              <span className={`text-base font-bold mt-0.5 block ${
                simulationResult.voice_evaluation.threat_score > 65 ? 'text-[#FF3B30]' : 'text-[#00E599]'
              }`}>
                {simulationResult.voice_evaluation.threat_score}%
              </span>
              <span className="text-[10px] text-[#A0A6B5]">Humanity Index: {simulationResult.voice_evaluation.humanity_index}%</span>
            </div>

            <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[#7D8494] text-[10px] block">AUTOMATED MITIGATION ACTION</span>
              <span className="text-sm font-bold text-[#FF5500] mt-0.5 block truncate">
                {simulationResult.automated_defense_action.action_taken}
              </span>
              <span className="text-[10px] text-[#00E599]">Zero-Trust Enforcement</span>
            </div>
          </div>

          {/* Automated Defense Banner */}
          <div className={`p-3 rounded border text-xs font-mono mb-4 ${
            simulationResult.voice_evaluation.is_synthetic
              ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]'
              : 'bg-[#00E599]/10 border-[#00E599]/30 text-[#00E599]'
          }`}>
            <span className="font-bold">SYSTEM RESPONSE: </span>
            {simulationResult.automated_defense_action.alert_message}
          </div>

          {/* Deep Learning & Biometric ASV Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 font-mono text-xs">
            {/* Deep Learning */}
            {simulationResult.voice_evaluation?.deep_learning && (
              <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#7D8494] text-[10px] font-bold uppercase">Deep Learning Neural Net</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40">
                    SincNet + MHA Active
                  </span>
                </div>
                <div className="text-[11px] text-[#C7CBD4] space-y-1">
                  <div>Model: <strong className="text-white">{simulationResult.voice_evaluation.deep_learning.model_architecture}</strong></div>
                  <div className="flex justify-between text-[10px] text-[#A0A6B5]">
                    <span>Params: <strong>{simulationResult.voice_evaluation.deep_learning.parameters_count}</strong></span>
                    <span>Filters: <strong>{simulationResult.voice_evaluation.deep_learning.sincnet_filters} Sinc filters</strong></span>
                  </div>
                  <div className="text-[10px] text-[#A0A6B5]">
                    Neural Logits: <code className="text-[#FFD000]">[{simulationResult.voice_evaluation.deep_learning.neural_logits?.join(', ')}]</code>
                  </div>
                </div>
              </div>
            )}

            {/* Biometric ASV */}
            {simulationResult.voice_evaluation?.speaker_verification && (
              <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#7D8494] text-[10px] font-bold uppercase">Biometric ASV Consistency</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    simulationResult.voice_evaluation.speaker_verification.mismatch_detected
                      ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40'
                      : 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'
                  }`}>
                    {simulationResult.voice_evaluation.speaker_verification.cross_session_consistency}
                  </span>
                </div>
                <div className="text-[11px] text-[#C7CBD4] space-y-1">
                  <div>Claimed: <strong className="text-white">{simulationResult.voice_evaluation.speaker_verification.claimed_identity}</strong></div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#A0A6B5]">Voiceprint Match:</span>
                    <span className={simulationResult.voice_evaluation.speaker_verification.similarity_score > 0.7 ? "text-[#00E599] font-bold" : "text-[#FF3B30] font-bold"}>
                      {(simulationResult.voice_evaluation.speaker_verification.similarity_score * 100).toFixed(1)}% Cosine
                    </span>
                  </div>
                  <div className="text-[10px] text-[#7D8494]">
                    Historical enrollment comparison: {simulationResult.voice_evaluation.speaker_verification.is_enrolled_speaker ? 'Profile Matched' : 'Unenrolled Caller'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contextual Enrichment & Alerting Layer */}
          {(simulationResult.voice_evaluation?.contextual_enrichment || simulationResult.automated_defense_action?.pre_transaction_warning) && (
            <div className="space-y-3 mb-4 font-mono text-xs">
              {simulationResult.voice_evaluation?.contextual_enrichment && (
                <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#7D8494] text-[10px] font-bold uppercase">Contextual Risk Enrichment</span>
                    <span className="text-[#FFD000] font-bold">{simulationResult.voice_evaluation.contextual_enrichment.context_risk_multiplier}x Multiplier</span>
                  </div>
                  <div className="text-[11px] text-[#A0A6B5] flex justify-between">
                    <span>NCRP / I4C Portal: <strong className={simulationResult.voice_evaluation.contextual_enrichment.i4c_blacklist_record.includes('FLAGGED') ? 'text-[#FF3B30]' : 'text-[#00E599]'}>{simulationResult.voice_evaluation.contextual_enrichment.i4c_blacklist_record}</strong></span>
                    <span>Origin: <strong className="text-white">{simulationResult.call_metadata?.phone || '+91 98112 34567'}</strong></span>
                  </div>
                </div>
              )}

              {simulationResult.automated_defense_action?.pre_transaction_warning && (
                <div className="p-3 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 text-xs">
                  <span className="text-[#FF5500] font-bold text-[10px] uppercase block mb-1">
                    Pre-Transaction Real-Time Warning Prompt:
                  </span>
                  <p className="text-[11px] text-[#F2F4F8] italic leading-tight mb-2">
                    "{simulationResult.automated_defense_action.pre_transaction_warning.prompt_text}"
                  </p>
                  <div className="flex flex-wrap gap-3 text-[10px] text-[#A0A6B5]">
                    <span>Tone: <strong className="text-[#FFD000]">{simulationResult.automated_defense_action.pre_transaction_warning.audio_tone_injection}</strong></span>
                    <span>IVR Action: <strong className="text-white">{simulationResult.automated_defense_action.pre_transaction_warning.ivr_recommended_action}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* XAI Explanation */}
          <div className="p-3.5 rounded bg-[#0B0D11] border border-[#232730]">
            <span className="text-xs font-mono font-bold text-[#FF5500] block mb-1">
              FORENSIC MATHEMATICAL EVIDENCE (XAI):
            </span>
            <p className="text-xs font-mono text-[#C7CBD4] leading-relaxed">
              {simulationResult.voice_evaluation.xai_explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
