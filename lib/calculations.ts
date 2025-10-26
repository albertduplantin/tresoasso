import { Transaction, BudgetCategory } from '@/types';

export const calculateTotalAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => {
    const multiplier = transaction.type === 'expense' ? -1 : 1;
    return sum + transaction.amount * multiplier;
  }, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalRevenues = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalRevenues(transactions) - calculateTotalExpenses(transactions);
};

export const calculateByCertainty = (transactions: Transaction[]) => {
  return {
    confirmed: transactions.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0),
    probable: transactions.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0),
    potential: transactions.filter(t => t.certainty === 'potential').reduce((sum, t) => sum + t.amount, 0),
  };
};

export const calculateCategorySpending = (
  transactions: Transaction[],
  categories: BudgetCategory[]
): Record<string, { spent: number; budgeted: number; remaining: number; percentage: number }> => {
  const result: Record<string, { spent: number; budgeted: number; remaining: number; percentage: number }> = {};

  categories.forEach(category => {
    const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const budgeted = category.budgetedAmount;
    const remaining = budgeted - spent;
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;

    result[category.id] = {
      spent,
      budgeted,
      remaining,
      percentage,
    };
  });

  return result;
};

export const calculateVAT = (amountHT: number, vatRate: number): number => {
  return amountHT * (vatRate / 100);
};

export const calculateAmountTTC = (amountHT: number, vatRate: number): number => {
  return amountHT + calculateVAT(amountHT, vatRate);
};

export const calculateAmountHT = (amountTTC: number, vatRate: number): number => {
  return amountTTC / (1 + vatRate / 100);
};

