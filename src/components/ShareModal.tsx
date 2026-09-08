import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Globe, QrCode } from 'lucide-react';

interface ShareModalProps {
  sharedUrl: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ sharedUrl, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDevLink, setCopiedDevLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const devUrl = 'https://ais-dev-nsbrvcojn6a2rs7tud6l4p-75160131100.asia-east1.run.app';

  const reportCitation = `=== NTU FindAI Application Access Link ===
Public System URL: ${sharedUrl}
System: NTU FindAI (Generative AI University Lost-and-Found System)
Stage 5 Live Prototype & Stage 6 Evaluation Benchmark
Tested on: Google Cloud Run container environment
Note: Fully accessible to instructors and peer evaluators without login.`;

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div id="share-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div id="share-modal-card" className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">System Access &amp; Submission Links</h2>
              <p className="text-xs text-slate-500">Public Live URL &amp; Deployment Guide</p>
            </div>
          </div>
          <button
            id="close-share-modal-button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Important Alert on How to Enable the Share URL */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold text-blue-900 flex items-center space-x-1.5">
              <span>💡 Link Access &amp; Availability Guide</span>
            </div>
            <ul className="text-blue-900/90 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>To test immediately in your browser:</strong> Open the <strong>[Live Preview Link]</strong> below in a new tab, or use the AI Studio Live Preview panel directly.
              </li>
              <li>
                <strong>To share with instructors and peers:</strong> Click the <strong>[Share]</strong> button at the top-right of the Google AI Studio interface to deploy and activate the public external link (<code>ais-pre-...</code>).
              </li>
            </ul>
          </div>

          {/* Link 1: Development Live Link (For immediate self-check) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                1. Immediate Browser Preview Link (Development Instance)
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Active Now
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="dev-modal-url-input"
                type="text"
                readOnly
                value={devUrl}
                className="w-full bg-slate-50 text-slate-800 text-xs font-mono px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden select-all"
              />
              <button
                id="dev-modal-copy-link-button"
                onClick={() => copyToClipboard(devUrl, setCopiedDevLink)}
                className="inline-flex items-center px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shrink-0 transition-colors"
              >
                {copiedDevLink ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copiedDevLink ? 'Copied' : 'Copy'}
              </button>
              <a
                id="dev-modal-open-tab-button"
                href={devUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Open
              </a>
            </div>
          </div>

          {/* Link 2: Public Share URL (For Report Submission) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                2. Assignment Deliverable #2 Public URL (Permanent Shared Link)
              </label>
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Activated via AI Studio Share
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="share-modal-url-input"
                type="text"
                readOnly
                value={sharedUrl}
                className="w-full bg-slate-50 text-slate-800 text-xs font-mono px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden select-all"
              />
              <button
                id="share-modal-copy-link-button"
                onClick={() => copyToClipboard(sharedUrl, setCopiedLink)}
                className="inline-flex items-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
              >
                {copiedLink ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copiedLink ? 'Copied' : 'Copy Link'}
              </button>
              <a
                id="share-modal-open-tab-button"
                href={sharedUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shrink-0 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Formatted Report Appendix Citation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">Report Appendix Citation Text (10-page PDF)</span>
              <button
                onClick={() => copyToClipboard(reportCitation, setCopiedCitation)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedCitation ? 'Copied!' : 'Copy Formatted Text'}
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={reportCitation}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-700 select-all focus:outline-hidden"
            />
          </div>

          {/* QR Code note */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
            <QrCode className="w-4 h-4 text-slate-400" />
            <span>This link can also be converted to a QR code for your in-class Stage 6 presentation slides.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
