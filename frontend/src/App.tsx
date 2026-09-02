import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WalletModal } from './components/WalletModal';
import { AccountDrawer } from './components/AccountDrawer';
import { LandingPage } from './pages/LandingPage';
import { CovenantsPage } from './pages/CovenantsPage';
import { DisputesPage } from './pages/DisputesPage';
import { DisputeDetailPage } from './pages/DisputeDetailPage';
import { AccountPage } from './pages/AccountPage';
import { GuidePage } from './pages/GuidePage';
import { ContractAdapter } from './services/contractAdapter';
import { Covenant, Dispute } from './types';
import { useWallet } from './context/WalletContext';

export const App: React.FC = () => {
  const { address, provider } = useWallet();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [initialDisputeCovenantId, setInitialDisputeCovenantId] = useState<string | null>(null);

  const [covenants, setCovenants] = useState<Covenant[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  const loadData = async () => {
    try {
      const adapter = new ContractAdapter(address || '', provider);
      const [covData, dispData] = await Promise.all([
        adapter.getCovenants(),
        adapter.getDisputes(),
      ]);
      setCovenants(covData);
      setDisputes(dispData);
    } catch (err) {
      console.error('Failed to load contract data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [address, provider]);

  const handleNavigate = (tab: string, disputeId?: string) => {
    if (disputeId) {
      setSelectedDisputeId(disputeId);
      setActiveTab('dispute-detail');
    } else {
      setActiveTab(tab);
    }
  };

  const handleNavigateToDisputeWithCovenant = (covenantId: string) => {
    setInitialDisputeCovenantId(covenantId);
    setActiveTab('disputes');
  };

  const handleSelectDispute = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    setActiveTab('dispute-detail');
  };

  const activeDispute = disputes.find((d) => d.id === selectedDisputeId) || disputes[0];
  const associatedCovenant = activeDispute
    ? covenants.find((c) => c.id === activeDispute.covenantId) || covenants[0]
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-accent/30 selection:text-foreground">
      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {activeTab === 'landing' && (
            <LandingPage
              covenants={covenants}
              disputes={disputes}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'covenants' && (
            <CovenantsPage
              covenants={covenants}
              onRefresh={loadData}
              onNavigateToDispute={handleNavigateToDisputeWithCovenant}
            />
          )}

          {activeTab === 'disputes' && (
            <DisputesPage
              disputes={disputes}
              covenants={covenants}
              onRefresh={loadData}
              onSelectDispute={handleSelectDispute}
              initialCovenantId={initialDisputeCovenantId}
            />
          )}

          {activeTab === 'dispute-detail' && activeDispute && (
            <DisputeDetailPage
              dispute={activeDispute}
              covenant={associatedCovenant}
              onBack={() => setActiveTab('disputes')}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'account' && (
            <AccountPage
              covenants={covenants}
              disputes={disputes}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'guide' && <GuidePage />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <WalletModal />
      <AccountDrawer />

      {/* Persistent Footer */}
      <footer className="border-t border-border/60 py-8 bg-card/40 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div>
            <span>AgentEfficacySLA • Built on GenLayer Studionet • Intelligent Contract</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('guide')} className="hover:text-accent cursor-pointer">
              Docs & Guide
            </button>
            <span>•</span>
            <a
              href="https://explorer-studio.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              Studionet Explorer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
