import React, { useState } from 'react';
import { Share2, ExternalLink, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface HeaderProps {
  sharedUrl: string;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ sharedUrl, hasApiKey }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = async () => {
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShowShareModal(true);
    }
  };

  return (
    <>
      <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  NTU FindAI
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  GenAI &amp; Agentic AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                University Lost-and-Found Matching &amp; Private Ownership Verification System
              </p>
            </div>
          </div>

          {/* Action Buttons & Share Link */}
          <div className="flex items-center flex-wrap gap-2.5">
            {hasApiKey ? (
              <div className="hidden sm:flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Gemini 3.8 Flash Active
              </div>
            ) : (
              <div className="hidden sm:flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200" title="Running in simulated benchmark mode">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-500" />
                Deterministic Benchmark Mode
              </div>
            )}

            {/* Quick Share Link Button */}
            <button
              id="header-quick-copy-button"
              onClick={handleQuickCopy}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              title="Copy submission share link"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              {copied ? 'Link Copied! ✓' : 'Copy Share Link'}
            </button>

            <button
              id="header-open-share-modal-button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Public Access Links
            </button>
          </div>
        </div>

        {/* Deliverable Alert Strip */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-t border-blue-100 px-4 py-1.5 text-xs text-slate-600 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2">
            <span className="truncate">
              📌 <strong className="text-slate-800">Assignment Deliverable 2:</strong> Publicly accessible link for evaluation: <code className="bg-white/80 px-1.5 py-0.5 rounded text-blue-800 font-mono text-[11px] border border-blue-200 ml-1">{sharedUrl}</code>
            </span>
            <button
              onClick={() => setShowShareModal(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold underline text-xs shrink-0 ml-3"
            >
              Report Appendix Guide &gt;
            </button>
          </div>
        </div>
      </header>

      {showShareModal && (
        <ShareModal
          sharedUrl={sharedUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};
