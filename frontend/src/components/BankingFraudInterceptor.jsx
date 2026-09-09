import React, { useState } from 'react';
import { Lock, ShieldAlert, ShieldCheck, DollarSign, Building2, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function BankingFraudInterceptor({ onBankingEvaluated }) {
  const [callerName, setCallerName] = useState("Rajesh Malhotra (Chief Financial Officer)");
  const [transferAmount, setTransferAmount] = useState("₹50,00,000");
  const [beneficiaryAcc, setBeneficiaryAcc] = useState("SBI - 987201928371");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bankingResult, setBankingResult] = useState(null);

  const triggerCallAuthorization = async (isAttack) => {
    try {
      setIsProcessing(true);
      const res = await api.simulateCall({
        scenario_type: isAttack ? "CEO_WIRE_FRAUD" : "BENIGN_FAMILY_CALL",
        caller_claimed_identity: callerName,
        caller_phone: "+91 99887 76655",
        target_action: `Wire Transfer Approval of ${transferAmount} to ${beneficiaryAcc}`
      });

      setBankingResult(res);
      if (onBankingEvaluated) onBankingEvaluated(res.voice_evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="card-panel p-5 border-[#232730] tactical-corner">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
              CORE BANKING &amp; CXO VOICE FRAUD INTERCEPTOR
            </h2>
            <p className="text-[11px] font-mono text-[#7D8494] mt-0.5">
              Simulated Core Banking API / Telephony gateway protecting high-value transactions against voice clone authorization
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Dispatch Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 card-panel p-5 border-[#232730] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232730]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF5500]" />
              INCOMING WIRE AUTHORIZATION CALL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181C24] text-[#00E599] border border-[#2B313E]">
              SECURE SIP TRUNK #409
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#7D8494] block mb-1">CLAIMED CXO IDENTITY</label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full input-clean"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#7D8494] block mb-1">TRANSFER AMOUNT</label>
                <input
                  type="text"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full input-clean font-bold text-[#FFD000]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#7D8494] block mb-1">TARGET BENEFICIARY ACCOUNT</label>
                <input
                  type="text"
                  value={beneficiaryAcc}
                  onChange={(e) => setBeneficiaryAcc(e.target.value)}
                  className="w-full input-clean"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => triggerCallAuthorization(true)}
              disabled={isProcessing}
              className="btn-danger py-2 text-xs"
            >
              <PhoneCall className="w-3 h-3" />
              <span>TEST AI CLONE CALL (ATTACK)</span>
            </button>

            <button
              onClick={() => triggerCallAuthorization(false)}
              disabled={isProcessing}
              className="btn-success py-2 text-xs"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>TEST GENUINE CXO CALL (SAFE)</span>
            </button>
          </div>
        </div>

        {/* Real-Time Banking Telemetry */}
        <div className="lg:col-span-6 card-panel p-5 border-[#232730] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
                AUTOMATED API ACTION STATUS
              </span>
              <span className="text-[10px] font-mono text-[#7D8494]">SUB-50ms ZERO-TRUST GATE</span>
            </div>

            {bankingResult ? (
              <div className="space-y-3 font-mono text-xs">
                <div className={`p-3.5 rounded border ${
                  bankingResult.voice_evaluation.is_synthetic 
                    ? 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]'
                    : 'bg-[#00E599]/10 border-[#00E599]/30 text-[#00E599]'
                }`}>
                  <div className="flex items-center justify-between font-bold text-sm mb-1">
                    <span>{bankingResult.automated_defense_action.status}</span>
                    <span>{bankingResult.voice_evaluation.threat_score}% THREAT</span>
                  </div>
                  <p className="text-xs">{bankingResult.automated_defense_action.alert_message}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                    <span className="text-[#7D8494] text-[9.5px] block">CORE BANKING TRIGGER</span>
                    <span className="text-[#F2F4F8] font-bold block mt-0.5">
                      {bankingResult.automated_defense_action.action_taken}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                    <span className="text-[#7D8494] text-[9.5px] block">LMT PHYSIOLOGY</span>
                    <span className="text-[#00E599] font-bold block mt-0.5">
                      {bankingResult.voice_evaluation.humanity_index}% Organic Index
                    </span>
                  </div>
                </div>

                {/* Biometric ASV & Cross-Session Consistency */}
                {bankingResult.voice_evaluation?.speaker_verification && (
                  <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#7D8494] text-[9.5px] font-bold uppercase">
                        Biometric Voiceprint (Cross-Session ASV)
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        bankingResult.voice_evaluation.speaker_verification.mismatch_detected
                          ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40'
                          : 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'
                      }`}>
                        {bankingResult.voice_evaluation.speaker_verification.cross_session_consistency}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#C7CBD4]">
                      <span>Enrolled Baseline: <strong className="text-white">{bankingResult.voice_evaluation.speaker_verification.claimed_identity}</strong></span>
                      <span>Cosine Match: <strong className={bankingResult.voice_evaluation.speaker_verification.similarity_score > 0.7 ? "text-[#00E599]" : "text-[#FF3B30]"}>{(bankingResult.voice_evaluation.speaker_verification.similarity_score * 100).toFixed(1)}%</strong></span>
                    </div>
                  </div>
                )}

                {/* Contextual Enrichment Multipliers */}
                {bankingResult.voice_evaluation?.contextual_enrichment && (
                  <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730] text-[11px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#7D8494] text-[9.5px] font-bold uppercase">Contextual Risk Engine</span>
                      <span className="text-[#FFD000] font-bold">{bankingResult.voice_evaluation.contextual_enrichment.context_risk_multiplier}x Multiplier</span>
                    </div>
                    <div className="text-[10px] text-[#A0A6B5] space-y-0.5">
                      <div>NCRP/I4C Blacklist: <strong className={bankingResult.voice_evaluation.contextual_enrichment.i4c_blacklist_record.includes('FLAGGED') ? 'text-[#FF3B30]' : 'text-[#00E599]'}>{bankingResult.voice_evaluation.contextual_enrichment.i4c_blacklist_record}</strong></div>
                      <div>Identified Flags: <span className="text-[#E2E6EE]">{bankingResult.voice_evaluation.contextual_enrichment.risk_factors?.join(' • ') || 'None'}</span></div>
                    </div>
                  </div>
                )}

                {/* Pre-Transaction Warning Prompt */}
                {bankingResult.automated_defense_action?.pre_transaction_warning && (
                  <div className="p-2.5 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 text-xs">
                    <span className="text-[#FF5500] font-bold text-[10px] uppercase block mb-1">
                      Pre-Transaction IVR Alert Prompt:
                    </span>
                    <p className="text-[11px] text-[#F2F4F8] leading-tight italic">
                      "{bankingResult.automated_defense_action.pre_transaction_warning.prompt_text}"
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-[#A0A6B5]">
                      <span>Tone: <code className="text-[#FFD000]">{bankingResult.automated_defense_action.pre_transaction_warning.audio_tone_injection}</code></span>
                      <span>Action: <strong className="text-white">{bankingResult.automated_defense_action.pre_transaction_warning.ivr_recommended_action}</strong></span>
                    </div>
                  </div>
                )}

                {/* Multi-Channel Alerts Dispatched */}
                {bankingResult.automated_defense_action?.multi_channel_dispatch?.channels_notified && (
                  <div className="p-2 rounded bg-[#0B0D11] border border-[#232730]">
                    <span className="text-[#7D8494] text-[9px] font-bold uppercase block mb-1">Dispatched Alert Channels:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {bankingResult.automated_defense_action.multi_channel_dispatch.channels_notified.map((ch, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#181C24] text-[#00E599] border border-[#2B313E]">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#FF5500] text-[9.5px] font-bold block mb-1">AUDIT RATIONALE:</span>
                  <p className="text-[11px] text-[#A0A6B5] leading-normal">
                    {bankingResult.voice_evaluation.xai_explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[#7D8494] font-mono text-xs">
                Click one of the test buttons to initiate an incoming voice authorization call.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
