import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { ShieldCheck, Cpu, Leaf, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenSubmit, onScrollToShowcase }) {
  const { isConnected, chain } = useAccount();
  const isWrongNetwork = isConnected && chain && chain.id !== baseSepolia.id;

  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center py-20 overflow-hidden bg-grid-pattern-animated">
      {/* Background Radial Glow Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />

      {/* Slow Moving Animated Ambient Light Orb */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] left-[40%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[110px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-7 text-left space-y-8 z-10">
          
          {/* Animated Announcement Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wider uppercase font-display"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Introducing CarbonChain Ledger v4.0</span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-white"
            >
              Enterprise carbon verification. <br />
              <span className="text-gradient-cyan-blue">Without blockchain complexity.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed"
            >
              Gasless ESG infrastructure powered by invisible blockchain transactions. Committing green credentials instantly to an immutable decentralized ledger.
            </motion.p>
          </div>

          {/* Dynamic Wallet Status Onboarding Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center gap-2 text-xs font-semibold py-2 px-3.5 rounded-xl bg-white/5 border border-white/5 w-fit"
          >
            <span className={`w-2 h-2 rounded-full ${isWrongNetwork ? 'bg-rose-500 animate-pulse' : isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
            <span className={isWrongNetwork ? 'text-rose-400' : isConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isWrongNetwork
                ? 'Unsupported network. Please switch to Base Sepolia.'
                : isConnected 
                  ? 'Wallet connected. Ready for ESG verification.' 
                  : 'Connect your organization wallet to begin.'}
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <motion.button 
              onClick={onOpenSubmit}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 0 25px rgba(6,182,212,0.4)" 
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              Submit ESG Record
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button 
              onClick={onScrollToShowcase}
              whileHover={{ 
                scale: 1.03, 
                borderColor: "rgba(6, 182, 212, 0.5)",
                backgroundColor: "rgba(6, 182, 212, 0.08)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="px-8 py-4 rounded-xl font-semibold border border-white/10 text-white flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              Verify Record
            </motion.button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-4 border-t border-white/5"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">Gasless via UGF</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">Immutable ESG Records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">No ETH Required</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Animated 3D Climate Globe Grid */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[450px]">
          
          {/* Main Globe Placeholder Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-white/5 bg-brand-dark/20 backdrop-blur-3xl flex items-center justify-center shadow-[0_0_80px_rgba(6,182,212,0.05)]"
          >
            {/* Spinning Outer Orbit Rings using Framer Motion */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-500/10" 
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-dotted border-blue-500/15" 
            />
            <motion.div 
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-16 rounded-full border border-cyan-500/20" 
            />
            
            {/* Central Globe Core */}
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-950 via-blue-900 to-indigo-950 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              {/* Inner Glowing Orb */}
              <div className="absolute inset-1.5 rounded-full bg-[#050816] flex items-center justify-center">
                <Leaf className="w-16 h-16 text-cyan-400 animate-pulse-glow" />
              </div>
            </div>

            {/* Glowing Climate Network Connecting Lines & Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
              <line x1="120" y1="120" x2="200" y2="80" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="280" y1="120" x2="200" y2="80" stroke="rgba(37,99,235,0.25)" strokeWidth="1.5" />
              <line x1="280" y1="280" x2="200" y2="320" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="120" y1="280" x2="200" y2="320" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" />
              <line x1="80" y1="200" x2="120" y2="120" stroke="rgba(37,99,235,0.2)" strokeWidth="1.5" />
              <line x1="320" y1="200" x2="280" y2="280" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" />

              {/* Pulsing Energy Nodes with Framer Motion */}
              <motion.circle cx="200" cy="80" r="4" fill="#06b6d4" animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
              <circle cx="200" cy="80" r="3.5" fill="#22d3ee" />
              <circle cx="120" cy="120" r="3" fill="#3b82f6" />
              <circle cx="280" cy="120" r="3" fill="#10b981" />
              <circle cx="320" cy="200" r="4.5" fill="#06b6d4" />
              <circle cx="80" cy="200" r="3" fill="#10b981" />
              <circle cx="120" cy="280" r="3.5" fill="#3b82f6" />
              <circle cx="280" cy="280" r="3" fill="#22d3ee" />
              <motion.circle cx="200" cy="320" r="4" fill="#10b981" animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3.5, repeat: Infinity }} />
              <circle cx="200" cy="320" r="3" fill="#34d399" />
            </svg>
          </motion.div>

          {/* Floating UI Cards with Framer Motion Parallax float effects */}
          
          {/* Card 1: Gasless Transaction Verified */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ y: -15, scale: 1.03, zIndex: 30 }}
            className="absolute top-2 -left-4 xs:left-0 z-20 glass-card p-3 rounded-xl border border-white/10 shadow-lg flex items-center gap-2.5 max-w-[210px] cursor-pointer transition-colors hover:border-cyan-500/30"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">Gasless TX Verified</p>
              <p className="text-[9px] text-slate-400">Gas fee: <span className="text-emerald-400 font-bold">$0.00</span></p>
            </div>
          </motion.div>

          {/* Card 2: ESG Record Created */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ y: 5, scale: 1.03, zIndex: 30 }}
            className="absolute bottom-10 -left-6 xs:left-2 z-20 glass-card p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2.5 max-w-[200px] cursor-pointer transition-colors hover:border-cyan-500/30"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">ESG Record Created</p>
              <p className="text-[9px] text-cyan-400 font-mono">Block #8,481,209</p>
            </div>
          </motion.div>

          {/* Card 3: Blockchain Verified */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ y: -13, scale: 1.03, zIndex: 30 }}
            className="absolute top-24 -right-6 xs:right-2 z-20 glass-card p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-2.5 max-w-[190px] cursor-pointer transition-colors hover:border-blue-500/30"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white">Carbon Audited</p>
              <p className="text-[9px] text-slate-400">100% Cryptographic</p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
