'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  FolderKanban, 
  Search, 
  MoreVertical, 
  Edit, 
  Archive, 
  Copy, 
  Download,
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/lib/contexts/organization-context';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Project } from '@/types';

type ProjectStats = {
  totalTransactions: number;
  totalRevenues: number;
  totalExpenses: number;
  balance: number;
  budgetUsedPercent: number;
  confirmed: { revenues: number; expenses: number };
  probable: { revenues: number; expenses: number };
};

export default function ProjectsPage() {
  const router = useRouter();
  const { currentOrganization, projects, loading, refreshProjects } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'closed' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculer les statistiques pour chaque projet
  const getProjectStats = (project: Project, transactions: any[]): ProjectStats => {
    const projectTransactions = transactions.filter(t => t.projectId === project.id);
    
    const revenues = projectTransactions.filter(t => t.type === 'revenue');
    const expenses = projectTransactions.filter(t => t.type === 'expense');
    
    const totalRevenues = revenues.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const confirmedRevenues = revenues.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0);
    const confirmedExpenses = expenses.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0);
    
    const probableRevenues = revenues.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0);
    const probableExpenses = expenses.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0);
    
    // Calculer le budget total depuis les catégories
    const totalBudget = project.budgetCategories?.reduce((sum, cat) => sum + (cat.budgetedAmount || 0), 0) || 0;
    
    return {
      totalTransactions: projectTransactions.length,
      totalRevenues,
      totalExpenses,
      balance: totalRevenues - totalExpenses,
      budgetUsedPercent: totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0,
      confirmed: { revenues: confirmedRevenues, expenses: confirmedExpenses },
      probable: { revenues: probableRevenues, expenses: probableExpenses },
    };
  };

  // Hook pour charger les transactions (on va les utiliser pour les stats)
  const { transactions } = useTransactions();

  // Projets avec stats calculées
  const projectsWithStats = useMemo(() => {
    return projects.map(project => ({
      ...project,
      stats: getProjectStats(project, transactions),
    }));
  }, [projects, transactions]);

  // Filtrer les projets
  const filteredProjects = projectsWithStats.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistiques globales
  const globalStats = useMemo(() => {
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalBudget: projectsWithStats.reduce((sum, p) => 
        sum + (p.budgetCategories?.reduce((s, cat) => s + (cat.budgetedAmount || 0), 0) || 0), 0
      ),
      totalBalance: projectsWithStats.reduce((sum, p) => sum + p.stats.balance, 0),
    };
  }, [projects, projectsWithStats]);

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      active: 'bg-success/10 text-success',
      closed: 'bg-warning/10 text-warning',
      archived: 'bg-surface text-text-secondary',
    };
    
    const labels = {
      draft: 'Brouillon',
      active: 'Actif',
      closed: 'Clôturé',
      archived: 'Archivé',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleNewProject = () => {
    if (!currentOrganization) {
      alert('Veuillez sélectionner une organisation');
      return;
    }
    router.push(`/onboarding/project?org=${currentOrganization.id}`);
  };

  const handleProjectClick = (project: Project) => {
    // TODO: Implémenter la navigation vers la page détaillée du projet
    console.log('Navigate to project:', project.id);
  };

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-warning" />
            <p className="text-text-secondary mb-4">
              Veuillez sélectionner une organisation pour voir les projets.
            </p>
            <Button onClick={() => router.push('/onboarding/organization')}>
              Créer une organisation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-48 bg-surface-hover animate-pulse rounded"></div>
            <div className="h-5 w-64 bg-surface-hover animate-pulse rounded mt-2"></div>
          </div>
          <div className="h-10 w-40 bg-surface-hover animate-pulse rounded"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-20 bg-surface-hover animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-hover animate-pulse rounded"></div>
                  <div className="h-4 bg-surface-hover animate-pulse rounded"></div>
                  <div className="h-4 bg-surface-hover animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projets</h1>
          <p className="text-text-secondary mt-2">
            {currentOrganization.name}
          </p>
        </div>
        <Button onClick={handleNewProject}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projets
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalStats.totalProjects}</div>
            <p className="text-xs text-text-secondary">
              {globalStats.activeProjects} actif{globalStats.activeProjects > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Budget Total
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(globalStats.totalBudget)}</div>
            <p className="text-xs text-text-secondary">
              Tous les projets confondus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde Global
            </CardTitle>
            {globalStats.totalBalance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-error" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${globalStats.totalBalance >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(globalStats.totalBalance)}
            </div>
            <p className="text-xs text-text-secondary">
              {globalStats.totalBalance >= 0 ? 'Excédent' : 'Déficit'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions
            </CardTitle>
            <Users className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-text-secondary">
              Toutes organisations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="closed">Clôturé</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50 text-text-secondary" />
            <p className="text-text-secondary mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Aucun projet ne correspond à vos filtres'
                : 'Aucun projet pour le moment'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={handleNewProject}>
                <Plus className="mr-2 h-4 w-4" />
                Créer votre premier projet
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const budget = project.budgetCategories?.reduce((sum, cat) => sum + (cat.budgetedAmount || 0), 0) || 0;
            const budgetUsedPercent = project.stats.budgetUsedPercent;
            const isOverBudget = budgetUsedPercent > 100;

            return (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-all cursor-pointer group relative"
                onClick={() => handleProjectClick(project)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FolderKanban className={`h-8 w-8 ${
                      project.status === 'active' ? 'text-primary' : 'text-text-secondary'
                    }`} />
                    {getStatusBadge(project.status)}
                  </div>
                  <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    Année fiscale {project.fiscalYear} • Créé le {project.createdAt ? formatDate(project.createdAt as any) : 'N/A'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Budget */}
                    {budget > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text-secondary">Budget</span>
                          <span className="font-medium">{formatCurrency(budget)}</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              isOverBudget ? 'bg-error' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                          {budgetUsedPercent.toFixed(1)}% utilisé
                          {isOverBudget && ' - Dépassement !'}
                        </p>
                      </div>
                    )}

                    {/* Dépenses */}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Dépenses</span>
                      <span className="font-medium text-error">
                        {formatCurrency(project.stats.totalExpenses)}
                      </span>
                    </div>

                    {/* Recettes */}
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Recettes</span>
                      <span className="font-medium text-success">
                        {formatCurrency(project.stats.totalRevenues)}
                      </span>
                    </div>

                    {/* Solde */}
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="font-medium">Solde</span>
                      <span className={`font-bold ${
                        project.stats.balance >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {formatCurrency(project.stats.balance)}
                      </span>
                    </div>

                    {/* Nombre de transactions */}
                    <div className="flex items-center gap-2 text-xs text-text-secondary pt-2">
                      <Users className="h-3 w-3" />
                      {project.stats.totalTransactions} transaction{project.stats.totalTransactions > 1 ? 's' : ''}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit project:', project.id);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('More actions:', project.id);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
