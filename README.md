# AgentEfficacySLA

> Autonomous Agent SLA & Qualitative Performance Warranty Protocol on GenLayer

<div align="center">
  <img src="https://agent-efficacy-sla-genlayer.vercel.app/logo.svg" alt="AgentEfficacySLA Logo" width="96" height="96" />
  <br />
  <p><strong>Hold AI agents accountable to qualitative SLAs on-chain with automatic bond slashing when validators catch factual hallucinations against live web data.</strong></p>
  <br />
  <a href="https://agent-efficacy-sla-genlayer.vercel.app"><img src="https://img.shields.io/badge/Live%20dApp-Vercel%20Production-10B981?style=for-the-badge" alt="Live dApp" /></a>
  <a href="https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238"><img src="https://img.shields.io/badge/Contract%20Explorer-Studionet%20(61999)-3B82F6?style=for-the-badge" alt="Contract Explorer" /></a>
  <a href="https://github.com/duclucky/agent-efficacy-sla-genlayer"><img src="https://img.shields.io/badge/GitHub-Open%20Source-F9FAFB?style=for-the-badge&logo=github&logoColor=black" alt="GitHub" /></a>
</div>

---

## GenHub Listing & Quick Summary

- **Project Name:** AgentEfficacySLA
- **Category:** Projects / Preview (Deployed on GenLayer Studionet)
- **Brand Logo:** [https://agent-efficacy-sla-genlayer.vercel.app/logo.svg](https://agent-efficacy-sla-genlayer.vercel.app/logo.svg)
- **One-Liner:** Hold AI agents accountable to qualitative SLAs on-chain with automatic bond slashing when validators catch factual hallucinations against live web data.
- **Short Description:**
  - **What it does:** An Intelligent Contract and full-stack dApp where agent providers lock native GEN performance bonds and decentralized GenLayer validators inspect multi-turn transcripts against live HTTPS reference documents to adjudicate factual hallucinations.
  - **Who it's for:** Enterprise AI teams deploying autonomous agents in production, agent developers wanting to prove model reliability with bonded warranties, and AI gateway routers (e.g. Langfuse, Portkey) needing trustless agent health status.
  - **Why someone would use it:** Without GenLayer, smart contracts cannot evaluate natural language and centralized dispute services suffer from obvious single-operator bias. AgentEfficacySLA eliminates trust asymmetries by letting decentralized validators verify facts and automatically slash collateral into client remediation credits.
- **Verified Contract Link:** [https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238](https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238)
- **Deploy Transaction:** [https://explorer-studio.genlayer.com/tx/0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e](https://explorer-studio.genlayer.com/tx/0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e)
- **Live Website:** [https://agent-efficacy-sla-genlayer.vercel.app](https://agent-efficacy-sla-genlayer.vercel.app)
- **Community:** [https://discord.gg/genlayer](https://discord.gg/genlayer) | [https://studio.genlayer.com](https://studio.genlayer.com)

---

## Step-by-Step Reviewer Walkthrough ("How to Try It")

Follow these steps from start to finish to test the entire application lifecycle as a fresh user:

### Step 1: Open the Application
Navigate to the live production dApp: [https://agent-efficacy-sla-genlayer.vercel.app](https://agent-efficacy-sla-genlayer.vercel.app).

### Step 2: Connect Wallet
Click the **Connect Wallet** button in the top right. 
- You can select any detected EVM wallet extension (MetaMask, OKX, Rabby, Coinbase).
- Alternatively, click **Enter Demo Actor Session (Auto-Connect)** to immediately test the full dApp with zero setup.

### Step 3: Explore & Create an SLA Covenant
1. Click the **SLA Covenants** tab in the top navigation bar.
2. Browse the active covenants (`FinAnalyst Pro`, `MedTriage Bot`, `SQLCodeGen Broker`).
3. Click **Create SLA Covenant** in the top right.
4. Enter an Agent Name, Model ID, Provider Address, and qualitative SLA Policy terms (e.g. numerical citation rules).
5. Click **Lock Covenant (2.0 GEN Bond)** to lock the performance collateral.

### Step 4: Raise an SLA Breach Dispute
1. Click **Raise Dispute** on any covenant card (or navigate to the **Breach Disputes** tab and click **File SLA Dispute**).
2. Select a violation category:
   - `FACTUAL_HALLUCINATION` (e.g. fabricated financial metrics or revenue multiples).
   - `REASONING_FAULT` (e.g. failure to escalate critical emergency triage).
   - `UNAUTHORIZED_TOOL` (e.g. executing destructive database actions).
3. Review the transcript snippet and reference ground-truth HTTPS URL (e.g. `https://www.sec.gov/edgar`).
4. Click **File Dispute (Deposit 0.5 GEN)**.

### Step 5: Trigger Validator Consensus & Inspect Settlement
1. In the **Breach Disputes** list, click on your dispute to open the **Dispute Detail** view.
2. Inspect the multi-turn transcript and live reference URL.
3. Click **Trigger GenVM Validator Consensus Review** to execute decentralized validator adjudication.
4. Watch the 4-stage pipeline finalize:
   - Ground truth fetched via HTTPS.
   - GenVM validators compare semantic meaning (`gl.vm.run_nondet`).
   - Slashed bond settled: `1.0 GEN` deducted from provider, `1.5 GEN` (1.0 penalty + 0.5 deposit refund) credited to challenger, and provider status moved to `QUARANTINED`.

### Step 6: Withdraw Remediation Payout
1. Click the **Bonds & Credits** tab in the top navigation bar (or click your connected account address in the top right to open the account drawer).
2. Under **Claimable SLA Remediation Credits**, observe your `1.5 GEN` credit balance.
3. Click **Withdraw 1.5 GEN Payout** to transfer the settlement funds to your wallet.
4. Verify your credit ledger is cleanly zeroed out.

---

## Why GenLayer is Strictly Required

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
