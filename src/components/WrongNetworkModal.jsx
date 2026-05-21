import { useAccount, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function WrongNetworkModal() {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  // Show only if connected and the network is not Base Sepolia (id: 84532)
  const isWrongNetwork = isConnected && chain && chain.id !== baseSepolia.id;

  if (!isWrongNetwork) return null;

  const handleSwitch = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden glass-card rounded-2xl border border-rose-500/20 p-8 text-center space-y-6 shadow-2xl"
        >
          {/* Glowing Red Aura */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-rose-500/10 rounded-full blur-xl" />
          
          {/* Warning Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-display text-white">Unsupported Network</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              CarbonChain operates exclusively on the <span className="text-cyan-400 font-semibold">Base Sepolia</span> testnet. Please switch your connected network to proceed.
            </p>
          </div>

          <button
            onClick={handleSwitch}
            disabled={isPending}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-red-600 to-orange-600 hover:from-rose-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-rose-950/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Confirming Switch...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Switch to Base Sepolia</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
