import React, { useState } from 'react';
import { X, Copy, Check, Quote } from 'lucide-react';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperTitle: string;
  citations: {
    apa: string;
    mla: string;
    chicago: string;
    harvard: string;
    bibtex: string;
  } | null;
}

export const CitationModal: React.FC<CitationModalProps> = ({
  isOpen,
  onClose,
  paperTitle,
  citations,
}) => {
  const [activeTab, setActiveTab] = useState<'apa' | 'mla' | 'chicago' | 'harvard' | 'bibtex'>('apa');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !citations) return null;

  const currentCitation = citations[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: Array<{ id: 'apa' | 'mla' | 'chicago' | 'harvard' | 'bibtex'; label: string }> = [
    { id: 'apa', label: 'APA 7th' },
    { id: 'mla', label: 'MLA 9th' },
    { id: 'chicago', label: 'Chicago' },
    { id: 'harvard', label: 'Harvard' },
    { id: 'bibtex', label: 'BibTeX' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252B3A]/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E6E0] flex items-center justify-between bg-[#F8F7F3]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EFF4F0] text-[#354D43] flex items-center justify-center shadow-2xs">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#252B3A]">Format Academic Citation</h3>
              <p className="text-xs text-[#737B89] truncate max-w-md">{paperTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737B89] hover:text-[#252B3A] hover:bg-[#E8E6E0] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="px-5 pt-4 pb-1 border-b border-[#E8E6E0] flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#354D43] text-white shadow-xs'
                  : 'bg-[#F8F7F3] text-[#737B89] hover:text-[#252B3A] hover:bg-[#EFF4F0] border border-[#E8E6E0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Citation Display Area */}
        <div className="p-5 space-y-4">
          <div className="relative">
            {activeTab === 'bibtex' ? (
              <pre className="p-4 bg-[#252B3A] text-[#8FA998] text-xs font-mono rounded-xl overflow-x-auto max-h-56 leading-relaxed border border-[#E8E6E0]/20">
                {currentCitation}
              </pre>
            ) : (
              <div className="p-4 bg-[#F8F7F3] text-[#252B3A] text-xs font-serif rounded-xl border border-[#E8E6E0] leading-relaxed italic">
                "{currentCitation}"
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#737B89]">
              Verified standard academic reference output.
            </span>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-[#354D43] hover:bg-[#2A3E36] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#8FA998]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Citation'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
