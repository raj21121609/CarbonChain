import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, Activity, BarChart, HardDrive, Terminal } from 'lucide-react';
import WalletStatus from './WalletStatus';
import AnimatedCounter from './AnimatedCounter';
import { getTelemetryMetrics } from '../gasless/sponsorUtils';

function UGFTelemetryCard() {
  const [metrics, setMetrics] = useState({
    sponsorBalance: 1250.00,
    totalGasSaved: 148.52,
    gaslessTxCount: 120,
    logs: []
  });
  const [flashBalance, setFlashBalance] = useState(false);
  const [flashSavings, setFlashSavings] = useState(false);

  useEffect(() => {
    // Load initial metrics
    setMetrics(getTelemetryMetrics());

    // Listen to updates
    const handleUpdate = () => {
      const newMetrics = getTelemetryMetrics();
      
      // Determine what changed to trigger animations
      if (newMetrics.sponsorBalance !== metrics.sponsorBalance) {
        setFlashBalance(true);
        setTimeout(() => setFlashBalance(false), 800);
      }
      if (newMetrics.totalGasSaved !== metrics.totalGasSaved) {
        setFlashSavings(true);
        setTimeout(() => setFlashSavings(false), 800);
      }
      
      setMetrics(newMetrics);
    };

    window.addEventListener('cc-telemetry-update', handleUpdate);

    // Periodic live log simulation to keep the UI feeling "alive"
    const liveSimulationLogList = [
      `[UGF-ROUTING] Live relay status: ACTIVE (Latency: 11ms)`,
      `[UGF-QUOTE] Fetched gas estimate for Base Sepolia: 0.042 Mock USD`,
      `[UGF-SPONSOR] Audited relayer balances: 100% solvency ratio`,
      `[UGF-RELAY] Heartbeat ping verified from relayer group #4`,
      `[UGF-ACCOUNTING] Real-time mock USD accounting verified`,
      `[UGF-CONSENSUS] Pipeline synchronizing with block indexer`
    ];

    const interval = setInterval(() => {
      const randomLog = liveSimulationLogList[Math.floor(Math.random() * liveSimulationLogList.length)];
      const timestamp = new Date().toLocaleTimeString();
      setMetrics(prev => {
        const updatedLogs = [`[${timestamp}] ${randomLog}`, ...prev.logs].slice(0, 40);
        return { ...prev, logs: updatedLogs };
      });
    }, 12000);

    return () => {
      window.removeEventListener('cc-telemetry-update', handleUpdate);
      clearInterval(interval);
    };
  }, [metrics.sponsorBalance, metrics.totalGasSaved]);

  const parseLogPrefix = (log) => {
    if (log.includes('[UGF-QUOTE]')) return { prefix: '[UGF-QUOTE]', content: log.split('[UGF-QUOTE]')[1], color: 'text-cyan-400' };
    if (log.includes('[UGF-SPONSOR]')) return { prefix: '[UGF-SPONSOR]', content: log.split('[UGF-SPONSOR]')[1], color: 'text-emerald-400 font-semibold' };
    if (log.includes('[UGF-BROADCAST]')) return { prefix: '[UGF-BROADCAST]', content: log.split('[UGF-BROADCAST]')[1], color: 'text-indigo-400' };
    if (log.includes('[UGF-SETTLED]')) return { prefix: '[UGF-SETTLED]', content: log.split('[UGF-SETTLED]')[1], color: 'text-purple-400' };
    if (log.includes('[UGF-CONSENSUS]')) return { prefix: '[UGF-CONSENSUS]', content: log.split('[UGF-CONSENSUS]')[1], color: 'text-yellow-400/90' };
    if (log.includes('[UGF-RELAY]')) return { prefix: '[UGF-RELAY]', content: log.split('[UGF-RELAY]')[1], color: 'text-blue-400' };
    if (log.includes('[UGF-ROUTING]')) return { prefix: '[UGF-ROUTING]', content: log.split('[UGF-ROUTING]')[1], color: 'text-slate-400' };
    if (log.includes('[UGF-ACCOUNTING]')) return { prefix: '[UGF-ACCOUNTING]', content: log.split('[UGF-ACCOUNTING]')[1], color: 'text-pink-400' };
    return { prefix: '', content: log, color: 'text-slate-300' };
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[350px]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 opacity-30" />
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h4 className="font-semibold text-white text-sm tracking-wide font-display uppercase">UGF Gasless Telemetry</h4>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">Active</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">Sponsor Pool</span>
          <span className={`text-sm sm:text-base font-extrabold font-mono text-white transition-all duration-500 ${
            flashBalance ? 'text-emerald-400 scale-105' : ''
          }`}>
            ${metrics.sponsorBalance.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">Gas Saved</span>
          <span className={`text-sm sm:text-base font-extrabold font-mono text-white transition-all duration-500 ${
            flashSavings ? 'text-cyan-400 scale-105' : ''
          }`}>
            ${metrics.totalGasSaved.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">Sponsored Tx</span>
          <span className="text-sm sm:text-base font-extrabold font-mono text-cyan-400">
            {metrics.gaslessTxCount}
          </span>
        </div>
      </div>

      {/* Logs Terminal */}
      <div className="flex-1 min-h-[140px] bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[10px] overflow-y-auto space-y-1.5 max-h-[160px] scrollbar-thin">
        <AnimatePresence initial={false}>
          {metrics.logs.map((log, idx) => {
            const parsed = parseLogPrefix(log);
            return (
              <motion.div 
                key={log + idx}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                className="leading-relaxed break-all"
              >
                <span className={parsed.color}>{parsed.prefix} </span>
                <span className="text-slate-300">{parsed.content}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

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
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
                  <AnimatedCounter value={recordsCount} format={(v) => formatNumber(Math.round(v))} />
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
                  <AnimatedCounter value={carbonReduction} format={(v) => formatNumber(v.toFixed(2))} /> <span className="text-lg font-light text-slate-400">MT</span>
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
                <AnimatedCounter value={84} format={(v) => Math.round(v).toString()} />
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

        {/* Reusable Wallet Status and UGF Telemetry Consoles */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <WalletStatus />
          <UGFTelemetryCard />
        </div>

      </div>
    </section>
  );
}
