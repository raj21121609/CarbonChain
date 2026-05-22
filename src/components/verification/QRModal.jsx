import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Share2, Check, ExternalLink, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getTxExplorerUrl } from '../../web3/chainUtils';

export default function QRModal({ isOpen, onClose, credential, ownerAddress }) {
  const [copied, setCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const qrRef = useRef(null);

  // Check if Web Share API is available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setShareSupported(true);
    }
  }, []);

  if (!credential) return null;

  // The verification link points to this app's public /verify/:address page
  const verificationLink = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${ownerAddress || ''}`
    : `https://carbonchain.esg/verify/${ownerAddress || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    // Find the SVG element rendering the QR code
    const svgElement = document.getElementById('qr-svg-code');
    if (!svgElement) return;

    // Convert SVG to string
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    
    // Create an image element and draw to canvas to export as PNG
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 350;
      canvas.height = 350;
      const context = canvas.getContext('2d');
      
      // Draw background
      context.fillStyle = '#050816';
      context.fillRect(0, 0, 350, 350);
      
      // Draw SVG onto canvas
      context.drawImage(image, 25, 25, 300, 300);
      
      // Trigger download
      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = `${credential.organizationName.replace(/\s+/g, '_')}_ESG_Verification_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  const handleShare = async () => {
    if (shareSupported) {
      try {
        await navigator.share({
          title: `ESG Verification: ${credential.organizationName}`,
          text: `Verified ESG Record: ${credential.category} - ${credential.metric}`,
          url: verificationLink,
        });
      } catch (err) {
        console.warn('Web Share failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#03050c]/85 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden glass-card rounded-2xl border border-cyan-500/20 bg-[#050816]/95 shadow-[0_0_50px_rgba(6,182,212,0.15)] p-6 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-display">Share Verification Proof</h3>
            </div>

            {/* QR display block */}
            <div className="flex flex-col items-center justify-center bg-[#03050c] border border-white/5 rounded-xl p-6 mb-6">
              <div className="relative p-3 bg-white rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] border-2 border-cyan-400/50 overflow-hidden">
                {/* Laser scan line overlay */}
                <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-[scan_2s_ease-in-out_infinite] z-10" />
                <QRCodeSVG
                  id="qr-svg-code"
                  value={verificationLink}
                  size={200}
                  level="H"
                  bgColor="#ffffff"
                  fgColor="#050816"
                  includeMargin={true}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-4 font-medium text-center">
                Scan to instantly audit this credential on the public ledger
              </p>
            </div>

            {/* Credential overview list */}
            <div className="space-y-3 border border-white/5 rounded-xl bg-white/2 p-4 mb-6 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Holder</span>
                <span className="text-white font-semibold">{credential.organizationName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Metric Type</span>
                <span className="text-cyan-400 font-semibold">{credential.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Audit Metrics</span>
                <span className="text-emerald-400 font-semibold">{credential.metric}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Token ID</span>
                <span className="text-white font-mono font-semibold">#{credential.tokenId}</span>
              </div>
            </div>

            {/* Buttons grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-cyan-500/5 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadQR}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-cyan-500/5 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </motion.button>
            </div>

            {shareSupported && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-cyan-500 text-[#050816] hover:bg-cyan-400 transition-all cursor-pointer mb-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Verification Link</span>
              </motion.button>
            )}

            <a
              href={getTxExplorerUrl(credential.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-cyan-400 transition-colors py-1 w-full"
            >
              <span>Verify transaction on BaseScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
