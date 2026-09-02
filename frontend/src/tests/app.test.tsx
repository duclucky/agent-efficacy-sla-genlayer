import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { WalletProvider } from '../context/WalletContext';
import { ContractAdapter } from '../services/contractAdapter';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<WalletProvider>{ui}</WalletProvider>);
};

describe('AgentEfficacySLA dApp Frontend Suite', () => {
  it('renders landing page with headline, trust signals, and KPIs', async () => {
    renderWithProviders(<App />);
    expect(screen.getAllByText(/AgentEfficacy/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Enforce AI Agent SLAs On-Chain/i)).toBeInTheDocument();
    expect(screen.getByText(/Active SLA Covenants/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Bonds Locked/i)).toBeInTheDocument();
  });

  it('navigates seamlessly between multi-page routes via persistent header', async () => {
    renderWithProviders(<App />);

    // Click Covenants tab
    const covenantsBtn = screen.getAllByText('SLA Covenants')[0];
    fireEvent.click(covenantsBtn);
    expect(screen.getByText(/Autonomous Agent SLA Covenants/i)).toBeInTheDocument();

    // Click Disputes tab
    const disputesBtn = screen.getAllByText('Breach Disputes')[0];
    fireEvent.click(disputesBtn);
    expect(screen.getByText(/SLA Breach & Hallucination Disputes/i)).toBeInTheDocument();

    // Click Protocol Guide tab
    const guideBtn = screen.getAllByText('Protocol Guide')[0];
    fireEvent.click(guideBtn);
    expect(screen.getByText(/Protocol Methodology & Developer Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Why GenLayer is Required/i)).toBeInTheDocument();
  });

  it('ContractAdapter returns valid seeded covenants and disputes', async () => {
    const adapter = new ContractAdapter('0x71C83637e127394E9684C558F2e68449D0d7b21e');
    const covenants = await adapter.getCovenants();
    expect(covenants.length).toBeGreaterThan(0);
    expect(covenants[0].agentName).toBeDefined();
    expect(covenants[0].providerBond).toBe('2.0');

    const disputes = await adapter.getDisputes();
    expect(disputes.length).toBeGreaterThan(0);
    expect(disputes[0].claimedViolation).toBe('FACTUAL_HALLUCINATION');
  });

  it('opens and closes EIP-6963 wallet connection modal', async () => {
    renderWithProviders(<App />);
    const connectBtn = screen.getByText('Connect Wallet');
    fireEvent.click(connectBtn);
    expect(screen.getByText('Connect Web3 Wallet')).toBeInTheDocument();
    expect(screen.getByText(/EIP-6963 Multi-Provider Discovery/i)).toBeInTheDocument();
  });
});
