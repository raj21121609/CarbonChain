import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Award, Globe, CheckCircle2, ShieldCheck, ArrowRight, Activity, Cpu, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchCredentialsForAddress, isValidAddress, fetchGlobalMetrics } from '../verify/contractReader';
import { shortenAddress } from '../web3/contractHelpers';
import { getTxExplorerUrl } from '../web3/chainUtils';
import { ESG_CREDENTIAL_ADDRESS } from '../web3/mintCredential';
import QRModal from '../components/verification/QRModal';
import AnimatedCounter from '../components/AnimatedCounter';

export default function VerificationPage({ route, onNavigate }) {
  const [searchVal, setSearchVal] = useState('');
  const [activeAddress, setActiveAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [metrics, setMetrics] = useState({
    sponsorPool: 1250.00,
    gasSaved: 148.52,
    sponsoredTx: 120,
    organizationsVerified: 14,
  });

  const [selectedCred, setSelectedCred] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      const data = await fetchGlobalMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  useEffect(() => {
    const parts = route.split('/');
    if (parts.length > 2) {
      const addressParam = parts[2];
      if (isValidAddress(addressParam)) {
        setSearchVal(addressParam);
        handleSearch(addressParam);
      } else {
        setError('The wallet address in the link is invalid.');
      }
    } else {
      setActiveAddress('');
      setCredentials([]);
      setError(null);
    }
  }, [route]);

  const handleSearch = async (address) => {
    if (!address) return;
    const targetAddr = address.trim();

    if (!isValidAddress(targetAddr)) {
      setError('Please enter a valid Ethereum address (e.g. 0x...)');
      setCredentials([]);
      return;
    }

    setError(null);
    setLoading(true);
    setActiveAddress(targetAddr);
    
    onNavigate(`/verify/${targetAddr}`);

    try {
      const results = await fetchCredentialsForAddress(targetAddr);
      setCredentials(results);
    } catch (err) {
      setError(err.message || 'Lookup failed.');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchVal('');
    setActiveAddress('');
    setCredentials([]);
    setError(null);
    onNavigate('/verify');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 relative min-h-screen font-sans selection:bg-white/10 selection:text-white">
      
      {/* Background Atmosphere */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs font-medium text-slate-300 mb-8 backdrop-blur-md"
        >
          <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
          <span className="tracking-wide">Global Verification Registry</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.1] mb-6 font-display"
        >
          Institutional-grade
          <br />
          <span className="text-slate-400">ESG infrastructure.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400/80 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
        >
          Verify corporate ESG credentials instantly. Secured cryptographically via Base Sepolia with an immutable onchain audit trail.
        </motion.p>
      </div>

      {/* Metrics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 relative z-10"
      >
        {[
          { label: "Verified Credentials", value: metrics.sponsoredTx + credentials.length, icon: Award },
          { label: "Carbon Saved (T)", value: (metrics.gasSaved * 8.4 + (credentials.length * 15)), icon: Globe, isFloat: true },
          { label: "Sponsored Audits", value: metrics.sponsoredTx, icon: Cpu },
          { label: "Organizations Audited", value: metrics.organizationsVerified + (activeAddress ? 1 : 0), icon: Activity }
        ].map((metric, i) => (
          <div key={i} className="group relative overflow-hidden bg-[#050816]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.03] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="text-white/20 mb-4 group-hover:text-white/40 transition-colors duration-500">
                <metric.icon className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-3xl font-medium text-white tracking-tight mb-1 font-display">
                <AnimatedCounter 
                  value={metric.value} 
                  format={v => metric.isFloat ? v.toFixed(1) : Math.round(v).toLocaleString()}
                />
              </div>
              <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search Console */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto mb-20 relative z-20"
      >
        <div className="relative bg-[#050816]/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 transition-all duration-300 focus-within:border-white/20 focus-within:bg-[#050816]/80 focus-within:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] group">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchVal); }} className="relative flex items-center">
            <Search className="absolute left-6 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
            <input
              id="wallet-search-input"
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Enter corporate wallet address..."
              autoComplete="off"
              className="w-full bg-transparent pl-16 pr-32 py-5 text-sm text-white placeholder-slate-500 focus:outline-none font-mono [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
              spellCheck={false}
            />
            
            <div className="absolute right-2 flex items-center gap-2">
              {searchVal && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !searchVal}
                className="h-10 px-6 rounded-xl text-sm font-medium bg-white text-[#050816] hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Audit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-8 left-0 right-0 flex justify-center"
            >
              <div className="flex items-center gap-2 text-rose-400 text-xs px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results View */}
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {loading && (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="h-4 w-48 shimmer-skeleton rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#050816]/40 border border-white/5 rounded-2xl p-6 h-[280px]">
                    <div className="h-4 w-24 shimmer-skeleton rounded mb-6" />
                    <div className="space-y-3">
                      <div className="h-8 w-3/4 shimmer-skeleton rounded" />
                      <div className="h-4 w-full shimmer-skeleton rounded" />
                      <div className="h-4 w-2/3 shimmer-skeleton rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!loading && activeAddress && credentials.length > 0 && (
            <motion.div
              key="results-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-medium text-white tracking-tight font-display mb-2">Verified Records</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>Target Wallet:</span>
                    <span className="font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">{shortenAddress(activeAddress)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Base Sepolia Sync Active
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {credentials.map((cred, idx) => (
                  <motion.div
                    key={cred.tokenId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                    className="group relative bg-[#0a0d1c] border border-white/5 hover:border-white/10 rounded-2xl p-8 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <span className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase mb-2 block">{cred.category}</span>
                          <h4 className="text-xl font-medium text-white font-display leading-tight">{cred.organizationName}</h4>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-slate-300 uppercase tracking-wide">
                            Valid
                          </span>
                          {cred.isGasless && (
                            <span className="px-2.5 py-1 rounded bg-[#0a1f33] border border-[#1e3a5f] text-[10px] font-medium text-[#7cb3ff] uppercase tracking-wide">
                              Sponsored
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-400/90 text-sm leading-relaxed mb-8">{cred.description || 'No description provided.'}</p>

                      <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                        <div className="bg-[#0a0d1c] p-4">
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Metric</span>
                          <span className="text-sm font-medium text-white truncate block">{cred.metric}</span>
                        </div>
                        <div className="bg-[#0a0d1c] p-4">
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Token ID</span>
                          <span className="text-sm font-mono text-slate-300 truncate block">#{cred.tokenId}</span>
                        </div>
                        <div className="bg-[#0a0d1c] p-4">
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">Audit</span>
                          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Onchain
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 flex gap-3 mt-8 pt-6 border-t border-white/5">
                      <button
                        onClick={() => {
                          setSelectedCred(cred);
                          setQrModalOpen(true);
                        }}
                        className="flex-grow flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-transparent hover:border-white/10 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 opacity-70" />
                        Audit QR
                      </button>
                      <a
                        href={getTxExplorerUrl(cred.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg border border-white/5 bg-[#050816] hover:bg-white/5 hover:border-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Timeline */}
              <div className="mt-16">
                <h3 className="text-lg font-medium text-white font-display mb-8">Infrastructure Timeline</h3>
                
                <div className="relative pl-8 max-w-4xl">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-[7px] top-2 w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent"
                  />
                  
                  {credentials.map((cred, idx) => (
                    <motion.div 
                      key={cred.tokenId} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15, duration: 0.6 }}
                      className="relative pb-12 last:pb-0"
                    >
                      <div className="absolute -left-[32px] top-1.5 w-3 h-3 rounded-full border-[2px] border-[#050816] bg-slate-300 ring-1 ring-white/20" />

                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-colors">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-white">ID #{cred.tokenId}</span>
                          <span className="text-xs text-slate-500">{new Date(cred.timestamp * 1000).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">
                          Minted <span className="text-slate-300 font-medium">{cred.category}</span> credential for <span className="text-white font-medium">{cred.organizationName}</span> recording <span className="text-slate-300 font-medium">{cred.metric}</span>.
                        </p>
                        <a
                          href={getTxExplorerUrl(cred.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          {cred.txHash}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!loading && activeAddress && credentials.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 max-w-lg mx-auto"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-slate-500">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-medium text-white font-display mb-3">No Records Found</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                No verified ESG credentials were found on the ledger for the address:
                <span className="block mt-2 font-mono text-xs text-slate-300 bg-white/5 py-1 px-2 rounded border border-white/10 break-all">
                  {activeAddress}
                </span>
              </p>
              <button
                onClick={handleClear}
                className="h-10 px-6 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
              >
                Clear Query
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <QRModal
        isOpen={qrModalOpen}
        onClose={() => { setQrModalOpen(false); setSelectedCred(null); }}
        credential={selectedCred}
        ownerAddress={activeAddress}
      />

    </div>
  );
}
