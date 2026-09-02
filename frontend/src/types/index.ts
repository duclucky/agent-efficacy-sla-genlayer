export type CovenantStatus = 'ACTIVE' | 'QUARANTINED' | 'CLOSED';

export type DisputeStatus =
  | 'OPEN'
  | 'EVALUATING'
  | 'BREACH_CONFIRMED'
  | 'NO_BREACH'
  | 'UNVERIFIABLE'
  | 'SETTLED';

export type ViolationCategory =
  | 'FACTUAL_HALLUCINATION'
  | 'UNAUTHORIZED_TOOL'
  | 'REASONING_FAULT'
  | 'NONE';

export interface Covenant {
  id: string;
  client: string;
  provider: string;
  agentName: string;
  modelIdentifier: string;
  slaPolicyText: string;
  referenceDomain: string;
  providerBond: string; // in GEN, e.g. "2.0"
  status: CovenantStatus;
  createdAt: number;
  totalDisputesCount: number;
}

export interface Dispute {
  id: string;
  covenantId: string;
  agentName: string;
  challenger: string;
  transcriptSnippet: string;
  claimedViolation: ViolationCategory;
  referenceSourceUrl: string;
  challengerDeposit: string; // in GEN, e.g. "0.5"
  status: DisputeStatus;
  verdict: 'BREACH_CONFIRMED' | 'NO_BREACH' | 'UNVERIFIABLE' | null;
  violationCategory: ViolationCategory;
  rationale: string;
  settlementPayout: string; // in GEN, e.g. "1.0"
  createdAt: number;
  finalizedAt?: number;
  txHash?: string;
}

export interface AccountStats {
  address: string;
  genBalance: string; // in GEN
  bondsLocked: string; // in GEN
  claimableCredits: string; // in GEN
  covenantsCount: number;
  disputesCount: number;
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}
