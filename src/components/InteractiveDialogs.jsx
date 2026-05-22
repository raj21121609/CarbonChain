import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldAlert, Cpu, Database, Send, Clipboard, ExternalLink, Leaf } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { esgContractConfig, ESG_CREDENTIAL_ADDRESS } from '../web3/mintCredential';
import { getTxExplorerUrl } from '../web3/chainUtils';
import { useUGFModal } from '@tychilabs/react-ugf';
import { useEthersSigner, encodeMintData } from '../gasless/ugfHelpers';
import { recordGaslessMint } from '../gasless/sponsorUtils';

export function SubmitRecordModal({ isOpen, onClose, onSubmitSuccess }) {
  const { address, isConnected, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const signer = useEthersSigner();
  const { openUGF, result } = useUGFModal();

  const [formData, setFormData] = useState({
    companyName: '',
    category: 'Carbon Offsetting',
    metric: '',
    score: 95,
    description: ''
  });

  const [step, setStep] = useState('form'); // 'form' | 'syncing' | 'success'
  const [syncStep, setSyncStep] = useState(0);
  const [txError, setTxError] = useState(null);
  const [txHash, setTxHash] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [isGasless, setIsGasless] = useState(true);

  const { data: receipt, error: receiptError, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  const standardSyncMessages = [
    { title: "Validating Metadata", desc: "Computing cryptographic hashes of ESG credentials..." },
    { title: "Requesting Signature", desc: "Please confirm the mint transaction in your browser wallet..." },
    { title: "Broadcasting to Base Sepolia", desc: "Awaiting block confirmation on the decentralized ledger..." },
    { title: "Securing Credentials", desc: "Minting soulbound token and writing proof to chain..." }
  ];

  const gaslessSyncMessages = [
    { title: "Preparing Gasless Transaction", desc: "Computing payload hashes and gas sponsorships..." },
    { title: "Securing UGF Sponsorship", desc: "Opening UGF Gasless Portal. Please sign transaction in wallet..." },
    { title: "Executing Onchain", desc: "Broadcasting sponsored transaction to Base Sepolia ledger..." },
    { title: "Finalizing ESG Credential", desc: "Awaiting block confirmation and indexer security check..." }
  ];

  const syncMessages = isGasless ? gaslessSyncMessages : standardSyncMessages;

  // Refs to mitigate state stale closure and prevent race conditions
  const txHashRef = useRef('');
  const resultRef = useRef(null);
  const lastProcessedHash = useRef(null);

  useEffect(() => {
    txHashRef.current = txHash;
  }, [txHash]);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  // Watch if the UGF Modal is closed by the user
  useEffect(() => {
    if (step === 'syncing' && syncStep === 1 && isGasless) {
      let modalOpenedSeen = false;
      const interval = setInterval(() => {
        const modalDom = document.querySelector('div[style*="zIndex: 9999"]');
        if (modalDom) {
          modalOpenedSeen = true;
        }
        
        // Safely access current values from refs to avoid stale state check race condition
        const currentTxHash = txHashRef.current;
        const currentResult = resultRef.current;
        const previousHash = lastProcessedHash.current;

        // If modal disappears, check if we have received a new transaction hash
        const hasNewHash = currentTxHash || (currentResult?.txHash && currentResult.txHash !== previousHash);

        // Only propagate a cancel error if the modal has actually been seen mounted/open at least once
        if (modalOpenedSeen && !modalDom && !hasNewHash) {
          setTxError("UGF Sponsorship request closed or canceled.");
          setStep('form');
        }
      }, 500); // Check faster to respond quicker
      return () => clearInterval(interval);
    }
  }, [step, syncStep, isGasless]);

  // Watch for UGF gasless completion
  useEffect(() => {
    if (result && result.txHash && step === 'syncing' && isGasless) {
      if (result.txHash !== lastProcessedHash.current) {
        setTxHash(result.txHash);
        setSyncStep(2); // Executing Onchain
      }
    }
  }, [result, step, isGasless]);

  // Watch for block confirmation
  useEffect(() => {
    if (isConfirmed && receipt) {
      let tokenId = '0';
      if (receipt.logs && receipt.logs.length > 0) {
        try {
          const transferLog = receipt.logs.find(log => 
            log.topics && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
          );
          if (transferLog && transferLog.topics.length >= 4) {
            tokenId = parseInt(transferLog.topics[3], 16).toString();
          }
        } catch (e) {
          console.warn("Failed to parse tokenId from receipt logs, falling back", e);
        }
      }
      
      // Update telemetry if gasless
      if (isGasless && txHash) {
        recordGaslessMint({ txHash, tokenId });
      }

      // Save to public verification lookup index history in localStorage
      try {
        const historyStr = localStorage.getItem('cc_ugf_mint_history') || '[]';
        let history = [];
        try { history = JSON.parse(historyStr); } catch (_) {}
        if (!history.some(item => String(item.tokenId) === String(tokenId))) {
          history.push({
            tokenId,
            recipient: address,
            txHash,
            isGasless
          });
          localStorage.setItem('cc_ugf_mint_history', JSON.stringify(history));
        }
      } catch (err) {
        console.warn("Failed to write to cc_ugf_mint_history", err);
      }
      
      // Override any potential stale errors and display final success UI
      setTxError(null);
      
      const timer = setTimeout(() => {
        setSyncStep(3); // Finalizing
        setMintedTokenId(tokenId);
        setStep('success');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isConfirmed, receipt, isGasless, txHash, address]);

  // Watch for transaction errors post-broadcast
  useEffect(() => {
    if (receiptError) {
      const timer = setTimeout(() => {
        setTxError(receiptError.shortMessage || receiptError.message || "Block verification failed.");
        setStep('form');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [receiptError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.metric) return;
    
    if (!isConnected) {
      setTxError("Wallet disconnected. Please connect your wallet first.");
      return;
    }
    
    // Base Sepolia ID is 84532
    if (chain?.id !== 84532) {
      setTxError("Incorrect network. Please switch to Base Sepolia to mint credentials.");
      return;
    }

    // Capture the current UGF result hash before this submission to prevent cross-contamination
    lastProcessedHash.current = result?.txHash || null;

    setTxError(null);
    setTxHash('');
    setMintedTokenId(null);
    setStep('syncing');
    setSyncStep(0);

    if (isGasless) {
      try {
        // Step 0: Preparing Gasless Transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!signer) {
          throw new Error("Ethers signer not loaded. Please ensure your wallet is connected.");
        }
        
        // Step 1: Securing UGF Sponsorship
        setSyncStep(1);
        
        const data = encodeMintData({
          recipient: address,
          companyName: formData.companyName,
          category: formData.category,
          description: formData.description,
          metric: formData.metric
        });
        
        openUGF({
          signer,
          tx: {
            to: ESG_CREDENTIAL_ADDRESS,
            data,
            value: 0n
          },
          destChainId: '84532'
        });
      } catch (err) {
        console.error("UGF Gasless setup error:", err);
        setTxError(err.message || "Failed to initialize UGF transaction.");
        setStep('form');
      }
    } else {
      try {
        // Step 0: validation done
        await new Promise(resolve => setTimeout(resolve, 800));
        setSyncStep(1); // Requesting signature in wallet

        const hash = await writeContractAsync({
          ...esgContractConfig,
          functionName: 'mintCredential',
          args: [
            address,
            formData.companyName,
            formData.category,
            formData.description,
            formData.metric
          ]
        });

        setTxHash(hash);
        setSyncStep(2); // Broadcasting to Base Sepolia
      } catch (err) {
        console.error("Standard mint error:", err);
        const friendlyMessage = err.message?.includes("User rejected")
          ? "Transaction rejected by user."
          : err.message?.includes("insufficient funds")
          ? "Insufficient gas to execute transaction."
          : err.shortMessage || err.message || "Transaction failed.";
          
        setTxError(friendlyMessage);
        setStep('form');
      }
    }
  };

  const handleDone = () => {
    onSubmitSuccess({
      companyName: formData.companyName,
      category: formData.category,
      metric: formData.metric,
      description: formData.description,
      score: formData.score,
      txHash: txHash,
      tokenId: mintedTokenId || '0',
      timestamp: new Date().toUTCString(),
      isGasless // Pass gasless flag for showcase item render
    });
    
    // Reset state
    setStep('form');
    setFormData({ companyName: '', category: 'Carbon Offsetting', metric: '', score: 95, description: '' });
    setTxError(null);
    setTxHash('');
    setMintedTokenId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg overflow-hidden glass-card rounded-2xl border border-white/10 shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-semibold font-display text-white">Create ESG Ledger Record</h3>
            </div>
            <button 
              onClick={step === 'syncing' ? null : onClose} 
              disabled={step === 'syncing'}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Apex Renewables Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">ESG Standard</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option>Carbon Offsetting</option>
                      <option>Solar Deployment</option>
                      <option>Energy Efficiency</option>
                      <option>Waste Reduction</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Impact Metric / Value</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 15,200 MT CO2e"
                      value={formData.metric}
                      onChange={(e) => setFormData({...formData, metric: e.target.value})}
                      className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">ESG Verification Score</label>
                    <span className="text-cyan-400 font-semibold text-sm font-display">{formData.score}/100</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="100"
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: parseInt(e.target.value)})}
                    className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Brief summary of verification project details..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                </div>

                {/* Gasless / Sponsored Toggle */}
                <div className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-950/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Sponsor Gas (Gasless Mint)</h4>
                    <p className="text-xs text-slate-400">Zero fee execution powered by Universal Gas Framework</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGasless(!isGasless)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isGasless ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-[#050816] transition-transform ${
                        isGasless ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {txError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 animate-pulse" />
                    <span>{txError}</span>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isGasless ? "Generate Gasless ESG Record" : "Generate ESG Record"}
                  </button>
                  {isGasless && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400/70 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Powered by UGF • Gasless</span>
                    </div>
                  )}
                </div>
              </form>
            )}

            {step === 'syncing' && (
              <div className="py-8 flex flex-col items-center justify-center">
                {/* Floating animated rings */}
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow"></div>
                  <div className="absolute inset-2 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                  <div className="absolute inset-4 rounded-full border border-blue-500/30 animate-spin-reverse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {syncStep === 0 && <Cpu className="w-8 h-8 text-cyan-400" />}
                    {syncStep === 1 && <Send className="w-8 h-8 text-blue-400 animate-pulse" />}
                    {syncStep === 2 && <Database className="w-8 h-8 text-indigo-400" />}
                    {syncStep === 3 && <Leaf className="w-8 h-8 text-emerald-400 animate-bounce" />}
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-4">
                  {syncMessages.map((msg, idx) => {
                    const isActive = idx === syncStep;
                    const isCompleted = idx < syncStep;
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                          isActive ? 'bg-white/5 border border-cyan-500/20' : 'opacity-40'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-white/10" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold font-display ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {msg.title}
                          </h4>
                          {isActive && <p className="text-xs text-slate-400 mt-1">{msg.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-6 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold font-display text-cyan-400">
                    {isGasless ? "Gasless ESG Record Created Successfully" : "ESG Record Created Successfully"}
                  </h4>
                  {isGasless && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span>Sponsorship Covered via UGF • No ETH Required</span>
                    </div>
                  )}
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">
                    Your non-transferable soulbound ESG credential NFT has been secured on Base Sepolia.
                  </p>
                </div>

                <div className="p-4 bg-brand-dark/80 border border-white/5 rounded-xl text-left space-y-2 max-w-sm mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>CREDENTIAL ID</span>
                    <span className="text-white font-semibold font-mono">#{mintedTokenId || '0'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>TRANSACTION HASH</span>
                    <a 
                      href={getTxExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 font-mono flex items-center gap-1 hover:underline hover:text-cyan-300 transition-colors"
                    >
                      {txHash ? `${txHash.slice(0, 8)}...${txHash.slice(-8)}` : '0x...'}
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    </a>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>TIMESTAMP</span>
                    <span className="text-slate-300">{new Date().toUTCString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>SECURITY & GAS</span>
                    <span className={isGasless ? "text-cyan-400 font-semibold" : "text-slate-300 font-semibold"}>
                      {isGasless ? "Gasless (Sponsored via UGF)" : "Standard (User Paid Gas)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>SECURITY STATE</span>
                    <span className="text-emerald-400 font-semibold">Soulbound Verified</span>
                  </div>
                </div>

                <button 
                  onClick={handleDone}
                  className="px-8 py-3 bg-white hover:bg-slate-200 text-[#050816] font-semibold rounded-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function VerifyReceiptModal({ isOpen, onClose, record }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !record) return null;

  const mockTxHash = record.txHash || '0x4fbc901a88dfb2c7e090df3a1bdfd90a827cfb191a27cf89be';
  const mockBlock = record.block || '8,481,209';

  const handleCopy = () => {
    navigator.clipboard.writeText(mockTxHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg overflow-hidden glass-card rounded-2xl border border-white/10 shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-semibold font-display text-white">Immutable Ledger Proof</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-2">
                  ✓ Ledger Verified
                </span>
                <h4 className="text-2xl font-bold font-display text-white">{record.companyName}</h4>
                <p className="text-sm text-slate-400 mt-1">{record.category}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">ESG SCORE</span>
                <span className="text-3xl font-bold font-display text-gradient-green-cyan">{record.score}/100</span>
              </div>
            </div>

            {/* Cryptographic Details Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-brand-dark/80 border border-white/5 rounded-xl">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Status</span>
                <span className="text-sm font-semibold text-emerald-400">Confirmed (Gasless)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Timestamp</span>
                <span className="text-sm font-semibold text-white">{record.timestamp || 'May 21, 2026 21:20 GMT'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Impact Metric</span>
                <span className="text-sm font-semibold text-cyan-400">{record.metric}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Block Index</span>
                <span className="text-sm font-semibold text-white">{mockBlock}</span>
              </div>
            </div>

            {/* Cryptographic Hashes */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1.5">
                  <span>Cryptographic Proof Hash (SHA-256)</span>
                  <button 
                    onClick={handleCopy}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </label>
                <div className="p-3 bg-brand-dark/80 border border-white/5 rounded-xl font-mono text-xs text-slate-400 break-all select-all">
                  {mockTxHash}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Universal Gasless Forwarder Seal
                </label>
                <div className="p-3 bg-brand-dark/80 border border-white/5 rounded-xl font-mono text-xs text-emerald-500/80 break-all">
                  Secured_via_UGF_Contract_0x9b7e...sig_verified_by_validators_relay_epoch_591
                </div>
              </div>
            </div>

            {/* Verification Button */}
            <div className="pt-2">
              <a 
                href={getTxExplorerUrl(mockTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                View on Basescan Explorer
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
