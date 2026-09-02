import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export function parseDeployReceipt(receipt) {
  if (!receipt) {
    throw new Error('Null receipt');
  }

  // Raw Studio receipt shape
  if (receipt.consensus_data && Array.isArray(receipt.consensus_data.leader_receipt)) {
    const leaderExec = receipt.consensus_data.leader_receipt[0]?.execution_result;
    const contractAddress = receipt.contract_address || receipt.to || receipt.consensus_data.contract_address;
    const status = receipt.status || 'FINALIZED';
    return {
      status,
      success: leaderExec === 'SUCCESS' || leaderExec === 'SUCCESSFUL' || receipt.result === 'SUCCESS',
      contractAddress: contractAddress || '0x0000000000000000000000000000000000000000',
    };
  }

  // Normalized SDK receipt shape
  if (receipt.status || receipt.result) {
    return {
      status: receipt.status || 'FINALIZED',
      success: receipt.status === 'FINALIZED' && (receipt.result === 'SUCCESS' || !receipt.result),
      contractAddress: receipt.contractAddress || receipt.to || receipt.address,
    };
  }

  throw new Error('Unknown receipt format');
}

describe('Deployment Receipt Parser Fixture Tests', () => {
  it('parses raw Studio receipt with consensus_data correctly', () => {
    const rawStudioFixture = {
      status: 'FINALIZED',
      consensus_data: {
        leader_receipt: [{ execution_result: 'SUCCESS' }],
        contract_address: '0x13A27D41718a8a4ED445f8C4c708686e849748BE',
      },
      transaction_hash: '0xec79fa0ff73700def67bc36937b4e4d1a02fe5720fe983e2e5204f08cf71b764',
    };

    const parsed = parseDeployReceipt(rawStudioFixture);
    assert.equal(parsed.status, 'FINALIZED');
    assert.equal(parsed.success, true);
    assert.equal(parsed.contractAddress, '0x13A27D41718a8a4ED445f8C4c708686e849748BE');
  });

  it('parses normalized SDK receipt correctly', () => {
    const normalizedFixture = {
      status: 'FINALIZED',
      result: 'SUCCESS',
      contractAddress: '0x9aeebe7B3e1318D4ca2eBD38fB714b84976fdA86',
      transactionHash: '0x00b61dcbc6035d63a7610d0bee418095a72c29047c21c2e3ec4d3a86e1d22ace',
    };

    const parsed = parseDeployReceipt(normalizedFixture);
    assert.equal(parsed.status, 'FINALIZED');
    assert.equal(parsed.success, true);
    assert.equal(parsed.contractAddress, '0x9aeebe7B3e1318D4ca2eBD38fB714b84976fdA86');
  });
});
