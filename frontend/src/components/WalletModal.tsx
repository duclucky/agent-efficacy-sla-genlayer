import React from 'react';
import { X, Wallet, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const WalletModal: React.FC = () => {
  const { isModalOpen, closeWalletModal, availableProviders, connectWallet, isConnecting } = useWallet();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-card border border-border/90 rounded-3xl p-7 shadow-2xl overflow-hidden glass-card">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow-accent">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Connect Web3 Wallet</h3>
              <p className="text-xs text-muted-foreground font-mono">EIP-6963 Multi-Provider Discovery</p>
            </div>
          </div>
          <button
            onClick={closeWalletModal}
            className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Notice */}
        <div className="mt-5 p-3.5 rounded-2xl bg-secondary/60 border border-border/60 text-xs flex items-start space-x-2.5 text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <span>
            Connect your EVM wallet to transact on <strong className="text-foreground">GenLayer Studionet (61999)</strong> with zero private key exposure.
          </span>
        </div>

        {/* Detected EIP-6963 Providers */}
        <div className="mt-5 space-y-2.5">
          {availableProviders.length > 0 ? (
            availableProviders.map((detail) => (
              <button
                key={detail.info.uuid}
                onClick={() => connectWallet(detail)}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border hover:border-accent/50 text-foreground transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-glow-accent"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={detail.info.icon}
                    alt={detail.info.name}
                    className="w-8 h-8 rounded-xl object-contain bg-background p-1 border border-border"
                  />
                  <div className="text-left">
                    <div className="font-bold text-sm group-hover:text-accent transition-colors">
                      {detail.info.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {detail.info.rdns || 'EIP-6963 Standard'}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="space-y-2.5">
              <button
                onClick={() => connectWallet()}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border hover:border-accent/50 text-foreground transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-glow-accent"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm group-hover:text-accent transition-colors">
                      Detected Injected Provider
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      MetaMask / OKX / Rabby / Browser Extension
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}
        </div>

        {/* Demo Fast Session Connect */}
        <div className="mt-5 pt-4 border-t border-border/60">
          <button
            onClick={() => connectWallet()}
            className="w-full py-3 px-4 rounded-2xl bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <span>Enter Demo Actor Session (Auto-Connect)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
