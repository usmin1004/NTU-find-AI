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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Header with Share Link and Status */}
      <Header sharedUrl={sharedUrl} hasApiKey={hasApiKey} />

      {/* Navigation Tabs for All Stages */}
      <NavTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'prototype' && <PrototypeView />}
        {activeTab === 'evaluation' && <EvaluationView />}
        {activeTab === 'failures' && <FailureAnalysisView />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'dataset' && <DatasetView />}
      </main>

      {/* Footer with Assignment Deliverable Reference */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-800">
              Generative AI &amp; Agentic AI — Group Assignment (Part 1)
            </div>
            <div>
              Project: <strong>NTU FindAI</strong> (Design, prototype, test, and improve a GenAI application)
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="bg-slate-100 px-2.5 py-1 rounded text-[11px] font-mono border border-slate-200 text-slate-700">
              Submission: 13 September 2026, 11:59pm
            </span>
            <span className="text-blue-600 font-medium hover:underline cursor-pointer" onClick={() => setActiveTab('prototype')}>
              Deliverable #2 Public Web App
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
