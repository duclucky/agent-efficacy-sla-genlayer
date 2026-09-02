import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  Globe,
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Cpu,
  Award,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Dispute, Covenant } from '../types';
import { useWallet } from '../context/WalletContext';
import { ContractAdapter } from '../services/contractAdapter';

interface DisputeDetailPageProps {
  dispute: Dispute;
  covenant?: Covenant;
  onBack: () => void;
  onRefresh: () => void;
}

export const DisputeDetailPage: React.FC<DisputeDetailPageProps> = ({
  dispute,
  onBack,
  onRefresh,
}) => {
  const { address, isConnected, openWalletModal } = useWallet();
  const [isAdjudicating, setIsAdjudicating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleTriggerAdjudication = async () => {
    if (!isConnected) {
      openWalletModal();
      return;
    }
    setIsAdjudicating(true);
    setActionError(null);
    try {
      const adapter = new ContractAdapter(address || '');
      await adapter.adjudicateDispute(dispute.id);
      onRefresh();
    } catch (err: any) {
      setActionError(err.message || 'Adjudication failed');
    } finally {
      setIsAdjudicating(false);
    }
  };

  const isFinalized = dispute.status === 'BREACH_CONFIRMED' || dispute.status === 'NO_BREACH' || dispute.status === 'SETTLED';

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Disputes</span>
      </button>

      {/* Main Title & Status Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-warning/15 border border-warning/40 flex items-center justify-center text-warning shadow-glow-warning">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{dispute.agentName}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-accent font-mono font-bold">
                  {dispute.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                Covenant Target: {dispute.covenantId} • Category: <strong className="text-warning">{dispute.claimedViolation}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {dispute.status === 'BREACH_CONFIRMED' && (
              <span className="px-3.5 py-1.5 rounded-full bg-destructive/15 text-destructive border border-destructive/40 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-glow-destructive">
                <XCircle className="w-4 h-4" />
                <span>BREACH CONFIRMED & SLASHED</span>
              </span>
            )}
            {dispute.status === 'NO_BREACH' && (
              <span className="px-3.5 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/40 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-glow-accent">
                <CheckCircle2 className="w-4 h-4" />
                <span>VERIFIED CONFORMANT (NO BREACH)</span>
              </span>
            )}
            {(dispute.status === 'OPEN' || dispute.status === 'EVALUATING') && (
              <span className="px-3.5 py-1.5 rounded-full bg-warning/15 text-warning border border-warning/40 text-xs font-mono font-bold flex items-center space-x-1.5 animate-pulse shadow-glow-warning">
                <Clock className="w-4 h-4" />
                <span>AWAITING VALIDATOR CONSENSUS</span>
              </span>
            )}
          </div>
        </div>

        {/* 4-Stage Validator Consensus Progress Tracker */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Consensus Verification Pipeline
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. Dispute Filed</span>
            </div>
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 ${
                isFinalized
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-warning/10 border-warning/30 text-warning animate-pulse'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>2. Fetch HTTPS Truth</span>
            </div>
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 ${
                isFinalized
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'bg-secondary text-muted-foreground border-border'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span>3. GenVM Equivalence</span>
            </div>
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 ${
                isFinalized
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : 'bg-secondary text-muted-foreground border-border'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>4. Slashing Settled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Transcript Evidence & Ground Truth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Submitted Transcript Snippet */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-accent" />
              <span>Agent Interaction Session Transcript</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-mono">Submitted by Challenger</span>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border/80 font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {dispute.transcriptSnippet}
          </div>

          <div className="pt-2 text-xs text-muted-foreground space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Challenger Address:</span>
              <span className="text-foreground">{dispute.challenger}</span>
            </div>
            <div className="flex justify-between">
              <span>Challenger Deposit:</span>
              <span className="text-foreground font-bold">{dispute.challengerDeposit} GEN</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authoritative Reference Source & Validator Findings */}
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm flex items-center space-x-2">
              <Globe className="w-4 h-4 text-accent" />
              <span>Authoritative Reference Ground Truth</span>
            </h3>
            <a
              href={dispute.referenceSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center space-x-1"
            >
              <span>Open Live URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border/80 text-xs font-mono text-accent break-all">
            {dispute.referenceSourceUrl}
          </div>

          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Validator Consensus Finding
            </span>
            <p className="text-xs text-foreground leading-relaxed font-sans">
              {dispute.rationale || 'Awaiting validator quorum consensus execution on GenLayer Studionet.'}
            </p>
          </div>

          {/* Action to trigger adjudication if pending */}
          {!isFinalized && (
            <div className="pt-2">
              {actionError && (
                <div className="mb-3 p-3 rounded-xl bg-destructive/15 border border-destructive/40 text-xs text-destructive flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}
              <button
                onClick={handleTriggerAdjudication}
                disabled={isAdjudicating}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-glow-accent cursor-pointer"
              >
                {isAdjudicating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Scale className="w-4 h-4" />
                )}
                <span>Trigger GenVM Validator Consensus Review</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settlement Consequence Card */}
      {isFinalized && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-destructive/40 shadow-glow-destructive space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Enforced Consequence & Settlement</h3>
              <p className="text-xs text-muted-foreground font-mono">Deterministic Value & State Transition Applied</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-background border border-border">
              <span className="text-muted-foreground">Provider Bond Slashed</span>
              <div className="text-lg font-bold text-destructive mt-1">-{dispute.settlementPayout} GEN</div>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border">
              <span className="text-muted-foreground">Client SLA Credit</span>
              <div className="text-lg font-bold text-accent mt-1">+{dispute.settlementPayout} GEN</div>
            </div>
            <div className="p-4 rounded-2xl bg-background border border-border">
              <span className="text-muted-foreground">Agent Provider State</span>
              <div className="text-lg font-bold text-destructive mt-1">QUARANTINED</div>
            </div>
          </div>

          {dispute.txHash && (
            <div className="pt-2 text-xs text-muted-foreground font-mono flex items-center justify-between">
              <span>Settlement Tx Hash:</span>
              <a
                href={`https://explorer-studio.genlayer.com/tx/${dispute.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline flex items-center space-x-1"
              >
                <span>{dispute.txHash.slice(0, 16)}...{dispute.txHash.slice(-8)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
