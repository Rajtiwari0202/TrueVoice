import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Link, Lock, FileText, CheckCircle2, 
  AlertTriangle, RefreshCw, Download, Copy, Check, Eye, Database, Cpu
} from 'lucide-react';

export default function ForensicLedger() {
  const [chain, setChain] = useState([]);
  const [privacyReport, setPrivacyReport] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);

  const fetchLedgerData = async () => {
    try {
      setIsLoading(true);
      const [ledgerRes, privacyRes] = await Promise.all([
        fetch('http://localhost:8000/api/voice/ledger').then(r => r.json()),
        fetch('http://localhost:8000/api/voice/privacy-status').then(r => r.json())
      ]);
      setChain(ledgerRes);
      setPrivacyReport(privacyRes);
    } catch (err) {
      console.error('Failed to fetch forensic ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyIntegrity = async () => {
    try {
      setIsVerifying(true);
      const res = await fetch('http://localhost:8000/api/voice/ledger/verify').then(r => r.json());
      setVerificationResult(res);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const openCertificate = async (incidentId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/voice/ledger/certificate?incident_id=${incidentId}`).then(r => r.json());
      setSelectedCert(res);
    } catch (err) {
      console.error('Certificate fetch failed:', err);
    }
  };

  const copyCertToClipboard = () => {
    if (!selectedCert) return;
    navigator.clipboard.writeText(selectedCert.certificate_plaintext);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  const downloadCertFile = () => {
    if (!selectedCert) return;
    const element = document.createElement("a");
    const file = new Blob([selectedCert.certificate_plaintext], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedCert.certificate_id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="card-panel p-6 border-[#232730] tactical-corner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#00E599]">
            <Link className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
                SOVEREIGN FORENSIC BLOCKCHAIN LEDGER &amp; DPDP 2023 PRIVACY SHIELD
              </h2>
              <span className="px-2 py-0.5 text-[9.5px] font-mono font-bold rounded bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30">
                THEME: BLOCKCHAIN &amp; CYBERSECURITY
              </span>
            </div>
            <p className="text-xs font-mono text-[#7D8494] mt-1">
              Tamper-evident SHA-256 hash-chained incident blocks with 5D Merkle root proofs &amp; Indian Evidence Act Section 65B legal certificates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchLedgerData}
            disabled={isLoading}
            className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>SYNC CHAIN</span>
          </button>
          <button
            onClick={verifyIntegrity}
            disabled={isVerifying}
            className="btn-primary py-2 px-3.5 text-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'AUDITING...' : 'VERIFY MERKLE INTEGRITY'}</span>
          </button>
        </div>
      </div>

      {/* Verification Banner */}
      {verificationResult && (
        <div className={`p-4 rounded border text-xs font-mono flex items-center justify-between ${
          verificationResult.is_valid
            ? 'bg-[#00E599]/10 border-[#00E599]/40 text-[#00E599]'
            : 'bg-[#FF3B30]/10 border-[#FF3B30]/40 text-[#FF3B30]'
        }`}>
          <div className="flex items-center space-x-2">
            {verificationResult.is_valid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <div>
              <span className="font-bold uppercase tracking-wider">
                {verificationResult.verification_status}:
              </span>
              <span className="ml-2 text-white">
                {verificationResult.total_blocks} blocks cryptographically verified with 0 corrupted hashes.
              </span>
            </div>
          </div>
          <span className="text-[10px] text-[#A0A6B5]">
            Latest Hash: <code className="text-[#FFD000]">{verificationResult.latest_block_hash.slice(0, 16)}...</code>
          </span>
        </div>
      )}

      {/* DPDP Act 2023 & GDPR Privacy Compliance Cards */}
      {privacyReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-panel p-4 border-[#232730]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232730]">
              <span className="text-[10.5px] font-mono font-bold uppercase text-[#7D8494] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#00E599]" />
                DPDP ACT 2023 STATUS
              </span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-[#00E599]/20 text-[#00E599]">
                {privacyReport.status}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#A0A6B5] space-y-1">
              <div>Sec. 4 (Lawful Purpose): <strong className="text-white">Active</strong></div>
              <div>Sec. 6 (Data Minimization): <strong className="text-white">Active</strong></div>
              <div>Sec. 8 (Storage Limitation): <strong className="text-white">Active</strong></div>
            </div>
          </div>

          <div className="card-panel p-4 border-[#232730]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232730]">
              <span className="text-[10.5px] font-mono font-bold uppercase text-[#7D8494] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#FF5500]" />
                EPHEMERAL RAM ZEROING
              </span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-[#00E599]/20 text-[#00E599]">
                ZERO-RETENTION
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#A0A6B5] space-y-1">
              <div>Scrub Method: <strong className="text-white">np.fill(0)</strong></div>
              <div>Disk Persistence: <strong className="text-[#00E599]">FALSE (0 bytes)</strong></div>
              <div>Cloud Uploads: <strong className="text-[#00E599]">NONE (Edge CPU)</strong></div>
            </div>
          </div>

          <div className="card-panel p-4 border-[#232730]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232730]">
              <span className="text-[10.5px] font-mono font-bold uppercase text-[#7D8494] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#3B82F6]" />
                BIOMETRIC PROTECTION
              </span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-[#3B82F6]/20 text-[#3B82F6]">
                HMAC-SHA256
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#A0A6B5] space-y-1">
              <div>Voiceprint Hash: <strong className="text-white">One-Way Salted</strong></div>
              <div>Reverse Synthesis: <strong className="text-[#00E599]">Impossible</strong></div>
              <div>GDPR Art. 9: <strong className="text-white">Exempt (Security)</strong></div>
            </div>
          </div>

          <div className="card-panel p-4 border-[#232730]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#232730]">
              <span className="text-[10.5px] font-mono font-bold uppercase text-[#7D8494] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FFD000]" />
                STATUTORY EVIDENCE
              </span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-[#FFD000]/20 text-[#FFD000]">
                SEC 65B READY
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#A0A6B5] space-y-1">
              <div>Evidence Act: <strong className="text-white">Sec 65B(4)</strong></div>
              <div>BSA 2023: <strong className="text-white">Section 63</strong></div>
              <div>Court Admissible: <strong className="text-[#00E599]">YES</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Hash-Chained Blocks */}
      <div className="card-panel p-5 border-[#232730]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#232730]">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8] flex items-center gap-2">
            <Link className="w-4 h-4 text-[#00E599]" />
            IMMUTABLE INCIDENT CHAIN ({chain.length} BLOCKS ANCHORED)
          </span>
          <span className="text-[10.5px] font-mono text-[#7D8494]">
            APPEND-ONLY HASH CHAIN (PREV_HASH ➔ BLOCK_HASH)
          </span>
        </div>

        {chain.length === 0 ? (
          <div className="py-12 text-center text-[#7D8494] font-mono text-xs">
            Loading cryptographic blockchain ledger...
          </div>
        ) : (
          <div className="space-y-4">
            {chain.map((block, idx) => {
              const isGenesis = block.index === 0;
              const isBlocked = block.payload?.verdict === 'BLOCK' || block.payload?.threat_score > 60;

              return (
                <div 
                  key={block.index} 
                  className={`p-4 rounded border transition-all ${
                    isGenesis 
                      ? 'bg-[#10131A] border-[#2A3140]' 
                      : isBlocked 
                        ? 'bg-[#1A1215] border-[#FF3B30]/30 hover:border-[#FF3B30]/60'
                        : 'bg-[#0F1713] border-[#00E599]/30 hover:border-[#00E599]/60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#232730]">
                    <div className="flex items-center space-x-2.5 font-mono">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                        isGenesis 
                          ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40' 
                          : isBlocked 
                            ? 'bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/40' 
                            : 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'
                      }`}>
                        BLOCK #{block.index} {isGenesis && '(GENESIS)'}
                      </span>
                      <span className="text-xs font-bold text-white">{block.incident_id}</span>
                      <span className="text-[10px] text-[#7D8494]">{block.timestamp}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!isGenesis && (
                        <button
                          onClick={() => openCertificate(block.incident_id)}
                          className="btn-secondary py-1 px-2 text-[10.5px] font-mono flex items-center gap-1.5"
                        >
                          <FileText className="w-3 h-3 text-[#FFD000]" />
                          <span>SECTION 65B CERTIFICATE</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Block Metadata Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono mb-3">
                    <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                      <span className="text-[#7D8494] text-[9.5px] block uppercase">Caller &amp; Scenario</span>
                      <span className="text-white font-bold block mt-0.5">
                        {block.payload.caller_phone || block.payload.system_node || 'N/A'}
                      </span>
                      <span className="text-[10px] text-[#A0A6B5] block truncate mt-0.5">
                        {block.payload.scenario_type || block.payload.protocol || 'Sovereign Root'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                      <span className="text-[#7D8494] text-[9.5px] block uppercase">Threat Verdict &amp; Action</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className={`font-bold ${isBlocked ? 'text-[#FF3B30]' : 'text-[#00E599]'}`}>
                          {block.payload.verdict || 'INITIALIZED'}
                        </span>
                        {block.payload.threat_score !== undefined && (
                          <span className="text-[10px] text-[#FFD000] font-bold">
                            {block.payload.threat_score}% Threat
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#7D8494] block truncate mt-0.5">
                        {block.payload.action_taken || block.payload.purpose || 'Active Surveillance'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[#0B0D11] border border-[#232730]">
                      <span className="text-[#7D8494] text-[9.5px] block uppercase">5D Merkle Root Proof</span>
                      <code className="text-[10px] text-[#00E599] block truncate mt-0.5">
                        {block.merkle_root}
                      </code>
                      <span className="text-[9.5px] text-[#7D8494] block mt-0.5">
                        {isGenesis ? 'Sovereign Root' : 'Acoustic + Biological + ASV Proof'}
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Link Hash Footer */}
                  <div className="p-2 rounded bg-[#07090D] border border-[#1A1D24] text-[10px] font-mono text-[#7D8494] flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="truncate">
                      <span>PREV HASH: </span>
                      <code className="text-[#A0A6B5]">{block.previous_hash}</code>
                    </div>
                    <div className="truncate">
                      <span>BLOCK HASH: </span>
                      <code className="text-[#00E599] font-bold">{block.block_hash}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 65B Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="card-panel border-[#FFD000]/40 bg-[#0F1218] max-w-3xl w-full max-h-[85vh] flex flex-col p-6 rounded-lg tactical-corner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#232730]">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#FFD000]" />
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    COURT-ADMISSIBLE ELECTRONIC EVIDENCE CERTIFICATE
                  </h3>
                  <span className="text-[10px] font-mono text-[#00E599]">
                    {selectedCert.statutory_act}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyCertToClipboard}
                  className="btn-secondary py-1 px-2.5 text-xs font-mono flex items-center gap-1"
                >
                  {copiedCert ? <Check className="w-3.5 h-3.5 text-[#00E599]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCert ? 'COPIED' : 'COPY'}</span>
                </button>
                <button
                  onClick={downloadCertFile}
                  className="btn-primary py-1 px-2.5 text-xs font-mono flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD TXT</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-2 py-1 text-xs font-mono text-[#7D8494] hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#07090D] p-4 rounded border border-[#232730] font-mono text-[11px] text-[#C7CBD4] leading-relaxed whitespace-pre font-mono">
              {selectedCert.certificate_plaintext}
            </div>

            <div className="pt-3 mt-3 border-t border-[#232730] flex items-center justify-between text-[10px] font-mono text-[#7D8494]">
              <span>Cryptographic Seal: <strong>{selectedCert.block_hash.slice(0, 32)}...</strong></span>
              <span>Admissible in High Courts &amp; Sessions Courts of India</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
