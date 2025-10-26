'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SuppliersPage() {
  const mockSuppliers = [
    {
      id: '1',
      name: 'Agence Luckytime',
      type: 'supplier' as const,
      email: 'contact@luckytime.fr',
      totalTransactions: 3,
      totalAmount: 5400,
    },
    {
      id: '2',
      name: 'DRAC Bretagne',
      type: 'grant_agency' as const,
      email: 'drac@culture.gouv.fr',
      totalTransactions: 1,
      totalAmount: 15000,
    },
    {
      id: '3',
      name: 'Location Pro',
      type: 'supplier' as const,
      email: 'contact@locationpro.fr',
      totalTransactions: 2,
      totalAmount: 4600,
    },
  ];

  const typeLabels = {
    supplier: 'Fournisseur',
    sponsor: 'Sponsor',
    grant_agency: 'Subventions',
    partner: 'Partenaire',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fournisseurs & Partenaires</h1>
          <p className="text-text-secondary mt-2">
            Gérez votre carnet d'adresses professionnel
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau fournisseur
        </Button>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Rechercher un fournisseur..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-hover transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {typeLabels[supplier.type]}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary">{supplier.email}</p>
              </div>
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Transactions</span>
                  <span className="font-medium">{supplier.totalTransactions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Montant total</span>
                  <span className="font-medium">{supplier.totalAmount.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

