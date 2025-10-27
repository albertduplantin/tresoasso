'use client';

import { useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Archive,
  Download,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  Users,
  FileText,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/lib/contexts/organization-context';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useProjects } from '@/lib/hooks/useProjects';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { StatusBadge, CertaintyBadge } from '@/components/transactions/status-badge';
import { ProjectEditDialog } from '@/components/projects/project-edit-dialog';
import { exportProjectToCSV, exportProjectReport } from '@/lib/utils/export';
import { BUDGET_CATEGORIES } from '@/constants';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();
  const { projects, currentOrganization } = useOrganization();
  const { transactions, loading } = useTransactions();
  const { updateProject } = useProjects(currentOrganization?.id || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Trouver le projet
  const project = projects.find(p => p.id === projectId);

  // Filtrer les transactions du projet
  const projectTransactions = useMemo(() => {
    return transactions.filter(t => t.projectId === projectId);
  }, [transactions, projectId]);

  // Calculer les stats
  const stats = useMemo(() => {
    const revenues = projectTransactions.filter(t => t.type === 'revenue');
    const expenses = projectTransactions.filter(t => t.type === 'expense');

    const totalRevenues = revenues.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    const confirmedRevenues = revenues.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0);
    const confirmedExpenses = expenses.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0);

    const probableRevenues = revenues.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0);
    const probableExpenses = expenses.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0);

    const potentialRevenues = revenues.filter(t => t.certainty === 'potential').reduce((sum, t) => sum + t.amount, 0);
    const potentialExpenses = expenses.filter(t => t.certainty === 'potential').reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = project?.budgetCategories?.reduce((sum, cat) => sum + (cat.budgetedAmount || 0), 0) || 0;

    return {
      totalTransactions: projectTransactions.length,
      totalRevenues,
      totalExpenses,
      balance: totalRevenues - totalExpenses,
      confirmedBalance: confirmedRevenues - confirmedExpenses,
      probableBalance: probableRevenues - probableExpenses,
      potentialBalance: potentialRevenues - potentialExpenses,
      totalBudget,
      budgetUsed: totalExpenses,
      budgetRemaining: totalBudget - totalExpenses,
      budgetUsedPercent: totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0,
      confirmedRevenues,
      confirmedExpenses,
      probableRevenues,
      probableExpenses,
      potentialRevenues,
      potentialExpenses,
    };
  }, [projectTransactions, project]);

  // Stats par catégorie
  const categoryStats = useMemo(() => {
    const stats = new Map();

    projectTransactions.forEach(transaction => {
      const category = BUDGET_CATEGORIES.find(c => c.id === transaction.categoryId);
      if (!category) return;

      if (!stats.has(category.id)) {
        stats.set(category.id, {
          category,
          total: 0,
          count: 0,
          budgeted: project?.budgetCategories?.find(c => c.id === category.id)?.budgetedAmount || 0,
        });
      }

      const stat = stats.get(category.id);
      stat.total += transaction.amount;
      stat.count += 1;
    });

    return Array.from(stats.values()).sort((a, b) => b.total - a.total);
  }, [projectTransactions, project]);

  const handleSaveProject = async (data: Partial<typeof project>) => {
    try {
      await updateProject(projectId, data);
      // Le projet sera automatiquement mis à jour via le context
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-warning" />
            <p className="text-text-secondary mb-4">
              Projet non trouvé
            </p>
            <Button onClick={() => router.push('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-success/10 text-success',
      closed: 'bg-warning/10 text-warning',
      archived: 'bg-surface text-text-secondary',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/projects')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux projets
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge className={getStatusColor(project.status)}>
                  {project.status === 'active' ? 'Actif' : 
                   project.status === 'draft' ? 'Brouillon' :
                   project.status === 'closed' ? 'Clôturé' : 'Archivé'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Année fiscale {project.fiscalYear}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {stats.totalTransactions} transaction{stats.totalTransactions > 1 ? 's' : ''}
                </span>
                {currentOrganization && (
                  <span>{currentOrganization.name}</span>
                )}
              </div>

              {project.description && (
                <p className="text-text-secondary mt-2">{project.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          
          {/* Menu Export */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            
            {exportMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-card-background border border-border rounded-lg shadow-lg z-20">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface flex items-center gap-2 rounded-t-lg"
                    onClick={() => {
                      exportProjectToCSV(project, projectTransactions);
                      setExportMenuOpen(false);
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Exporter en CSV
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface flex items-center gap-2 rounded-b-lg"
                    onClick={() => {
                      exportProjectReport(project, projectTransactions);
                      setExportMenuOpen(false);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimer le rapport
                  </button>
                </div>
              </>
            )}
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPIs Rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <Wallet className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</div>
            <p className="text-xs text-text-secondary">
              {stats.budgetUsedPercent.toFixed(1)}% utilisé
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">{formatCurrency(stats.totalExpenses)}</div>
            <p className="text-xs text-text-secondary">
              {formatCurrency(stats.confirmedExpenses)} certaines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.totalRevenues)}</div>
            <p className="text-xs text-text-secondary">
              {formatCurrency(stats.confirmedRevenues)} certaines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
            {stats.balance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-error" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-text-secondary">
              {stats.balance >= 0 ? 'Excédent' : 'Déficit'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <FileText className="mr-2 h-4 w-4" />
            Transactions ({stats.totalTransactions})
          </TabsTrigger>
          <TabsTrigger value="budget">
            <Wallet className="mr-2 h-4 w-4" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Équipe
          </TabsTrigger>
        </TabsList>

        {/* Onglet Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Montants par certitude */}
            <Card>
              <CardHeader>
                <CardTitle>Montants par Certitude</CardTitle>
                <CardDescription>Répartition des montants selon leur niveau de certitude</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Certains</span>
                    <span className="text-success font-bold">
                      {formatCurrency(stats.confirmedRevenues + stats.confirmedExpenses)}
                    </span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats.confirmedRevenues + stats.confirmedExpenses) /
                            (stats.totalRevenues + stats.totalExpenses)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Probables</span>
                    <span className="text-warning font-bold">
                      {formatCurrency(stats.probableRevenues + stats.probableExpenses)}
                    </span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats.probableRevenues + stats.probableExpenses) /
                            (stats.totalRevenues + stats.totalExpenses)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Hypothétiques</span>
                    <span className="text-potential font-bold">
                      {formatCurrency(stats.potentialRevenues + stats.potentialExpenses)}
                    </span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2">
                    <div
                      className="bg-potential h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats.potentialRevenues + stats.potentialExpenses) /
                            (stats.totalRevenues + stats.totalExpenses)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget restant */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Restant</CardTitle>
                <CardDescription>Progression de l'utilisation du budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Utilisé</span>
                      <span className="font-bold">{formatCurrency(stats.budgetUsed)}</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          stats.budgetUsedPercent > 100
                            ? 'bg-error'
                            : stats.budgetUsedPercent > 80
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(100, stats.budgetUsedPercent)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {stats.budgetUsedPercent.toFixed(1)}% du budget total
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-text-secondary">Restant</p>
                      <p className={`text-lg font-bold ${stats.budgetRemaining >= 0 ? 'text-success' : 'text-error'}`}>
                        {formatCurrency(stats.budgetRemaining)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Total</p>
                      <p className="text-lg font-bold">{formatCurrency(stats.totalBudget)}</p>
                    </div>
                  </div>

                  {stats.budgetUsedPercent > 100 && (
                    <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-error" />
                      <p className="text-sm text-error">
                        Dépassement de budget de {formatCurrency(Math.abs(stats.budgetRemaining))}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Soldes par certitude */}
          <Card>
            <CardHeader>
              <CardTitle>Soldes par Niveau de Certitude</CardTitle>
              <CardDescription>Impact de chaque niveau de certitude sur le solde global</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">Solde Certain</p>
                  <p className={`text-xl font-bold ${stats.confirmedBalance >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(stats.confirmedBalance)}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    {formatCurrency(stats.confirmedRevenues)} - {formatCurrency(stats.confirmedExpenses)}
                  </p>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">Solde Probable</p>
                  <p className={`text-xl font-bold ${stats.probableBalance >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(stats.probableBalance)}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    {formatCurrency(stats.probableRevenues)} - {formatCurrency(stats.probableExpenses)}
                  </p>
                </div>

                <div className="p-4 bg-surface border rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">Solde Hypothétique</p>
                  <p className={`text-xl font-bold ${stats.potentialBalance >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatCurrency(stats.potentialBalance)}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    {formatCurrency(stats.potentialRevenues)} - {formatCurrency(stats.potentialExpenses)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Transactions */}
        <TabsContent value="transactions" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : projectTransactions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50 text-text-secondary" />
                <p className="text-text-secondary mb-4">Aucune transaction pour ce projet</p>
                <Button onClick={() => router.push('/transactions')}>
                  Créer une transaction
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projectTransactions.map((transaction) => {
                const category = BUDGET_CATEGORIES.find(c => c.id === transaction.categoryId);

                return (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{transaction.description}</h3>
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
                              {formatDate(transaction.transactionDate)}
                            </div>
                          </div>

                          {transaction.notes && (
                            <p className="text-sm text-text-secondary mt-2 italic">{transaction.notes}</p>
                          )}
                        </div>

                        <div className="text-right ml-4">
                          <div
                            className={`text-2xl font-bold ${
                              transaction.type === 'revenue' ? 'text-success' : 'text-error'
                            }`}
                          >
                            {transaction.type === 'revenue' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Onglet Budget */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Catégorie</CardTitle>
              <CardDescription>Dépenses réelles vs budget prévisionnel par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryStats.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <p>Aucune catégorie utilisée pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryStats.map((stat) => {
                    const usedPercent = stat.budgeted > 0 ? (stat.total / stat.budgeted) * 100 : 0;
                    const isOverBudget = usedPercent > 100;

                    return (
                      <div key={stat.category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium">{stat.category.name}</p>
                            <p className="text-xs text-text-secondary">
                              {stat.count} transaction{stat.count > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-error">{formatCurrency(stat.total)}</p>
                            {stat.budgeted > 0 && (
                              <p className="text-xs text-text-secondary">
                                / {formatCurrency(stat.budgeted)}
                              </p>
                            )}
                          </div>
                        </div>

                        {stat.budgeted > 0 && (
                          <div>
                            <div className="w-full bg-surface rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  isOverBudget ? 'bg-error' : usedPercent > 80 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${Math.min(100, usedPercent)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              {usedPercent.toFixed(1)}% utilisé
                              {isOverBudget && ' - Dépassement !'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Équipe */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de l'Équipe</CardTitle>
              <CardDescription>Gérer les membres et les permissions du projet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-text-secondary">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="mb-2">Fonctionnalité à venir</p>
                <p className="text-sm">
                  Vous pourrez bientôt assigner des trésoriers et gérer les permissions par projet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de modification */}
      {project && (
        <ProjectEditDialog
          project={project}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
}

