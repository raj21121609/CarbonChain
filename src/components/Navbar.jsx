import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Leaf, Wallet, ChevronDown, LogOut, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { shortenAddress } from '../web3/contractHelpers';

export default function Navbar({ onOpenSubmitModal }) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={onOpenSubmitModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-4.5 py-2.5 text-sm font-semibold text-cyan-400 hover:text-white border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            Submit Record
          </button>
          
          {/* RainbowKit Connected Button with Custom Dropdown */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button 
                          onClick={openConnectModal}
                          className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg bg-white hover:bg-slate-200 text-[#050816] shadow-white/5 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                        >
                          <Wallet className="w-4 h-4" />
                          <span>Connect Wallet</span>
                        </button>
                      );
                    }

                    return (
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className={`relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer ${
                            chain.id !== baseSepolia.id
                              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            chain.id !== baseSepolia.id ? 'bg-rose-400' : 'bg-emerald-400'
                          }`} />
                          <span>{chain.id !== baseSepolia.id ? 'Wrong Network' : account.displayName}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                            chain.id !== baseSepolia.id ? 'text-rose-500' : 'text-emerald-500'
                          } ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Connected Dropdown Menu */}
                        <AnimatePresence>
                          {dropdownOpen && (
                            <>
                              {/* Click outside overlay */}
                              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2.5 w-60 z-20 overflow-hidden glass-card rounded-xl border border-white/10 shadow-2xl p-2.5 space-y-1.5"
                              >
                                <div className="px-3 py-2 border-b border-white/5">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Validator Node</span>
                                  <span className="text-xs font-mono text-white truncate block">{account.address}</span>
                                </div>

                                <div className="space-y-0.5">
                                  {chain.id !== baseSepolia.id && (
                                    <button
                                      onClick={() => {
                                        switchChain({ chainId: baseSepolia.id });
                                        setDropdownOpen(false);
                                      }}
                                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-500/20 to-red-500/20 hover:from-rose-500/30 hover:to-red-500/30 text-rose-300 border border-rose-500/20 flex items-center justify-between transition-all cursor-pointer mb-1.5"
                                    >
                                      <span>Switch to Base Sepolia</span>
                                      <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleCopy(account.address)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors cursor-pointer"
                                  >
                                    <span>Copy Wallet Address</span>
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  {copied && (
                                    <div className="text-[10px] text-emerald-400 px-3 py-0.5 text-right font-medium">Copied!</div>
                                  )}

                                  <a
                                    href={`https://sepolia.basescan.org/address/${account.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors cursor-pointer"
                                  >
                                    <span>View on BaseScan</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>

                                <div className="h-px bg-white/5" />

                                <button
                                  onClick={() => {
                                    disconnect();
                                    setDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-between transition-colors cursor-pointer"
                                >
                                  <span>Disconnect Wallet</span>
                                  <LogOut className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
