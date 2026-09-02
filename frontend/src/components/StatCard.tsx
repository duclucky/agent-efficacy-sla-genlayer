import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'warning' | 'destructive';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return {
          border: 'border-accent/30 hover:border-accent',
          iconBg: 'bg-accent/15 text-accent border border-accent/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          glow: 'hover:shadow-glow-accent',
          valColor: 'text-accent',
        };
      case 'warning':
        return {
          border: 'border-warning/30 hover:border-warning',
          iconBg: 'bg-warning/15 text-warning border border-warning/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          glow: 'hover:shadow-glow-warning',
          valColor: 'text-warning',
        };
      case 'destructive':
        return {
          border: 'border-destructive/30 hover:border-destructive',
          iconBg: 'bg-destructive/15 text-destructive border border-destructive/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
          glow: 'hover:shadow-glow-destructive',
          valColor: 'text-destructive',
        };
      default:
        return {
          border: 'border-border/80 hover:border-border',
          iconBg: 'bg-secondary text-muted-foreground border border-border',
          glow: '',
          valColor: 'text-foreground',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`p-6 rounded-3xl bg-card/90 glass-card ${styles.border} ${styles.glow} glass-card-hover transition-all flex items-start justify-between relative overflow-hidden group`}
    >
      <div className="space-y-1.5 z-10">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          {title}
        </span>
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${styles.valColor}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground/90 font-sans">{subtitle}</p>
        )}
      </div>

      <div className={`p-3.5 rounded-2xl ${styles.iconBg} shrink-0 group-hover:scale-110 transition-transform duration-300 z-10`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Ambient background glow */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/10 transition-colors" />
    </div>
  );
};
