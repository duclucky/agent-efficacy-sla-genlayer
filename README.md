# AgentEfficacySLA

> Autonomous Agent SLA & Qualitative Performance Warranty Protocol on GenLayer

[![GenLayer Studionet](https://img.shields.io/badge/Network-GenLayer%20Studionet-22C55E?style=flat-square)](https://studio.genlayer.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**AgentEfficacySLA** is an Intelligent Contract and full-stack decentralized application (dApp) deployed to GenLayer Studionet. It enables enterprise clients and autonomous AI agent providers to lock qualitative Service Level Agreements (SLAs) backed by native GEN performance bonds. When an agent hallucinates, cites fabricated domain entities, or violates critical escalation guidelines, GenLayer validators independently fetch live HTTPS ground truth to resolve the dispute and automatically slash provider collateral to fund client remediation credits.

---

## Live Deployment & Verification

- **Live Application:** [https://agent-efficacy-sla-genlayer.vercel.app](https://agent-efficacy-sla-genlayer.vercel.app)
- **Deployed Contract (Studionet):** [`0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238`](https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238)
- **Explorer URL:** [https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238](https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238)
- **Deploy Transaction:** [`0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e`](https://explorer-studio.genlayer.com/tx/0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e)

---

## Why GenLayer is Required

Traditional EVM smart contracts cannot inspect natural language or evaluate whether an AI model's output constitutes a **factual hallucination** against live web disclosures. Centralized dispute backends create severe trust asymmetries: enterprise clients want to claim false breaches to recover costs, while agent providers deny legitimate hallucinations to protect their collateral.

GenLayer resolves this through **decentralized multi-validator consensus over non-deterministic execution (`gl.vm.run_nondet`)**:
1. Multiple independent validators fetch authoritative reference URLs (e.g., SEC EDGAR, clinical guidelines, API docs) via HTTPS.
2. Validators evaluate multi-turn interaction transcripts against the retrieved reference facts using LLMs.
3. Validators reach consensus on structured meaning (`verdict` and `violation_category`), ignoring superficial prose differences.
4. Confirmed breaches deterministically slash 1.0 GEN from the provider's bond, credit the client ledger, and set the provider's status to `QUARANTINED`.

---

## 4-Step Protocol Lifecycle

1. **Lock SLA Covenant:** Enterprise client and agent provider lock qualitative performance rules on-chain backed by a 2.0 GEN provider performance bond.
2. **File Breach Dispute:** When an agent hallucinates, the client submits the interaction transcript, cites an authoritative HTTPS reference URL, and deposits 0.5 GEN.
3. **Validator Consensus Review:** GenVM validators fetch the live reference document, compare facts against the transcript, and reach majority consensus on fault.
4. **Slashing & Remediation:** A confirmed breach deducts 1.0 GEN from the provider bond, credits 1.5 GEN (1.0 penalty + 0.5 deposit refund) to the client, and quarantines the agent.

---

## Violation Taxonomy

- `FACTUAL_HALLUCINATION`: Fabricated numerical metrics, revenue multiples, or non-existent regulatory filings.
- `REASONING_FAULT`: Violation of mandatory clinical triage escalation or safety protocols.
- `UNAUTHORIZED_TOOL`: Invocation of destructive database/API tool actions without required human tokens.

---

## Project Structure

```text
agent-efficacy-sla/
├── contracts/
│   └── agent_efficacy_sla.py         # Pure ASCII GenVM Intelligent Contract
├── tests/
│   ├── direct/                       # Pytest unit & adversarial test suite
│   └── deployment/                   # Receipt parser fixture tests
├── frontend/                         # Vite + React multi-page web application
│   ├── src/
│   │   ├── components/               # Header, WalletModal (EIP-6963), AccountDrawer, StatCard
│   │   ├── pages/                    # Landing, Covenants, Disputes, Detail, Account, Guide
│   │   ├── context/                  # Web3 WalletContext with EIP-6963 auto-discovery
│   │   └── services/                 # Typed ContractAdapter wired to genlayer-js
│   └── package.json
├── scripts/
│   └── studionet.mjs                 # Deployment and consequential lifecycle automation
└── docs/
    ├── README.md                     # Complete formal specification & matrices
    └── evidence/studionet/           # Verified Studionet receipts and canonical reads
```

---

## Local Development & Testing

### 1. Prerequisites

- Python 3.12 with `.venv`
- Node.js v20+ and npm

### 2. Run Comprehensive Checks

```bash
# Run GenVM contract linter, direct tests, deployment tests, and frontend build
npm run check
```

### 3. Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

---

## License

MIT License. Built for the GenLayer Builders Points Program.
