import React from 'react';

interface HeaderProps {
  sharedUrl?: string;
  hasApiKey?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header id="app-header" className="bg-[#f8f6f0] border-b border-[#ece7dc] pt-6 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d94826] text-white flex items-center justify-center font-bold text-base shadow-xs">
            F
          </div>
          <span className="text-lg font-bold text-[#141b2d] tracking-tight font-sans">
            NTU FindAI
          </span>
        </div>

        {/* Right Status Pill */}
        <div className="text-xs font-medium text-[#5c687e] bg-[#ede8dc] border border-[#ded7c8] px-3.5 py-1 rounded-full">
          Student prototype &middot; human-verified &middot; build 1.1
        </div>
      </div>
    </header>
  );
};

