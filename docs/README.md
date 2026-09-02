# AgentEfficacySLA Specification

> Autonomous Agent SLA & Qualitative Performance Warranty Protocol on GenLayer

## Identity

- Idea ID: `IDEA-022`
- Project name: `AgentEfficacySLA`
- Project slug: `agent-efficacy-sla`
- Category: `Projects`
- Status: `BUILDING`
- Repository: `https://github.com/duclucky/agent-efficacy-sla-genlayer`
- Target network: `studionet` (Chain ID `61999`, `https://studio.genlayer.com/api`)

## One-sentence product hook

Enforce autonomous AI agent SLAs on-chain before one party controls the blame: GenLayer validators inspect multi-turn transcripts against live HTTPS ground truth to resolve factual hallucination disputes with automatic bond slashing and native GEN remediation payouts.

## Trust problem

- **Decision that must not depend on one party:** Whether an autonomous AI agent's real-world interaction session suffered a material qualitative failure (factual hallucination, citation of falsified filings, unauthorized tool invocation, or critical safety triage downgrade) against locked qualitative SLA standards.
- **Why database/ordinary EVM/backend LLM is insufficient:** EVM smart contracts cannot evaluate natural-language semantics or verify facts against live web documents. A centralized backend or single-operator LLM is economically biased—enterprise clients have an incentive to over-report hallucinations to claw back fees, while agent providers have an incentive to deny legitimate errors to protect their collateral and reputation.
- **Value/rights/access at risk:** Provider performance collateral (2.0 GEN per covenant), challenger dispute deposits (0.5 GEN), client SLA remediation credits (1.0 GEN per breach), and agent routing health status (`ACTIVE` vs `QUARANTINED`).

## Fingerprint

- **Trust problem:** Enterprise clients and autonomous agent providers cannot trust either party to neutrally judge whether an agent's real-world interaction session suffered a material qualitative failure against locked SLA benchmarks before service fees or performance bonds move.
- **Actors/adversary:** Client (wants SLA penalty payout and bond forfeiture), Agent Provider (wants to keep 2 GEN bond and deny liability), Downstream Integration Gateway (needs neutral on-chain status to trigger automatic agent failover/quarantine).
- **Evidence class + authenticity mechanism:** Locked SLA policy on-chain + client-submitted interaction transcript session + authoritative live reference URL fetched by validators via HTTPS (e.g. SEC EDGAR / API documentation / clinical guidelines).
- **Consensus question:** Whether the agent session demonstrates a `MATERIAL_BREACH`, `ACCEPTABLE_DEVIATION`, or `UNVERIFIABLE`; the exact violation categories (`FACTUAL_HALLUCINATION`, `UNAUTHORIZED_TOOL`, `REASONING_FAULT`, `NONE`); and the derived consequence.
- **State machine:** `ACTIVE -> DISPUTE_OPEN -> EVALUATING -> BREACH_CONFIRMED | NO_BREACH | UNVERIFIABLE -> SETTLED | CLOSED`.
- **Direct consequence:** `BREACH_CONFIRMED` transfers 1 GEN penalty from provider bond to client credit and sets agent status to `QUARANTINED`; `NO_BREACH` returns dispute bond to provider; `UNVERIFIABLE` refunds dispute bond without penalty.
- **Reuse surface:** AI agent marketplaces, enterprise LLM gateway routers, API subscription protocols, and decentralized agent work platforms can integrate the contract views (`get_covenant`, `get_dispute`, `is_agent_healthy`, `get_claimable_credits`) to trigger automatic gateway failover, provider slashing, or refund routing.

## Mandatory gate matrix

| Gate | PASS/FAIL | Evidence/reason |
| --- | --- | --- |
| Replacement | `PASS` | Centralized database or single-model oracle restores unilateral bias; GenLayer decentralized multi-validator consensus is essential. |
| Judgment | `PASS` | Evaluating factual hallucination and reasoning fidelity against external documents is nondeterministic and semantic. |
| Evidence availability | `PASS` | Public reference documents are fetched via HTTPS with explicit status and length limits. |
| Evidence authenticity | `PASS` | SLA policy is locked on-chain; parties transact via authenticated wallet keys; reference URLs are fetched directly from authoritative domains. |
| Equivalence | `PASS` | Consensus compares structured enums (`verdict`, `violation_category`, `consequence_class`), ignoring cosmetic rationale wording. |
| Consequence | `PASS` | Finalized verdict directly slashes 1.0 GEN provider bond, credits client remediation, and sets provider to `QUARANTINED`. |
| Adversarial | `PASS` | Opposed financial and reputational incentives between client and provider over fault attribution. |
| State model | `PASS` | Strict per-covenant, per-dispute isolation in `TreeMap`; append-only history; explicit value destinations. |
| Reuse | `PASS` | Clean public views (`is_agent_healthy`, `get_covenant`, `get_dispute`) allow external routers and gateways to integrate. |
| Contract count | `PASS` | Exactly one contract (`AgentEfficacySLA`) owns the SLA terms, dispute evidence evaluation, bond accounting, and credit settlement. |
| Differentiation | `PASS` | Distinct from all 21 registry entries: adjudicates runtime factual hallucination and qualitative SLA compliance against live web truth. |
| Claim-to-code | `PASS` | All visible product actions map to explicit contract methods, states, tests, and UI controls. |
| Full lifecycle | `PASS` | Vite/React dApp signs real wallet writes (EIP-6963), handles finality states, and reloads canonical on-chain state. |
| Scope honesty | `PASS` | Adjudicates qualitative compliance against locked SLA standards; does not claim to modify model weights or inspect private weights. |

## Actors, roles and incentives

| Actor | Permissions | Value at risk | Incentive to bias |
| --- | --- | --- | --- |
| **Enterprise Client** | Lock covenant, file dispute with transcript, withdraw remediation credits | 0.5 GEN dispute deposit | Claim false hallucinations to recover service fees and obtain penalty credits |
| **Agent Provider** | Lock covenant, deposit performance bond, withdraw unaffected bond | 2.0 GEN performance bond | Deny valid hallucinations, blame user prompt ambiguity to protect collateral |
| **Downstream Gateway** | Read-only health inspection (`is_agent_healthy`) | Routing traffic reliability | Requires neutral canonical health status to prevent routing users to broken agents |

## Scope and non-goals

### In scope

- Bilateral SLA covenants with locked qualitative criteria and 2.0 GEN performance bond collateral.
- Multi-turn interaction transcript dispute filing with 0.5 GEN challenger deposit and authoritative HTTPS reference ground-truth link.
- Decentralized GenVM validator consensus (`gl.vm.run_nondet`) comparing factual grounding and violation taxonomy.
- Automatic 1.0 GEN bond slashing and client credit ledger update upon confirmed breach.
- Provider quarantine state transition (`ACTIVE` -> `QUARANTINED`).
- Complete multi-page Vite/React web application with EIP-6963 wallet discovery and Studionet deployment.

### Out of scope

- Private model weight modification or fine-tuning retraining on-chain.
- Accessing credentialed private corporate intranets.
- Arbitrary unconstrained web search or open-ended legal arbitration beyond locked domain guidelines.

## Product/frontend blueprint

### Human users and jobs

| User/role | Primary job | Decision or outcome needed |
| --- | --- | --- |
| **Enterprise AI Lead** | Monitor agent SLA compliance, file disputes for hallucinations | Confirm whether agent output breached factual grounding and collect remediation credits |
| **Agent Provider Dev** | Deposit performance bond, prove agent reliability, review disputes | Prove compliance, clear quarantine state, and protect collateral |
| **Gateway Operator** | Query on-chain health of registered agent endpoints | Automatically divert user traffic away from quarantined agent providers |

### Information architecture

| Screen/view | User purpose | Primary action | Required states | Mobile behavior |
| --- | --- | --- | --- | --- |
| **Overview (Landing)** | Protocol overview, trust signals, workflow, featured covenants | Navigate to covenants / disputes | Initial, Loaded | Stacked layout, responsive grid |
| **SLA Covenants** | Browse active covenants, inspect terms and bonds | Create SLA Covenant (Deposit 2 GEN) | Empty, Filtered, Create Modal | 1-column card list |
| **Breach Disputes** | Browse and filter filed disputes | File SLA Dispute (Deposit 0.5 GEN) | Empty, Filtered, File Modal | 1-column card list |
| **Dispute Detail** | Inspect transcript, live reference URL, consensus findings | Trigger GenVM Validator Review | Open, Evaluating, Finalized Slashed | Responsive split layout |
| **Bonds & Credits** | Manage collateral, withdraw SLA remediation credits | Withdraw Slashed Credits / Deposit Bond | Connected, Zero Credit, Positive Credit | Full drawer + page layout |
| **Protocol Guide** | Understand taxonomy, equivalence principle, and integration | Read documentation and API signatures | Static documentation | Responsive article reading |

### Visibility matrix

| Function/data group | Visibility | Eligible role/state | User need or reason hidden |
| --- | --- | --- | --- |
| Active Covenants & Terms | `USER_PRIMARY` | All users | Essential for discovering agent warranties and monitoring status |
| File Dispute Action | `USER_PRIMARY` | Connected Client / Auditor | Primary action to hold agent accountable for hallucinations |
| Validator Consensus Rationale | `USER_PRIMARY` | All users | Transparency on why validators confirmed or rejected a breach |
| Trigger Validator Review | `USER_CONTEXTUAL` | Connected wallet / Open dispute | Initiates decentralized GenVM execution on Studionet |
| Withdraw Remediation Credits | `USER_CONTEXTUAL` | Credited Challenger (> 0 GEN) | Enables claiming financial settlement funds |
| Raw Hex Hashes & Nonces | `SYSTEM_ONLY` | Explorer disclosure | Placed in secondary technical disclosures to avoid cluttering UX |

### UI action matrix

| Visible control | Contract capability/method | Eligible role | Legal state | Input/value | Finality | Failure/recovery |
| --- | --- | --- | --- | --- | --- | --- |
| Create SLA Covenant | `create_covenant` | Any user / Client | `N/A` (New) | 2.0 GEN bond + SLA policy terms | `FINALIZED` | Revert on empty policy or zero bond |
| File SLA Dispute | `file_dispute` | Any user / Challenger | Covenant `ACTIVE` | 0.5 GEN deposit + Transcript + URL | `FINALIZED` | Revert on closed covenant or invalid URL |
| Trigger Validator Review | `adjudicate_dispute` | Any user | Dispute `OPEN` | Dispute ID | `FINALIZED` | Retryable if external HTTPS source times out |
| Withdraw Credits | `withdraw_credits` | Credited user | Credits > 0 | None (transfers balance) | `FINALIZED` | Revert if credit ledger is zero |
| Deposit Provider Bond | `deposit_bond` | Provider | Covenant `ACTIVE`/`QUARANTINED` | N GEN (e.g. 1.0 GEN) | `FINALIZED` | Revert on zero deposit |

### User-facing state language

| Canonical status/violation | User-facing label | User consequence/next step |
| --- | --- | --- |
| `ACTIVE` | Active Warranty | Agent is in good standing; protected by provider performance bond |
| `QUARANTINED` | Quarantined (Breach Slashed) | Provider performance bond was slashed; gateway traffic should failover |
| `BREACH_CONFIRMED` | Breach Confirmed | 1.0 GEN penalty deducted from provider and credited to challenger |
| `NO_BREACH` | Verified Conformant | Dispute rejected; challenger deposit returned to provider |
| `UNVERIFIABLE` | Unverifiable Reference | Source unreachable or malformed; deposit refunded with zero penalty |

### Visual preservation constraints

- Visual language/layout to preserve: Dark Mode (OLED) palette with deep slate background (`#020617`), card surface (`#0E1223`), emerald accent (`#22C55E`), amber warning (`#F59E0B`), rose destructive (`#EF4444`), and Inter typography.
- Allowed functional edits: Wiring real contract view reads and wallet transaction writes into existing button handlers.
- Excluded from primary UI: Raw RPC dumps, validator node IDs, execution traces, private keys, and simulated local storage values.

## State model

### Stable IDs

- Covenant ID: `cov-<slug>` (e.g. `cov-alpha-001`)
- Dispute ID: `disp-<slug>` (e.g. `disp-101`)

### Structured storage

- `covenants: TreeMap[str, CovenantStruct]`
- `disputes: TreeMap[str, DisputeStruct]`
- `credits: TreeMap[str, bigint]`
- `provider_status: TreeMap[str, str]` (`ACTIVE` vs `QUARANTINED`)
- `covenant_keys: DynArray[str]`
- `dispute_keys: DynArray[str]`

### State machine

```text
[DRAFT] --create_covenant(2 GEN)--> [ACTIVE]
[ACTIVE] --file_dispute(0.5 GEN)--> [DISPUTE_OPEN]
[DISPUTE_OPEN] --adjudicate_dispute()--> [EVALUATING]
[EVALUATING] --> [BREACH_CONFIRMED] (1.0 GEN Slashed, QUARANTINED)
[EVALUATING] --> [NO_BREACH] (0.5 GEN to Provider)
[EVALUATING] --> [UNVERIFIABLE] (Refund Challenger)
[BREACH_CONFIRMED] --withdraw_credits()--> [SETTLED]
```

### Temporal entrypoint rules

- Canonical transaction-time source: `gl.message_raw` timestamp / block timestamp.
- Default/exception interval semantics: Time bounds enforced directly inside entrypoint methods before state mutation.
- Entrypoint-local deadline/expiry guards: Dispute filing allowed while covenant is active; review allowed while dispute is open.

## Write-method safety matrix

| Method | Caller | Allowed states | Forbidden states | Temporal/expiry gate | Idempotency | Value/accounting effect | Views affected | Negative tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `create_covenant` | Any (Client) | New ID | Existing ID | N/A | Unique ID check | Locks >= 2 GEN provider bond | `get_covenant`, `get_all_covenants` | Duplicate ID, zero bond |
| `file_dispute` | Any (Challenger) | Covenant `ACTIVE` | Covenant `CLOSED` | N/A | Unique Dispute ID | Locks 0.5 GEN challenge deposit | `get_dispute`, `get_all_disputes` | Invalid covenant, zero deposit |
| `adjudicate_dispute` | Any | Dispute `OPEN` | Dispute `FINALIZED` | N/A | One review per dispute | Slashes 1.0 GEN on breach, credits challenger | `get_dispute`, `is_agent_healthy` | Already settled, invalid ID |
| `withdraw_credits` | Credited user | Credits > 0 | Credits == 0 | N/A | Balance zeroed before transfer | Emits transfer of credit balance | `get_credits` | Zero credit, double withdraw |
| `deposit_bond` | Provider | Covenant exists | Invalid ID | N/A | Additive balance | Increases provider bond | `get_covenant` | Zero value, invalid covenant |

## Frontend lifecycle coverage matrix

| Canonical state | User action | Contract write | UI component | Frontend test | Evidence status |
| --- | --- | --- | --- | --- | --- |
| `N/A` | Create SLA Covenant | `create_covenant` | `CovenantsPage.tsx` | `app.test.tsx` | Tested & Verified |
| `ACTIVE` | File SLA Dispute | `file_dispute` | `DisputesPage.tsx` | `app.test.tsx` | Tested & Verified |
| `DISPUTE_OPEN` | Trigger Validator Review | `adjudicate_dispute` | `DisputeDetailPage.tsx` | `app.test.tsx` | Tested & Verified |
| `BREACH_CONFIRMED` | Withdraw Slashed Credits | `withdraw_credits` | `AccountPage.tsx` | `app.test.tsx` | Tested & Verified |
| `ACTIVE` | Deposit Performance Bond | `deposit_bond` | `AccountPage.tsx` | `app.test.tsx` | Tested & Verified |

## Evidence policy

- Authoritative sources: Live HTTPS reference URLs from official domains (e.g., `sec.gov`, `github.com`, `guidelines.gov`).
- Allowed schemes: Strictly `https://`.
- Missing evidence / Unreachable URL: Resolves to non-penalizing `UNVERIFIABLE`, refunding challenge deposit without slashing.

### Evidence Authority Matrix

| Consequential claim/fact | Evidence/artifact | Data controller | Authoritative source/issuer | Deterministic verification | Canonical objective/entity/actor binding | Freshness/anti-replay | Semantic role after verification | Non-penalizing failure state | Consequence blocked | Required negative test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Agent Factual Hallucination | Multi-turn interaction transcript + Reference HTTPS URL | Challenger / Client | Official HTTPS domain (e.g. sec.gov) | URL host parsing & HTTPS status check | Bound to `covenant_id` and `dispute_id` | Unique dispute ID | Grounds semantic equivalence review | `UNVERIFIABLE` | Slashing & penalty payout blocked | Mismatched domain, unreachable URL |
| Emergency Triage Fault | Clinical transcript snippet | Challenger | Official Medical Guidelines URL | Host allowlist & text rendering | Bound to clinical covenant | Unique dispute ID | Grounds clinical reasoning review | `UNVERIFIABLE` | Slashing blocked | 404 dead link test |

## Consensus design

### Leader task

- Inputs: `covenant.sla_policy_text`, `dispute.transcript_snippet`, `dispute.reference_source_url`.
- Fetch: `page_text = gl.nondet.web.render(url, mode="text")`.
- Structured output: `{"verdict": "BREACH_CONFIRMED" | "NO_BREACH" | "UNVERIFIABLE", "violation_category": "FACTUAL_HALLUCINATION" | "REASONING_FAULT" | "UNAUTHORIZED_TOOL" | "NONE", "rationale": str}`.

### Consensus-critical fields

| Field | Type/bounds | Comparison rule | Why critical |
| --- | --- | --- | --- |
| `verdict` | Enum | Exact string match | Determines bond slashing vs refund |
| `violation_category` | Enum | Exact string match | Classifies specific breach type |

### Validator

- Independent replay: Validator independently re-fetches the reference URL and runs LLM evaluation.
- Semantic rule: Returns `True` iff `my_res["verdict"] == leader_res["verdict"]` and `my_res["violation_category"] == leader_res["violation_category"]`.

## Consequence and accounting

- Finalized `BREACH_CONFIRMED`: Provider bond reduced by 1.0 GEN; challenger credited 1.0 GEN + 0.5 GEN deposit refund; provider marked `QUARANTINED`.
- Finalized `NO_BREACH`: Challenger 0.5 GEN deposit forfeited to provider; provider bond remains intact.
- Finalized `UNVERIFIABLE`: Challenger 0.5 GEN deposit refunded; zero penalty.
- Ledger invariant: `total_received == total_bonds_locked + total_credits_pending + total_withdrawn`.

## Reusable interface

### Write methods

- `create_covenant(covenant_id: str, provider: Address, agent_name: str, model_id: str, sla_policy: str, reference_domain: str)` (payable)
- `file_dispute(dispute_id: str, covenant_id: str, transcript: str, violation: str, reference_url: str)` (payable)
- `adjudicate_dispute(dispute_id: str)`
- `withdraw_credits()`
- `deposit_bond(covenant_id: str)` (payable)

### View methods

- `get_covenant(covenant_id: str) -> str`
- `get_dispute(dispute_id: str) -> str`
- `get_all_covenants() -> str`
- `get_all_disputes() -> str`
- `get_credits(account: Address) -> str`
- `is_agent_healthy(provider: Address) -> bool`

## Threat model

| Threat | Attack | Mitigation | Test |
| --- | --- | --- | --- |
| Malicious Client | Submits fake fabricated transcripts | Validators check factual grounding against independent HTTPS source | Negative test with conformant transcript |
| Dead/Malicious URL | Submits prompt injection in URL or 404 page | GenVM sandboxing; dead URL maps to non-penalizing `UNVERIFIABLE` | Unreachable URL test |
| Double Settle | Calls `adjudicate_dispute` twice | Status locked to `BREACH_CONFIRMED`; second call reverts | Duplicate adjudication test |
| Double Withdraw | Calls `withdraw_credits` concurrently | Balance zeroed before transfer | Zero credit withdrawal test |

## Claim-to-code matrix

| Product claim | Contract method/state | View/read | Direct test | Network evidence |
| --- | --- | --- | --- | --- |
| Lock SLA with Bond | `create_covenant` / `ACTIVE` | `get_covenant` | `test_create_covenant` | Studionet deployment |
| File Breach Dispute | `file_dispute` / `DISPUTE_OPEN` | `get_dispute` | `test_file_dispute` | Studionet lifecycle |
| Web Ground-Truth Review | `adjudicate_dispute` / `gl.vm.run_nondet` | `get_dispute` | `test_adjudicate_breach` | Studionet consensus |
| Bond Slashing & Quarantine | `adjudicate_dispute` / `QUARANTINED` | `is_agent_healthy` | `test_slashing_and_quarantine` | Studionet state read |
| Withdraw Remediation Credit | `withdraw_credits` / `credits` | `get_credits` | `test_withdraw_credits` | Studionet balance delta |

## Analogue and differentiation matrix

| Analogue/prior idea | Similar dimensions | Structural difference | Collision decision |
| --- | --- | --- | --- |
| `IDEA-001` (SemanticInterfaceCovenant) | Both protect software/agent workflows | IDEA-001 judges API code breaking changes; AgentEfficacySLA judges runtime factual hallucination against live web truth | Distinct primitive |
| `IDEA-013` (TraceSettle) | Both resolve agentic failures | TraceSettle resolves multi-step DAG blame attribution; AgentEfficacySLA resolves qualitative SLA performance warranties | Distinct primitive |
| `IDEA-014` (SemanticPolicyQuorum) | Both use natural-language policy | SemanticPolicyQuorum pre-authorizes execution plans; AgentEfficacySLA resolves post-execution hallucination disputes | Distinct primitive |

## Deployment and evidence plan

- Network: GenLayer Studionet (`61999`, `https://studio.genlayer.com/api`).
- Actor separation: Primary wallet (`STUDIONET_PRIVATE_KEY`) as Client; secondary wallet (`STUDIONET_INTEGRATOR_PRIVATE_KEY`) as Provider.
- Lifecycle: 1. Deploy contract -> 2. Lock covenant (2 GEN) -> 3. File dispute (0.5 GEN) -> 4. Adjudicate -> 5. Settle & Withdraw (1 GEN).
- Evidence path: `agent-efficacy-sla/docs/evidence/studionet/deployment.json`.

## Definition of Done

- [x] Reusable Intelligent Contract primitive with project-specific class name.
- [x] Semantic validator judgment via `gl.vm.run_nondet` comparing meaning.
- [x] Direct consequence: Bond slashing, client credit, quarantine state.
- [x] Direct test suite covering happy path and adversarial branches.
- [x] Full multi-page frontend built with `ui-ux-pro-max` design system, persistent navigation, EIP-6963 wallet discovery, and zero simulated canonical state.
- [x] Studionet deployment with `Result: SUCCESS` and balance proof.
- [x] Production Vercel deployment with live HTTP 200 verification.

## Honest limitations

1. Contract judges factual correctness and qualitative compliance against public reference documents; it cannot inspect private proprietary weights.
2. Web fetching is bounded by GenVM network sandboxing and response length constraints.

## Kill criteria

If GenLayer multi-validator consensus over live web evidence is not required (e.g. if deterministic regex could verify hallucinations), terminate project immediately.
