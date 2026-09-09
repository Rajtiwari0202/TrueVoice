import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Mic, Activity, Zap, FileSearch, ShieldAlert, BarChart2, BookOpen, 
  Lock, Wifi, Eye, Menu, X, ArrowRight, ShieldCheck, Terminal
} from 'lucide-react';

export default function Navbar({ isConnected, stats }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Overview', icon: ShieldCheck, exact: true },
    { to: '/shield', label: 'Live Shield', icon: Mic },
    { to: '/inspector', label: 'How It Works', icon: Eye },
    { to: '/codecs', label: 'Codec Studio', icon: Wifi },
    { to: '/simulator', label: 'Attack Sim', icon: Zap },
    { to: '/banking', label: 'Banking Guard', icon: Lock },
    { to: '/forensics', label: 'Forensics', icon: FileSearch },
    { to: '/telemetry', label: 'Telemetry', icon: BarChart2 },
    { to: '/specs', label: 'Specs', icon: BookOpen },
  ];

  return (
    <header className="border-b border-[#1E232E] bg-[#07090E]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Node Identifier */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded bg-[#131720] border border-[#262D3D] flex items-center justify-center text-[#FF5500] shadow-inner group-hover:border-[#FF5500]/70 group-hover:shadow-[0_0_12px_rgba(255,85,0,0.3)] transition-all">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight text-[#F2F4F8] uppercase font-mono">
                  True<span className="text-[#FF5500]">Voice</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#141822] text-[#9EA6B8] rounded border border-[#252C3B]">
                  SIH26104
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#677084] leading-none mt-0.5">
                AI Voice Clone Defense Engine
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center p-1 bg-[#0E1118] rounded-md border border-[#1E2430]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF5500] text-white font-bold shadow-sm'
                      : 'text-[#8C93A3] hover:text-[#F2F4F8] hover:bg-[#161B26]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#717B8F]'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Real-Time Telemetry & Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#0E1118] border border-[#1E2430] text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00E599] animate-pulse shadow-[0_0_8px_rgba(0,229,153,0.6)]' : 'bg-[#FF5500]'}`} />
              <span className="text-[#A4ACB9] text-[10.5px]">
                {isConnected ? 'LIVE 16kHz DSP' : 'CONNECTING...'}
              </span>
            </div>

            <Link
              to="/shield"
              className="btn-primary py-1.5 px-3 text-xs"
            >
              <span>MIC SHIELD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="xl:hidden flex items-center space-x-2">
            <Link
              to="/shield"
              className="btn-primary py-1 px-2.5 text-xs text-[11px]"
            >
              SHIELD
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-[#121620] border border-[#232936] text-[#A4ACB9] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#1E2430] bg-[#0A0D14] px-4 pt-3 pb-5 space-y-1 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded transition ${
                  isActive
                    ? 'bg-[#FF5500] text-white font-bold'
                    : 'text-[#8C93A3] hover:text-white hover:bg-[#141822]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
