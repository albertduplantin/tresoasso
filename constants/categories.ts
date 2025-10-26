import { BudgetCategory } from '@/types';

export const DEFAULT_EXPENSE_CATEGORIES: Omit<BudgetCategory, 'id' | 'budgetedAmount'>[] = [
  { name: 'Publicité, publications, relations publiques', type: 'expense', accountingCode: '6234', color: '#ef4444' },
  { name: 'Transports sur achats', type: 'expense', accountingCode: '6241', color: '#f59e0b' },
  { name: 'Réceptions', type: 'expense', accountingCode: '6257', color: '#f97316' },
  { name: 'Achats de marchandises', type: 'expense', accountingCode: '607', color: '#eab308' },
  { name: 'Fournitures administratives', type: 'expense', accountingCode: '6064', color: '#84cc16' },
  { name: 'Location immobilière', type: 'expense', accountingCode: '6132', color: '#22c55e' },
  { name: 'Location mobilière', type: 'expense', accountingCode: '6135', color: '#10b981' },
  { name: 'Maintenance et entretien', type: 'expense', accountingCode: '615', color: '#14b8a6' },
  { name: 'Assurances', type: 'expense', accountingCode: '616', color: '#06b6d4' },
  { name: 'Honoraires', type: 'expense', accountingCode: '622', color: '#0ea5e9' },
  { name: 'Frais postaux et télécommunications', type: 'expense', accountingCode: '626', color: '#3b82f6' },
  { name: 'Services bancaires', type: 'expense', accountingCode: '627', color: '#6366f1' },
  { name: 'Cotisations professionnelles', type: 'expense', accountingCode: '6281', color: '#8b5cf6' },
  { name: 'Salaires et traitements', type: 'expense', accountingCode: '641', color: '#a855f7' },
  { name: 'Charges sociales', type: 'expense', accountingCode: '645', color: '#c026d3' },
  { name: 'Autres charges de gestion courante', type: 'expense', accountingCode: '658', color: '#d946ef' },
];

export const DEFAULT_REVENUE_CATEGORIES: Omit<BudgetCategory, 'id' | 'budgetedAmount'>[] = [
  { name: 'Cotisations membres', type: 'revenue', accountingCode: '706', color: '#10b981' },
  { name: 'Dons et mécénat', type: 'revenue', accountingCode: '708', color: '#14b8a6' },
  { name: 'Subventions d\'exploitation - État', type: 'revenue', accountingCode: '7411', color: '#06b6d4' },
  { name: 'Subventions d\'exploitation - Région', type: 'revenue', accountingCode: '7412', color: '#0ea5e9' },
  { name: 'Subventions d\'exploitation - Département', type: 'revenue', accountingCode: '7413', color: '#3b82f6' },
  { name: 'Subventions d\'exploitation - Commune', type: 'revenue', accountingCode: '7414', color: '#6366f1' },
  { name: 'Subventions d\'exploitation - Organismes internationaux', type: 'revenue', accountingCode: '7415', color: '#8b5cf6' },
  { name: 'Subventions d\'exploitation - Autres', type: 'revenue', accountingCode: '7417', color: '#a855f7' },
  { name: 'Ventes de prestations de services', type: 'revenue', accountingCode: '706', color: '#22c55e' },
  { name: 'Ventes de marchandises', type: 'revenue', accountingCode: '707', color: '#84cc16' },
  { name: 'Produits financiers', type: 'revenue', accountingCode: '76', color: '#eab308' },
  { name: 'Autres produits de gestion courante', type: 'revenue', accountingCode: '758', color: '#f59e0b' },
];

export const getAllDefaultCategories = (): Omit<BudgetCategory, 'id' | 'budgetedAmount'>[] => {
  return [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_REVENUE_CATEGORIES];
};

