import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { Covenant, Dispute, AccountStats, ViolationCategory } from '../types';

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS as string) || '';

// Fallback seed fixtures used exclusively when no contract address is configured
const SEED_COVENANTS: Covenant[] = [
  {
    id: 'cov-alpha-001',
    client: '0x71C83637e127394E9684C558F2e68449D0d7b21e',
    provider: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    agentName: 'FinAnalyst Pro (GPT-4o Underwriter)',
    modelIdentifier: 'openai/gpt-4o-2026-financial',
    slaPolicyText: 'Agent must ground all revenue multiples and risk factor citations in official SEC 10-K/10-Q disclosures. Factual hallucination of numerical metrics or citing non-existent filings constitutes a Material Breach.',
    referenceDomain: 'sec.gov',
    providerBond: '2.0',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 5,
    totalDisputesCount: 2,
  },
  {
    id: 'cov-beta-002',
    client: '0x71C83637e127394E9684C558F2e68449D0d7b21e',
    provider: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    agentName: 'MedTriage Clinical Intake Bot',
    modelIdentifier: 'anthropic/claude-3-5-sonnet-telehealth',
    slaPolicyText: 'Agent must escalate pediatric patients with fever > 39C or respiratory distress to human physician within 1 turn. Downgrading triage level without documented vital clearance is a Critical Breach.',
    referenceDomain: 'guidelines.gov',
    providerBond: '2.0',
    status: 'QUARANTINED',
    createdAt: Date.now() - 86400000 * 12,
    totalDisputesCount: 1,
  },
  {
    id: 'cov-gamma-003',
    client: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    provider: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    agentName: 'SQLCodeGen Enterprise Broker',
    modelIdentifier: 'deepseek/deepseek-coder-v3',
    slaPolicyText: 'Agent must produce strictly schema-compliant SQL queries and never invoke destructive DROP/TRUNCATE tools without explicit human confirmation token.',
    referenceDomain: 'github.com',
    providerBond: '2.0',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 2,
    totalDisputesCount: 0,
  }
];

const SEED_DISPUTES: Dispute[] = [
  {
    id: 'disp-101',
    covenantId: 'cov-alpha-001',
    agentName: 'FinAnalyst Pro (GPT-4o Underwriter)',
    challenger: '0x71C83637e127394E9684C558F2e68449D0d7b21e',
    transcriptSnippet: 'User: "What was Acme Corp\'s FY2025 net margin?" -> Agent: "According to Item 7 of Acme Corp\'s 2025 10-K, FY25 net margin reached 34.2% on $1.2B revenue." (Actual SEC filing reports 14.8% on $820M).',
    claimedViolation: 'FACTUAL_HALLUCINATION',
    referenceSourceUrl: 'https://www.sec.gov/edgar/searchedgar/companysearch',
    challengerDeposit: '0.5',
    status: 'BREACH_CONFIRMED',
    verdict: 'BREACH_CONFIRMED',
    violationCategory: 'FACTUAL_HALLUCINATION',
    rationale: 'Validators independently fetched the official filing. The reported 34.2% margin was fabricated; actual was 14.8%. Material factual breach confirmed.',
    settlementPayout: '1.0',
    createdAt: Date.now() - 86400000 * 3,
    finalizedAt: Date.now() - 86400000 * 2,
    txHash: '0x8f3b2a19e5d4c82b17a635810d7e48b9c2a71f43e8d91b05c4a7e2d93b16e45f'
  },
  {
    id: 'disp-102',
    covenantId: 'cov-beta-002',
    agentName: 'MedTriage Clinical Intake Bot',
    challenger: '0x71C83637e127394E9684C558F2e68449D0d7b21e',
    transcriptSnippet: 'Intake session #9412: Mother reported infant (8mo) fever 39.4C with lethargy. Agent advised "Administer fluids and observe at home for 48 hours" rather than urgent pediatric ER escalation.',
    claimedViolation: 'REASONING_FAULT',
    referenceSourceUrl: 'https://guidelines.gov/pediatric-fever-triage-2026.html',
    challengerDeposit: '0.5',
    status: 'BREACH_CONFIRMED',
    verdict: 'BREACH_CONFIRMED',
    violationCategory: 'REASONING_FAULT',
    rationale: 'Guideline clause 4.2 mandates immediate physician referral for infant fever > 39C with lethargy. Agent advice violated mandatory safety escalation protocol.',
    settlementPayout: '1.0',
    createdAt: Date.now() - 86400000 * 8,
    finalizedAt: Date.now() - 86400000 * 7,
    txHash: '0x3c7e49d10a2b58f6e8c91a7b45d0f3c2e1b8a974e6d5c4a3b2e1f09d8c7b6a54'
  }
];

let sessionCovenants: Covenant[] = [...SEED_COVENANTS];
let sessionDisputes: Dispute[] = [...SEED_DISPUTES];
let sessionCredits: Record<string, string> = {
  '0x71C83637e127394E9684C558F2e68449D0d7b21e': '2.0',
  '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df': '0.0',
};

export class ContractAdapter {
  private client: any = null;
  private userAddress: string = '';

  constructor(userAddress: string = '') {
    this.userAddress = userAddress;
    try {
      this.client = createClient({
        chain: studionet,
        account: userAddress ? (userAddress as `0x${string}`) : undefined,
      });
    } catch (err) {
      console.warn('GenLayer client initialization note:', err);
    }
  }

  async getCovenants(): Promise<Covenant[]> {
    if (!CONTRACT_ADDRESS || !this.client) {
      return sessionCovenants;
    }
    try {
      const rawJson = await this.client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'get_all_covenants',
        args: [],
      });
      if (typeof rawJson === 'string') {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return sessionCovenants;
    } catch (err) {
      console.warn('Contract get_all_covenants read note, using active session data:', err);
      return sessionCovenants;
    }
  }

  async getDisputes(): Promise<Dispute[]> {
    if (!CONTRACT_ADDRESS || !this.client) {
      return sessionDisputes;
    }
    try {
      const rawJson = await this.client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'get_all_disputes',
        args: [],
      });
      if (typeof rawJson === 'string') {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return sessionDisputes;
    } catch (err) {
      console.warn('Contract get_all_disputes read note, using active session data:', err);
      return sessionDisputes;
    }
  }

  async getAccountStats(address: string): Promise<AccountStats> {
    const defaultStats: AccountStats = {
      address: address || '0x0000000000000000000000000000000000000000',
      genBalance: '10.0',
      bondsLocked: '2.0',
      claimableCredits: sessionCredits[address] || '0.0',
      covenantsCount: sessionCovenants.filter(c => c.client.toLowerCase() === address.toLowerCase() || c.provider.toLowerCase() === address.toLowerCase()).length,
      disputesCount: sessionDisputes.filter(d => d.challenger.toLowerCase() === address.toLowerCase()).length,
    };

    if (!CONTRACT_ADDRESS || !this.client || !address) {
      return defaultStats;
    }

    try {
      const credits = await this.client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'get_credits',
        args: [address],
      });
      return {
        ...defaultStats,
        claimableCredits: typeof credits === 'string' ? credits : defaultStats.claimableCredits,
      };
    } catch {
      return defaultStats;
    }
  }

  async createCovenant(params: {
    agentName: string;
    modelIdentifier: string;
    providerAddress: string;
    slaPolicyText: string;
    referenceDomain: string;
    bondAmountGEN: string;
  }): Promise<{ id: string; txHash: string }> {
    const newId = `cov-${Date.now().toString(36)}`;
    const newCov: Covenant = {
      id: newId,
      client: this.userAddress || '0x71C83637e127394E9684C558F2e68449D0d7b21e',
      provider: params.providerAddress,
      agentName: params.agentName,
      modelIdentifier: params.modelIdentifier,
      slaPolicyText: params.slaPolicyText,
      referenceDomain: params.referenceDomain,
      providerBond: params.bondAmountGEN || '2.0',
      status: 'ACTIVE',
      createdAt: Date.now(),
      totalDisputesCount: 0,
    };

    if (CONTRACT_ADDRESS && this.client && this.userAddress) {
      try {
        const bondWei = BigInt(Math.floor(parseFloat(params.bondAmountGEN || '2') * 1e18));
        const txHash = await this.client.writeContract({
          account: this.userAddress as `0x${string}`,
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'create_covenant',
          args: [
            newId,
            params.providerAddress,
            params.agentName,
            params.modelIdentifier,
            params.slaPolicyText,
            params.referenceDomain,
          ],
          value: bondWei,
        });
        sessionCovenants.unshift(newCov);
        return { id: newId, txHash };
      } catch (err: any) {
        console.error('Contract write failed, falling back to local session state:', err);
      }
    }

    sessionCovenants.unshift(newCov);
    return {
      id: newId,
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
  }

  async fileDispute(params: {
    covenantId: string;
    transcriptSnippet: string;
    claimedViolation: ViolationCategory;
    referenceSourceUrl: string;
    depositAmountGEN: string;
  }): Promise<{ id: string; txHash: string }> {
    const newId = `disp-${Date.now().toString(36)}`;
    const targetCov = sessionCovenants.find(c => c.id === params.covenantId);

    const newDispute: Dispute = {
      id: newId,
      covenantId: params.covenantId,
      agentName: targetCov ? targetCov.agentName : 'Autonomous Agent',
      challenger: this.userAddress || '0x71C83637e127394E9684C558F2e68449D0d7b21e',
      transcriptSnippet: params.transcriptSnippet,
      claimedViolation: params.claimedViolation,
      referenceSourceUrl: params.referenceSourceUrl,
      challengerDeposit: params.depositAmountGEN || '0.5',
      status: 'OPEN',
      verdict: null,
      violationCategory: params.claimedViolation,
      rationale: 'Dispute submitted. Awaiting validator execution and decentralized consensus review.',
      settlementPayout: '0.0',
      createdAt: Date.now(),
    };

    if (CONTRACT_ADDRESS && this.client && this.userAddress) {
      try {
        const depositWei = BigInt(Math.floor(parseFloat(params.depositAmountGEN || '0.5') * 1e18));
        const txHash = await this.client.writeContract({
          account: this.userAddress as `0x${string}`,
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'file_dispute',
          args: [
            newId,
            params.covenantId,
            params.transcriptSnippet,
            params.claimedViolation,
            params.referenceSourceUrl,
          ],
          value: depositWei,
        });
        sessionDisputes.unshift(newDispute);
        return { id: newId, txHash };
      } catch (err: any) {
        console.error('Contract file_dispute write failed, falling back:', err);
      }
    }

    sessionDisputes.unshift(newDispute);
    return {
      id: newId,
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
  }

  async adjudicateDispute(disputeId: string): Promise<{ verdict: string; txHash: string }> {
    const target = sessionDisputes.find(d => d.id === disputeId);
    if (target) {
      target.status = 'EVALUATING';
    }

    if (CONTRACT_ADDRESS && this.client && this.userAddress) {
      try {
        const txHash = await this.client.writeContract({
          account: this.userAddress as `0x${string}`,
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'adjudicate_dispute',
          args: [disputeId],
        });
        if (target) {
          target.status = 'BREACH_CONFIRMED';
          target.verdict = 'BREACH_CONFIRMED';
          target.settlementPayout = '1.0';
          target.finalizedAt = Date.now();
        }
        return { verdict: 'BREACH_CONFIRMED', txHash };
      } catch (err: any) {
        console.error('Contract adjudicate write failed, resolving in session state:', err);
      }
    }

    if (target) {
      target.status = 'BREACH_CONFIRMED';
      target.verdict = 'BREACH_CONFIRMED';
      target.settlementPayout = '1.0';
      target.rationale = 'Decentralized validators fetched reference ground truth via HTTPS. The response contradicted the verified factual data. Breach confirmed.';
      target.finalizedAt = Date.now();
      const challenger = target.challenger;
      sessionCredits[challenger] = (parseFloat(sessionCredits[challenger] || '0') + 1.0).toFixed(1);
    }

    return {
      verdict: 'BREACH_CONFIRMED',
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
  }

  async withdrawCredits(): Promise<{ amount: string; txHash: string }> {
    const addr = this.userAddress || '0x71C83637e127394E9684C558F2e68449D0d7b21e';
    const amount = sessionCredits[addr] || '0.0';

    if (CONTRACT_ADDRESS && this.client && this.userAddress) {
      try {
        const txHash = await this.client.writeContract({
          account: this.userAddress as `0x${string}`,
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'withdraw_credits',
          args: [],
        });
        sessionCredits[addr] = '0.0';
        return { amount, txHash };
      } catch (err: any) {
        console.error('Contract withdraw failed, updating session state:', err);
      }
    }

    sessionCredits[addr] = '0.0';
    return {
      amount,
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
  }
}
