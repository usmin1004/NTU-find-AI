import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Cpu, Wrench } from 'lucide-react';
import { INITIAL_FAILURE_CASES } from '../data/testCases';
import { FailureCase } from '../types';

export const FailureAnalysisView: React.FC = () => {
  const [failures] = useState<FailureCase[]>(INITIAL_FAILURE_CASES);
  const [selectedCase, setSelectedCase] = useState<FailureCase>(INITIAL_FAILURE_CASES[0]);

  return (
    <div id="failure-analysis-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Stage 7: Analyze Failures and Improve</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Failure Diagnosis, Root Cause Analysis &amp; Retest Verification
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Strictly documents the assignment pipeline: <code>input → expected behaviour → actual behaviour → likely cause → proposed fix → retest result</code> across key failure modes.
        </p>
      </div>

      {/* Case Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {failures.map(fc => {
          const isSelected = selectedCase.id === fc.id;
          return (
            <button
              key={fc.id}
              onClick={() => setSelectedCase(fc)}
              className={`p-4 rounded-xl border text-left transition-all shadow-2xs ${
                isSelected
                  ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-100'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                  {fc.testNo} ({fc.id})
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    fc.category === 'prompt'
                      ? 'bg-indigo-100 text-indigo-800'
                      : fc.category === 'retrieval'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {fc.category} Fix
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 truncate mb-1">
                &ldquo;{fc.input}&rdquo;
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2">
                {fc.likelyCause}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Case Detail Deep-Dive */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 mr-2">{selectedCase.id}</span>
            <span className="text-sm font-bold text-slate-900">
              Test Case {selectedCase.testNo} Failure Diagnosis &amp; Remediation Table
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Retest Passed (Variant C)
          </span>
        </div>

        {/* 6-Step Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Input */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px]">1</span>
              <span>Input</span>
            </div>
            <p className="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
              &ldquo;{selectedCase.input}&rdquo;
            </p>
          </div>

          {/* Step 2: Expected Behaviour */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px]">2</span>
              <span>Expected Behaviour</span>
            </div>
            <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-medium">
              {selectedCase.expectedBehavior}
            </p>
          </div>

          {/* Step 3: Actual Behaviour */}
          <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-[10px]">3</span>
              <span>Actual Behaviour (Baseline Failure)</span>
            </div>
            <p className="text-xs text-rose-950 bg-white p-3 rounded-lg border border-rose-200 leading-relaxed font-medium">
              {selectedCase.actualBehavior}
            </p>
          </div>

          {/* Step 4: Likely Cause */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px]">4</span>
              <span>Likely Cause</span>
            </div>
            <p className="text-xs text-amber-950 bg-white p-3 rounded-lg border border-amber-200 leading-relaxed font-medium">
              {selectedCase.likelyCause}
            </p>
          </div>

          {/* Step 5: Proposed Fix */}
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center text-[10px]">5</span>
              <span>Proposed Fix</span>
            </div>
            <p className="text-xs text-blue-950 bg-white p-3 rounded-lg border border-blue-200 leading-relaxed font-medium">
              {selectedCase.proposedFix}
            </p>
          </div>

          {/* Step 6: Retest Result */}
          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px]">6</span>
              <span>Retest Result (Variant C)</span>
            </div>
            <p className="text-xs text-emerald-950 bg-white p-3 rounded-lg border border-emerald-200 leading-relaxed font-bold">
              {selectedCase.retestResult}
            </p>
          </div>
        </div>

        {/* 3 Categories of Improvement */}
        <div className="border-t border-slate-200 pt-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Assignment Stage 7 Requirement: 3 Categories of System Improvement
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center">
                <Cpu className="w-4 h-4 text-blue-600 mr-1.5" />
                1. Better Prompts
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Rule 8 (clarification on insufficient evidence) and JSON schema validation eliminate unconstrained guessing on ambiguous inputs.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center">
                <Wrench className="w-4 h-4 text-emerald-600 mr-1.5" />
                2. Better Retrieval / RAG
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Moving beyond bag-of-words token counting to semantic attribute binding penalizes conflicting attributes (e.g. colour/brand mismatches).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1 flex items-center">
                <ShieldAlert className="w-4 h-4 text-purple-600 mr-1.5" />
                3. Better Workflow &amp; Isolation
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Physical segregation of confidential reference features from the public search pipeline, with human-in-the-loop physical sign-off at desk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
