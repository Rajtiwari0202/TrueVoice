import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VoiceConsole from './components/VoiceConsole';
import AttackSimulator from './components/AttackSimulator';
import BankingFraudInterceptor from './components/BankingFraudInterceptor';
import AudioForensicStudio from './components/AudioForensicStudio';
import CodecRobustnessStudio from './components/CodecRobustnessStudio';
import BenchmarkTelemetry from './components/BenchmarkTelemetry';
import TechnicalWhitepaper from './components/TechnicalWhitepaper';
import InteractiveArchitectureInspector from './components/InteractiveArchitectureInspector';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('inspector');
  const [isConnected, setIsConnected] = useState(false);
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [stats, setStats] = useState({
    total_chunks_processed: 0,
    clones_intercepted: 0,
    human_verified_chunks: 0,
    active_streams: 0
  });

  const fetchHealth = async () => {
    try {
      const data = await api.getHealth();
      setStats(data.telemetry);
      setIsConnected(true);
    } catch (e) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEvaluationUpdate = (evalResult) => {
    setLatestEvaluation(evalResult);
    fetchHealth();
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F2F4F8] telemetry-grid font-sans flex flex-col selection:bg-[#FF5500] selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isConnected={isConnected} 
        stats={stats} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'inspector' && (
          <InteractiveArchitectureInspector latestEvaluation={latestEvaluation} />
        )}
        {activeTab === 'console' && (
          <VoiceConsole onStreamEvaluation={handleEvaluationUpdate} />
        )}
        {activeTab === 'codecs' && (
          <CodecRobustnessStudio onCodecEvaluated={handleEvaluationUpdate} />
        )}
        {activeTab === 'simulator' && (
          <AttackSimulator onAttackEvaluated={handleEvaluationUpdate} />
        )}
        {activeTab === 'banking' && (
          <BankingFraudInterceptor onBankingEvaluated={handleEvaluationUpdate} />
        )}
        {activeTab === 'forensics' && (
          <AudioForensicStudio onForensicEvaluated={handleEvaluationUpdate} />
        )}
        {activeTab === 'telemetry' && (
          <BenchmarkTelemetry />
        )}
        {activeTab === 'overview' && (
          <TechnicalWhitepaper />
        )}
      </main>

      {/* Sovereign Bottom Status Bar */}
      <footer className="border-t border-[#232730] bg-[#0E1015] py-3 text-xs font-mono text-[#7D8494]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599]" />
            <span className="text-[#C7CBD4] font-bold">TRUEVOICE ACTIVE ENGINE</span>
            <span>// SIH 2026 PS ID SIH26104</span>
          </div>
          <div>
            AICTE Cyber Security Cell &bull; Ministry of Communications &bull; Ministry of Home Affairs
          </div>
        </div>
      </footer>
    </div>
  );
}
