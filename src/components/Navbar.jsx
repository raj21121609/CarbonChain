import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Wallet, ChevronRight, Check } from 'lucide-react';

export default function Navbar({ onOpenSubmitModal }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = () => {
    if (walletConnected) {
      setWalletConnected(false);
      return;
    }
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setWalletConnected(true);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050816]/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300">
            <Leaf className="w-5.5 h-5.5 text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold font-display text-white tracking-tight">
            Carbon<span className="text-gradient-cyan-blue">Chain</span>
          </span>
        </a>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative py-2">
            Features
          </a>
          <a href="#why-section" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative py-2">
            Verify
          </a>
          <a href="#showcase" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative py-2">
            Credentials
          </a>
          <a href="#impact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative py-2">
            Global Impact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSubmitModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2 text-sm font-semibold text-cyan-400 hover:text-white border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Submit Record
          </button>
          
          <button 
            onClick={handleConnectWallet}
            disabled={connecting}
            className={`relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer ${
              walletConnected 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-white hover:bg-slate-200 text-[#050816] shadow-white/5'
            }`}
          >
            {connecting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                <span>Connecting...</span>
              </>
            ) : walletConnected ? (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>0x71e...a39f</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
