import { motion } from 'framer-motion';
import { AlertTriangle, EyeOff, Server, ShieldCheck, Zap, Layers, Check, ArrowRight } from 'lucide-react';

export default function WhySection() {
  return (
    <section id="features" className="py-24 border-t border-white/5 bg-[#070b1e]/30 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold tracking-widest uppercase text-cyan-400 font-display">Comparative Architecture</h2>
          <p className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Rebuilding ESG data integrity from the ground up
          </p>
          <p className="text-slate-400 font-light">
            Traditional ESG systems rely on centralized databases vulnerable to modification and manual errors. CarbonChain enforces tamper-proof validity using gasless Web3 infrastructure.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional ESG Systems */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 sm:p-10 rounded-2xl border border-white/5 flex flex-col justify-between opacity-80 hover:opacity-150 transition-opacity duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-bold font-display text-white">Traditional ESG Reporting</h3>
              </div>

              <p className="text-sm text-slate-400 font-light text-left">
                Fragile audit trails dependent on self-reported PDFs, manual spreadsheets, and opaque corporate auditing firms.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3.5 text-left">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <span className="text-red-400 text-xs font-bold font-mono">!</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300">Centralized & Mutable</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Records are stored in standard cloud systems where they can be edited, deleted, or backdated.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-left">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <EyeOff className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300">Opaque Transparency</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Requires weeks of manual third-party audits to verify single carbon statements or offset points.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-left">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <Server className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300">Difficult to Programmatically Verify</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Audits are locked in flat documents, preventing integration with automated API verification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 text-left text-xs text-red-400/70 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>Risk Profile: High Vulnerability</span>
            </div>
          </motion.div>

          {/* CarbonChain */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card glass-card-hover p-8 sm:p-10 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">CarbonChain Infrastructure</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 uppercase tracking-wider">
                  Recommended
                </span>
              </div>

              <p className="text-sm text-slate-300 font-light text-left">
                Cryptographically secured ESG ledger where every record is stamped with a cryptographic proof and verifiable instantly.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3.5 text-left">
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Immutable Ledger Proofs</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every statement generates a SHA-256 hash locked onto a decentralized blockchain ledger.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-left">
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Gasless Onboarding</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Zero crypto wallets, gas fees, or complex onboarding. Transactions are relay-sponsored seamlessly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-left">
                  <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Instant API Verification</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Verify records programmatically via client APIs or the CarbonChain 1-click verification badge.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 text-left text-xs text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 group">
              <span>Explore Cryptographic Protocols</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
