'use client';

import { Building2, FolderKanban, ChevronDown, Plus } from 'lucide-react';
import { useOrganization } from '@/lib/contexts/organization-context';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();
  const {
    currentOrganization,
    currentProject,
    organizations,
    projects,
    setCurrentOrganization,
    setCurrentProject,
    loading,
  } = useOrganization();

  if (loading) {
    return (
      <div className="bg-surface border-b border-border p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-64 bg-surface-hover animate-pulse rounded"></div>
          <div className="h-10 w-64 bg-surface-hover animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  // Si aucune organisation n'existe
  if (organizations.length === 0) {
    return (
      <div className="bg-surface border-b border-border p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-text-secondary" />
            <div>
              <p className="text-sm font-medium">Aucune organisation</p>
              <p className="text-xs text-text-secondary">
                Créez votre première organisation pour commencer
              </p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/onboarding/organization')}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une organisation
          </Button>
        </div>
      </div>
    );
  }

  // Si pas de projet dans l'organisation
  const hasNoProjects = currentOrganization && projects.length === 0;

  return (
    <div className="bg-surface border-b border-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Sélecteurs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Sélecteur d'organisation */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Building2 className="w-5 h-5 text-text-secondary flex-shrink-0" />
            <Select
              value={currentOrganization?.id || ''}
              onValueChange={setCurrentOrganization}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue>
                  {currentOrganization?.name || 'Sélectionner une organisation'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélecteur de projet */}
          {currentOrganization && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FolderKanban className="w-5 h-5 text-text-secondary flex-shrink-0" />
              {hasNoProjects ? (
                <Button
                  onClick={() => router.push(`/onboarding/project?org=${currentOrganization.id}`)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un projet
                </Button>
              ) : (
                <Select
                  value={currentProject?.id || ''}
                  onValueChange={setCurrentProject}
                >
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue>
                      {currentProject?.name || 'Sélectionner un projet'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        {/* Actions rapides */}
        {currentOrganization && !hasNoProjects && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/projects')}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet
            </Button>
          </div>
        )}
      </div>

      {/* Message d'aide si organisation mais pas de projet */}
      {hasNoProjects && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning-foreground">
            💡 <strong>Créez votre premier projet</strong> pour commencer à gérer vos budgets et transactions.
          </p>
        </div>
      )}
    </div>
  );
}

