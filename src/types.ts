export interface FoundItem {
  id: string;
  category: string;
  publicDescription: string;
  locationFound: string;
  datetimeFound: string;
  searchTagsInternal: string;
  hiddenFeature1: string;
  hiddenFeature2: string;
}

export type PublicFoundItem = Omit<FoundItem, 'hiddenFeature1' | 'hiddenFeature2'>;

export interface MatchingCandidate {
  id: string;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  matchScore?: number; // 0 to 100
  matchStrengthLabel?: string; // 'strong match' | 'moderate match' | 'weak match'
}

export interface Module1Response {
  candidates: MatchingCandidate[];
  noMatch: boolean;
  clarifyingQuestion: string | null;
  rawResponse?: string;
  variant: 'A' | 'B' | 'C';
  executionTimeMs?: number;
  modelUsed?: string;
  interpretedQuery?: {
    item_type?: string;
    color?: string;
    location?: string;
    time?: string;
    other_attributes?: string[];
  };
  followUpQuestion?: string;
  error?: string;
  fallbackUsed?: boolean;
}

export interface VerificationRound {
  question: string;
  studentAnswer?: string;
  evidenceLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation?: string;
  timestamp: string;
}

export interface Module2AssessmentResponse {
  evidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  askAnotherQuestion: boolean;
  nextQuestion: string | null;
}

export interface TestCase {
  no: string; // T01 ~ T20
  type: 'Normal' | 'Ambiguous' | 'Missing Info' | 'Misleading' | '정상' | '애매함' | '정보 부족' | '오해 소지';
  input: string;
  targetCandidate: string; // F001 or "None" or "F003 / F006..." or "Must Refuse"
  validationPoint: string;
  description: string;
}

export interface TestCaseResult {
  testNo: string;
  variantA: {
    resultId: string;
    note: string;
    isMatch: boolean;
  };
  variantB: {
    resultIds: string[];
    note: string;
    isMatch: boolean;
  };
  variantC: {
    resultIds: string[];
    confidence: string;
    noMatch: boolean;
    clarifyingQuestion?: string | null;
    explanation: string;
    isMatch: boolean;
  };
  evaluatedAt?: string;
}

export interface FailureCase {
  id: string;
  testNo: string;
  input: string;
  expectedBehavior: string;
  actualBehavior: string;
  likelyCause: string;
  proposedFix: string;
  retestResult: string;
  category: 'prompt' | 'retrieval' | 'workflow' | 'safety';
}
