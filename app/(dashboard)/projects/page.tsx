'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projets</h1>
          <p className="text-text-secondary mt-2">
            Gérez vos différents projets et événements
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <FolderKanban className="h-8 w-8 text-primary" />
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                Actif
              </span>
            </div>
            <CardTitle className="mt-4">Festival Film Court 2024</CardTitle>
            <CardDescription>
              Année fiscale 2024 • Créé le 01/01/2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Budget</span>
                <span className="font-medium">150 000 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Dépensé</span>
                <span className="font-medium text-error">87 450 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Recettes</span>
                <span className="font-medium text-success">95 200 €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-hover transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <FolderKanban className="h-8 w-8 text-secondary" />
              <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-full font-medium">
                Actif
              </span>
            </div>
            <CardTitle className="mt-4">Court Vers le Large 2024</CardTitle>
            <CardDescription>
              Année fiscale 2024 • Créé le 15/01/2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Budget</span>
                <span className="font-medium">80 000 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Dépensé</span>
                <span className="font-medium text-error">45 320 €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Recettes</span>
                <span className="font-medium text-success">52 100 €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

