import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    emoji: '✅',
    className: 'risk-badge-low',
  },
  moderate: {
    label: 'Moderate',
    emoji: '⚠️',
    className: 'risk-badge-moderate',
  },
  high: {
    label: 'High Risk',
    emoji: '🔶',
    className: 'risk-badge-high',
  },
  critical: {
    label: 'Critical',
    emoji: '🚨',
    className: 'risk-badge-critical',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function RiskBadge({ level, score, showIcon = true, size = 'md' }: RiskBadgeProps) {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        'risk-badge',
        config.className,
        sizeClasses[size]
      )}
    >
      {showIcon && <span>{config.emoji}</span>}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="font-bold">({Math.round(score)}%)</span>
      )}
    </span>
  );
}
