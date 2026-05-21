import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { motion } from 'framer-motion';
import { WifiOff, LogOut, RefreshCw, Cpu } from 'lucide-react';

export default function WalletStatus() {
  const { address, isConnected, isConnecting, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chain && chain.id !== baseSepolia.id;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Cpu className="w-12 h-12 text-slate-500" />
      </div>

      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display mb-4">
        Ledger Connection Node
      </h4>

      {isConnecting && (
        <div className="flex items-center gap-3 py-2">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-slate-400">Locating credentials...</span>
        </div>
      )}

      {!isConnecting && !isConnected && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-semibold text-rose-400">Node Offline</span>
          </div>
          <p className="text-xs text-slate-500">
            Connect your corporate cryptographic wallet in the header navigation to initialize onchain ESG record signing.
          </p>
        </div>
      )}

      {!isConnecting && isConnected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isWrongNetwork ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400 animate-ping'}`} />
              <span className={`text-sm font-bold ${isWrongNetwork ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isWrongNetwork ? 'Invalid Network' : 'Node Online'}
              </span>
            </div>
            <button 
              onClick={() => disconnect()}
              className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Validator Address</span>
              <span className="text-sm font-mono text-white block select-all">{address}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Target Consensus</span>
              <span className="text-sm font-semibold text-slate-300 block">
                {isWrongNetwork ? 'Unsupported Chain' : 'Base Sepolia Testnet'}
              </span>
            </div>
          </div>

          {isWrongNetwork && (
            <button 
              onClick={() => switchChain({ chainId: baseSepolia.id })}
              className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Switch to Base Sepolia</span>
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
