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
