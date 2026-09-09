import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  sharedUrl?: string;
  hasApiKey?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
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
      </div>
    </header>
  );
};

