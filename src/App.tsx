import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavTabs, TabKey } from './components/NavTabs';
import { PrototypeView } from './components/PrototypeView';
import { EvaluationView } from './components/EvaluationView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { ArchitectureView } from './components/ArchitectureView';
import { DatasetView } from './components/DatasetView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('prototype');
  const [sharedUrl, setSharedUrl] = useState<string>(
    'https://ais-pre-nsbrvcojn6a2rs7tud6l4p-75160131100.asia-east1.run.app'
  );
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.sharedAppUrl) setSharedUrl(data.sharedAppUrl);
        if (data.hasApiKey !== undefined) setHasApiKey(data.hasApiKey);
      })
      .catch(() => {
        // Default fallback if server route not yet ready
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col text-[#141b2d] font-sans antialiased selection:bg-[#d94826]/20 selection:text-[#d94826]">
      {/* Top Header with Share Link and Status */}
      <Header sharedUrl={sharedUrl} hasApiKey={hasApiKey} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Navigation Tabs for All Stages */}
        <NavTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'prototype' && <PrototypeView onChangeTab={setActiveTab} />}
          {activeTab === 'evaluation' && <EvaluationView />}
          {activeTab === 'failures' && <FailureAnalysisView />}
          {activeTab === 'architecture' && <ArchitectureView />}
          {activeTab === 'dataset' && <DatasetView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f6f0] border-t border-[#ece7dc] mt-auto py-6 text-xs text-[#7c8799]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="font-medium text-[#4b5569]">
            NTU FindAI &mdash; University Lost-and-Found Matching &amp; Verification System
          </div>
          <div className="text-[#8e98a8]">
            NTU Campus Community &middot; GenAI &amp; Agentic AI
          </div>
        </div>
      </footer>
    </div>
  );
}
