import React, { useState } from 'react';
import { FileSearch, Upload, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Award, Download } from 'lucide-react';
import { api } from '../services/api';

export default function AudioForensicStudio({ onForensicEvaluated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    try {
      setIsAnalyzing(true);
      const res = await api.analyzeFile(file);
      setAnalysisResult(res);
      if (onForensicEvaluated) onForensicEvaluated(res.evaluation);
    } catch (err) {
      console.error("Forensic analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="card-panel p-5 border-[#232730] tactical-corner">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500]">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
              WHATSAPP &amp; TELEGRAM VOICE NOTE FORENSIC STUDIO
            </h2>
            <p className="text-[11px] font-mono text-[#7D8494] mt-0.5">
              Court-admissible acoustic physics decomposition and tamper-evident synthetic certificate generator
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="card-panel p-8 border-dashed border-[#2F3646] hover:border-[#FF5500]/60 transition-colors text-center">
        <Upload className="w-8 h-8 mx-auto text-[#FF5500] mb-3" />
        <h3 className="text-xs font-mono font-bold text-[#F2F4F8] uppercase">
          DRAG &amp; DROP AUDIO NOTE (.OGG, .M4A, .WAV, .MP3)
        </h3>
        <p className="text-[11px] font-mono text-[#7D8494] mt-1 mb-4">
          Analyzes audio for glottal flow deformation, LMT micro-tremor absence, and vocoder phase aliasing
        </p>

        <label className="btn-primary py-2 px-5 cursor-pointer text-xs">
          <span>SELECT AUDIO EVIDENCE</span>
          <input
            type="file"
            accept="audio/*,.ogg,.wav,.mp3,.m4a"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {selectedFile && (
          <div className="mt-3 text-xs font-mono text-[#00E599]">
            Loaded: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>

      {/* Forensic Report Output */}
      {analysisResult && (
        <div className="card-panel p-6 border-[#232730] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232730]">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#00E599]" />
              <span className="text-xs font-mono font-bold uppercase text-[#F2F4F8]">
                CERTIFIED FORENSIC ANALYSIS CERTIFICATE
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#181C24] text-[10px] font-mono text-[#00E599] border border-[#2B313E]">
              {analysisResult.forensic_certificate.certificate_id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[#7D8494] text-[10px] block">SECURITY VERDICT</span>
              <span className={`text-base font-bold mt-0.5 block ${
                analysisResult.evaluation.is_synthetic ? 'text-[#FF3B30]' : 'text-[#00E599]'
              }`}>
                {analysisResult.evaluation.verdict}
              </span>
              <span className="text-[10px] text-[#A0A6B5]">{analysisResult.forensic_certificate.court_admissible_status}</span>
            </div>

            <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[#7D8494] text-[10px] block">THREAT INDEX</span>
              <span className={`text-base font-bold mt-0.5 block ${
                analysisResult.evaluation.threat_score > 65 ? 'text-[#FF3B30]' : 'text-[#00E599]'
              }`}>
                {analysisResult.evaluation.threat_score}%
              </span>
              <span className="text-[10px] text-[#A0A6B5]">Humanity Index: {analysisResult.evaluation.humanity_index}%</span>
            </div>

            <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
              <span className="text-[#7D8494] text-[10px] block">DETECTED VOCODER</span>
              <span className="text-sm font-bold text-[#FF5500] mt-0.5 block truncate">
                {analysisResult.evaluation.detected_vocoder}
              </span>
              <span className="text-[10px] text-[#A0A6B5]">Phase Variance: {analysisResult.evaluation.metrics.phase_anomaly}</span>
            </div>
          </div>

          {/* Detailed Forensic Explanation */}
          <div className="p-4 rounded bg-[#0B0D11] border border-[#232730]">
            <span className="text-xs font-mono font-bold text-[#FF5500] block mb-1.5">
              FORENSIC ACOUSTIC RATIONALE:
            </span>
            <p className="text-xs font-mono text-[#C7CBD4] leading-relaxed">
              {analysisResult.evaluation.xai_explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
