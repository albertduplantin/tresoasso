'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { StatusBadge, CertaintyBadge } from '@/components/transactions/status-badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TransactionFormData } from '@/lib/validations/schemas';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useOrganization } from '@/lib/contexts/organization-context';
import { Transaction } from '@/types';
import { toast } from 'sonner';
import { BUDGET_CATEGORIES } from '@/constants';

export default function TransactionsPage() {
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { currentOrganization, currentProject } = useOrganization();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'revenue'>('all');

  // Filtrer les transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === '' ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.counterparty.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      if (editingTransaction) {
        // Mise à jour
        await updateTransaction(editingTransaction.id, data as any);
        toast.success('Transaction mise à jour !');
      } else {
        // Création
        await createTransaction(data as any);
        toast.success('Transaction créée !');
      }
      setFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    // Transformer la transaction pour le formulaire
    const formData: any = {
      ...transaction,
      counterpartyName: transaction.counterparty.name,
      counterpartyType: transaction.counterparty.type,
      counterpartyEmail: transaction.counterparty.contactEmail,
      counterpartyPhone: transaction.counterparty.contactPhone,
    };
    setEditingTransaction(formData);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await deleteTransaction(id);
        toast.success('Transaction supprimée !');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setFormOpen(true);
  };

  // Si pas d'organisation/projet sélectionné
  if (!currentOrganization || !currentProject) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-text-secondary mb-4">
              Veuillez sélectionner une organisation et un projet pour voir les transactions.
            </p>
            <Button onClick={() => window.location.href = '/onboarding/organization'}>
              Créer une organisation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-text-secondary mt-2">
            {currentProject.name} • {currentOrganization.name}
          </p>
        </div>
        <Button onClick={handleNewTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle transaction
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
                <SelectItem value="revenue">Recettes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-text-secondary mb-4">
              {searchQuery || typeFilter !== 'all'
                ? 'Aucune transaction ne correspond à vos filtres'
                : 'Aucune transaction pour le moment'}
            </p>
            {!searchQuery && typeFilter === 'all' && (
              <Button onClick={handleNewTransaction}>
                <Plus className="mr-2 h-4 w-4" />
                Créer votre première transaction
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const category = BUDGET_CATEGORIES.find(c => c.id === transaction.categoryId);
            
            return (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {transaction.description}
                        </h3>
                        <StatusBadge status={transaction.status} />
                        <CertaintyBadge certainty={transaction.certainty} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
                        <div>
                          <span className="font-medium">Partenaire :</span>{' '}
                          {transaction.counterparty.name}
                        </div>
                        <div>
                          <span className="font-medium">Catégorie :</span>{' '}
                          {category?.name || 'Non catégorisé'}
                        </div>
                        <div>
                          <span className="font-medium">Date :</span>{' '}
                          {formatDate(transaction.transactionDate as any)}
                        </div>
                      </div>

                      {transaction.notes && (
                        <p className="text-sm text-text-secondary mt-2 italic">
                          {transaction.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${
                            transaction.type === 'revenue'
                              ? 'text-success'
                              : 'text-error'
                          }`}
                        >
                          {transaction.type === 'revenue' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog Formulaire */}
      <TransactionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        categories={BUDGET_CATEGORIES}
        initialData={editingTransaction || undefined}
        mode={editingTransaction ? 'edit' : 'create'}
      />
    </div>
  );
}
