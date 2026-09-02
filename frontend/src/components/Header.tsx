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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          className="flex items-center space-x-3.5 cursor-pointer group select-none"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 flex items-center justify-center text-accent group-hover:scale-105 group-hover:border-accent group-hover:shadow-glow-accent transition-all duration-300">
            <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-foreground font-sans">
                AgentEfficacy<span className="text-accent">SLA</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/30">
                PRO
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              <span>GenLayer Intelligent Contract</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1.5 p-1.5 rounded-2xl bg-card/80 border border-border/70 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-secondary text-foreground border border-border shadow-md text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {/* Network Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-mono text-muted-foreground shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span className="text-foreground font-medium">Studionet</span>
            <span className="text-muted-foreground font-light">(61999)</span>
          </div>

          {/* Wallet Connect / Account Trigger */}
          {isConnected && address ? (
            <button
              onClick={openAccountDrawer}
              className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-card hover:bg-card-hover border border-accent/40 hover:border-accent text-xs font-mono text-foreground cursor-pointer transition-all duration-200 shadow-sm hover:shadow-glow-accent"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-bold">{formatAddr(address)}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ) : (
            <button
              onClick={openWalletModal}
              className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-bold transition-all duration-200 shadow-glow-accent hover:scale-[1.02] cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-border/60 py-2.5 bg-card/95 backdrop-blur-lg overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
