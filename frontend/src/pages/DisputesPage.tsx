import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { Dispute, Covenant, ViolationCategory } from '../types';
import { useWallet } from '../context/WalletContext';
import { ContractAdapter } from '../services/contractAdapter';

interface DisputesPageProps {
  disputes: Dispute[];
  covenants: Covenant[];
  onRefresh: () => void;
  onSelectDispute: (disputeId: string) => void;
  initialCovenantId?: string | null;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({
  disputes,
  covenants,
  onRefresh,
  onSelectDispute,
  initialCovenantId,
}) => {
  const { address, isConnected, openWalletModal } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(!!initialCovenantId);

  // Form State
  const [selectedCovenantId, setSelectedCovenantId] = useState(initialCovenantId || (covenants[0]?.id ?? ''));
  const [transcriptSnippet, setTranscriptSnippet] = useState('');
  const [claimedViolation, setClaimedViolation] = useState<ViolationCategory>('FACTUAL_HALLUCINATION');
  const [referenceSourceUrl, setReferenceSourceUrl] = useState('https://www.sec.gov/edgar');
  const [depositAmountGEN, setDepositAmountGEN] = useState('0.5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.transcriptSnippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.claimedViolation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCovenantId || !transcriptSnippet || !referenceSourceUrl) {
      setFormError('Please fill in all required dispute fields.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const adapter = new ContractAdapter(address || '');
      const res = await adapter.fileDispute({
        covenantId: selectedCovenantId,
        transcriptSnippet,
        claimedViolation,
        referenceSourceUrl,
        depositAmountGEN,
      });
      setSuccessTx(res.txHash);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessTx(null);
        setTranscriptSnippet('');
        onRefresh();
      }, 1800);
    } catch (err: any) {
      setFormError(err.message || 'Failed to file dispute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BREACH_CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-destructive/15 text-destructive border border-destructive/30 text-xs font-mono font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>BREACH CONFIRMED</span>
          </span>
        );
      case 'NO_BREACH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>NO BREACH</span>
          </span>
        );
      case 'EVALUATING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-warning/15 text-warning border border-warning/30 text-xs font-mono font-bold animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>VALIDATING (GENVM)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>DISPUTE OPEN</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-heading">
            SLA Breach & Hallucination Disputes
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Decentralized Validator Truth Verification Against Live HTTPS Ground Truth
          </p>
        </div>

        <button
          onClick={() => {
            if (!isConnected) {
              openWalletModal();
            } else {
              setIsModalOpen(true);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground font-semibold text-sm flex items-center space-x-2 transition-all shadow-glow-warning cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>File SLA Dispute</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search disputes by agent name, transcript excerpt, or violation category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-accent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-card border border-border overflow-x-auto">
          {['ALL', 'OPEN', 'EVALUATING', 'BREACH_CONFIRMED', 'NO_BREACH'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Disputes Table / List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <div
            key={dispute.id}
            onClick={() => onSelectDispute(dispute.id)}
            className="p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-accent/40 glass-card transition-all cursor-pointer group space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-warning group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-accent transition-colors">
                    {dispute.agentName}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground font-mono">
                    <span>Dispute ID: {dispute.id}</span>
                    <span>•</span>
                    <span className="text-warning">{dispute.claimedViolation}</span>
                  </div>
                </div>
              </div>

              <div>{getStatusBadge(dispute.status)}</div>
            </div>

            {/* Transcript Snippet */}
            <div className="p-3.5 rounded-xl bg-background/80 border border-border/60 text-xs font-mono text-muted-foreground line-clamp-2">
              <span className="text-accent font-bold">Transcript: </span>
              {dispute.transcriptSnippet}
            </div>

            {/* Footer Metadata */}
            <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground font-mono gap-2">
              <div className="flex items-center space-x-4">
                <span>Challenger: {dispute.challenger.slice(0, 6)}...{dispute.challenger.slice(-4)}</span>
                <span>Deposit: <strong className="text-foreground">{dispute.challengerDeposit} GEN</strong></span>
                {dispute.settlementPayout !== '0.0' && (
                  <span>Payout: <strong className="text-destructive">{dispute.settlementPayout} GEN Slashed</strong></span>
                )}
              </div>

              <div className="flex items-center space-x-1.5 text-accent group-hover:translate-x-1 transition-transform font-semibold text-xs">
                <span>Inspect Consensus Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: File SLA Dispute */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">File SLA Breach Dispute</h3>
                  <p className="text-xs text-muted-foreground font-mono">Submit Agent Transcript for GenVM Verification</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successTx ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-foreground">Dispute Registered!</h4>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  Tx Hash: {successTx}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFileDispute} className="mt-4 space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/40 text-xs text-destructive flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Select Target SLA Covenant
                  </label>
                  <select
                    value={selectedCovenantId}
                    onChange={(e) => setSelectedCovenantId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  >
                    {covenants.map((cov) => (
                      <option key={cov.id} value={cov.id}>
                        {cov.agentName} ({cov.id}) — Bond: {cov.providerBond} GEN
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Violation Category
                  </label>
                  <select
                    value={claimedViolation}
                    onChange={(e) => setClaimedViolation(e.target.value as ViolationCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  >
                    <option value="FACTUAL_HALLUCINATION">FACTUAL_HALLUCINATION (Fabricated metrics/facts)</option>
                    <option value="REASONING_FAULT">REASONING_FAULT (Safety escalation failure)</option>
                    <option value="UNAUTHORIZED_TOOL">UNAUTHORIZED_TOOL (Illegal parameter/action)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Interaction Session Transcript Excerpt
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Paste the user prompt and agent response showing the exact hallucination or fault..."
                    value={transcriptSnippet}
                    onChange={(e) => setTranscriptSnippet(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none resize-none font-mono text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Authoritative Reference Ground-Truth HTTPS URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={referenceSourceUrl}
                    onChange={(e) => setReferenceSourceUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                    Validators will fetch this exact URL via HTTPS to verify objective ground truth.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Challenger Dispute Deposit (GEN)
                  </label>
                  <input
                    type="text"
                    value={depositAmountGEN}
                    onChange={(e) => setDepositAmountGEN(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-warning hover:bg-warning/90 text-warning-foreground text-sm font-semibold flex items-center space-x-2 cursor-pointer shadow-glow-warning"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Scale className="w-4 h-4" />
                    )}
                    <span>File Dispute (Deposit {depositAmountGEN} GEN)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
