import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Cpu,
  Lock,
  ShieldAlert,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Covenant } from '../types';
import { useWallet } from '../context/WalletContext';
import { ContractAdapter } from '../services/contractAdapter';

interface CovenantsPageProps {
  covenants: Covenant[];
  onRefresh: () => void;
  onNavigateToDispute: (covenantId: string) => void;
}

export const CovenantsPage: React.FC<CovenantsPageProps> = ({
  covenants,
  onRefresh,
  onNavigateToDispute,
}) => {
  const { address, isConnected, openWalletModal } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'QUARANTINED'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [agentName, setAgentName] = useState('');
  const [modelIdentifier, setModelIdentifier] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [slaPolicyText, setSlaPolicyText] = useState('');
  const [referenceDomain, setReferenceDomain] = useState('sec.gov');
  const [bondAmountGEN, setBondAmountGEN] = useState('2.0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const filteredCovenants = covenants.filter((c) => {
    const matchesSearch =
      c.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.modelIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slaPolicyText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCovenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName || !providerAddress || !slaPolicyText) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const adapter = new ContractAdapter(address || '');
      const res = await adapter.createCovenant({
        agentName,
        modelIdentifier: modelIdentifier || 'custom/agent-v1',
        providerAddress,
        slaPolicyText,
        referenceDomain,
        bondAmountGEN,
      });
      setSuccessTx(res.txHash);
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setSuccessTx(null);
        setAgentName('');
        setModelIdentifier('');
        setProviderAddress('');
        setSlaPolicyText('');
        onRefresh();
      }, 1800);
    } catch (err: any) {
      setFormError(err.message || 'Failed to lock covenant on-chain.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-heading">
            Autonomous Agent SLA Covenants
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Active Qualitative Performance Warranties Backed by GEN Collateral
          </p>
        </div>

        <button
          onClick={() => {
            if (!isConnected) {
              openWalletModal();
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-sm flex items-center space-x-2 transition-all shadow-glow-accent cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create SLA Covenant</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by agent name, model ID, or SLA policy terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-accent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-card border border-border">
          {(['ALL', 'ACTIVE', 'QUARANTINED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Covenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCovenants.map((cov) => (
          <div
            key={cov.id}
            className="p-5 rounded-2xl bg-card border border-border hover:border-accent/40 glass-card transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-accent">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{cov.agentName}</h3>
                    <span className="text-[11px] text-muted-foreground font-mono">{cov.modelIdentifier}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    cov.status === 'ACTIVE'
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'bg-destructive/15 text-destructive border border-destructive/30'
                  }`}
                >
                  {cov.status}
                </span>
              </div>

              {/* Policy Body */}
              <div className="p-3 rounded-xl bg-background/60 border border-border/50 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1 font-mono text-[11px] text-accent">
                  SLA Grounding Requirement:
                </strong>
                {cov.slaPolicyText}
              </div>

              {/* Metadata details */}
              <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                <div className="flex justify-between">
                  <span>Client (Auditor):</span>
                  <span className="text-foreground">{formatAddr(cov.client)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider (Operator):</span>
                  <span className="text-foreground">{formatAddr(cov.provider)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ground-Truth Domain:</span>
                  <span className="text-accent">{cov.referenceDomain}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer & Action */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-accent" />
                <span>
                  Bond: <strong className="text-foreground">{cov.providerBond} GEN</strong>
                </span>
              </div>

              <button
                onClick={() => onNavigateToDispute(cov.id)}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground flex items-center space-x-1.5 transition-colors cursor-pointer hover:border-warning/50"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-warning" />
                <span>Raise Dispute</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create SLA Covenant */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Lock SLA Performance Covenant</h3>
                  <p className="text-xs text-muted-foreground font-mono">Bilateral Performance Guarantee on GenLayer</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successTx ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-foreground">SLA Covenant Locked!</h4>
                <p className="text-xs text-muted-foreground font-mono break-all max-w-sm mx-auto">
                  Tx Hash: {successTx}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateCovenant} className="mt-4 space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/40 text-xs text-destructive flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Agent Name & Version
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FinAnalyst GPT-4o Underwriter"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="openai/gpt-4o"
                      value={modelIdentifier}
                      onChange={(e) => setModelIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Provider Bond (GEN)
                    </label>
                    <input
                      type="text"
                      value={bondAmountGEN}
                      onChange={(e) => setBondAmountGEN(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Agent Provider Wallet Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={providerAddress}
                    onChange={(e) => setProviderAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Qualitative SLA Policy Terms & Grounding Requirement
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Define exact factual constraints, citation rules, or escalation criteria..."
                    value={slaPolicyText}
                    onChange={(e) => setSlaPolicyText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Reference Ground-Truth Domain
                  </label>
                  <input
                    type="text"
                    value={referenceDomain}
                    onChange={(e) => setReferenceDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-semibold flex items-center space-x-2 cursor-pointer shadow-glow-accent"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Lock Covenant (Deposit {bondAmountGEN} GEN)</span>
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
