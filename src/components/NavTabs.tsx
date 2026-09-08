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
    <nav id="main-navigation-tabs" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                id={`tab-button-${tab.key}`}
                onClick={() => onChangeTab(tab.key)}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left whitespace-nowrap transition-all text-xs font-semibold shrink-0 ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        isActive ? 'bg-blue-200/70 text-blue-800' : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-600 font-normal">{tab.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
