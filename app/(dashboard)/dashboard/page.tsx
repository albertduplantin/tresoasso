'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, FileText } from 'lucide-react';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useOrganization } from '@/lib/contexts/organization-context';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { transactions, loading, getStats } = useTransactions();
  const { currentOrganization, currentProject } = useOrganization();

  // Calculer les statistiques
  const stats = getStats();

  // Transactions récentes (top 5)
  const recentTransactions = transactions.slice(0, 5);

  // Si pas d'organisation ou de projet sélectionné
  if (!currentOrganization || !currentProject) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary mt-2">
            Vue d'ensemble de votre situation financière
          </p>
        </div>

        <Card className="bg-info/5 border-info/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-info" />
              <div>
                <p className="font-medium">Aucun projet sélectionné</p>
                <p className="text-sm text-text-secondary mt-1">
                  Sélectionnez une organisation et un projet dans le header ci-dessus pour voir vos données financières.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage en chargement
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-text-secondary mt-2">
            Vue d'ensemble de votre situation financière
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-20 bg-surface-hover animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-surface-hover animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Vue d'ensemble de votre situation financière
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions
            </CardTitle>
            <FileText className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-text-secondary">
              {stats.confirmed} certaines, {stats.probable} probables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dépenses
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Recettes
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Solde
            </CardTitle>
            <Wallet className={`h-4 w-4 ${stats.balance >= 0 ? 'text-success' : 'text-error'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-text-secondary">
              {stats.balance >= 0 ? 'Solde positif' : 'Solde négatif'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Montants certains vs hypothétiques */}
      <Card>
        <CardHeader>
          <CardTitle>Montants Certains vs Hypothétiques</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.total > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Certains</span>
                  <span className="text-sm font-bold text-success">
                    {formatCurrency((stats.confirmedRevenues || 0) + (stats.confirmedExpenses || 0))}
                  </span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, ((stats.confirmedRevenues + stats.confirmedExpenses) / (stats.totalRevenues + stats.totalExpenses)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Probables</span>
                  <span className="text-sm font-bold text-warning">
                    {formatCurrency((stats.probableRevenues || 0) + (stats.probableExpenses || 0))}
                  </span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, ((stats.probableRevenues + stats.probableExpenses) / (stats.totalRevenues + stats.totalExpenses)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Hypothétiques</span>
                  <span className="text-sm font-bold text-potential">
                    {formatCurrency((stats.potentialRevenues || 0) + (stats.potentialExpenses || 0))}
                  </span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className="bg-potential h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, ((stats.potentialRevenues + stats.potentialExpenses) / (stats.totalRevenues + stats.totalExpenses)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <p>Aucune transaction pour le moment</p>
              <p className="text-sm mt-2">Créez votre première transaction pour voir les statistiques</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.counterparty.name}</p>
                    <p className="text-sm text-text-secondary">
                      {transaction.description} • {format(new Date(transaction.transactionDate), 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'expense' ? 'text-error' : 'text-success'}`}>
                      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-text-secondary capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Aucune transaction</p>
              <p className="text-sm mt-2">Créez votre première transaction pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

