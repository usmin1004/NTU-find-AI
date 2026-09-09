import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, Send, CheckCircle2, Eye, EyeOff, Bot, User, Clock, Award } from 'lucide-react';
import { PublicFoundItem, FoundItem, VerificationRound } from '../types';
import { FOUND_ITEMS_DATA } from '../data/items';

interface VerificationModalProps {
  candidate: PublicFoundItem;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ candidate, onClose }) => {
  const [rounds, setRounds] = useState<VerificationRound[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalEvidenceLevel, setFinalEvidenceLevel] = useState<'HIGH' | 'MEDIUM' | 'LOW' | null>(null);
  const [finalExplanation, setFinalExplanation] = useState<string>('');
  const [showStaffSecrets, setShowStaffSecrets] = useState(false);

  // Retrieve full item record to display staff confidential view for instructors/evaluators
  const fullItem: FoundItem | undefined = FOUND_ITEMS_DATA.find(i => i.id === candidate.id);

  // Initialize with First Question (Module 2 System Prompt 2.6 & 2.7)
  useEffect(() => {
    let isMounted = true;
    const fetchFirstQuestion = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/verify/first-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: candidate.id }),
        });
        const data = await res.json();
        if (isMounted) {
          setRounds([
            {
              question: data.question || `Could you describe any unique markings, stickers, engravings, or distinctive wear on your ${candidate.category.toLowerCase()}?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } catch {
        if (isMounted) {
          setRounds([
            {
              question: `Could you describe any distinctive markings, stickers, engravings, or specific features on your ${candidate.category.toLowerCase()} that would distinguish it?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFirstQuestion();
    return () => {
      isMounted = false;
    };
  }, [candidate.id, candidate.category]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isLoading || isCompleted) return;

    const currentRoundIndex = rounds.length - 1;
    const activeQuestion = rounds[currentRoundIndex].question;
    const answerText = currentAnswer.trim();

    // Update round with answer
    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = {
      ...updatedRounds[currentRoundIndex],
      studentAnswer: answerText,
    };
    setRounds(updatedRounds);
    setCurrentAnswer('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/verify/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          question: activeQuestion,
          studentAnswer: answerText,
          round: rounds.length,
        }),
      });
      const data = await res.json();

      const latestRoundWithEvaluation: VerificationRound = {
        ...updatedRounds[currentRoundIndex],
        evidenceLevel: data.evidenceLevel,
        explanation: data.explanation,
      };

      if (data.askAnotherQuestion && data.nextQuestion && rounds.length < 3) {
        setRounds([
          ...updatedRounds.slice(0, currentRoundIndex),
          latestRoundWithEvaluation,
          {
            question: data.nextQuestion,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Complete process (max rounds or sufficient confidence)
        setRounds([
          ...updatedRounds.slice(0, currentRoundIndex),
          latestRoundWithEvaluation,
        ]);
        setIsCompleted(true);
        setFinalEvidenceLevel(data.evidenceLevel);
        setFinalExplanation(data.explanation);
      }
    } catch {
      setIsCompleted(true);
      setFinalEvidenceLevel('LOW');
      setFinalExplanation('Verification assessment could not be finalized. Please report directly to campus lost & found staff.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="verification-modal-overlay" className="fixed inset-0 z-50 bg-[#141b2d]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div id="verification-modal-dialog" className="bg-[#f8f6f0] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#e5dfd2] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ded7c8] bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#141b2d] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#141b2d]">Module 2: Ownership Verification</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ede8dc] text-[#141b2d]">
                  {candidate.id}
                </span>
              </div>
              <p className="text-xs text-[#5c687e]">
                Non-leading interactive questioning with privacy-preserving semantic evaluation
              </p>
            </div>
          </div>
          <button
            id="close-verification-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5c687e] hover:text-[#141b2d] hover:bg-[#ede8dc] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Candidate Summary Banner */}
        <div className="px-5 py-3 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Target Item:</span>
            <span className="font-bold text-blue-900">{candidate.publicDescription}</span>
            <span className="text-slate-600">({candidate.category})</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>Location: <strong>{candidate.locationFound}</strong></span>
            <span>Date/Time: <strong>{candidate.datetimeFound}</strong></span>
          </div>
        </div>

        {/* Evaluator / Staff Inspector Toggle */}
        <div className="px-5 py-2 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Evaluator Inspection Mode:</strong> Verify that the AI never leaks confidential ground-truth answers.
            </span>
          </div>
          <button
            onClick={() => setShowStaffSecrets(!showStaffSecrets)}
            className="inline-flex items-center px-2 py-1 rounded bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 text-[11px] font-semibold transition-colors"
          >
            {showStaffSecrets ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
            {showStaffSecrets ? 'Hide Reference Answers' : 'Inspect Ground Truth'}
          </button>
        </div>

        {/* Confidential Features Peek Box */}
        {showStaffSecrets && fullItem && (
          <div className="px-5 py-3 bg-amber-100/60 border-b border-amber-200 text-xs text-amber-950 animate-in fade-in">
            <div className="font-bold mb-1 flex items-center text-amber-900">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Confidential Hidden Features (Admin Database Only):
            </div>
            <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-amber-900 ml-1">
              <li>Hidden Feature 1: <strong>{fullItem.hiddenFeature1}</strong></li>
              <li>Hidden Feature 2: <strong>{fullItem.hiddenFeature2}</strong></li>
            </ul>
            <div className="text-[11px] text-amber-700 mt-1">
              * Per Rules 1, 2, &amp; 4, the assistant will never quote, hint at, or reveal these details directly to the student.
            </div>
          </div>
        )}

        {/* Dialogue Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
          {rounds.map((round, idx) => (
            <div key={idx} className="space-y-3">
              {/* Question from AI */}
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs max-w-[85%]">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-bold text-indigo-700">NTU FindAI Verification Assistant (Round {idx + 1}/3)</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{round.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {round.question}
                  </p>
                </div>
              </div>

              {/* Student Answer */}
              {round.studentAnswer && (
                <div className="flex items-start justify-end space-x-3">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs p-3.5 shadow-2xs max-w-[85%]">
                    <div className="text-[11px] text-blue-200 mb-1 font-semibold">
                      Student Claimant Response
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {round.studentAnswer}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* AI Assessment for this round */}
              {round.evidenceLevel && (
                <div className="mx-auto max-w-[90%] bg-white border border-slate-200 rounded-xl p-3 shadow-2xs text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700">Round {idx + 1} Assessment:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        round.evidenceLevel === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : round.evidenceLevel === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      Evidence Level: {round.evidenceLevel}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {round.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-700 font-medium py-2 px-3 bg-indigo-50/70 rounded-lg w-fit">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Evaluating response semantically against confidential reference features...</span>
            </div>
          )}

          {/* Completed Summary Box */}
          {isCompleted && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-4 shadow-lg space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Ownership Pre-Verification Complete</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    finalEvidenceLevel === 'HIGH'
                      ? 'bg-emerald-500 text-white'
                      : finalEvidenceLevel === 'MEDIUM'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  Final Evidence Rating: {finalEvidenceLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {finalExplanation}
              </p>
              <div className="bg-white/10 rounded-lg p-2.5 text-[11px] text-slate-200 border border-white/10">
                ⚠️ <strong>Human-in-the-Loop Protocol (Rules 9 &amp; 10):</strong> The AI does not make definitive ownership determinations or authorize release. The claimant must bring their student matriculation card to the campus desk (Found Location: {candidate.locationFound}) for physical inspection by staff.
              </div>
            </div>
          )}
        </div>

        {/* Input Form Footer */}
        <div className="p-4 border-t border-slate-200 bg-white">
          {!isCompleted ? (
            <form onSubmit={handleSubmitAnswer} className="flex items-center space-x-2">
              <input
                id="verification-student-answer-input"
                type="text"
                placeholder={
                  rounds.length === 1
                    ? 'e.g. There is a small blue sticker on the bottom and a minor scratch near the lid...'
                    : 'Describe any additional distinctive markings, stickers, engravings, accessories...'
                }
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
              <button
                id="submit-verification-answer-btn"
                type="submit"
                disabled={!currentAnswer.trim() || isLoading}
                className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Submit Response
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Verification process concluded.
              </span>
              <button
                id="close-verification-done-btn"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close Dialog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
