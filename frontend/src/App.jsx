import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './routes/LandingPage';
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
    <BrowserRouter>
      <div className="min-h-screen bg-[#07090E] text-[#F2F4F8] telemetry-grid font-sans flex flex-col selection:bg-[#FF5500] selection:text-white">
        
        {/* Persistent Tactical Navigation Bar */}
        <Navbar 
          isConnected={isConnected} 
          stats={stats} 
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage onQuickEvaluation={handleEvaluationUpdate} />} 
            />
            <Route 
              path="/shield" 
              element={<VoiceConsole onStreamEvaluation={handleEvaluationUpdate} />} 
            />
            <Route 
              path="/inspector" 
              element={<InteractiveArchitectureInspector latestEvaluation={latestEvaluation} />} 
            />
            <Route 
              path="/codecs" 
              element={<CodecRobustnessStudio onCodecEvaluated={handleEvaluationUpdate} />} 
            />
            <Route 
              path="/simulator" 
              element={<AttackSimulator onAttackEvaluated={handleEvaluationUpdate} />} 
            />
            <Route 
              path="/banking" 
              element={<BankingFraudInterceptor onBankingEvaluated={handleEvaluationUpdate} />} 
            />
            <Route 
              path="/forensics" 
              element={<AudioForensicStudio onForensicEvaluated={handleEvaluationUpdate} />} 
            />
            <Route 
              path="/telemetry" 
              element={<BenchmarkTelemetry />} 
            />
            <Route 
              path="/specs" 
              element={<TechnicalWhitepaper />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>

        {/* Tactical Footer */}
        <footer className="border-t border-[#1E232E] bg-[#0A0D14] py-4 text-xs font-mono text-[#6E788B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00E599]" />
              <span className="text-[#C7CBD4] font-bold">TRUEVOICE SOVEREIGN DEFENSE</span>
              <span>// PS ID SIH26104</span>
            </div>
            <div className="text-[11px] text-center sm:text-right">
              AICTE Cyber Security Cell &bull; Ministry of Communications &bull; Ministry of Home Affairs
            </div>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
