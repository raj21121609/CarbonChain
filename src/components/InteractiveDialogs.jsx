import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldAlert, Cpu, Database, Send, Clipboard, ExternalLink, Leaf } from 'lucide-react';

export function SubmitRecordModal({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    companyName: '',
    category: 'Carbon Offsetting',
    metric: '',
    score: 95,
    description: ''
  });

  const [step, setStep] = useState('form'); // 'form' | 'syncing' | 'success'
  const [syncStep, setSyncStep] = useState(0);

  const syncMessages = [
    { title: "Compiling ESG Metadata", desc: "Computing cryptographic hash of carbon credentials..." },
    { title: "Verifying Gasless Signature", desc: "Verifying authorization via Universal Gasless Forwarder..." },
    { title: "Broadcasting Ledger TX", desc: "Broadcasting zero-gas transaction to CarbonChain validators..." },
    { title: "Committing Block", desc: "Writing immutable record to decentralized ledger..." }
  ];

  useEffect(() => {
    let interval;
    if (step === 'syncing') {
      setSyncStep(0);
      interval = setInterval(() => {
        setSyncStep((prev) => {
          if (prev >= syncMessages.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setStep('success');
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.metric) return;
    setStep('syncing');
  };

  const handleDone = () => {
    onSubmitSuccess({
      ...formData,
      txHash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      timestamp: new Date().toUTCString()
    });
    setStep('form');
    setFormData({ companyName: '', category: 'Carbon Offsetting', metric: '', score: 95, description: '' });
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
              onClick={onClose} 
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
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

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Gasless ESG Record
                  </button>
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
                <div>
                  <h4 className="text-xl font-bold font-display text-white">Record Secured on Chain</h4>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                    Your ESG credentials have been successfully hashed and committed to the ledger with gasless transaction relaying.
                  </p>
                </div>

                <div className="p-4 bg-brand-dark/80 border border-white/5 rounded-xl text-left space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>TRANSACTION HASH</span>
                    <span className="text-cyan-400 font-mono">0x{Math.random().toString(36).substring(2, 10)}...</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>SECURITY SCHEME</span>
                    <span className="text-emerald-400">UGF-Immutable-v4</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>GAS COSTS</span>
                    <span className="text-slate-400 line-through">$0.00 (Gasless)</span>
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
                href="#"
                onClick={(e) => { e.preventDefault(); alert("You are viewing the simulated transaction on the CarbonChain testnet ledger explorer!"); }}
                className="w-full py-3.5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                View on CarbonChain Explorer
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
