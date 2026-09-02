from pathlib import Path
import ast

CONTRACT_PATH = Path("contracts/agent_efficacy_sla.py")

def test_contract_source_is_pure_ascii():
    assert CONTRACT_PATH.exists(), f"Contract file missing at {CONTRACT_PATH}"
    content = CONTRACT_PATH.read_bytes()
    try:
        content.decode("ascii")
    except UnicodeDecodeError as e:
        pytest.fail(f"Contract contains non-ASCII character at index {e.start}: {e}")

def test_contract_header_depends_pragma():
    text = CONTRACT_PATH.read_text(encoding="ascii")
    first_line = text.strip().splitlines()[0]
    assert first_line.startswith('# { "Depends": "py-genlayer:'), f"Invalid header: {first_line}"

def test_single_contract_subclass():
    text = CONTRACT_PATH.read_text(encoding="ascii")
    tree = ast.parse(text)
    contract_classes = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            for base in node.bases:
                if (isinstance(base, ast.Attribute) and base.attr == "Contract") or (isinstance(base, ast.Name) and base.id == "Contract"):
                    contract_classes.append(node.name)
    assert len(contract_classes) == 1, f"Expected 1 gl.Contract subclass, found: {contract_classes}"
    assert contract_classes[0] == "AgentEfficacySLA"

def test_payable_methods_have_payable_decorator():
    text = CONTRACT_PATH.read_text(encoding="ascii")
    tree = ast.parse(text)
    payable_methods = {"create_covenant", "file_dispute", "deposit_bond"}
    found_payable = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            for decorator in node.decorator_list:
                dec_str = ast.unparse(decorator)
                if "payable" in dec_str:
                    found_payable.add(node.name)

    assert payable_methods == found_payable, f"Expected payable methods {payable_methods}, found {found_payable}"
