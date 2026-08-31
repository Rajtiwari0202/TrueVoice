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
