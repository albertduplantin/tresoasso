'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Project, BudgetCategory } from '@/types';
import { BUDGET_CATEGORIES } from '@/constants';
import { formatCurrency } from '@/lib/formatters';

// Schema de validation
const projectEditSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  fiscalYear: z.string().regex(/^\d{4}$/, 'Format: AAAA'),
  status: z.enum(['draft', 'active', 'closed', 'archived']),
  budgetCategories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    budgetedAmount: z.number().min(0),
    type: z.enum(['expense', 'revenue']),
    accountingCode: z.string().optional(),
    color: z.string().optional(),
    parentCategoryId: z.string().optional(),
  })),
});

type ProjectEditFormData = z.infer<typeof projectEditSchema>;

interface ProjectEditDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Project>) => Promise<void>;
}

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
  onSave,
}: ProjectEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(
    project.budgetCategories || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProjectEditFormData>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
      fiscalYear: project.fiscalYear.toString(),
      status: project.status,
      budgetCategories: project.budgetCategories || [],
    },
  });

  const status = watch('status');

  // Réinitialiser le formulaire quand le projet change
  useEffect(() => {
    reset({
      name: project.name,
      description: project.description || '',
      fiscalYear: project.fiscalYear.toString(),
      status: project.status,
      budgetCategories: project.budgetCategories || [],
    });
    setBudgetCategories(project.budgetCategories || []);
  }, [project, reset]);

  // Mettre à jour le formulaire quand les catégories changent
  useEffect(() => {
    setValue('budgetCategories', budgetCategories);
  }, [budgetCategories, setValue]);

  const handleAddCategory = (categoryId: string) => {
    const category = BUDGET_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const exists = budgetCategories.some(c => c.id === categoryId);
    if (exists) {
      alert('Cette catégorie est déjà ajoutée');
      return;
    }

    setBudgetCategories([
      ...budgetCategories,
      {
        ...category,
        budgetedAmount: 0,
      },
    ]);
  };

  const handleUpdateCategoryAmount = (categoryId: string, amount: number) => {
    setBudgetCategories(
      budgetCategories.map(cat =>
        cat.id === categoryId ? { ...cat, budgetedAmount: amount } : cat
      )
    );
  };

  const handleRemoveCategory = (categoryId: string) => {
    setBudgetCategories(budgetCategories.filter(cat => cat.id !== categoryId));
  };

  const onSubmit = async (data: ProjectEditFormData) => {
    try {
      setIsSubmitting(true);

      await onSave({
        name: data.name,
        description: data.description,
        fiscalYear: parseInt(data.fiscalYear, 10),
        status: data.status,
        budgetCategories: budgetCategories,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Erreur lors de la mise à jour du projet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + (cat.budgetedAmount || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
          <DialogDescription>
            Modifiez les informations et le budget de votre projet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations générales</h3>

            <div>
              <Label htmlFor="name">Nom du projet *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Festival d'été 2024"
              />
              {errors.name && (
                <p className="text-sm text-error mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Description du projet..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fiscalYear">Année fiscale *</Label>
                <Input
                  id="fiscalYear"
                  {...register('fiscalYear')}
                  placeholder="2024"
                  maxLength={4}
                />
                {errors.fiscalYear && (
                  <p className="text-sm text-error mt-1">{errors.fiscalYear.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={status}
                  onValueChange={(value: any) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="closed">Clôturé</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Budget par catégorie */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Budget par catégorie</h3>
              <div className="text-right">
                <p className="text-sm text-text-secondary">Budget total</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(totalBudget)}</p>
              </div>
            </div>

            {/* Ajouter une catégorie */}
            <div className="flex gap-2">
              <Select onValueChange={handleAddCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Ajouter une catégorie..." />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_CATEGORIES.filter(cat => cat.type === 'expense').map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" disabled>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Liste des catégories */}
            <div className="space-y-2">
              {budgetCategories.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <p>Aucune catégorie budgétaire définie</p>
                  <p className="text-sm mt-1">Ajoutez des catégories pour définir votre budget</p>
                </div>
              ) : (
                budgetCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-surface rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-text-secondary">{category.type === 'expense' ? 'Dépense' : 'Recette'}</p>
                    </div>
                    <div className="w-48">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={category.budgetedAmount || 0}
                        onChange={(e) =>
                          handleUpdateCategoryAmount(category.id, parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

