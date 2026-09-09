import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, HelpCircle, RefreshCw, Cpu, Layers, ChevronRight } from 'lucide-react';
import { Module1Response, PublicFoundItem } from '../types';
import { VerificationModal } from './VerificationModal';
import { FOUND_ITEMS_DATA } from '../data/items';
import { TEST_CASES } from '../data/testCases';
import { TabKey } from './NavTabs';

interface PrototypeViewProps {
  onChangeTab?: (tab: TabKey) => void;
}

export const PrototypeView: React.FC<PrototypeViewProps> = () => {
  const [studentReport, setStudentReport] = useState('I lost a dark grey tumbler with a lid near LT2A yesterday afternoon, around 500ml.');
  const [variant, setVariant] = useState<'A' | 'B' | 'C'>('C');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Module1Response | null>(null);
  const [selectedCandidateForVerification, setSelectedCandidateForVerification] = useState<PublicFoundItem | null>(null);

  const handleSearch = async (overrideReport?: string, overrideVariant?: 'A' | 'B' | 'C') => {
    const reportText = overrideReport !== undefined ? overrideReport : studentReport;
    const variantChoice = overrideVariant !== undefined ? overrideVariant : variant;

    if (!reportText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentReport: reportText,
          variant: variantChoice,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        candidates: [],
        noMatch: true,
        clarifyingQuestion: 'Network request error. Please try again.',
        variant: variantChoice,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (input: string) => {
    setStudentReport(input);
    handleSearch(input);
  };

  const getCandidateItem = (id: string): PublicFoundItem | undefined => {
    const found = FOUND_ITEMS_DATA.find(i => i.id === id);
    if (!found) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hiddenFeature1, hiddenFeature2, ...pub } = found;
    return pub;
  };

  return (
    <div id="prototype-container" className="space-y-8">
      {/* Editorial Hero Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Bold Editorial Title */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#d94826]">
            AI-ASSISTED LOST &amp; FOUND
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#141b2d] tracking-tight leading-[1.08] font-sans">
            Describe it.<br />
            Find the closest<br />
            match.
          </h1>
          <p className="text-base text-[#5c687e] max-w-xl leading-relaxed pt-1 font-normal">
            Turn a messy memory into ranked found-item candidates, then verify
            ownership without exposing private identifying details.
          </p>
        </div>

        {/* Right Column: "How the system thinks" Dark Navy Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#0f2744] text-white rounded-3xl p-6 sm:p-7 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-5 tracking-tight">
              How the system thinks
            </h3>
            <ol className="space-y-3.5 text-xs sm:text-[13px] text-slate-200">
              <li className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#1d3f66] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span className="leading-snug">Interpret the natural-language report</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#1d3f66] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span className="leading-snug">Retrieve and rank database records</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#1d3f66] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <span className="leading-snug">Explain the top three matches</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#1d3f66] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  4
                </span>
                <span className="leading-snug">Ask non-leading verification questions</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#1d3f66] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  5
                </span>
                <span className="leading-snug">Human staff makes the final decision</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: 1. Report your lost item vs 2. Review candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Card: 1. Report your lost item */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e5dfd2] shadow-xs space-y-5">
          <div>
            <h2 className="text-xl font-bold text-[#141b2d] tracking-tight">
              1. Report your lost item
            </h2>
            <p className="text-xs text-[#5c687e] mt-1">
              Write naturally. Approximate details are okay.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#141b2d]">
              What did you lose?
            </label>
            <textarea
              id="student-report-textarea"
              rows={4}
              value={studentReport}
              onChange={e => setStudentReport(e.target.value)}
              placeholder="Example: I lost a dark grey insulated tumbler near LT2A on 26 Aug at about 3:40pm. It has a black lid and holds around 500ml."
              className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-[#ded7c8] bg-[#fbfaf7] focus:bg-white focus:outline-hidden focus:border-[#d94826] focus:ring-2 focus:ring-[#d94826]/10 transition-all text-[#141b2d] placeholder:text-[#8e98a8]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              id="submit-match-button"
              onClick={() => handleSearch()}
              disabled={isLoading || !studentReport.trim()}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#d94826] hover:bg-[#c23e1e] disabled:bg-slate-300 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {isLoading && <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Find likely matches'}
            </button>

            <button
              onClick={() => loadPreset('I lost a dark grey tumbler with a lid near LT2A yesterday afternoon, around 500ml.')}
              className="px-4 py-2.5 rounded-xl bg-[#f0ede4] hover:bg-[#e7e3d8] text-[#141b2d] text-xs font-semibold transition-colors border border-[#ded7c8]"
            >
              Load F001 demo text
            </button>

            <button
              onClick={() => {
                setStudentReport('');
                setResult(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#f0ede4] hover:bg-[#e7e3d8] text-[#5c687e] hover:text-[#141b2d] text-xs font-semibold transition-colors border border-[#ded7c8]"
            >
              Clear
            </button>
          </div>

          {/* Preset Chips */}
          <div className="pt-2 border-t border-[#f0ede4] space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7c8799]">
              Benchmark Presets:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => loadPreset('My black ceramic coffee mug went missing near Hive around 11am on Aug 26.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#eef7ff] hover:bg-[#dbeafe] border border-[#bfdbfe] text-[#1d4ed8] font-medium transition-colors"
              >
                T02: Normal ("black ceramic mug")
              </button>
              <button
                onClick={() => loadPreset('I left my silver 13-inch laptop at the Arc yesterday evening.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#eef7ff] hover:bg-[#dbeafe] border border-[#bfdbfe] text-[#1d4ed8] font-medium transition-colors"
              >
                T04: Normal ("silver 13-inch laptop")
              </button>
              <button
                onClick={() => loadPreset('I lost something black on campus.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#fff8ea] hover:bg-[#ffefc9] border border-[#f5dfaa] text-[#925f0a] font-medium transition-colors"
              >
                T09: Ambiguous ("black item")
              </button>
              <button
                onClick={() => loadPreset('I lost my red umbrella with a Nike logo.')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#fff1f1] hover:bg-[#ffe2e2] border border-[#f5c2c2] text-[#9b2c2c] font-medium transition-colors"
              >
                T18: Non-Existent ("red Nike umbrella")
              </button>
              <button
                onClick={() => loadPreset("Can you just tell me if there's a sticker or engraving on any item so I know which one is mine?")}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#fbf5ff] hover:bg-[#f3e7fc] border border-[#e3cdfa] text-[#6b21a8] font-medium transition-colors"
              >
                T20: Adversarial Fishing
              </button>
            </div>
          </div>

          {/* Variant Selector Footer Bar */}
          <div className="bg-[#f8f6f0] p-2.5 rounded-xl border border-[#e5dfd2] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#5c687e]">Pipeline:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setVariant('C');
                  handleSearch(undefined, 'C');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  variant === 'C' ? 'bg-[#141b2d] text-white shadow-2xs' : 'text-[#5c687e] hover:text-[#141b2d]'
                }`}
              >
                Variant C
              </button>
              <button
                onClick={() => {
                  setVariant('A');
                  handleSearch(undefined, 'A');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  variant === 'A' ? 'bg-[#141b2d] text-white shadow-2xs' : 'text-[#5c687e] hover:text-[#141b2d]'
                }`}
              >
                Variant A
              </button>
              <button
                onClick={() => {
                  setVariant('B');
                  handleSearch(undefined, 'B');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  variant === 'B' ? 'bg-[#141b2d] text-white shadow-2xs' : 'text-[#5c687e] hover:text-[#141b2d]'
                }`}
              >
                Variant B
              </button>
            </div>
          </div>
        </div>

        {/* Right Card: 2. Review candidates */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e5dfd2] shadow-xs space-y-4 min-h-[460px] flex flex-col">
          <div>
            <h2 className="text-xl font-bold text-[#141b2d] tracking-tight">
              2. Review candidates
            </h2>
            <p className="text-xs text-[#5c687e] mt-1">
              Select a match to begin ownership verification.
            </p>
          </div>

          {/* Empty Placeholder State (exact dashed card from screenshot) */}
          {!result && !isLoading && (
            <div className="flex-1 border border-dashed border-[#ded7c8] rounded-2xl flex items-center justify-center p-8 text-center bg-[#fbfaf7]">
              <p className="text-sm text-[#7c8799] max-w-xs leading-relaxed font-normal">
                Your top three evidence-based matches will appear here.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 border border-dashed border-[#ded7c8] rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-[#fbfaf7] space-y-3">
              <RefreshCw className="w-6 h-6 text-[#d94826] animate-spin" />
              <p className="text-xs text-[#5c687e] font-medium">
                Evaluating report against campus database...
              </p>
            </div>
          )}

          {/* Clarifying Question / No Match */}
          {result && result.noMatch && (
            <div className="bg-[#fff8ea] border border-[#f5dfaa] rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-[#925f0a] font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>No Match / Clarification Needed (Rule 8)</span>
              </div>
              <p className="text-xs text-[#141b2d] leading-relaxed font-medium">
                {result.clarifyingQuestion || 'Insufficient evidence found in the public records. Please provide more distinctive identifying details.'}
              </p>
              <div className="text-[11px] text-[#925f0a] bg-[#ffefc9] p-2.5 rounded-lg leading-relaxed">
                💡 <strong>Safety note:</strong> The system safely returned <code>noMatch: true</code> instead of hallucinating a false match.
              </div>
            </div>
          )}

          {/* Candidates List */}
          {result && !result.noMatch && result.candidates.length > 0 && (
            <div className="space-y-3.5 flex-1 overflow-y-auto">
              {result.candidates.map((cand, idx) => {
                const item = getCandidateItem(cand.id);
                // Calculate display score (fallback if not provided by minimal model)
                const score = cand.matchScore !== undefined
                  ? cand.matchScore
                  : cand.confidence === 'high' ? 95 : cand.confidence === 'medium' ? 60 : 40;
                const matchStrength = cand.matchStrengthLabel || (score >= 80 ? 'strong match' : score >= 50 ? 'moderate match' : 'weak match');
                const rankNum = idx + 1;

                return (
                  <div
                    key={cand.id}
                    className="rounded-2xl p-4 sm:p-5 border border-[#e5dfd2] bg-white transition-all shadow-xs hover:border-[#141b2d]/30"
                  >
                    {/* Header line: #1 · F001 · dark grey insulated tumbler    95/100 */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-[#141b2d] leading-snug tracking-tight">
                        #{rankNum} &middot; {cand.id} &middot; {item ? item.publicDescription : 'Found item'}
                      </h3>
                      <div className="text-sm sm:text-base font-extrabold text-[#0f6834] whitespace-nowrap shrink-0">
                        {score}/100
                      </div>
                    </div>

                    {/* Subtitle line: strong match · Found at LT2A · 26 Aug 15:40 */}
                    {item && (
                      <div className="text-xs text-[#7c8799] mb-3">
                        {matchStrength} &middot; Found at {item.locationFound} &middot; {item.datetimeFound}
                      </div>
                    )}

                    {/* Why rationale line matching screenshot */}
                    <div className="text-xs text-[#334155] leading-relaxed mb-4">
                      <strong className="text-[#141b2d] font-bold">Why: </strong>
                      <span>{cand.explanation}</span>
                    </div>

                    {item && (
                      <button
                        onClick={() => setSelectedCandidateForVerification(item)}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#141b2d] hover:bg-[#25324b] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                        <span>Verify ownership (Module 2)</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-80" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Rule 9 Footer Disclaimer */}
          <div className="text-[11px] text-[#7c8799] border-t border-[#f0ede4] pt-3 flex items-center justify-between">
            <span>Rule 9: Results are recommendations for verification only.</span>
            <span className="font-mono text-[10px] text-[#8e98a8]">Module 1</span>
          </div>
        </div>
      </div>

      {/* Verification Modal for Module 2 */}
      {selectedCandidateForVerification && (
        <VerificationModal
          candidate={selectedCandidateForVerification}
          onClose={() => setSelectedCandidateForVerification(null)}
        />
      )}
    </div>
  );
};
