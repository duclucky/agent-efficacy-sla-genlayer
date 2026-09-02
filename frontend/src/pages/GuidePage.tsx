import React from 'react';
import {
  ShieldCheck,
  Scale,
  AlertTriangle,
  Code2,
} from 'lucide-react';

export const GuidePage: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn pb-20 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="pb-3 border-b border-border/60">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-heading font-sans">
            Protocol Methodology & Developer Guide
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
            v1.0
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
          Architectural Blueprint, Hallucination Taxonomy & GenVM Consensus Rules
        </p>
      </div>

      {/* 1. Trust Problem & Necessity */}
      <div className="p-7 sm:p-9 rounded-[2rem] bg-card border border-border/80 space-y-4 glass-card shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Why GenLayer is Strictly Required</h2>
            <p className="text-xs text-muted-foreground font-mono">The Decentralized Solution to AI Agent Trust Asymmetry</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Traditional EVM smart contracts can enforce deterministic checks (like cryptographic signatures or token balances) but cannot evaluate whether an AI agent's complex natural-language output constitutes a <strong className="text-foreground">factual hallucination</strong> against external ground truth. Centralized backends or single-model oracles create severe trust conflicts—the enterprise has an incentive to claim false breaches to claw back fees, while the agent provider has an incentive to deny legitimate faults.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          GenLayer solves this through <strong className="text-accent">decentralized validator consensus over non-deterministic execution (<code className="text-accent font-mono">gl.vm.run_nondet</code>)</strong>: multiple independent validators fetch live HTTPS reference documents, evaluate factual grounding semantically, and reach consensus on whether an SLA breach occurred.
        </p>
      </div>

      {/* 2. Qualitative Breach Taxonomy */}
      <div className="p-7 sm:p-9 rounded-[2rem] bg-card border border-border/80 space-y-6 glass-card shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">SLA Violation Taxonomy</h2>
            <p className="text-xs text-muted-foreground font-mono">Standardized Failure Classes Adjudicated by Validators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-background/80 border border-destructive/30 space-y-2.5 shadow-sm">
            <span className="text-xs font-mono font-bold text-destructive flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span>FACTUAL_HALLUCINATION</span>
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent asserts fabricated numbers, non-existent filing items, or falsified domain entities contradicted by authoritative reference documents.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-background/80 border border-warning/30 space-y-2.5 shadow-sm">
            <span className="text-xs font-mono font-bold text-warning flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <span>REASONING_FAULT</span>
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent violates mandatory clinical, legal, or escalation triage rules (e.g. failing to escalate a critical alert within required turns).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-background/80 border border-info/30 space-y-2.5 shadow-sm">
            <span className="text-xs font-mono font-bold text-info flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
              <span>UNAUTHORIZED_TOOL</span>
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent executes out-of-scope database/API tool parameters or invokes destructive actions without required human confirmation tokens.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Equivalence Principle & GenVM Consensus */}
      <div className="p-7 sm:p-9 rounded-[2rem] bg-card border border-border/80 space-y-5 glass-card shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Equivalence Principle & Meaning Consensus</h2>
            <p className="text-xs text-muted-foreground font-mono">Validator Consensus Logic (Rule #7 & D3)</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Following GenLayer authoring rules, validators compare the <strong className="text-foreground">semantic meaning</strong> of the verdict rather than exact JSON string formatting or narrative rationale wording:
        </p>

        <div className="p-5 rounded-2xl bg-background border border-border font-mono text-xs text-muted-foreground space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-accent font-bold border-b border-border/60 pb-2">
            <span># Python GenVM Validator Logic (Meaning Comparison)</span>
            <span className="text-muted-foreground text-[11px]">contracts/agent_efficacy_sla.py</span>
          </div>
          <pre className="text-foreground overflow-x-auto leading-relaxed">
{`def validator_fn(leader_res) -> bool:
    if not isinstance(leader_res, gl.vm.Return):
        return False
    leader = leader_res.calldata
    if not isinstance(leader, dict):
        return False

    # Validator independently re-runs web fetch + LLM judgment
    my_res = leader_fn()
    if not isinstance(my_res, dict):
        return False

    # Compare structured verdict and category only
    return (
        my_res.get("verdict") == leader.get("verdict") and
        my_res.get("violation_category") == leader.get("violation_category")
    )`}
          </pre>
        </div>
      </div>

      {/* 4. Downstream Integration & Reusable Views */}
      <div className="p-7 sm:p-9 rounded-[2rem] bg-card border border-border/80 space-y-5 glass-card shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Downstream Protocol Integration</h2>
            <p className="text-xs text-muted-foreground font-mono">Reusable RPC Methods for Gateways, Routers & Marketplaces</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          External agent gateway routers (e.g. Langfuse / Portkey / Helicone) or decentralized agent marketplaces can integrate with `AgentEfficacySLA` using lightweight read-only views:
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-accent font-bold">is_agent_healthy(provider: Address) -&gt; bool</span>
            <span className="text-muted-foreground">True if provider is ACTIVE and not quarantined</span>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-accent font-bold">get_covenant(covenant_id: str) -&gt; str</span>
            <span className="text-muted-foreground">Returns locked SLA terms and bond balance</span>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-accent font-bold">get_dispute(dispute_id: str) -&gt; str</span>
            <span className="text-muted-foreground">Returns consensus verdict and settlement status</span>
          </div>
          <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-accent font-bold">withdraw_credits() -&gt; None</span>
            <span className="text-muted-foreground">Transfers accumulated SLA remediation credits</span>
          </div>
        </div>
      </div>
    </div>
  );
};
