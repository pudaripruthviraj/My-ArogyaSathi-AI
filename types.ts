export enum AppState {
  LANDING = 'LANDING',
  ASSESSMENT = 'ASSESSMENT',
  ANALYSIS = 'ANALYSIS',
  RESULTS = 'RESULTS'
}

export enum MessageType {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  options?: string[]; // Quick reply options
}

export interface UserProfile {
  age?: number;
  gender?: string;
  pincode?: string;
  familyMembers?: string[];
  existingDiseases?: string[];
  budget?: string;
  coverageAmount?: string;
}

export interface PolicyFeature {
  icon: string;
  text: string;
}

export interface InsurancePolicy {
  id: string;
  insurerName: string;
  policyName: string;
  sumInsured: string;
  premium: number; // Monthly estimate
  copay: string;
  roomRentLimit: string;
  waitingPeriod: string;
  pedWaitingPeriod: string; // Pre-existing disease waiting period
  networkHospitals: number;
  claimSettlementRatio: number;
  features: string[];
}

export interface RecommendationAnalysis {
  policyId: string;
  matchScore: number;
  reasoning: string;
  pros: string[];
  cons: string[];
}

export interface FullRecommendation {
  policy: InsurancePolicy;
  analysis: RecommendationAnalysis;
}