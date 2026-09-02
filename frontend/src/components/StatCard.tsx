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
          border: 'border-accent/40',
          iconBg: 'bg-accent/15 text-accent',
          glow: 'shadow-glow-accent',
          badge: 'text-accent',
        };
      case 'warning':
        return {
          border: 'border-warning/40',
          iconBg: 'bg-warning/15 text-warning',
          glow: 'shadow-glow-warning',
          badge: 'text-warning',
        };
      case 'destructive':
        return {
          border: 'border-destructive/40',
          iconBg: 'bg-destructive/15 text-destructive',
          glow: 'shadow-glow-destructive',
          badge: 'text-destructive',
        };
      default:
        return {
          border: 'border-border',
          iconBg: 'bg-secondary text-muted-foreground',
          glow: '',
          badge: 'text-muted-foreground',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`p-5 rounded-2xl bg-card/90 glass-card ${styles.border} ${styles.glow} glass-card-hover transition-all flex items-start justify-between`}
    >
      <div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="mt-1.5 text-2xl font-extrabold text-foreground font-mono tracking-tight">{value}</div>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${styles.iconBg} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
