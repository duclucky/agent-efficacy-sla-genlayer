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
  Copy,
  Check,
  Sparkles,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

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
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-heading font-sans">
              Autonomous Agent SLA Covenants
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
              {covenants.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
            Active Qualitative Performance Warranties Backed by Native GEN Collateral
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
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all duration-200 shadow-glow-accent hover:scale-[1.02] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create SLA Covenant</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by agent name, model ID, or SLA policy terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-accent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-1.5 p-1.5 rounded-2xl bg-card border border-border">
          {(['ALL', 'ACTIVE', 'QUARANTINED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-secondary text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Covenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCovenants.map((cov) => (
          <div
            key={cov.id}
            className="p-6 rounded-3xl bg-card border border-border/90 hover:border-accent/50 glass-card transition-all flex flex-col justify-between space-y-5 group shadow-sm hover:shadow-glow-card"
          >
            <div className="space-y-4">
              {/* Card Top Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary border border-border/80 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                      {cov.agentName}
                    </h3>
                    <span className="text-[11px] text-muted-foreground font-mono">{cov.modelIdentifier}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                    cov.status === 'ACTIVE'
                      ? 'bg-accent/15 text-accent border border-accent/30 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                      : 'bg-destructive/15 text-destructive border border-destructive/30 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                  }`}
                >
                  {cov.status}
                </span>
              </div>

              {/* Policy Body */}
              <div className="p-4 rounded-2xl bg-background/80 border border-border/60 text-xs text-muted-foreground leading-relaxed space-y-1.5">
                <div className="flex items-center space-x-1.5 text-accent font-mono text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SLA Grounding Requirement:</span>
                </div>
                <p className="line-clamp-3">{cov.slaPolicyText}</p>
              </div>

              {/* Metadata Details */}
              <div className="space-y-2 text-xs text-muted-foreground font-mono bg-secondary/30 p-3 rounded-2xl border border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/80">Covenant ID:</span>
                  <button
                    onClick={(e) => handleCopy(cov.id, cov.id, e)}
                    className="flex items-center space-x-1 text-foreground hover:text-accent cursor-pointer"
                  >
                    <span>{cov.id}</span>
                    {copiedId === cov.id ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span>Client (Auditor):</span>
                  <span className="text-foreground">{formatAddr(cov.client)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider (Operator):</span>
                  <span className="text-foreground">{formatAddr(cov.provider)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Truth Domain:</span>
                  <span className="text-accent font-semibold">{cov.referenceDomain}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer & Action */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-muted-foreground">
                <Lock className="w-4 h-4 text-accent" />
                <span>
                  Bond: <strong className="text-foreground">{cov.providerBond} GEN</strong>
                </span>
              </div>

              <button
                onClick={() => onNavigateToDispute(cov.id)}
                className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border/80 text-xs font-bold text-foreground flex items-center space-x-1.5 transition-all cursor-pointer hover:border-warning/60 hover:text-warning"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <ShieldCheck className="w-5 h-5" />
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
              <form onSubmit={handleCreateCovenant} className="mt-5 space-y-4">
                {formError && (
                  <div className="p-3 rounded-2xl bg-destructive/15 border border-destructive/40 text-xs text-destructive flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Agent Name & Version
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FinAnalyst GPT-4o Underwriter"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="openai/gpt-4o"
                      value={modelIdentifier}
                      onChange={(e) => setModelIdentifier(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Provider Bond (GEN)
                    </label>
                    <input
                      type="text"
                      value={bondAmountGEN}
                      onChange={(e) => setBondAmountGEN(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Agent Provider Wallet Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={providerAddress}
                    onChange={(e) => setProviderAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Qualitative SLA Policy Terms & Grounding Requirement
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Define exact factual constraints, citation rules, or escalation criteria..."
                    value={slaPolicyText}
                    onChange={(e) => setSlaPolicyText(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Reference Ground-Truth Domain
                  </label>
                  <input
                    type="text"
                    value={referenceDomain}
                    onChange={(e) => setReferenceDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-glow-accent"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Lock Covenant ({bondAmountGEN} GEN Bond)</span>
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
