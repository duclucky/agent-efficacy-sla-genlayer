import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Lock,
  Globe,
  Sparkles,
  CheckCircle2,
  XCircle,
  Database,
  Server,
  Layers,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Covenant, Dispute } from '../types';

interface LandingPageProps {
  covenants: Covenant[];
  disputes: Dispute[];
  onNavigate: (tab: string, disputeId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  covenants,
  disputes,
  onNavigate,
}) => {
  const activeCovenantsCount = covenants.filter((c) => c.status === 'ACTIVE').length;
  const confirmedBreachesCount = disputes.filter((d) => d.status === 'BREACH_CONFIRMED').length;
  const totalBondsGEN = (covenants.length * 2.0).toFixed(1);

  return (
    <div className="space-y-16 pb-20 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-card via-card/90 to-background border border-border/80 p-8 sm:p-14 lg:p-20 text-center shadow-glow-card">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-12 right-1/4 w-48 h-48 bg-info/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-secondary/80 border border-accent/30 text-accent text-xs font-mono font-semibold shadow-glow-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Autonomous AI Agent SLA Assurance Protocol</span>
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Enforce AI Agent SLAs On-Chain <br className="hidden sm:inline" />
            <span className="gradient-accent">Before One Party Controls the Blame</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            Protect enterprise autonomous agent workflows with bonded qualitative performance warranties.
            GenLayer validators inspect multi-turn transcripts against live HTTPS ground truth to resolve factual hallucination disputes with automatic collateral slashing.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('covenants')}
              className="px-7 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm flex items-center space-x-2.5 transition-all duration-200 shadow-glow-accent hover:scale-[1.03] cursor-pointer group"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Explore SLA Covenants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('disputes')}
              className="px-7 py-3.5 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/80 hover:border-warning/50 text-foreground font-semibold text-sm flex items-center space-x-2.5 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <ShieldAlert className="w-4 h-4 text-warning" />
              <span>Inspect Live Disputes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Protocol KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <StatCard
          title="Active SLA Covenants"
          value={`${activeCovenantsCount} Agents`}
          subtitle="Backed by on-chain bonds"
          icon={ShieldCheck}
          variant="accent"
        />
        <StatCard
          title="Performance Collateral"
          value={`${totalBondsGEN} GEN`}
          subtitle="Provider bonds at stake"
          icon={Lock}
          variant="default"
        />
        <StatCard
          title="Breaches Slashed"
          value={`${confirmedBreachesCount} Settled`}
          subtitle="Decentralized consensus"
          icon={ShieldAlert}
          variant="warning"
        />
        <StatCard
          title="Truth Grounding"
          value="Live HTTPS"
          subtitle="SEC EDGAR / Official APIs"
          icon={Globe}
          variant="default"
        />
      </div>

      {/* 4-Step Interactive Lifecycle */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent font-bold uppercase tracking-wider">
            <span>Protocol Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight gradient-heading">
            Decentralized SLA Enforcement Lifecycle
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            From qualitative SLA definition to objective consensus-backed bond settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 glass-card space-y-4 hover:border-accent/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold text-lg group-hover:scale-105 group-hover:shadow-glow-accent transition-all">
              01
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-accent transition-colors">
              Lock SLA & Bond
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise client and agent provider agree on qualitative factual grounding terms and lock a 2.0 GEN provider performance bond on Studionet.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 glass-card space-y-4 hover:border-warning/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning font-mono font-bold text-lg group-hover:scale-105 group-hover:shadow-glow-warning transition-all">
              02
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-warning transition-colors">
              Flag Factual Dispute
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When an agent hallucinates or violates escalation guidelines, the client submits the interaction transcript and deposits 0.5 GEN collateral.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 glass-card space-y-4 hover:border-accent/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold text-lg group-hover:scale-105 group-hover:shadow-glow-accent transition-all">
              03
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-accent transition-colors">
              Validator Web Review
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              GenVM validators independently fetch official reference documents via HTTPS, compare facts against the transcript, and reach consensus.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 glass-card space-y-4 hover:border-destructive/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive font-mono font-bold text-lg group-hover:scale-105 group-hover:shadow-glow-destructive transition-all">
              04
            </div>
            <h3 className="font-bold text-foreground text-base group-hover:text-destructive transition-colors">
              Slashing & Payout
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A confirmed breach immediately transfers 1.0 GEN penalty credit to the client and sets the agent provider into a Quarantined status.
            </p>
          </div>
        </div>
      </div>

      {/* Why Existing Solutions Fail Comparison Matrix */}
      <div className="p-8 sm:p-10 rounded-3xl bg-card/70 border border-border/80 glass-card space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Why Other Architectures Cannot Solve AI Agent SLAs
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            Architectural Comparison: Ordinary EVM vs Centralized Oracle vs GenLayer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-background/60 border border-border/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Standard EVM Contracts</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Limited to deterministic mathematics, cryptographic signatures, and token balances. Cannot parse natural language, detect hallucinations, or fetch live web disclosures.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-destructive font-mono font-semibold pt-2">
              <XCircle className="w-4 h-4" />
              <span>Cannot evaluate semantics</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-background/60 border border-border/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-foreground">Centralized LLM Oracle</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A single operator or API server evaluates disputes. Suffers from severe trust asymmetries—either party can corrupt or pressure the centralized oracle operator.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-destructive font-mono font-semibold pt-2">
              <XCircle className="w-4 h-4" />
              <span>Vulnerable to single-operator bias</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-accent/5 border border-accent/40 space-y-3 shadow-glow-accent">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-accent">GenLayer Multi-Validator Consensus</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Independent validators fetch live HTTPS reference truth, evaluate semantic factual grounding via <code className="text-accent font-mono">gl.vm.run_nondet</code>, and compare structured meaning.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-accent font-mono font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Decentralized, objective & bonded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Active Covenants Preview */}
      <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Active SLA Covenants</h3>
            <p className="text-xs text-muted-foreground font-mono">Autonomous Agents Protected on GenLayer Studionet</p>
          </div>
          <button
            onClick={() => onNavigate('covenants')}
            className="text-xs font-semibold text-accent hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Covenants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {covenants.slice(0, 2).map((cov) => (
            <div
              key={cov.id}
              className="p-6 rounded-2xl bg-background border border-border hover:border-accent/40 transition-all space-y-4 cursor-pointer group shadow-sm hover:shadow-glow-accent"
              onClick={() => onNavigate('covenants')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">
                      {cov.agentName}
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-mono">{cov.modelIdentifier}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold ${
                    cov.status === 'ACTIVE'
                      ? 'bg-accent/15 text-accent border border-accent/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      : 'bg-destructive/15 text-destructive border border-destructive/30'
                  }`}
                >
                  {cov.status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {cov.slaPolicyText}
              </p>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Collateral: <strong className="text-foreground">{cov.providerBond} GEN</strong></span>
                <span>Ref: <strong className="text-accent">{cov.referenceDomain}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
