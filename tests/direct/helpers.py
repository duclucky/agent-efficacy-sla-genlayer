import json
from tests.direct.conftest import to_hex

CONTRACT_PATH = "contracts/agent_efficacy_sla.py"
GEN_SCALE = 10**18

CLIENT_ADDR = "0x71C83637e127394E9684C558F2e68449D0d7b21e"
PROVIDER_ADDR = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df"

def create_sample_covenant(
    contract,
    vm,
    client=CLIENT_ADDR,
    provider=PROVIDER_ADDR,
    covenant_id="cov-alpha-001",
    bond_amount=2 * GEN_SCALE
):
    vm.sender = client
    vm.value = bond_amount
    contract.create_covenant(
        covenant_id,
        provider,
        "FinAnalyst Pro",
        "openai/gpt-4o",
        "Agent must ground all numerical citations in official SEC 10-K filings.",
        "sec.gov"
    )
    contract_address = vm._contract_address
    current_balance = vm._balances.get(bytes(contract_address), 0)
    vm.deal(contract_address, current_balance + bond_amount)
    vm.value = 0
    return covenant_id

def file_sample_dispute(
    contract,
    vm,
    challenger=CLIENT_ADDR,
    covenant_id="cov-alpha-001",
    dispute_id="disp-101",
    deposit_amount=int(0.5 * GEN_SCALE)
):
    vm.sender = challenger
    vm.value = deposit_amount
    contract.file_dispute(
        dispute_id,
        covenant_id,
        "Agent cited 34.2% FY25 margin; actual filing says 14.8%.",
        "FACTUAL_HALLUCINATION",
        "https://www.sec.gov/edgar/sample-10k.html"
    )
    contract_address = vm._contract_address
    current_balance = vm._balances.get(bytes(contract_address), 0)
    vm.deal(contract_address, current_balance + deposit_amount)
    vm.value = 0
    return dispute_id

def mock_reference_web(vm, url_pattern=r".*sec\.gov.*", content="Acme Corp FY2025 Form 10-K Item 7: Net margin was 14.8% on total revenues of $820M."):
    vm.mock_web(
        url_pattern,
        {"method": "GET", "status": 200, "body": content}
    )

def mock_llm_verdict(vm, verdict="BREACH_CONFIRMED", category="FACTUAL_HALLUCINATION", rationale="Agent reported 34.2% margin which contradicted 14.8% in SEC filing."):
    payload = {
        "verdict": verdict,
        "violation_category": category,
        "rationale": rationale
    }
    vm.mock_llm(
        r".*decentralized factual SLA compliance validator.*",
        json.dumps(payload)
    )
