'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { transactionSchema, TransactionFormData } from '@/lib/validations/schemas';
import { EXPENSE_STATUSES, REVENUE_STATUSES } from '@/constants';
import { BudgetCategory } from '@/types';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  categories: BudgetCategory[];
  initialData?: Partial<TransactionFormData>;
  mode?: 'create' | 'edit';
}

export function TransactionForm({
  open,
  onOpenChange,
  onSubmit,
  categories,
  initialData,
  mode = 'create',
}: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'revenue'>(
    initialData?.type || 'expense'
  );

  const form = useForm<any>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: initialData || {
      type: 'expense',
      certainty: 'confirmed',
      transactionDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD pour input date
      counterpartyType: 'supplier',
      status: 'pending',
      tags: [],
      amount: 0,
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;

  const handleFormSubmit = async (data: TransactionFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(mode === 'create' ? 'Transaction créée !' : 'Transaction mise à jour !');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = transactionType === 'expense' ? EXPENSE_STATUSES : REVENUE_STATUSES;
  const filteredCategories = categories.filter(cat => cat.type === transactionType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nouvelle transaction' : 'Modifier la transaction'}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de la transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={transactionType}
                onValueChange={(value) => {
                  setTransactionType(value as 'expense' | 'revenue');
                  setValue('type', value as 'expense' | 'revenue');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Dépense</SelectItem>
                  <SelectItem value="revenue">Recette</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { 
                  setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
                })}
              />
              {errors.amount && (
                <p className="text-sm text-error">{String(errors.amount.message)}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="Ex: Achat matériel pour festival"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-error">{String(errors.description.message)}</p>
            )}
          </div>

          {/* Catégorie et Statut */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Catégorie *</Label>
              <Select onValueChange={(value) => setValue('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.accountingCode ? `${cat.accountingCode} - ` : ''}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-error">{String(errors.categoryId.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Certitude */}
          <div className="space-y-2">
            <Label htmlFor="certainty">Certitude *</Label>
            <Select onValueChange={(value) => setValue('certainty', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Certain</SelectItem>
                <SelectItem value="probable">Probable</SelectItem>
                <SelectItem value="potential">Hypothétique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Date *</Label>
              <Input
                id="transactionDate"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('transactionDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Date échéance</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
              />
            </div>
          </div>

          {/* Partie prenante */}
          <div className="space-y-2">
            <Label htmlFor="counterpartyName">Fournisseur/Partenaire *</Label>
            <Input
              id="counterpartyName"
              placeholder="Nom du fournisseur ou partenaire"
              {...register('counterpartyName')}
            />
            {errors.counterpartyName && (
              <p className="text-sm text-error">{String(errors.counterpartyName.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="counterpartyType">Type</Label>
              <Select onValueChange={(value) => setValue('counterpartyType', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Fournisseur</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="grant">Subvention</SelectItem>
                  <SelectItem value="individual">Particulier</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="counterpartyEmail">Email</Label>
              <Input
                id="counterpartyEmail"
                type="email"
                placeholder="contact@exemple.com"
                {...register('counterpartyEmail')}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires..."
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                mode === 'create' ? 'Créer' : 'Mettre à jour'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

