import json
import pytest
from tests.direct.helpers import (
    CONTRACT_PATH,
    CLIENT_ADDR,
    PROVIDER_ADDR,
    GEN_SCALE,
    create_sample_covenant,
    file_sample_dispute,
)

def test_covenant_creation_happy_path(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)

    # Verify covenant view
    cov_json = contract.get_covenant(cov_id)
    cov = json.loads(cov_json)
    assert cov["id"] == cov_id
    assert cov["agent_name"] == "FinAnalyst Pro"
    assert cov["model_identifier"] == "openai/gpt-4o"
    assert cov["provider_bond"] == "2.00"
    assert cov["status"] == "ACTIVE"
    assert cov["dispute_count"] == 0

    # Verify provider status
    assert contract.is_agent_healthy(PROVIDER_ADDR) is True

    # Verify get_all_covenants
    all_covs = json.loads(contract.get_all_covenants())
    assert len(all_covs) == 1
    assert all_covs[0]["id"] == cov_id

def test_covenant_creation_rejects_duplicate_id(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm, covenant_id="cov-dup-1")

    direct_vm.sender = CLIENT_ADDR
    direct_vm.value = 2 * GEN_SCALE
    with pytest.raises(Exception, match="covenant ID already exists"):
        contract.create_covenant(
            cov_id,
            PROVIDER_ADDR,
            "Duplicate Agent",
            "openai/gpt-4o",
            "SLA terms",
            "sec.gov"
        )

def test_covenant_creation_rejects_insufficient_bond(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.sender = CLIENT_ADDR
    direct_vm.value = int(0.5 * GEN_SCALE) # Less than 1 GEN
    with pytest.raises(Exception, match="insufficient provider bond deposit"):
        contract.create_covenant(
            "cov-low-bond",
            PROVIDER_ADDR,
            "Low Bond Agent",
            "openai/gpt-4o",
            "SLA terms",
            "sec.gov"
        )

def test_file_dispute_happy_path(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    disp_id = file_sample_dispute(contract, direct_vm, covenant_id=cov_id)

    # Verify dispute view
    disp_json = contract.get_dispute(disp_id)
    disp = json.loads(disp_json)
    assert disp["id"] == disp_id
    assert disp["covenant_id"] == cov_id
    assert disp["claimed_violation"] == "FACTUAL_HALLUCINATION"
    assert disp["status"] == "OPEN"
    assert disp["verdict"] == "PENDING"
    assert disp["challenger_deposit"] == "0.50"

    # Verify covenant dispute count updated
    cov = json.loads(contract.get_covenant(cov_id))
    assert cov["dispute_count"] == 1

    # Verify get_all_disputes
    all_disps = json.loads(contract.get_all_disputes())
    assert len(all_disps) == 1
    assert all_disps[0]["id"] == disp_id

def test_file_dispute_rejects_nonexistent_covenant(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.sender = CLIENT_ADDR
    direct_vm.value = int(0.5 * GEN_SCALE)
    with pytest.raises(Exception, match="covenant does not exist"):
        contract.file_dispute(
            "disp-err",
            "cov-nonexistent",
            "transcript snippet",
            "FACTUAL_HALLUCINATION",
            "https://sec.gov"
        )

def test_file_dispute_rejects_insufficient_deposit(direct_deploy, direct_vm):
    contract = direct_deploy(CONTRACT_PATH)
    cov_id = create_sample_covenant(contract, direct_vm)
    direct_vm.sender = CLIENT_ADDR
    direct_vm.value = int(0.01 * GEN_SCALE) # Less than 0.1 GEN
    with pytest.raises(Exception, match="insufficient challenge deposit"):
        contract.file_dispute(
            "disp-low-deposit",
            cov_id,
            "transcript snippet",
            "FACTUAL_HALLUCINATION",
            "https://sec.gov"
        )
