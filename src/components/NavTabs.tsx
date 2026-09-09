import React from 'react';
import { Search, BarChart3, AlertTriangle, Layers, Database } from 'lucide-react';

export type TabKey = 'prototype' | 'evaluation' | 'failures' | 'architecture' | 'dataset';

interface NavTabsProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
}

export const NavTabs: React.FC<NavTabsProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      key: 'prototype' as TabKey,
      label: 'Stage 5: Live Prototype',
      sublabel: 'Student Search & Verification',
      icon: Search,
      badge: 'Interactive',
    },
    {
      key: 'evaluation' as TabKey,
      label: 'Stage 6: Evaluation Matrix',
      sublabel: '20 Test Cases (A vs B vs C)',
      icon: BarChart3,
      badge: 'A / B / C',
    },
    {
      key: 'failures' as TabKey,
      label: 'Stage 7: Failure Analysis',
      sublabel: 'Diagnosis, Cause & Retest',
      icon: AlertTriangle,
    },
    {
      key: 'architecture' as TabKey,
      label: 'Stages 1–4: Architecture',
      sublabel: 'System Design & Prompts',
      icon: Layers,
    },
    {
      key: 'dataset' as TabKey,
      label: 'RAG Dataset (30 Items)',
      sublabel: 'Simulated Campus Records',
      icon: Database,
    },
  ];

  return (
    <nav id="main-navigation-tabs" className="py-2">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-button-${tab.key}`}
              onClick={() => onChangeTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#141b2d] text-white shadow-xs'
                  : 'bg-white text-[#4b5569] hover:text-[#141b2d] hover:bg-[#ede8dc]/80 border border-[#e5dfd2]'
              }`}
            >
              {tab.key === 'prototype' && 'Live prototype'}
              {tab.key === 'architecture' && 'Architecture'}
              {tab.key === 'evaluation' && 'Evaluation'}
              {tab.key === 'failures' && 'Failure Analysis'}
              {tab.key === 'dataset' && 'Dataset (30 items)'}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
