import { TransactionStatus } from '@/types';

export const EXPENSE_STATUSES: { value: TransactionStatus; label: string; color: string }[] = [
  { value: 'expense_quote_requested', label: 'Devis demandé', color: '#6b7280' },
  { value: 'expense_quote_received', label: 'Devis reçu', color: '#f59e0b' },
  { value: 'expense_purchase_order_sent', label: 'Bon de commande envoyé', color: '#3b82f6' },
  { value: 'expense_invoice_received', label: 'Facture reçue', color: '#8b5cf6' },
  { value: 'expense_paid', label: 'Payé', color: '#10b981' },
];

export const REVENUE_STATUSES: { value: TransactionStatus; label: string; color: string }[] = [
  { value: 'revenue_verbal_promise', label: 'Promesse verbale', color: '#6b7280' },
  { value: 'revenue_application_sent', label: 'Demande envoyée', color: '#f59e0b' },
  { value: 'revenue_confirmed', label: 'Confirmé', color: '#3b82f6' },
  { value: 'revenue_received', label: 'Encaissé', color: '#10b981' },
];

export const CANCELLED_STATUS: { value: TransactionStatus; label: string; color: string } = {
  value: 'cancelled',
  label: 'Annulé',
  color: '#ef4444',
};

export const getStatusLabel = (status: TransactionStatus): string => {
  const allStatuses = [...EXPENSE_STATUSES, ...REVENUE_STATUSES, CANCELLED_STATUS];
  return allStatuses.find(s => s.value === status)?.label || status;
};

export const getStatusColor = (status: TransactionStatus): string => {
  const allStatuses = [...EXPENSE_STATUSES, ...REVENUE_STATUSES, CANCELLED_STATUS];
  return allStatuses.find(s => s.value === status)?.color || '#6b7280';
};

export const CERTAINTY_LABELS = {
  confirmed: 'Certain',
  probable: 'Probable',
  potential: 'Hypothétique',
} as const;

export const CERTAINTY_COLORS = {
  confirmed: '#10b981',
  probable: '#f59e0b',
  potential: '#6b7280',
} as const;

