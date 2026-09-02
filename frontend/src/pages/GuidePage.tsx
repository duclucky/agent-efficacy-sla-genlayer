import React from 'react';
import {
  ShieldCheck,
  Scale,
  AlertTriangle,
  Code2,
} from 'lucide-react';

export const GuidePage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight gradient-heading">
          Protocol Methodology & Developer Guide
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Architectural Blueprint, Hallucination Taxonomy & GenVM Consensus Rules
        </p>
      </div>

      {/* 1. Trust Problem & Necessity */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-4 glass-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Why GenLayer is Required</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Traditional EVM smart contracts can enforce deterministic checks (like cryptographic signatures or token balances) but cannot evaluate whether an AI agent's complex natural-language output constitutes a <strong>factual hallucination</strong> against external ground truth. Centralized backends or single-model oracles create severe trust conflicts—the enterprise has an incentive to claim false breaches to claw back fees, while the agent provider has an incentive to deny legitimate faults.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          GenLayer solves this through <strong>decentralized validator consensus over non-deterministic execution (<code className="text-accent font-mono">gl.vm.run_nondet</code>)</strong>: multiple independent validators fetch live HTTPS reference documents, evaluate factual grounding semantically, and reach consensus on whether an SLA breach occurred.
        </p>
      </div>

      {/* 2. Qualitative Breach Taxonomy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-5 glass-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">SLA Violation Taxonomy</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
            <span className="text-xs font-mono font-bold text-destructive">
              FACTUAL_HALLUCINATION
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent asserts fabricated numbers, non-existent filing items, or falsified domain entities contradicted by authoritative reference documents.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
            <span className="text-xs font-mono font-bold text-warning">
              REASONING_FAULT
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent violates mandatory clinical, legal, or escalation triage rules (e.g. failing to escalate a critical alert within required turns).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
            <span className="text-xs font-mono font-bold text-accent">
              UNAUTHORIZED_TOOL
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Agent executes out-of-scope database/API tool parameters or invokes destructive actions without required human confirmation tokens.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Equivalence Principle & GenVM Consensus */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-4 glass-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Equivalence Principle & Meaning Consensus</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Following GenLayer authoring rules, validators compare the <strong>semantic meaning</strong> of the verdict rather than exact JSON string formatting or narrative rationale wording:
        </p>

        <div className="p-4 rounded-2xl bg-background border border-border font-mono text-xs text-muted-foreground space-y-2">
          <div className="text-accent font-bold"># Python GenVM Validator Logic (Meaning Comparison)</div>
          <pre className="text-foreground overflow-x-auto leading-relaxed">
{`def validator_fn(leader_res) -> bool:
    if not isinstance(leader_res, gl.vm.Return):
        return False
    leader_verdict = leader_res.calldata.get("verdict")
    leader_cat = leader_res.calldata.get("violation_category")

    # Validator independently re-runs web fetch + LLM judgment
    my_res = leader_fn()

    # Compare structured verdict and category only
    return (my_res.get("verdict") == leader_verdict and
            my_res.get("violation_category") == leader_cat)`}
          </pre>
        </div>
      </div>

      {/* 4. Downstream Integration & Reusable Views */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-4 glass-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent">
            <Code2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Downstream Protocol Integration</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          External agent gateway routers (e.g. Langfuse / Portkey / Helicone) or decentralized agent marketplaces can integrate with `AgentEfficacySLA` using lightweight read-only views:
        </p>

        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-background border border-border flex justify-between">
            <span className="text-accent">is_agent_healthy(provider: Address) -&gt; bool</span>
            <span className="text-muted-foreground">True if provider is ACTIVE and not quarantined</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border flex justify-between">
            <span className="text-accent">get_covenant(covenant_id: str) -&gt; CovenantView</span>
            <span className="text-muted-foreground">Returns locked SLA terms and bond balance</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border flex justify-between">
            <span className="text-accent">get_dispute(dispute_id: str) -&gt; DisputeView</span>
            <span className="text-muted-foreground">Returns consensus verdict and settlement status</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border flex justify-between">
            <span className="text-accent">withdraw_credits() -&gt; None</span>
            <span className="text-muted-foreground">Transfers accumulated SLA remediation credits</span>
          </div>
        </div>
      </div>
    </div>
  );
};
