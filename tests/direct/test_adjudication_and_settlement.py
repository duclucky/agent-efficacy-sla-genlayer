import json
import pytest
from tests.direct.helpers import (
    CONTRACT_PATH,
    CLIENT_ADDR,
    PROVIDER_ADDR,
    GEN_SCALE,
    create_sample_covenant,
    file_sample_dispute,
    mock_reference_web,
    mock_llm_verdict,
)

def test_adjudication_breach_confirmed(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    # Setup web and LLM mocks for factual breach
    mock_reference_web(direct_vm, r".*sec\.gov.*", "Acme Corp FY2025 Form 10-K Item 7: Net margin was 14.8% on total revenues of $820M.")
    mock_llm_verdict(
        direct_vm,
        verdict="BREACH_CONFIRMED",
        category="FACTUAL_HALLUCINATION",
        rationale="Agent reported 34.2% margin which contradicted 14.8% in SEC filing."
    )

    # Trigger adjudication
    direct_vm.sender = CLIENT_ADDR
    contract.adjudicate_dispute(disp_id)

    # Verify dispute state
    disp_json = contract.get_dispute(disp_id)
    disp = json.loads(disp_json)
    assert disp["status"] == "BREACH_CONFIRMED"
    assert disp["verdict"] == "BREACH_CONFIRMED"
    assert disp["violation_category"] == "FACTUAL_HALLUCINATION"
    assert disp["settlement_payout"] == "1.00"

    # Verify provider bond slashed (2.0 -> 1.0 GEN)
    cov_json = contract.get_covenant(cov_id)
    cov = json.loads(cov_json)
    assert cov["provider_bond"] == "1.00"
    assert cov["status"] == "QUARANTINED"

    # Verify provider quarantined in registry
    assert contract.is_agent_healthy(PROVIDER_ADDR) is False

    # Verify challenger credit ledger (1.0 GEN penalty + 0.5 GEN deposit = 1.50 GEN)
    credits = contract.get_credits(CLIENT_ADDR)
    assert credits == "1.50"

def test_adjudication_no_breach_forfeits_deposit_to_provider(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    # Setup web and LLM mocks for grounded conformant output
    mock_reference_web(direct_vm, r".*sec\.gov.*", "Acme Corp FY2025 Form 10-K Item 7: Net margin was 14.8% on total revenues of $820M.")
    mock_llm_verdict(
        direct_vm,
        verdict="NO_BREACH",
        category="NONE",
        rationale="Agent statement is faithful to SEC disclosure."
    )

    # Trigger adjudication
    direct_vm.sender = CLIENT_ADDR
    contract.adjudicate_dispute(disp_id)

    # Verify dispute state
    disp_json = contract.get_dispute(disp_id)
    disp = json.loads(disp_json)
    assert disp["status"] == "NO_BREACH"
    assert disp["verdict"] == "NO_BREACH"
    assert disp["settlement_payout"] == "0.00"

    # Provider bond untouched (2.0 GEN) and remains healthy
    cov = json.loads(contract.get_covenant(cov_id))
    assert cov["provider_bond"] == "2.00"
    assert cov["status"] == "ACTIVE"
    assert contract.is_agent_healthy(PROVIDER_ADDR) is True

    # Provider receives challenger deposit (0.50 GEN)
    prov_credits = contract.get_credits(PROVIDER_ADDR)
    assert prov_credits == "0.50"

def test_adjudication_unverifiable_refunds_challenger(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    # Mock web outage / unreachable reference
    direct_vm.mock_web(r".*sec\.gov.*", {"method": "GET", "status": 500, "body": ""})

    # Trigger adjudication
    direct_vm.sender = CLIENT_ADDR
    contract.adjudicate_dispute(disp_id)

    # Verify dispute state
    disp = json.loads(contract.get_dispute(disp_id))
    assert disp["status"] == "UNVERIFIABLE"
    assert disp["verdict"] == "UNVERIFIABLE"

    # Challenger deposit (0.50 GEN) refunded without penalty
    client_credits = contract.get_credits(CLIENT_ADDR)
    assert client_credits == "0.50"

    # Provider bond untouched
    cov = json.loads(contract.get_covenant(cov_id))
    assert cov["provider_bond"] == "2.00"

def test_adjudication_rejects_duplicate_call(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    mock_reference_web(direct_vm)
    mock_llm_verdict(direct_vm, verdict="NO_BREACH", category="NONE")

    direct_vm.sender = CLIENT_ADDR
    contract.adjudicate_dispute(disp_id)

    # Second adjudication call must revert
    with pytest.raises(Exception, match="dispute already finalized"):
        contract.adjudicate_dispute(disp_id)
