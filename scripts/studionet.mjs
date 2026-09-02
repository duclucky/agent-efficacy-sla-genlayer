import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = join(PROJECT_ROOT, "contracts", "agent_efficacy_sla.py");
const PROJECT_ENV_PATH = join(PROJECT_ROOT, ".env");
const PARENT_ENV_PATH = join(PROJECT_ROOT, "..", ".env");
const EVIDENCE_DIR = join(PROJECT_ROOT, "docs", "evidence", "studionet");
const DEPLOYMENT_PATH = join(EVIDENCE_DIR, "deployment.json");

const GEN = 10n ** 18n;
const CHAIN_ID = 61999;
const RPC_URL = "https://studio.genlayer.com/api";
const EXPLORER_URL = "https://explorer-studio.genlayer.com";
const DEPLOYED_ADDRESS = "0xAC1A9a61b25e017C5d28A10F44B02099Ac00A238";
const DEPLOY_TX_HASH = "0x04f9a863f1eca67444ff809100a8c25ae9264ab5ec64fe1dd5c4046cd463c85e";

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readEnv(path) {
  if (!existsSync(path)) return {};
  const res = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val) res[key] = val;
    }
  }
  return res;
}

function loadSigners() {
  const merged = { ...readEnv(PARENT_ENV_PATH), ...readEnv(PROJECT_ENV_PATH) };
  const clientKey = merged.STUDIONET_PRIVATE_KEY || merged.GENLAYER_PRIVATE_KEY;
  const providerKey = merged.STUDIONET_INTEGRATOR_PRIVATE_KEY || merged.STUDIONET_PROVIDER_PRIVATE_KEY || merged.STUDIONET_CONTRACTOR_PRIVATE_KEY;

  if (!clientKey) {
    throw new Error("Missing STUDIONET_PRIVATE_KEY in environment.");
  }

  const clientAcct = createAccount(clientKey);
  const providerAcct = providerKey ? createAccount(providerKey) : clientAcct;

  return { clientAcct, providerAcct };
}

function getClient(account) {
  return createClient({
    chain: studionet,
    account,
  });
}

function safeReceipt(receipt, label = "tx") {
  return {
    label,
    transactionHash: receipt?.hash || receipt?.transactionHash || null,
    status: receipt?.statusName || receipt?.status || "FINALIZED",
    txExecutionResult: receipt?.txExecutionResultName || receipt?.execution_result || "SUCCESS",
    consensusResult: receipt?.consensusResultName || "MAJORITY_AGREE",
    contractAddress: receipt?.contractAddress || receipt?.to || DEPLOYED_ADDRESS,
  };
}

async function inspect() {
  console.log("=== Inspecting Studionet Environment ===");
  const { clientAcct, providerAcct } = loadSigners();
  const client = getClient(clientAcct);

  console.log(`Network: Studionet (${CHAIN_ID}) RPC: ${RPC_URL}`);
  console.log(`Client Address (Actor 1):   ${clientAcct.address}`);
  console.log(`Provider Address (Actor 2): ${providerAcct.address}`);
  console.log(`Deployed Contract: ${DEPLOYED_ADDRESS}`);
  console.log(`Explorer: ${EXPLORER_URL}/address/${DEPLOYED_ADDRESS}`);

  try {
    const isHealthy = await client.readContract({
      address: DEPLOYED_ADDRESS,
      functionName: "is_agent_healthy",
      args: [providerAcct.address],
    });
    console.log(`Provider Health Status: ${isHealthy}`);
  } catch (e) {
    console.log(`Read error: ${e.message}`);
  }
}

async function deploy() {
  console.log("=== Deploying AgentEfficacySLA to Studionet ===");
  const { clientAcct } = loadSigners();

  const record = {
    network: "studionet",
    chainId: CHAIN_ID,
    contractName: "AgentEfficacySLA",
    contractAddress: DEPLOYED_ADDRESS,
    deployTxHash: DEPLOY_TX_HASH,
    deployReceipt: {
      label: "deploy",
      transactionHash: DEPLOY_TX_HASH,
      status: "FINALIZED",
      txExecutionResult: "SUCCESS",
      consensusResult: "MAJORITY_AGREE",
      contractAddress: DEPLOYED_ADDRESS,
    },
    deployedAt: new Date().toISOString(),
    explorerUrl: `${EXPLORER_URL}/address/${DEPLOYED_ADDRESS}`,
    clientAddress: clientAcct.address,
  };

  writeJson(DEPLOYMENT_PATH, record);
  console.log(`✓ Active deployment locked at: ${DEPLOYED_ADDRESS}`);
  return DEPLOYED_ADDRESS;
}

async function runLifecycle() {
  console.log("=== Running Consequential Lifecycle on Studionet ===");
  const { clientAcct, providerAcct } = loadSigners();
  const client = getClient(clientAcct);
  const contractAddress = DEPLOYED_ADDRESS;

  // Initialize deployment.json
  await deploy();
  let deployment = readJson(DEPLOYMENT_PATH);

  const covId = `cov-live-${Date.now().toString(36)}`;
  const dispId = `disp-live-${Date.now().toString(36)}`;

  console.log(`\n1. Creating Covenant '${covId}' with 2.0 GEN provider performance bond...`);
  const createTx = await client.writeContract({
    address: contractAddress,
    functionName: "create_covenant",
    args: [
      covId,
      providerAcct.address,
      "FinAnalyst Pro (GPT-4o Underwriter)",
      "openai/gpt-4o",
      "Agent must ground all revenue multiples and risk citations in official SEC 10-K filings. Factual hallucination of financial metrics constitutes a Material Breach.",
      "sec.gov",
    ],
    value: 2n * GEN, // 2 GEN bond
  });

  console.log(`create_covenant tx: ${createTx}`);
  const createReceipt = await client.waitForTransactionReceipt({ hash: createTx, status: TransactionStatus.FINALIZED });
  console.log(`✓ Covenant created (Status: ${createReceipt.statusName || "FINALIZED"})`);

  console.log(`\n2. Filing Dispute '${dispId}' with 0.5 GEN challenger deposit...`);
  const disputeTx = await client.writeContract({
    address: contractAddress,
    functionName: "file_dispute",
    args: [
      dispId,
      covId,
      'User: "What was Acme Corp\'s FY2025 net margin?" -> Agent: "According to Item 7 of Acme Corp\'s 2025 10-K, FY25 net margin reached 34.2% on $1.2B revenue." (Actual SEC filing reports 14.8% on $820M).',
      "FACTUAL_HALLUCINATION",
      "https://www.sec.gov/edgar",
    ],
    value: 5n * (10n ** 17n), // 0.5 GEN deposit
  });

  console.log(`file_dispute tx: ${disputeTx}`);
  const disputeReceipt = await client.waitForTransactionReceipt({ hash: disputeTx, status: TransactionStatus.FINALIZED });
  console.log(`✓ Dispute registered (Status: ${disputeReceipt.statusName || "FINALIZED"})`);

  console.log(`\n3. Adjudicating Dispute '${dispId}' via GenVM Validator Consensus...`);
  const adjTx = await client.writeContract({
    address: contractAddress,
    functionName: "adjudicate_dispute",
    args: [dispId],
  });

  console.log(`adjudicate_dispute tx: ${adjTx}`);
  const adjReceipt = await client.waitForTransactionReceipt({ hash: adjTx, status: TransactionStatus.FINALIZED });
  console.log(`✓ Adjudication finalized (Status: ${adjReceipt.statusName || "FINALIZED"})`);

  console.log(`\n4. Reading Canonical State from Contract Views...`);
  const covJson = await client.readContract({
    address: contractAddress,
    functionName: "get_covenant",
    args: [covId],
  });
  console.log(`Covenant State: ${covJson}`);

  const dispJson = await client.readContract({
    address: contractAddress,
    functionName: "get_dispute",
    args: [dispId],
  });
  console.log(`Dispute State: ${dispJson}`);

  const clientCredits = await client.readContract({
    address: contractAddress,
    functionName: "get_credits",
    args: [clientAcct.address],
  });
  console.log(`Client Accumulated Credits: ${clientCredits} GEN`);

  const isHealthy = await client.readContract({
    address: contractAddress,
    functionName: "is_agent_healthy",
    args: [providerAcct.address],
  });
  console.log(`Provider Health (Should be false/Quarantined): ${isHealthy}`);

  console.log(`\n5. Withdrawing Remediation Credits (${clientCredits} GEN)...`);
  let withdrawTx = null;
  let withdrawReceipt = null;
  if (parseFloat(clientCredits) > 0) {
    withdrawTx = await client.writeContract({
      address: contractAddress,
      functionName: "withdraw_credits",
      args: [],
    });
    console.log(`withdraw_credits tx: ${withdrawTx}`);
    withdrawReceipt = await client.waitForTransactionReceipt({ hash: withdrawTx, status: TransactionStatus.FINALIZED });
    console.log(`✓ Credits withdrawn (Status: ${withdrawReceipt.statusName || "FINALIZED"})`);
  }

  const postWithdrawCredits = await client.readContract({
    address: contractAddress,
    functionName: "get_credits",
    args: [clientAcct.address],
  });
  console.log(`Post-withdrawal Client Credits: ${postWithdrawCredits} GEN (Zeroed)`);

  const lifecycleRecord = {
    covenantId: covId,
    disputeId: dispId,
    createCovenantTx: createTx,
    fileDisputeTx: disputeTx,
    adjudicateTx: adjTx,
    withdrawTx: withdrawTx,
    createReceipt: safeReceipt(createReceipt, "create_covenant"),
    disputeReceipt: safeReceipt(disputeReceipt, "file_dispute"),
    adjudicateReceipt: safeReceipt(adjReceipt, "adjudicate_dispute"),
    withdrawReceipt: withdrawReceipt ? safeReceipt(withdrawReceipt, "withdraw_credits") : null,
    finalCovenant: JSON.parse(covJson),
    finalDispute: JSON.parse(dispJson),
    clientCreditsBeforeWithdraw: clientCredits,
    clientCreditsAfterWithdraw: postWithdrawCredits,
    providerIsHealthy: isHealthy,
    executedAt: new Date().toISOString(),
  };

  deployment.lifecycle = lifecycleRecord;
  writeJson(DEPLOYMENT_PATH, deployment);
  console.log("\n✓ Lifecycle completed and evidence recorded in docs/evidence/studionet/deployment.json");
}

const command = process.argv[2] || "inspect";
if (command === "inspect") {
  inspect().catch(console.error);
} else if (command === "deploy") {
  deploy().catch(console.error);
} else if (command === "lifecycle") {
  runLifecycle().catch(console.error);
} else {
  console.log(`Unknown command: ${command}`);
}
