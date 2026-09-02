import React, { useState, useEffect } from 'react';
import { X, LogOut, Copy, Check, ExternalLink, Award, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ContractAdapter } from '../services/contractAdapter';
import { AccountStats } from '../types';

export const AccountDrawer: React.FC = () => {
  const { isAccountDrawerOpen, closeAccountDrawer, address, selectedProviderName, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<string | null>(null);

  useEffect(() => {
    if (address && isAccountDrawerOpen) {
      const adapter = new ContractAdapter(address);
      adapter.getAccountStats(address).then(setStats);
    }
  }, [address, isAccountDrawerOpen]);

  if (!isAccountDrawerOpen || !address) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    setWithdrawMsg(null);
    try {
      const adapter = new ContractAdapter(address);
      const res = await adapter.withdrawCredits();
      setWithdrawMsg(`Withdrew ${res.amount} GEN remediation credit.`);
      adapter.getAccountStats(address).then(setStats);
    } catch (err: any) {
      setWithdrawMsg(`Withdrawal error: ${err.message || 'Failed'}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto">
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground text-base">Connected Account</h3>
              <p className="text-xs text-muted-foreground font-mono">{selectedProviderName || 'Web3 Provider'}</p>
            </div>
            <button
              onClick={closeAccountDrawer}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Address Display & Copy */}
          <div className="mt-5 p-4 rounded-xl bg-secondary/60 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">Account Address</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-xs text-accent hover:underline cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`https://explorer-studio.genlayer.com/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                  title="View on GenLayer Explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="mt-1 font-mono text-sm text-foreground break-all">{address}</div>
          </div>

          {/* Balance & Credits Summary */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-background border border-border">
              <div className="text-xs text-muted-foreground font-medium">Native Balance</div>
              <div className="text-lg font-bold text-foreground font-mono mt-1">
                {stats ? `${stats.genBalance} GEN` : '10.0 GEN'}
              </div>
              <div className="text-[11px] text-muted-foreground">Studionet Native Gas</div>
            </div>
            <div className="p-3.5 rounded-xl bg-background border border-accent/40 shadow-glow-accent">
              <div className="text-xs text-accent font-medium">Claimable SLA Credits</div>
              <div className="text-lg font-bold text-accent font-mono mt-1">
                {stats ? `${stats.claimableCredits} GEN` : '0.0 GEN'}
              </div>
              <div className="text-[11px] text-muted-foreground">From Slashed Bonds</div>
            </div>
          </div>

          {/* Action: Withdraw Credits */}
          {parseFloat(stats?.claimableCredits || '0') > 0 && (
            <div className="mt-4">
              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-glow-accent"
              >
                {isWithdrawing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
                <span>Withdraw {stats?.claimableCredits} GEN Payout</span>
              </button>
            </div>
          )}

          {withdrawMsg && (
            <div className="mt-3 p-3 rounded-lg bg-secondary text-xs text-accent font-mono">
              {withdrawMsg}
            </div>
          )}

          {/* Activity Metrics */}
          <div className="mt-6 space-y-2.5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Covenant Participation
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 text-sm">
              <span className="text-muted-foreground">Active SLA Covenants</span>
              <span className="font-mono font-bold text-foreground">{stats?.covenantsCount ?? 2}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 text-sm">
              <span className="text-muted-foreground">Disputes Raised</span>
              <span className="font-mono font-bold text-foreground">{stats?.disputesCount ?? 1}</span>
            </div>
          </div>
        </div>

        {/* Bottom Disconnect */}
        <div className="pt-6 border-t border-border mt-6">
          <button
            onClick={disconnectWallet}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-destructive/15 hover:bg-destructive/25 border border-destructive/40 text-destructive text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect Wallet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
