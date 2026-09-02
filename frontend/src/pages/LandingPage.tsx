import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Cpu,
  Lock,
  Globe,
  Zap,
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
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-card to-background border border-border p-8 sm:p-12 lg:p-16 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider shadow-glow-accent">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous AI Agent SLA Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Enforce AI Agent SLAs On-Chain <br />
            <span className="gradient-accent">Before One Party Controls the Blame</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Protect enterprise deployments of autonomous agents with decentralized, bonded performance warranties.
            GenLayer validators inspect multi-turn transcripts against live HTTPS ground truth to resolve factual hallucination disputes with automatic bond slashing.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('covenants')}
              className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-sm flex items-center space-x-2 transition-all shadow-glow-accent cursor-pointer group"
            >
              <span>Explore SLA Covenants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('disputes')}
              className="px-6 py-3 rounded-xl bg-secondary hover:bg-card border border-border hover:border-accent/40 text-foreground font-semibold text-sm flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-warning" />
              <span>Review Active Disputes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Protocol KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active SLA Covenants"
          value={`${activeCovenantsCount} Agents`}
          subtitle="Backed by on-chain bonds"
          icon={ShieldCheck}
          variant="accent"
        />
        <StatCard
          title="Performance Bonds Locked"
          value={`${totalBondsGEN} GEN`}
          subtitle="Provider collateral at risk"
          icon={Lock}
          variant="default"
        />
        <StatCard
          title="Breaches Adjudicated"
          value={`${confirmedBreachesCount} Slashed`}
          subtitle="Decentralized consensus"
          icon={ShieldAlert}
          variant="warning"
        />
        <StatCard
          title="Truth Grounding Mode"
          value="Live HTTPS"
          subtitle="SEC EDGAR / Official APIs"
          icon={Globe}
          variant="default"
        />
      </div>

      {/* How It Works: The 4-Step Architecture */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-heading">
            Decentralized SLA Enforcement Lifecycle
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            From qualitative SLA definition to objective consensus-backed bond settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-card border border-border/80 glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold">
              01
            </div>
            <h3 className="font-bold text-foreground text-base">Lock SLA & Bond</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise client & agent provider agree on qualitative factual grounding rules and lock a 2 GEN provider performance bond.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning font-mono font-bold">
              02
            </div>
            <h3 className="font-bold text-foreground text-base">Flag Factual Dispute</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When an agent hallucinates or violates escalation guidelines, the client submits the interaction transcript and a 0.5 GEN challenge deposit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold">
              03
            </div>
            <h3 className="font-bold text-foreground text-base">Validator Web Review</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              GenVM validators independently fetch official reference documents via HTTPS, compare facts against the transcript, and reach consensus.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive font-mono font-bold">
              04
            </div>
            <h3 className="font-bold text-foreground text-base">Slashing & Remediation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A confirmed breach immediately transfers 1 GEN penalty credit to the client and sets the agent provider into a Quarantined state.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Active Covenants Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card/60 border border-border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Featured Active Covenants</h3>
            <p className="text-xs text-muted-foreground font-mono">Autonomous Agents Protected on Studionet</p>
          </div>
          <button
            onClick={() => onNavigate('covenants')}
            className="text-xs font-semibold text-accent hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Covenants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {covenants.slice(0, 2).map((cov) => (
            <div
              key={cov.id}
              className="p-5 rounded-2xl bg-background border border-border hover:border-accent/40 transition-all space-y-3 cursor-pointer group"
              onClick={() => onNavigate('covenants')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-accent">
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
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${
                    cov.status === 'ACTIVE'
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'bg-destructive/15 text-destructive border border-destructive/30'
                  }`}
                >
                  {cov.status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {cov.slaPolicyText}
              </p>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Bond: <strong className="text-foreground">{cov.providerBond} GEN</strong></span>
                <span>Ref: <strong className="text-accent">{cov.referenceDomain}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
