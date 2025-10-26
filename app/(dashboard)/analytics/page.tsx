'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-text-secondary mt-2">
          Analyses approfondies de vos finances
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Fonctionnalité en cours de développement...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

