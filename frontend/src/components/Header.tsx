import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Award, BookOpen, Wallet, ChevronDown } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { address, isConnected, openWalletModal, openAccountDrawer } = useWallet();

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Cpu },
    { id: 'covenants', label: 'SLA Covenants', icon: ShieldCheck },
    { id: 'disputes', label: 'Breach Disputes', icon: ShieldAlert },
    { id: 'account', label: 'Bonds & Credits', icon: Award },
    { id: 'guide', label: 'Protocol Guide', icon: BookOpen },
  ];

  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-200 shadow-glow-accent">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight gradient-heading">
              AgentEfficacy<span className="text-accent">SLA</span>
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              <span>GenLayer Intelligent Contract</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-secondary text-foreground border border-border/80 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {/* Network Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-secondary/80 border border-border text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span>Studionet (61999)</span>
          </div>

          {/* Wallet Connect / Account Trigger */}
          {isConnected && address ? (
            <button
              onClick={openAccountDrawer}
              className="flex items-center space-x-2.5 px-3.5 py-2 rounded-lg bg-card hover:bg-card-hover border border-accent/40 text-sm font-mono text-foreground cursor-pointer transition-all shadow-sm hover:border-accent"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{formatAddr(address)}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <button
              onClick={openWalletModal}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-semibold transition-all shadow-glow-accent cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-border/40 py-2 bg-card/90 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
                isActive ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
