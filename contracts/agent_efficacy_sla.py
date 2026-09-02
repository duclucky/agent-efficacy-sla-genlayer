# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import json
from dataclasses import dataclass
from genlayer import *

# Contract: AgentEfficacySLA
# Autonomous Agent SLA and Qualitative Performance Warranty Protocol
# Strictly pure ASCII source code for GenVM schema compatibility

def _as_address(account: Address) -> Address:
    if hasattr(account, "as_bytes"):
        return account
    return Address(account)

def _addr_str(addr: Address) -> str:
    try:
        return addr.as_hex
    except Exception:
        return str(addr)

def _sender() -> Address:
    try:
        return gl.message.sender_address
    except Exception:
        return gl.message.sender

@gl.evm.contract_interface
class _EoaRecipient:
    class View:
        pass
    class Write:
        pass

@allow_storage
@dataclass
class CovenantRecord:
    covenant_id: str
    client: Address
    provider: Address
    agent_name: str
    model_identifier: str
    sla_policy_text: str
    reference_domain: str
    provider_bond: bigint
    status: str
    created_at: u64
    dispute_count: u32

@allow_storage
@dataclass
class DisputeRecord:
    dispute_id: str
    covenant_id: str
    challenger: Address
    transcript_snippet: str
    claimed_violation: str
    reference_source_url: str
    challenger_deposit: bigint
    status: str
    verdict: str
    violation_category: str
    rationale: str
    settlement_payout: bigint
    created_at: u64
    finalized_at: u64

class AgentEfficacySLA(gl.Contract):
    covenants: TreeMap[str, CovenantRecord]
    disputes: TreeMap[str, DisputeRecord]
    credits: TreeMap[str, bigint]
    provider_status: TreeMap[str, str]
    covenant_keys: DynArray[str]
    dispute_keys: DynArray[str]
    total_received: bigint
    total_withdrawn: bigint

    def __init__(self) -> None:
        pass

    @gl.public.write.payable
    def create_covenant(
        self,
        covenant_id: str,
        provider: Address,
        agent_name: str,
        model_identifier: str,
        sla_policy_text: str,
        reference_domain: str,
    ) -> None:
        if covenant_id in self.covenants:
            raise gl.vm.UserError("covenant ID already exists")
        if len(covenant_id) == 0 or len(agent_name) == 0 or len(sla_policy_text) == 0:
            raise gl.vm.UserError("invalid covenant parameters")

        # Minimum bond is 1 GEN (10**18 base units)
        min_bond = bigint(1000000000000000000)
        received_val = bigint(gl.message.value)
        if received_val < min_bond:
            raise gl.vm.UserError("insufficient provider bond deposit")

        client_addr = _as_address(_sender())
        provider_addr = _as_address(provider)

        cov = CovenantRecord(
            covenant_id=covenant_id,
            client=client_addr,
            provider=provider_addr,
            agent_name=agent_name,
            model_identifier=model_identifier,
            sla_policy_text=sla_policy_text,
            reference_domain=reference_domain,
            provider_bond=received_val,
            status="ACTIVE",
            created_at=u64(0),
            dispute_count=u32(0),
        )

        self.covenants[covenant_id] = cov
        self.covenant_keys.append(covenant_id)

        prov_key = _addr_str(provider_addr)
        if prov_key not in self.provider_status:
            self.provider_status[prov_key] = "ACTIVE"

        self.total_received = self.total_received + received_val

    @gl.public.write.payable
    def file_dispute(
        self,
        dispute_id: str,
        covenant_id: str,
        transcript_snippet: str,
        claimed_violation: str,
        reference_source_url: str,
    ) -> None:
        if dispute_id in self.disputes:
            raise gl.vm.UserError("dispute ID already exists")
        if covenant_id not in self.covenants:
            raise gl.vm.UserError("covenant does not exist")

        cov = self.covenants[covenant_id]
        if cov.status == "CLOSED":
            raise gl.vm.UserError("covenant is closed")

        if len(transcript_snippet) == 0 or len(reference_source_url) == 0:
            raise gl.vm.UserError("empty transcript or reference URL")

        # Minimum challenger deposit is 0.1 GEN
        min_deposit = bigint(100000000000000000)
        deposit_val = bigint(gl.message.value)
        if deposit_val < min_deposit:
            raise gl.vm.UserError("insufficient challenge deposit")

        challenger_addr = _as_address(_sender())
        dispute = DisputeRecord(
            dispute_id=dispute_id,
            covenant_id=covenant_id,
            challenger=challenger_addr,
            transcript_snippet=transcript_snippet,
            claimed_violation=claimed_violation,
            reference_source_url=reference_source_url,
            challenger_deposit=deposit_val,
            status="OPEN",
            verdict="PENDING",
            violation_category="NONE",
            rationale="Dispute opened. Awaiting validator quorum adjudication.",
            settlement_payout=bigint(0),
            created_at=u64(0),
            finalized_at=u64(0),
        )

        self.disputes[dispute_id] = dispute
        self.dispute_keys.append(dispute_id)
        cov.dispute_count = cov.dispute_count + u32(1)
        self.covenants[covenant_id] = cov
        self.total_received = self.total_received + deposit_val

    @gl.public.write
    def adjudicate_dispute(self, dispute_id: str) -> None:
        if dispute_id not in self.disputes:
            raise gl.vm.UserError("dispute not found")

        dispute = self.disputes[dispute_id]
        if dispute.status != "OPEN" and dispute.status != "EVALUATING":
            raise gl.vm.UserError("dispute already finalized")

        covenant = self.covenants[dispute.covenant_id]
        policy = covenant.sla_policy_text
        transcript = dispute.transcript_snippet
        ref_url = dispute.reference_source_url
        claimed_cat = dispute.claimed_violation

        # Non-deterministic review block
        def leader_fn():
            try:
                page_text = gl.nondet.web.render(ref_url, mode="text")
            except Exception:
                page_text = "UNAVAILABLE"

            if page_text == "UNAVAILABLE" or len(page_text) == 0:
                return {
                    "verdict": "UNVERIFIABLE",
                    "violation_category": "NONE",
                    "rationale": "Reference URL was unreachable or empty.",
                }

            prompt = (
                f"You are a decentralized factual SLA compliance validator.\n"
                f"SLA Policy Terms:\n{policy}\n\n"
                f"Agent Interaction Transcript:\n{transcript}\n\n"
                f"Claimed Violation: {claimed_cat}\n\n"
                f"Authoritative Ground-Truth Reference Document Content:\n{page_text[:4000]}\n\n"
                f"Task:\n"
                f"1. Compare the agent statements in the transcript against the authoritative reference text.\n"
                f"2. If the agent stated fabricated numerical facts, non-existent items, or violated mandatory escalation rules, verdict is 'BREACH_CONFIRMED'.\n"
                f"3. If the agent statements are grounded, conformant, or an acceptable paraphrase, verdict is 'NO_BREACH'.\n"
                f"4. If reference text does not cover the claim topic, verdict is 'UNVERIFIABLE'.\n\n"
                f"Respond ONLY in valid JSON with keys:\n"
                f'{{"verdict": "BREACH_CONFIRMED"|"NO_BREACH"|"UNVERIFIABLE", "violation_category": "FACTUAL_HALLUCINATION"|"REASONING_FAULT"|"UNAUTHORIZED_TOOL"|"NONE", "rationale": "<concise explanation>"}}'
            )

            res = gl.nondet.exec_prompt(prompt, response_format="json")
            if isinstance(res, str):
                try:
                    res = json.loads(res)
                except Exception:
                    return {
                        "verdict": "UNVERIFIABLE",
                        "violation_category": "NONE",
                        "rationale": "Model response was not valid JSON.",
                    }
            return res

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            leader = leader_res.calldata
            if not isinstance(leader, dict):
                return False

            my_res = leader_fn()
            if not isinstance(my_res, dict):
                return False

            # Semantic equivalence: Compare critical verdict and category
            return (
                my_res.get("verdict") == leader.get("verdict") and
                my_res.get("violation_category") == leader.get("violation_category")
            )

        result = gl.vm.run_nondet(leader_fn, validator_fn)
        verdict = result.get("verdict", "UNVERIFIABLE")
        category = result.get("violation_category", "NONE")
        rationale = result.get("rationale", "Adjudicated by GenLayer validators.")

        if verdict not in ("BREACH_CONFIRMED", "NO_BREACH", "UNVERIFIABLE"):
            verdict = "UNVERIFIABLE"
            category = "NONE"

        self._apply_settlement(dispute_id, verdict, category, rationale)

    def _apply_settlement(
        self,
        dispute_id: str,
        verdict: str,
        category: str,
        rationale: str
    ) -> None:
        dispute = self.disputes[dispute_id]
        covenant = self.covenants[dispute.covenant_id]
        challenger_key = _addr_str(dispute.challenger)
        provider_key = _addr_str(covenant.provider)

        # 1 GEN penalty base units
        one_gen = bigint(1000000000000000000)

        if verdict == "BREACH_CONFIRMED":
            dispute.status = "BREACH_CONFIRMED"
            dispute.verdict = "BREACH_CONFIRMED"
            dispute.violation_category = category
            dispute.rationale = rationale

            # Settle penalty from provider bond to challenger
            slash_amount = one_gen
            if covenant.provider_bond < slash_amount:
                slash_amount = covenant.provider_bond

            covenant.provider_bond = covenant.provider_bond - slash_amount
            dispute.settlement_payout = slash_amount

            # Challenger receives slashed bond + full deposit refund
            total_credit = slash_amount + dispute.challenger_deposit
            challenger_credit = self.credits[challenger_key] if challenger_key in self.credits else bigint(0)
            self.credits[challenger_key] = challenger_credit + total_credit

            # Set provider to QUARANTINED
            self.provider_status[provider_key] = "QUARANTINED"
            covenant.status = "QUARANTINED"

        elif verdict == "NO_BREACH":
            dispute.status = "NO_BREACH"
            dispute.verdict = "NO_BREACH"
            dispute.violation_category = "NONE"
            dispute.rationale = rationale
            dispute.settlement_payout = bigint(0)

            # Forfeit challenger deposit to provider credit
            prov_credit = self.credits[provider_key] if provider_key in self.credits else bigint(0)
            self.credits[provider_key] = prov_credit + dispute.challenger_deposit

        else: # UNVERIFIABLE
            dispute.status = "UNVERIFIABLE"
            dispute.verdict = "UNVERIFIABLE"
            dispute.violation_category = "NONE"
            dispute.rationale = rationale
            dispute.settlement_payout = bigint(0)

            # Refund challenger deposit without penalty
            challenger_credit = self.credits[challenger_key] if challenger_key in self.credits else bigint(0)
            self.credits[challenger_key] = challenger_credit + dispute.challenger_deposit

        self.disputes[dispute_id] = dispute
        self.covenants[dispute.covenant_id] = covenant

    @gl.public.write
    def withdraw_credits(self) -> None:
        caller = _as_address(_sender())
        key = _addr_str(caller)
        if key not in self.credits:
            raise gl.vm.UserError("no credits available")

        amount = self.credits[key]
        if amount <= bigint(0):
            raise gl.vm.UserError("credit balance is zero")

        # Zero ledger before external transfer
        self.credits[key] = bigint(0)
        self.total_withdrawn = self.total_withdrawn + amount

        # Transfer out to EOA recipient
        _EoaRecipient(caller).emit_transfer(value=u256(amount))

    @gl.public.write.payable
    def deposit_bond(self, covenant_id: str) -> None:
        if covenant_id not in self.covenants:
            raise gl.vm.UserError("covenant not found")

        received = bigint(gl.message.value)
        if received <= bigint(0):
            raise gl.vm.UserError("zero deposit amount")

        cov = self.covenants[covenant_id]
        cov.provider_bond = cov.provider_bond + received

        # If bond replenished, restore ACTIVE status
        if cov.provider_bond >= bigint(1000000000000000000):
            cov.status = "ACTIVE"
            self.provider_status[_addr_str(cov.provider)] = "ACTIVE"

        self.covenants[covenant_id] = cov
        self.total_received = self.total_received + received

    # ---------------------------------------------------------
    # View Methods
    # ---------------------------------------------------------

    @gl.public.view
    def get_covenant(self, covenant_id: str) -> str:
        if covenant_id not in self.covenants:
            return "{}"
        cov = self.covenants[covenant_id]
        bond_gen = float(int(cov.provider_bond)) / 1e18
        data = {
            "id": cov.covenant_id,
            "client": _addr_str(cov.client),
            "provider": _addr_str(cov.provider),
            "agent_name": cov.agent_name,
            "model_identifier": cov.model_identifier,
            "sla_policy_text": cov.sla_policy_text,
            "reference_domain": cov.reference_domain,
            "provider_bond": f"{bond_gen:.2f}",
            "status": cov.status,
            "dispute_count": int(cov.dispute_count),
        }
        return json.dumps(data)

    @gl.public.view
    def get_dispute(self, dispute_id: str) -> str:
        if dispute_id not in self.disputes:
            return "{}"
        disp = self.disputes[dispute_id]
        dep_gen = float(int(disp.challenger_deposit)) / 1e18
        pay_gen = float(int(disp.settlement_payout)) / 1e18
        data = {
            "id": disp.dispute_id,
            "covenant_id": disp.covenant_id,
            "challenger": _addr_str(disp.challenger),
            "transcript_snippet": disp.transcript_snippet,
            "claimed_violation": disp.claimed_violation,
            "reference_source_url": disp.reference_source_url,
            "challenger_deposit": f"{dep_gen:.2f}",
            "status": disp.status,
            "verdict": disp.verdict,
            "violation_category": disp.violation_category,
            "rationale": disp.rationale,
            "settlement_payout": f"{pay_gen:.2f}",
        }
        return json.dumps(data)

    @gl.public.view
    def get_credits(self, account: Address) -> str:
        account_addr = _as_address(account)
        key = _addr_str(account_addr)
        if key not in self.credits:
            return "0.00"
        amount_gen = float(int(self.credits[key])) / 1e18
        return f"{amount_gen:.2f}"

    @gl.public.view
    def is_agent_healthy(self, provider: Address) -> bool:
        prov_addr = _as_address(provider)
        key = _addr_str(prov_addr)
        if key not in self.provider_status:
            return True
        return self.provider_status[key] == "ACTIVE"

    @gl.public.view
    def get_all_covenants(self) -> str:
        res = []
        for i in range(len(self.covenant_keys)):
            k = self.covenant_keys[i]
            if k in self.covenants:
                cov = self.covenants[k]
                bond_gen = float(int(cov.provider_bond)) / 1e18
                res.append({
                    "id": cov.covenant_id,
                    "client": _addr_str(cov.client),
                    "provider": _addr_str(cov.provider),
                    "agentName": cov.agent_name,
                    "modelIdentifier": cov.model_identifier,
                    "slaPolicyText": cov.sla_policy_text,
                    "referenceDomain": cov.reference_domain,
                    "providerBond": f"{bond_gen:.1f}",
                    "status": cov.status,
                    "createdAt": 0,
                    "totalDisputesCount": int(cov.dispute_count),
                })
        return json.dumps(res)

    @gl.public.view
    def get_all_disputes(self) -> str:
        res = []
        for i in range(len(self.dispute_keys)):
            k = self.dispute_keys[i]
            if k in self.disputes:
                disp = self.disputes[k]
                cov_name = "Autonomous Agent"
                if disp.covenant_id in self.covenants:
                    cov_name = self.covenants[disp.covenant_id].agent_name
                dep_gen = float(int(disp.challenger_deposit)) / 1e18
                pay_gen = float(int(disp.settlement_payout)) / 1e18
                res.append({
                    "id": disp.dispute_id,
                    "covenantId": disp.covenant_id,
                    "agentName": cov_name,
                    "challenger": _addr_str(disp.challenger),
                    "transcriptSnippet": disp.transcript_snippet,
                    "claimedViolation": disp.claimed_violation,
                    "referenceSourceUrl": disp.reference_source_url,
                    "challengerDeposit": f"{dep_gen:.1f}",
                    "status": disp.status,
                    "verdict": disp.verdict if disp.verdict != "PENDING" else None,
                    "violationCategory": disp.violation_category,
                    "rationale": disp.rationale,
                    "settlementPayout": f"{pay_gen:.1f}",
                    "createdAt": 0,
                })
        return json.dumps(res)
