'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { StatusBadge, CertaintyBadge } from '@/components/transactions/status-badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TransactionFormData } from '@/lib/validations/schemas';

export default function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'revenue'>('all');

  // Mock data - à remplacer par useTransactions
  const mockTransactions = [
    {
      id: '1',
      type: 'expense' as const,
      amount: 1800,
      description: 'AGENCE LUCKYTIME - Publicité',
      categoryId: '1',
      categoryName: 'Publicité, publications',
      status: 'expense_paid' as const,
      certainty: 'confirmed' as const,
      transactionDate: new Date('2024-01-15'),
      counterpartyName: 'Agence Luckytime',
    },
    {
      id: '2',
      type: 'revenue' as const,
      amount: 15000,
      description: 'Subvention DRAC',
      categoryId: '2',
      categoryName: 'Subventions État',
      status: 'revenue_confirmed' as const,
      certainty: 'confirmed' as const,
      transactionDate: new Date('2024-01-10'),
      counterpartyName: 'DRAC Bretagne',
    },
    {
      id: '3',
      type: 'expense' as const,
      amount: 2300,
      description: 'Location Matériel',
      categoryId: '3',
      categoryName: 'Location mobilière',
      status: 'expense_quote_received' as const,
      certainty: 'probable' as const,
      transactionDate: new Date('2024-01-05'),
      counterpartyName: 'Location Pro',
    },
  ];

  const mockCategories = [
    {
      id: '1',
      name: 'Publicité, publications',
      type: 'expense' as const,
      accountingCode: '6234',
      budgetedAmount: 10000,
    },
    {
      id: '2',
      name: 'Subventions État',
      type: 'revenue' as const,
      accountingCode: '7411',
      budgetedAmount: 50000,
    },
    {
      id: '3',
      name: 'Location mobilière',
      type: 'expense' as const,
      accountingCode: '6135',
      budgetedAmount: 8000,
    },
  ];

  const handleCreateTransaction = async (data: TransactionFormData) => {
    console.log('Creating transaction:', data);
    // Implémenter avec useTransactions
  };

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-text-secondary mt-2">
            Gérez vos recettes et dépenses
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle transaction
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
                <SelectItem value="revenue">Recettes</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres avancés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredTransactions.length} transaction(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{transaction.description}</p>
                    <CertaintyBadge certainty={transaction.certainty} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span>{transaction.counterpartyName}</span>
                    <span>•</span>
                    <span>{transaction.categoryName}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.transactionDate)}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'expense' ? 'text-error' : 'text-success'
                    }`}
                  >
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <StatusBadge status={transaction.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreateTransaction}
        categories={mockCategories}
      />
    </div>
  );
}

