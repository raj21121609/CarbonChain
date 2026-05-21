import { motion } from 'framer-motion';
import { ShieldCheck, Sun, ArrowUpRight, BarChart3, Recycle, FileCheck } from 'lucide-react';

const PRESET_RECORDS = [
  {
    companyName: "Apex Renewables Ltd",
    category: "Solar Infrastructure Deployment",
    metric: "12.5 GWh Clean Energy",
    score: 98,
    timestamp: "May 18, 2026 14:32 GMT",
    txHash: "0x8fa37d2e8b91a0c4fbc901a88dfb2c7e090df3a1bdfd90a827cfb191a27cf89b",
    block: "8,479,091",
    status: "Verified",
    icon: Sun,
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  },
  {
    companyName: "Veritas Industries Corp",
    category: "Carbon Audit Completed",
    metric: "15,200 MT CO2e Reduced",
    score: 94,
    timestamp: "May 20, 2026 09:15 GMT",
    txHash: "0x3f5c889a71b2d04a98fe902bd39ee45cfb129b7e090df3a1bdfd90a827cfb191",
    block: "8,480,512",
    status: "Verified",
    icon: BarChart3,
    colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
  },
  {
    companyName: "Nova Logistics Group",
    category: "Recycling Initiative Verified",
    metric: "82% Recycled Materials",
    score: 91,
    timestamp: "May 21, 2026 11:42 GMT",
    txHash: "0x59be7dfd8b746c827361a9bc97b7de28a3f89a71b2d04a98fe902bd39ee45cfb",
    block: "8,481,104",
    status: "Verified",
    icon: Recycle,
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  }
];

export default function Showcase({ recordsList, onVerifyClick }) {
  // Combine preset records with any user-submitted ones
  const allRecords = [...recordsList, ...PRESET_RECORDS];

  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-dot-pattern">
      {/* Background Radial Glow Lights */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xs font-bold tracking-widest uppercase text-cyan-400 font-display">Onchain ESG Registry</h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Verified Enterprise Credentials
            </p>
            <p className="text-slate-400 font-light">
              Explore live, immutable sustainability credentials committed directly to the CarbonChain ledger. Click verify on any card to view the cryptographic proof.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-slate-400 py-2 px-4 rounded-xl bg-white/5 border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Syncing live ledger node epoch 19,284</span>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allRecords.map((record, index) => {
            const IconComponent = record.icon || FileCheck;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between text-left relative overflow-hidden group"
              >
                {/* Decorative glowing card core */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />

                <div>
                  {/* Card Header: Category & Status */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-2.5 rounded-xl border ${record.colorClass || 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ledger Secured</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <h3 className="text-xl font-bold font-display text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {record.companyName}
                  </h3>
                  <p className="text-sm text-slate-400 font-light mb-4">
                    {record.category}
                  </p>

                  {/* Impact Metric & Rating Detail */}
                  <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-brand-dark/50 border border-white/5 rounded-xl mb-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">Impact Metric</span>
                      <span className="text-sm font-semibold text-white truncate block">{record.metric}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">ESG Rating Score</span>
                      <span className="text-sm font-bold text-gradient-green-cyan">{record.score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Metadata and Action */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>TX: {record.txHash.slice(0, 10)}...</span>
                    <span>{record.timestamp.split(' ').slice(0,3).join(' ')}</span>
                  </div>

                  <button 
                    onClick={() => onVerifyClick(record)}
                    className="w-full py-3 bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Verify Cryptographic Receipt
                    <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
