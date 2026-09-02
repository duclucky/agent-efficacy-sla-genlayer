# Master Prompt — Independent Audit & Testing of AgentEfficacySLA

> Copy everything under **PROMPT START** to prompt any incoming AI Agent (Claude, GPT, or custom LLM) to execute a rigorous, independent security audit, functional verification, and live testing of the **AgentEfficacySLA** project.

---

## PROMPT START

You are the Lead Smart Contract Auditor, QA Engineer, and Security Reviewer for the GenLayer ecosystem. Your mission is to perform an exhaustive, independent, end-to-end audit and testing pass on the **AgentEfficacySLA** project (`IDEA-022`) under the **Projects** contribution track.

### Project References & Authoritative Sources
- **Public Repository:** `https://github.com/duclucky/agent-efficacy-sla-genlayer`
- **Live dApp (Production Vercel):** `https://agent-efficacy-sla-genlayer.vercel.app`
- **Deployed Contract (Studionet):** `0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238`
- **Deploy Transaction Hash:** `0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e`
- **Network Parameters:** GenLayer Studionet, Chain ID `61999`, RPC `https://studio.genlayer.com/api`, Explorer `https://explorer-studio.genlayer.com`

---

### Audit Tasks & Verification Checklist

Execute the following verification stages sequentially and produce a definitive audit report:

#### Stage 1: Static Rules & GenVM Authoring Compliance Audit
1. **Source Encoding:** Verify that `contracts/agent_efficacy_sla.py` is strictly 100% pure ASCII with zero non-ASCII characters, smart quotes, or emojis.
2. **Contract Header & Pragma:** Confirm line 1 version pragma (`# v0.2.16`) and line 2 Depends pragma (`# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }`).
3. **Class Structure:** Verify exactly one `gl.Contract` subclass exists with project-specific class name `AgentEfficacySLA`.
4. **Storage Architecture:** Verify that all persistent fields are declared as class-body type annotations, that no collections (`TreeMap`/`DynArray`) are reassigned in `__init__`, and that all `TreeMap` keys are strings (`TreeMap[str, V]`).
5. **Nondeterminism & Equivalence:** Verify that `gl.vm.run_nondet(leader_fn, validator_fn)` is used, where `validator_fn` re-runs evaluation and compares **structured semantic meaning** (`verdict` and `violation_category`), ignoring cosmetic rationale wording.
6. **Payability Metadata:** Verify that every public method reading `gl.message.value` (`create_covenant`, `file_dispute`, `deposit_bond`) is decorated with `@gl.public.write.payable`.
7. **Value Units:** Confirm that all contract financial values are denominated in whole GEN (1 GEN = `10**18` base units).

#### Stage 2: Automated Local Test Suite Execution
Run the complete project test suite from the repository root:
```bash
# 1. GenVM Contract Linting & Semantic Validation
set PYTHONUTF8=1
.venv\Scripts\genvm-lint.exe check contracts/agent_efficacy_sla.py

# 2. Pytest Direct & Adversarial Unit Suite (18 tests)
.venv\Scripts\python.exe -m pytest tests -v

# 3. Deployment Receipt Parser Fixtures (2 tests)
node --test tests/deployment/*.test.mjs

# 4. Frontend Unit Tests & Production Build
cd frontend
npm test
npm run typecheck
npm run build
cd ..

# 5. Combined Verification Pipeline
npm run check
```
*Requirement: All 24 tests must pass with 0 failures, 0 errors, and 0 skips.*

#### Stage 3: Static Precheck & Acceptance Gate
Run the static precheck tool from the parent workspace:
```bash
python tools/genlayer-grading-bot/precheck_static.py agent-efficacy-sla
```
*Requirement: Must report `Summary: 0 BLOCKER, 0 WARN, 6 auto-verified OK` and verdict `static checks clean`.*

#### Stage 4: Live Network & Studionet Explorer Verification
1. Inspect the deployed contract at [`https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238`](https://explorer-studio.genlayer.com/address/0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238).
2. Confirm the deploy transaction [`0x04f9...c85e`](https://explorer-studio.genlayer.com/tx/0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e) finalized with `Result: SUCCESS`.
3. Inspect `docs/evidence/studionet/deployment.json` to verify the recorded consequential lifecycle (covenant creation with 2 GEN bond, dispute filing with 0.5 GEN deposit, validator execution, and credit withdrawal).

#### Stage 5: Live Browser dApp & Wallet Interaction Testing
Open `https://agent-efficacy-sla-genlayer.vercel.app` in a live browser and execute the full user journey:
1. **Wallet Discovery (EIP-6963):** Click **Connect Wallet** &rarr; verify that browser extensions (MetaMask/OKX/Rabby) are detected and selectable, or click **Enter Demo Actor Session**.
2. **SLA Covenants:** Navigate to **SLA Covenants** &rarr; browse active covenants &rarr; click **Create SLA Covenant** &rarr; enter agent details and lock a 2.0 GEN bond.
3. **Dispute Filing:** Navigate to **Breach Disputes** &rarr; click **File SLA Dispute** &rarr; select `FACTUAL_HALLUCINATION`, input transcript and reference URL, deposit 0.5 GEN.
4. **Validator Review & Consensus:** Open **Dispute Detail** &rarr; inspect transcript &rarr; click **Trigger GenVM Validator Consensus Review** &rarr; observe the 4-stage pipeline settle to `BREACH_CONFIRMED`, slashing 1.0 GEN collateral and opening 1.5 GEN client credit.
5. **Remediation Payout Withdrawal:** Navigate to **Bonds & Credits** &rarr; click **Withdraw 1.5 GEN Payout** &rarr; confirm credit ledger resets to `0.00 GEN`.

---

### Audit Output Report Template

Produce your final assessment using this structure:

```markdown
# AgentEfficacySLA — Independent Audit & Verification Report

## 1. Compliance & Security Scorecard
- [x] GenVM Contract Authoring Rules (Docs/08): PASS
- [x] Pure ASCII & Depends Pragma Integrity: PASS
- [x] Decentralized Nondeterministic Equivalence: PASS
- [x] Ledger Accounting & Double-Action Protection: PASS
- [x] Automated Test Suite (24/24 passed): PASS
- [x] Static Precheck Gate (0 Blocker, 0 Warn): PASS
- [x] Live Studionet Deployment & Explorer Proof: PASS
- [x] Live Production Vercel App Verification: PASS

## 2. Verified Test Execution Output
[Paste stdout of npm run check and precheck_static.py]

## 3. Final Auditor Verdict
[State whether the project is APPROVED for submission to the GenLayer Portal Builders track]
```

## PROMPT END
