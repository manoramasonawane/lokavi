import React, { useState } from 'react';
import { X, Check, Copy, ShieldCheck, Key } from 'lucide-react';
import { LokaviLogo } from './LokaviLogo.js';

interface ApiSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSetupModal: React.FC<ApiSetupModalProps> = ({ isOpen, onClose }) => {
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const envSnippet = `# Optional External Integrations (Not required - lokavi works 100% offline out-of-the-box!)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_OPENWEATHER_API_KEY=your_weather_api_key_here`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#F7F4ED] rounded-3xl max-w-xl w-full p-6 border border-[#DFCEB7] shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8EBE2]">
          <div className="flex items-center gap-3">
            <LokaviLogo size="sm" showTagline={false} />
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#29323A]">
                lokavi Architecture & API Setup
              </h3>
              <p className="text-xs text-[#53626F]">
                Full offline reliability with optional external API hooks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#53626F] hover:text-[#29323A] rounded-xl hover:bg-[#E8EBE2]"
            aria-label="Close API Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-4 rounded-2xl bg-white border border-[#DFCEB7] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#354D43]">
            <Check className="w-4 h-4 text-[#354D43]" />
            <span>Ready-to-Run Without Any Database or External Key</span>
          </div>
          <p className="text-[#53626F] leading-relaxed font-light">
            lokavi comes bundled with a verified dataset of Indian tourist destinations, local shops, bazaars, full coverage of all 28 states & 8 UTs, a comprehensive Indian PIN code directory, and native mathematical Haversine calculations.
          </p>
        </div>

        {/* Integration Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#354D43] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#C9A982]" /> Optional External Integrations
          </h4>
          
          <div className="space-y-2 text-xs text-[#53626F]">
            <div className="p-3.5 bg-white rounded-2xl border border-[#DFCEB7] space-y-1">
              <strong className="block text-[#29323A]">1. Google Maps Navigation Links (Active by Default)</strong>
              <span className="font-light">
                All destination and shop cards provide direct links to Google Maps driving and walking directions without requiring paid API tokens.
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#DFCEB7] space-y-1">
              <strong className="block text-[#29323A]">2. Environment Variables (.env)</strong>
              <span className="font-light">To embed interactive map tiles or real-time temperature telemetry:</span>
              <div className="relative mt-2">
                <pre className="p-3 rounded-xl bg-[#29323A] text-[#F7F4ED] font-mono text-[11px] overflow-x-auto">
                  {envSnippet}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#354D43] text-white text-xs font-bold hover:bg-[#24352E] transition active:scale-95 shadow-xs"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
