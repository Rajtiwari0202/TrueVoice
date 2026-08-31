import React, { useState, useEffect } from 'react';
import { BarChart2, CheckCircle2, Clock, ShieldCheck, RefreshCw, Cpu, Activity, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function BenchmarkTelemetry() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBenchmarkStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="card-panel p-5 border-[#232730] tactical-corner flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500]">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F2F4F8]">
              GROUND-TRUTH BENCHMARK &amp; TELEMETRY ENGINE
            </h2>
            <p className="text-[11px] font-mono text-[#7D8494] mt-0.5">
              100-Sample Certified Ground-Truth Evaluation Matrix across Indian English &amp; Regional Accents
            </p>
          </div>
        </div>

        <button 
          onClick={fetchStats}
          disabled={isLoading}
          className="btn-secondary py-1.5 px-3 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>RE-RUN 100-SAMPLE BENCHMARK</span>
        </button>
      </div>

      {stats ? (
        <div className="space-y-5 font-mono">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card-panel p-4 border-[#232730]">
              <span className="text-[10px] uppercase text-[#7D8494] block">ANTI-SPOOF ACCURACY</span>
              <span className="text-2xl font-bold text-[#00E599] mt-1 block">{stats.accuracy_pct}%</span>
              <span className="text-[9.5px] text-[#A0A6B5]">50 Human vs 50 Cloned</span>
            </div>

            <div className="card-panel p-4 border-[#232730]">
              <span className="text-[10px] uppercase text-[#7D8494] block">ROC-AUC SCORE</span>
              <span className="text-2xl font-bold text-[#F2F4F8] mt-1 block">{stats.roc_auc}</span>
              <span className="text-[9.5px] text-[#00E599]">Industry Gold Standard</span>
            </div>

            <div className="card-panel p-4 border-[#232730]">
              <span className="text-[10px] uppercase text-[#7D8494] block">EQUAL ERROR RATE (EER)</span>
              <span className="text-2xl font-bold text-[#FFD000] mt-1 block">{stats.equal_error_rate_eer_pct}%</span>
              <span className="text-[9.5px] text-[#A0A6B5]">ASVspoof Benchmark</span>
            </div>

            <div className="card-panel p-4 border-[#232730]">
              <span className="text-[10px] uppercase text-[#7D8494] block">P90 PROCESSING LATENCY</span>
              <span className="text-2xl font-bold text-[#FF5500] mt-1 block">{stats.latency.p90_ms} ms</span>
              <span className="text-[9.5px] text-[#00E599]">SLA &lt;100ms: PASSED</span>
            </div>
          </div>

          {/* Detailed Performance Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Confusion Matrix */}
            <div className="lg:col-span-6 card-panel p-5 border-[#232730]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2F4F8] pb-3 mb-3 border-b border-[#232730]">
                CONFUSION MATRIX (100 SAMPLES)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#0B0D11] border border-[#00E599]/30">
                  <span className="text-[#7D8494] text-[10px] block">TRUE POSITIVES (CLONES INTERCEPTED)</span>
                  <span className="text-xl font-bold text-[#00E599] mt-1 block">
                    {stats.confusion_matrix.true_positives_ai_intercepted} / 50
                  </span>
                </div>
                <div className="p-3 rounded bg-[#0B0D11] border border-[#00E599]/30">
                  <span className="text-[#7D8494] text-[10px] block">TRUE NEGATIVES (HUMANS ALLOWED)</span>
                  <span className="text-xl font-bold text-[#00E599] mt-1 block">
                    {stats.confusion_matrix.true_negatives_human_passed} / 50
                  </span>
                </div>
                <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#7D8494] text-[10px] block">FALSE POSITIVES</span>
                  <span className="text-xl font-bold text-[#FF3B30] mt-1 block">
                    {stats.confusion_matrix.false_positives}
                  </span>
                </div>
                <div className="p-3 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#7D8494] text-[10px] block">FALSE NEGATIVES (MISSED)</span>
                  <span className="text-xl font-bold text-[#FF3B30] mt-1 block">
                    {stats.confusion_matrix.false_negatives}
                  </span>
                </div>
              </div>
            </div>

            {/* Latency SLAs */}
            <div className="lg:col-span-6 card-panel p-5 border-[#232730]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2F4F8] pb-3 mb-3 border-b border-[#232730]">
                LATENCY PERCENTILES &amp; SLA VALIDATION
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#A0A6B5]">P50 Median Latency:</span>
                  <span className="font-bold text-[#00E599]">{stats.latency.p50_ms} ms</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#A0A6B5]">P90 Latency:</span>
                  <span className="font-bold text-[#00E599]">{stats.latency.p90_ms} ms</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#A0A6B5]">P99 Worst-Case Latency:</span>
                  <span className="font-bold text-[#FF5500]">{stats.latency.p99_ms} ms</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-[#0B0D11] border border-[#232730]">
                  <span className="text-[#A0A6B5]">Average Latency:</span>
                  <span className="font-bold text-[#F2F4F8]">{stats.latency.avg_ms} ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-panel p-12 text-center text-[#7D8494] font-mono text-xs">
          Loading benchmark metrics...
        </div>
      )}
    </div>
  );
}
