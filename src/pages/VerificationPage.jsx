import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Award, Calendar, Hash, Globe, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, Activity, Cpu, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { fetchCredentialsForAddress, isValidAddress, fetchGlobalMetrics } from '../verify/contractReader';
import { shortenAddress } from '../web3/contractHelpers';
import { getTxExplorerUrl } from '../web3/chainUtils';
import { ESG_CREDENTIAL_ADDRESS } from '../web3/mintCredential';
import QRModal from '../components/verification/QRModal';

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

  // Selected credential for the QR sharing modal
  const [selectedCred, setSelectedCred] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Fetch general metrics on load
  useEffect(() => {
    async function loadMetrics() {
      const data = await fetchGlobalMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  // Parse address parameter from route (e.g. /verify/0xabc...)
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
      // Clear states if returning to blank search page
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
    
    // Update path dynamically without full page reload
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
    <div className="max-w-7xl mx-auto px-6 py-12 relative min-h-screen">
      
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-xs font-semibold text-cyan-400 mb-4"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public ESG Audit Explorer</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none mb-6"
        >
          Onchain ESG <span className="text-gradient-cyan-blue">Verification Registry</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg"
        >
          Search and verify corporate ESG achievements. Every credential shown here is cryptographically signed and secured directly on the Base Sepolia blockchain.
        </motion.p>
      </div>

      {/* Metrics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
      >
        <div className="glass-card border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300 relative group">
          <div className="absolute top-4 right-4 text-cyan-400/20 group-hover:text-cyan-400/30 transition-colors">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-medium text-slate-500 block mb-1">Total ESG Credentials</span>
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {metrics.sponsoredTx + credentials.length}
          </span>
        </div>

        <div className="glass-card border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300 relative group">
          <div className="absolute top-4 right-4 text-emerald-400/20 group-hover:text-emerald-400/30 transition-colors">
            <Globe className="w-8 h-8" />
          </div>
          <span className="text-xs font-medium text-slate-500 block mb-1">Carbon Saved (Tons)</span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight font-display">
            {(metrics.gasSaved * 8.4 + (credentials.length * 15)).toFixed(1)}
          </span>
        </div>

        <div className="glass-card border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300 relative group">
          <div className="absolute top-4 right-4 text-cyan-400/20 group-hover:text-cyan-400/30 transition-colors">
            <Cpu className="w-8 h-8" />
          </div>
          <span className="text-xs font-medium text-slate-500 block mb-1">Sponsored Gasless Tx</span>
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {metrics.sponsoredTx}
          </span>
        </div>

        <div className="glass-card border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300 relative group">
          <div className="absolute top-4 right-4 text-cyan-400/20 group-hover:text-cyan-400/30 transition-colors">
            <Activity className="w-8 h-8" />
          </div>
          <span className="text-xs font-medium text-slate-500 block mb-1">Organizations Audited</span>
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {metrics.organizationsVerified + (activeAddress ? 1 : 0)}
          </span>
        </div>
      </motion.div>

      {/* Search Console */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card border border-white/5 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto mb-16 relative"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/3 via-transparent to-blue-500/3 pointer-events-none" />
        
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchVal); }} className="space-y-4">
          <label htmlFor="wallet-search-input" className="block text-sm font-semibold text-white mb-2">
            Search Corporate Wallet Address
          </label>
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="wallet-search-input"
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Enter organization wallet address (0x...)"
                className="w-full pl-12 pr-4 py-4 rounded-xl text-sm border bg-[#03050c]/80 border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !searchVal}
              className="px-8 py-4 rounded-xl text-sm font-bold text-[#050816] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking up...</span>
                </>
              ) : (
                <>
                  <span>Audit Onchain</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-rose-400 text-xs mt-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>

      {/* Results View */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* Loading Skeleton */}
          {loading && (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Indexing Ledger Records...</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="glass-card border border-white/5 rounded-2xl p-6 h-60 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-6 w-1/3 shimmer-skeleton rounded-lg" />
                      <div className="h-4 w-2/3 shimmer-skeleton rounded-lg" />
                      <div className="h-4 w-1/2 shimmer-skeleton rounded-lg" />
                    </div>
                    <div className="h-10 w-full shimmer-skeleton rounded-xl" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actual Results Grid */}
          {!loading && activeAddress && credentials.length > 0 && (
            <motion.div
              key="results-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Results Title Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Verification Registry</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Showing <span className="text-cyan-400 font-semibold">{credentials.length}</span> verified credentials for wallet <span className="text-white font-mono">{shortenAddress(activeAddress)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2 sm:mt-0 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Base Sepolia Contract: {shortenAddress(ESG_CREDENTIAL_ADDRESS)}</span>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {credentials.map((cred, idx) => (
                  <motion.div
                    key={cred.tokenId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Sponsored badge top right */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      {cred.isGasless && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1">
                          <Cpu className="w-2.5 h-2.5" />
                          <span>Gasless (UGF)</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wide">
                        Verified
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Category & Title */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">{cred.category}</span>
                        <h4 className="text-lg font-bold text-white font-display leading-tight">{cred.organizationName}</h4>
                      </div>

                      {/* Description */}
                      <p className="text-slate-400 text-xs line-clamp-2">{cred.description || 'No description provided.'}</p>

                      {/* Metrics block */}
                      <div className="grid grid-cols-3 gap-2 border border-white/5 rounded-xl bg-[#03050c]/50 p-3 text-center">
                        <div>
                          <span className="text-[9px] text-slate-500 block">Metric Value</span>
                          <span className="text-xs font-bold text-white truncate block mt-0.5">{cred.metric}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Token ID</span>
                          <span className="text-xs font-bold text-cyan-400 truncate block mt-0.5">#{cred.tokenId}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Status</span>
                          <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-center gap-0.5 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Onchain</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex gap-2.5 mt-6 border-t border-white/5 pt-4">
                      <button
                        onClick={() => {
                          setSelectedCred(cred);
                          setQrModalOpen(true);
                        }}
                        className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Audit & Share QR</span>
                      </button>
                      <a
                        href={getTxExplorerUrl(cred.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl border border-white/5 bg-[#03050c] hover:bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                        title="View transaction on Basescan"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Issuance Timeline */}
              <div className="border border-white/5 rounded-2xl bg-white/2 p-6 sm:p-8 mt-12">
                <h3 className="text-base font-bold text-white font-display mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Onchain Transaction History Timeline</span>
                </h3>
                
                <div className="relative pl-6 space-y-8">
                  {/* Animated vertical timeline line */}
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-0 top-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent"
                  />
                  {credentials.map((cred, idx) => (
                    <motion.div 
                      key={cred.tokenId} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2, duration: 0.5 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border border-cyan-500 bg-[#050816] flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-white font-mono">Token ID #{cred.tokenId}</span>
                          <span className="text-[10px] text-slate-500 font-medium">({new Date(cred.timestamp * 1000).toLocaleString()})</span>
                          {cred.isGasless && (
                            <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                              UGF sponsored
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300">
                          Minted ESG Credential representing <span className="text-cyan-400 font-semibold">{cred.category}</span> by <span className="text-white font-semibold">{cred.organizationName}</span> with audited result of <span className="text-emerald-400 font-bold">{cred.metric}</span>.
                        </p>
                        <a
                          href={getTxExplorerUrl(cred.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyan-400 mt-2 transition-colors"
                        >
                          <span>Tx Hash: {shortenAddress(cred.txHash)}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty / No-results View */}
          {!loading && activeAddress && credentials.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card border border-white/5 rounded-2xl p-12 text-center max-w-xl mx-auto"
            >
              <Award className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-bold text-white font-display mb-2">No Credentials Found</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                We couldn't find any minted ESG Soulbound tokens registered onchain for the wallet <span className="text-white font-mono break-all block mt-1.5">{activeAddress}</span>
              </p>
              <button
                onClick={handleClear}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-cyan-500/5 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </motion.div>
          )}

          {/* Initial Search Prompt */}
          {!loading && !activeAddress && (
            <motion.div
              key="initial-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Enter Audit Query</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Provide any verified organization's corporate wallet address above to index their block ledger history.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* QR sharing modal overlay */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => { setQrModalOpen(false); setSelectedCred(null); }}
        credential={selectedCred}
        ownerAddress={activeAddress}
      />

    </div>
  );
}
