import React from 'react';
import { Mic, Activity, Zap, FileSearch, ShieldAlert, BarChart2, BookOpen, Radio, Lock, Wifi, Eye } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isConnected, stats }) {
  const tabs = [
    { id: 'inspector', label: 'How It Works (X-Ray)', icon: Eye },
    { id: 'console', label: 'Live Voice Shield', icon: Mic },
    { id: 'codecs', label: 'Codec Robustness', icon: Wifi },
    { id: 'simulator', label: 'Attack Simulator', icon: Zap },
    { id: 'banking', label: 'CXO & Banking Guard', icon: Lock },
    { id: 'forensics', label: 'WhatsApp Forensics', icon: FileSearch },
    { id: 'telemetry', label: 'Benchmark Telemetry', icon: BarChart2 },
    { id: 'overview', label: 'Whitepaper & Specs', icon: BookOpen }
  ];

  return (
    <header className="border-b border-[#232730] bg-[#0E1015]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Node Identifier */}
          <div 
            onClick={() => setActiveTab('inspector')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-[#1A1E26] border border-[#2F3646] flex items-center justify-center text-[#FF5500] shadow-inner group-hover:border-[#FF5500]/60 transition-colors">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight text-[#F2F4F8] uppercase font-mono">
                  True<span className="text-[#FF5500]">Voice</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#181C24] text-[#A0A6B5] rounded border border-[#2B313E]">
                  SIH26104 // AICTE CYBER CELL
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#7D8494] leading-none mt-0.5">
                Real-Time AI Voice Clone &amp; Neural Speech Defense Engine
              </p>
            </div>
          </div>

          {/* Segmented Mechanical Navigation */}
          <nav className="hidden xl:flex items-center p-1 bg-[#12151B] rounded border border-[#232730]">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF5500] text-white font-semibold shadow-sm'
                      : 'text-[#8C93A3] hover:text-[#F2F4F8] hover:bg-[#1A1E27]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7D8494]'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Real-Time Telemetry Badge */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#12151B] border border-[#232730] text-xs font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#00E599] animate-pulse' : 'bg-[#FF5500]'}`} />
              <span className="text-[#C7CBD4] text-[10.5px]">
                {isConnected ? 'LIVE WEBRTC DSP ACTIVE' : 'READY TO STREAM'}
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-[#232730]">
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono text-[#7D8494] block leading-none">Frames</span>
                <span className="text-xs font-mono font-bold text-[#F2F4F8] mt-0.5 block">
                  {stats?.total_chunks_processed || 0}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono text-[#7D8494] block leading-none">Intercepts</span>
                <span className="text-xs font-mono font-bold text-[#FF5500] mt-0.5 block">
                  {stats?.clones_intercepted || 0}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
