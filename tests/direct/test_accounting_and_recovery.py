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

def test_withdraw_credits_happy_path(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    # Confirmed breach creates 1.50 GEN credit for client
    mock_reference_web(direct_vm)
    mock_llm_verdict(direct_vm, verdict="BREACH_CONFIRMED", category="FACTUAL_HALLUCINATION")

    direct_vm.sender = CLIENT_ADDR
    contract.adjudicate_dispute(disp_id)

    assert contract.get_credits(CLIENT_ADDR) == "1.50"

    # Withdraw credits
    direct_vm.sender = CLIENT_ADDR
    contract.withdraw_credits()

    # Credit ledger must be zeroed
    assert contract.get_credits(CLIENT_ADDR) == "0.00"

def test_withdraw_credits_rejects_zero_balance(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.sender = "0x1111111111111111111111111111111111111111"

    with pytest.raises(Exception, match="no credits available"):
        contract.withdraw_credits()

def test_provider_bond_replenishment_and_quarantine_clearance(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    # Trigger breach -> sets provider to QUARANTINED (bond becomes 1.0 GEN)
    mock_reference_web(direct_vm)
    mock_llm_verdict(direct_vm, verdict="BREACH_CONFIRMED")
    direct_vm.sender = CLIENT_ADDR
    contract.adjudicate_dispute(disp_id)

    assert contract.is_agent_healthy(PROVIDER_ADDR) is False

    # Provider deposits 1.0 GEN additional bond collateral
    direct_vm.sender = PROVIDER_ADDR
    direct_vm.value = 1 * GEN_SCALE
    contract.deposit_bond(cov_id)

    # Verify covenant bond replenished (1.0 + 1.0 = 2.0 GEN)
    cov = json.loads(contract.get_covenant(cov_id))
    assert cov["provider_bond"] == "2.00"
    assert cov["status"] == "ACTIVE"

    # Provider status restored to ACTIVE
    assert contract.is_agent_healthy(PROVIDER_ADDR) is True

def test_deposit_bond_rejects_zero_value(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)

    direct_vm.sender = PROVIDER_ADDR
    direct_vm.value = 0
    with pytest.raises(Exception, match="zero deposit amount"):
        contract.deposit_bond(cov_id)
