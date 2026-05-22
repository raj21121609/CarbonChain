import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenSubmit, onScrollToShowcase }) {
  const { isConnected, chain } = useAccount();
  const isWrongNetwork = isConnected && chain && chain.id !== baseSepolia.id;

  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center py-20 overflow-hidden bg-grid-pattern-animated">
      {/* Background Radial Glow Lights for Atmospheric Depth */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Slow Moving Animated Ambient Light Orb */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Content */}
        <div className="lg:col-span-6 text-left space-y-10 z-10 pt-10 lg:pt-0">
          
          {/* Animated Announcement Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold tracking-wide uppercase font-display backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.02)]"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">CarbonChain Ledger v4.0</span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl sm:text-5xl lg:text-[4rem] font-bold font-display leading-[1.15] tracking-tight text-white max-w-2xl"
            >
              Planet-scale ESG infrastructure. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Invisible blockchain.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-lg md:text-xl text-slate-400/90 max-w-xl font-normal leading-relaxed tracking-wide"
            >
              The operating system for global sustainability. Commit verified green credentials to an immutable decentralized ledger with zero gas fees and enterprise-grade security.
            </motion.p>
          </div>

          {/* Dynamic Wallet Status Onboarding Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 text-xs font-medium py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 w-fit backdrop-blur-sm"
          >
            <span className={`w-2 h-2 rounded-full ${isWrongNetwork ? 'bg-rose-500 animate-pulse' : isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
            <span className={isWrongNetwork ? 'text-rose-400' : isConnected ? 'text-emerald-400' : 'text-amber-400'}>
              {isWrongNetwork
                ? 'Unsupported network. Switch to Base Sepolia.'
                : isConnected 
                  ? 'System connected. Ready for verification.' 
                  : 'Connect organization wallet to initialize.'}
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 pt-2"
          >
            <motion.button 
              onClick={onOpenSubmit}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden shadow-lg shadow-cyan-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2 text-base tracking-wide">
                Initialize ESG Record
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button 
              onClick={onScrollToShowcase}
              whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all text-base tracking-wide backdrop-blur-md"
            >
              View Public Ledger
            </motion.button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-8 border-t border-white/5"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500/70" />
              <span className="text-sm font-medium text-slate-400">Gasless Execution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500/70" />
              <span className="text-sm font-medium text-slate-400">Immutable Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500/70" />
              <span className="text-sm font-medium text-slate-400">Enterprise Grade</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Cinematic Earth Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-6 relative flex items-center justify-center w-full min-h-[500px]"
        >
          {/* Depth Fog / Atmospheric Glow behind the Earth */}
          <div 
            className="absolute inset-0 rounded-full scale-[1.3] pointer-events-none z-0" 
            style={{ background: 'radial-gradient(circle at center, rgba(8,145,178,0.08) 0%, transparent 65%)' }}
          />
          
          {/* Ultra-slow floating animation container */}
          <motion.div
            animate={{
              y: [-24, 24, -24],
              x: [-8, 8, -8],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-full max-w-[700px] lg:max-w-[850px] scale-110 lg:scale-125 xl:scale-[1.4] aspect-square flex items-center justify-center"
          >
            {/* The Cinematic Earth Image */}
            <img 
              src="/images/earth-cinematic.png" 
              alt="Planet-scale ESG Infrastructure"
              className="w-full h-full object-contain z-10 mix-blend-screen opacity-90 drop-shadow-[0_0_50px_rgba(34,211,238,0.1)]"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
