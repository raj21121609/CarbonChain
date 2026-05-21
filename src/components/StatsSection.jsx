import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, Activity, BarChart, HardDrive } from 'lucide-react';
import WalletStatus from './WalletStatus';

export default function StatsSection() {
  const [recordsCount, setRecordsCount] = useState(1248392);
  const [carbonReduction, setCarbonReduction] = useState(142500.42);
  const [flashRecord, setFlashRecord] = useState(false);
  const [flashCarbon, setFlashCarbon] = useState(false);

  useEffect(() => {
    // Random increment for ESG Records (e.g. every 4.5 seconds)
    const recordsInterval = setInterval(() => {
      setRecordsCount(prev => prev + 1);
      setFlashRecord(true);
      setTimeout(() => setFlashRecord(false), 800);
    }, 4500);

    // Random increment for Carbon Reduction (e.g. every 3 seconds)
    const carbonInterval = setInterval(() => {
      setCarbonReduction(prev => prev + parseFloat((Math.random() * 0.15).toFixed(2)));
      setFlashCarbon(true);
      setTimeout(() => setFlashCarbon(false), 800);
    }, 3000);

    return () => {
      clearInterval(recordsInterval);
      clearInterval(carbonInterval);
    };
  }, []);

  // Format helper for numbers
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section id="impact" className="py-24 border-t border-b border-white/5 bg-[#050816] relative overflow-hidden">
      {/* Background neon grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stat 1: ESG Records Verified */}
          <div className="glass-card p-8 rounded-2xl border border-white/5 relative flex flex-col justify-between items-center text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display mb-2">ESG Records Verified</p>
              
              <div className="relative inline-block">
                <span className={`text-4xl sm:text-5xl font-extrabold font-display text-white transition-all duration-500 ${
                  flashRecord ? 'text-emerald-400 scale-105' : ''
                }`}>
                  {formatNumber(recordsCount)}
                </span>
                <AnimatePresence>
                  {flashRecord && (
                    <motion.span 
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -20, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      className="absolute -right-8 -top-3 text-xs font-bold font-mono text-emerald-400"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-time onchain indexer active</span>
            </div>
          </div>

          {/* Stat 2: Carbon Reduction Metrics */}
          <div className="glass-card p-8 rounded-2xl border border-white/5 relative flex flex-col justify-between items-center text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display mb-2">Carbon Reduction Offset</p>
              
              <div className="relative inline-block">
                <span className={`text-4xl sm:text-5xl font-extrabold font-display text-white transition-all duration-500 ${
                  flashCarbon ? 'text-cyan-400 scale-105' : ''
                }`}>
                  {formatNumber(carbonReduction.toFixed(2))} <span className="text-lg font-light text-slate-400">MT</span>
                </span>
                <AnimatePresence>
                  {flashCarbon && (
                    <motion.span 
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -20, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      className="absolute -right-8 -top-3 text-xs font-bold font-mono text-cyan-400"
                    >
                      +MT
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Hashed ledger metrics accumulated</span>
            </div>
          </div>

          {/* Stat 3: Enterprise Participation */}
          <div className="glass-card p-8 rounded-2xl border border-white/5 relative flex flex-col justify-between items-center text-center overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display mb-2">Active Validator Nodes</p>
              <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                84
              </span>
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-white/5 w-full justify-center">
              <div className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>Uptime: <span className="text-white font-semibold">100%</span></span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1">
                <BarChart className="w-3.5 h-3.5 text-cyan-400" />
                <span>Consensus: <span className="text-white font-semibold">UGF-v4</span></span>
              </div>
            </div>
          </div>

        </div>

        {/* Reusable Wallet Status Console Component */}
        <div className="mt-12 max-w-xl mx-auto">
          <WalletStatus />
        </div>

      </div>
    </section>
  );
}
