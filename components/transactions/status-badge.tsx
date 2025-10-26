import { Badge } from '@/components/ui/badge';
import { TransactionStatus, TransactionCertainty } from '@/types';
import { getStatusLabel, getStatusColor, CERTAINTY_LABELS } from '@/constants';

interface StatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  return (
    <Badge
      className={className}
      style={{ backgroundColor: color }}
    >
      {label}
    </Badge>
  );
}

interface CertaintyBadgeProps {
  certainty: TransactionCertainty;
  className?: string;
}

export function CertaintyBadge({ certainty, className }: CertaintyBadgeProps) {
  const variants: Record<TransactionCertainty, 'certain' | 'probable' | 'potential'> = {
    confirmed: 'certain',
    probable: 'probable',
    potential: 'potential',
  };

  return (
    <Badge variant={variants[certainty]} className={className}>
      {CERTAINTY_LABELS[certainty]}
    </Badge>
  );
}

