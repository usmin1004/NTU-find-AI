import React, { useState } from 'react';
import { Layers, FileCode, CheckCircle2, ArrowRight, ShieldCheck, Database, Bot, UserCheck, Lock } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'stage1' | 'stage2' | 'stage3' | 'stage4'>('stage2');

  return (
    <div id="architecture-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Stages 1 ~ 4: System Design &amp; Architecture Documentation</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          NTU FindAI System Design, Architecture &amp; Prompt Specifications
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive documentation covering Problem Definition (Stage 1), Information Flow (Stage 2), AI Prompt Specifications (Stage 3), and RAG Knowledge Isolation (Stage 4).
        </p>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          {[
            { id: 'stage1', label: 'Stage 1: Problem Definition & Success Criteria' },
            { id: 'stage2', label: 'Stage 2: Architecture & Information Flow' },
            { id: 'stage3', label: 'Stage 3: AI Modules & Prompt Specifications' },
            { id: 'stage4', label: 'Stage 4: Lightweight RAG & Data Isolation' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as 'stage1' | 'stage2' | 'stage3' | 'stage4')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stage 1 Content */}
      {activeSubTab === 'stage1' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Stage 1 — Define the Problem</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traditional university lost-and-found management using physical noticeboards or public spreadsheets faces two critical vulnerabilities:
              (1) Vocabulary mismatch between student natural-language recollections (e.g., &quot;dark grey tumbler near LT2A yesterday afternoon&quot;) and structured database records,
              (2) Fraud and wrongful collection risk when full item photos and details are exposed publicly, enabling malicious actors to falsely claim ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Target Users &amp; Objectives</span>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                <li><strong>Target Users:</strong> NTU students searching for lost items and campus security/administrative staff managing repositories.</li>
                <li><strong>User Need:</strong> Rapid, accurate candidate identification using conversational natural language descriptions.</li>
                <li><strong>Desired Outcome:</strong> Reliable ownership verification ensuring items are returned exclusively to their rightful owners.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">4 Core Success Criteria</span>
              <ul className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li><strong>Top-3 Retrieval Accuracy &gt; 90%:</strong> Place the true matching item within the top 3 candidates for clear reports.</li>
                <li><strong>100% Anti-Hallucination Rate:</strong> Return safe <code>noMatch: true</code> for non-existent items.</li>
                <li><strong>Zero Leakage of Confidential Features:</strong> Never expose hidden verification cues in prompts or dialogue.</li>
                <li><strong>Mandatory Human-in-the-Loop Protocol:</strong> The AI never authorizes release; physical staff inspection is required.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2 Content: Architecture Diagram */}
      {activeSubTab === 'stage2' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Stage 2 — Design the System Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              End-to-end information flow mapping from initial student text query to final physical handover, enforcing modular role boundaries.
            </p>
          </div>

          {/* Flow Architecture Diagram */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
              NTU FindAI End-to-End System Pipeline
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              {/* Box 1: UI Input */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">1. Student Report</div>
                <div className="text-[10px] text-slate-500">Unstructured natural language input via web interface</div>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Box 2: Module 1 Matching (RAG) */}
              <div className="bg-white border-2 border-blue-400 rounded-xl p-3.5 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-blue-900">2. Module 1: Matching</div>
                <div className="text-[10px] text-slate-600">30-item public RAG matching &amp; calibrated Top-3 ranking</div>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Box 3: Candidate Selection */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">3. Candidate Selection</div>
                <div className="text-[10px] text-slate-500">Student reviews explanations and selects item to verify</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-2">
              {/* Box 4: Module 2 Verification */}
              <div className="bg-white border-2 border-indigo-400 rounded-xl p-3.5 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-indigo-900">4. Module 2: Ownership Verification</div>
                <div className="text-[10px] text-slate-600">Non-leading questions evaluated against confidential features</div>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Box 5: Human Review */}
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3.5 shadow-xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-emerald-950">5. Human Staff Review</div>
                <div className="text-[10px] text-emerald-800">Physical item inspection &amp; matriculation ID verification at desk</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 3 Content: Prompt Specifications */}
      {activeSubTab === 'stage3' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Stage 3 — Specify the AI Modules and Prompts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete production prompt specifications with embedded rules and safety constraints for both Module 1 (Matching) and Module 2 (Verification).
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Module 1: Matching Assistant System Prompt (9 Rules)
                </h4>
                <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  gemini-3.8-flash
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto leading-relaxed">
{`1. Extract only information stated or clearly implied by the student. Do not invent missing details.
2. Identify item category, colour, location, datetime, brand, size, material, visible features.
3. Compare report only with PUBLIC fields of the found-item records.
4. Never use, reveal, quote, or hint at hidden ownership-verification features.
5. Rank candidates using available evidence. Item type and distinctive visible features are stronger than colour.
6. Return no more than three candidates.
7. Give a short, evidence-based explanation for each result.
8. If evidence is too weak, state no match found and ask student for more information (clarifying question).
9. Do not claim item belongs to student. Output is only a recommendation.`}
              </pre>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Module 2: Ownership Verification System Prompt (10 Rules)
                </h4>
                <span className="text-[11px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                  gemini-3.8-flash
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto leading-relaxed">
{`1. Treat hidden features as confidential reference answers.
2. Never reveal, quote, complete, suggest, or hint at a hidden feature before student answers.
3. Ask one neutral, non-leading question at a time.
4. Ask student to describe a sticker, marking, damage, engraving, contents, accessory in own words.
5. Compare student's answer semantically with hidden features. Allow minor wording differences.
6. Do not request passwords, financial info, or government ID numbers.
7. Classify accumulated evidence as HIGH, MEDIUM, or LOW.
8. Explain assessment without revealing hidden reference answer.
9. Never make final ownership decision and never authorize release.
10. Always state staff must inspect physical item and verify claimant.`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Stage 4 Content: Lightweight RAG */}
      {activeSubTab === 'stage4' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Stage 4 — In-Context Learning / Lightweight RAG</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Constructs a 30-item simulated campus repository and enforces an in-context RAG architecture.
              To ensure zero information leakage, <strong>Public Matching Data</strong> and <strong>Confidential Verification Data</strong> are physically separated in the backend data pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Public Matching Fields (Module 1 Context)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Includes Record ID, Item Category, Public Description, Found Location, Found Date &amp; Time, and Search Tags.
                This public subset is injected into Module 1&apos;s prompt context to evaluate candidate matches.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Confidential Verification Fields (Module 2 Context)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Includes Hidden Feature 1 and Hidden Feature 2 (e.g., specific sticker engravings, internal initials, minor scuffs).
                These are strictly excluded from Module 1 and only injected as ground-truth reference keys during Module 2 verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
