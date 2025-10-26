'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
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
              Budget Total
            </CardTitle>
            <Wallet className="h-4 w-4 text-text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150 000 €</div>
            <p className="text-xs text-text-secondary">
              Budget prévisionnel 2024
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
            <div className="text-2xl font-bold">87 450 €</div>
            <p className="text-xs text-text-secondary">
              58% du budget utilisé
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
            <div className="text-2xl font-bold">95 200 €</div>
            <p className="text-xs text-text-secondary">
              +12% vs prévisionnel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 750 €</div>
            <p className="text-xs text-text-secondary">
              Solde actuel positif
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
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Certains</span>
                <span className="text-sm font-bold text-success">72 000 €</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Probables</span>
                <span className="text-sm font-bold text-warning">20 000 €</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Hypothétiques</span>
                <span className="text-sm font-bold text-potential">8 000 €</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div className="bg-potential h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors">
              <div className="flex-1">
                <p className="font-medium">AGENCE LUCKYTIME</p>
                <p className="text-sm text-text-secondary">Publicité • 15/01/2024</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-error">-1 800 €</p>
                <p className="text-xs text-success">Payé</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors">
              <div className="flex-1">
                <p className="font-medium">Subvention DRAC</p>
                <p className="text-sm text-text-secondary">Subvention • 10/01/2024</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">+15 000 €</p>
                <p className="text-xs text-warning">Confirmé</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-surface transition-colors">
              <div className="flex-1">
                <p className="font-medium">Location Matériel</p>
                <p className="text-sm text-text-secondary">Équipement • 05/01/2024</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-error">-2 300 €</p>
                <p className="text-xs text-text-secondary">Devis reçu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

