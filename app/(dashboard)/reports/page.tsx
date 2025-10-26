'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, FileSpreadsheet, FileType } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Bilan comptable',
      description: 'Actif et passif de l\'association',
      icon: FileText,
      format: 'PDF',
    },
    {
      title: 'Compte de résultat',
      description: 'Charges et produits de l\'exercice',
      icon: FileText,
      format: 'PDF',
    },
    {
      title: 'Budget prévisionnel',
      description: 'Prévisions pour l\'année N+1',
      icon: FileSpreadsheet,
      format: 'Excel',
    },
    {
      title: 'Export transactions',
      description: 'Liste complète des transactions',
      icon: FileSpreadsheet,
      format: 'CSV/Excel',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapports & Exports</h1>
        <p className="text-text-secondary mt-2">
          Générez vos documents comptables et exports
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={index} className="hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    Format: {report.format}
                  </span>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

