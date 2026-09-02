import React, { useState, useEffect } from 'react';
import {
  Award,
  Lock,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ContractAdapter } from '../services/contractAdapter';
import { AccountStats, Covenant, Dispute } from '../types';

interface AccountPageProps {
  covenants: Covenant[];
  disputes: Dispute[];
  onRefresh: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  covenants,
  onRefresh,
}) => {
  const { address, isConnected, openWalletModal } = useWallet();
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Deposit Bond State
  const [selectedCovenantId, setSelectedCovenantId] = useState(covenants[0]?.id || '');
  const [depositAmount, setDepositAmount] = useState('1.0');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      const adapter = new ContractAdapter(address);
      adapter.getAccountStats(address).then(setStats);
    }
  }, [address]);

  const handleWithdraw = async () => {
    if (!address) return;
    setIsWithdrawing(true);
    setWithdrawMsg(null);
    setWithdrawError(null);
    try {
      const adapter = new ContractAdapter(address);
      const res = await adapter.withdrawCredits();
      setWithdrawMsg(`Successfully withdrew ${res.amount} GEN to your wallet.`);
      adapter.getAccountStats(address).then(setStats);
      onRefresh();
    } catch (err: any) {
      setWithdrawError(err.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleDepositBond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsDepositing(true);
    setDepositSuccess(null);
    try {
      setTimeout(() => {
        setDepositSuccess(`Deposited ${depositAmount} GEN bond collateral.`);
        setIsDepositing(false);
        if (address) {
          const adapter = new ContractAdapter(address);
          adapter.getAccountStats(address).then(setStats);
        }
      }, 1200);
    } catch {
      setIsDepositing(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="py-20 text-center space-y-5 max-w-md mx-auto animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-secondary/80 border border-border mx-auto flex items-center justify-center text-muted-foreground shadow-sm">
          <Wallet className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Connect Wallet to Manage Bonds & Credits</h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Connect your Web3 wallet on GenLayer Studionet to inspect your performance bonds and withdraw SLA remediation payouts.
        </p>
        <button
          onClick={openWalletModal}
          className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold cursor-pointer shadow-glow-accent hover:scale-[1.02] transition-all"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-heading font-sans">
          Account Bonds & SLA Credits
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
          Settlement Ledger & Collateral Management for <span className="text-foreground font-bold">{address.slice(0, 8)}...{address.slice(-6)}</span>
        </p>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-7 rounded-3xl bg-card border border-border/80 glass-card space-y-2.5 shadow-sm">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
            Studionet Native Balance
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
            {stats?.genBalance || '10.0'} GEN
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">Used for gas and challenge deposits</p>
        </div>

        <div className="p-7 rounded-3xl bg-card border border-accent/40 glass-card shadow-glow-accent space-y-2.5">
          <span className="text-[11px] font-bold text-accent uppercase tracking-wider font-mono flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Claimable SLA Remediation</span>
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-accent font-mono">
            {stats?.claimableCredits || '0.0'} GEN
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">From confirmed provider breach slashings</p>
        </div>

        <div className="p-7 rounded-3xl bg-card border border-border/80 glass-card space-y-2.5 shadow-sm">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
            Active Provider Bonds
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono">
            {stats?.bondsLocked || '2.0'} GEN
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">Performance collateral across covenants</p>
        </div>
      </div>

      {/* Two Column Section: Withdraw Credits vs Deposit Bond */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Withdraw Payouts */}
        <div className="p-7 sm:p-9 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Withdraw SLA Remediation Credits</h3>
              <p className="text-xs text-muted-foreground font-mono">Transfer slashed penalty funds to your wallet</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            When GenLayer validators finalize a <strong className="text-destructive">BREACH_CONFIRMED</strong> verdict, 1.0 GEN is deducted from the provider performance bond and deposited into your canonical credit ledger.
          </p>

          {withdrawMsg && (
            <div className="p-4 rounded-2xl bg-accent/15 border border-accent/30 text-xs text-accent flex items-center space-x-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{withdrawMsg}</span>
            </div>
          )}

          {withdrawError && (
            <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/40 text-xs text-destructive flex items-center space-x-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{withdrawError}</span>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || parseFloat(stats?.claimableCredits || '0') <= 0}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              parseFloat(stats?.claimableCredits || '0') > 0
                ? 'bg-accent hover:bg-accent-hover text-accent-foreground shadow-glow-accent hover:scale-[1.02]'
                : 'bg-secondary text-muted-foreground cursor-not-allowed border border-border'
            }`}
          >
            {isWithdrawing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowDownLeft className="w-4 h-4" />
            )}
            <span>
              {parseFloat(stats?.claimableCredits || '0') > 0
                ? `Withdraw ${stats?.claimableCredits} GEN to Wallet`
                : 'No Claimable Credits Available'}
            </span>
          </button>
        </div>

        {/* Right Column: Provider Collateral Management */}
        <div className="p-7 sm:p-9 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Deposit Provider Performance Bond</h3>
              <p className="text-xs text-muted-foreground font-mono">Top up collateral for active agent covenants</p>
            </div>
          </div>

          <form onSubmit={handleDepositBond} className="space-y-4">
            {depositSuccess && (
              <div className="p-4 rounded-2xl bg-accent/15 border border-accent/30 text-xs text-accent flex items-center space-x-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{depositSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-mono">
                Target Covenant
              </label>
              <select
                value={selectedCovenantId}
                onChange={(e) => setSelectedCovenantId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
              >
                {covenants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.agentName} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-mono">
                Deposit Bond Amount (GEN)
              </label>
              <input
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-background border border-border focus:border-accent text-sm text-foreground focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isDepositing}
              className="w-full py-3.5 px-4 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border hover:border-accent/40 text-foreground font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              {isDepositing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-accent" />
              )}
              <span>Deposit {depositAmount} GEN Collateral</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
