'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuthContext } from '@/components/providers/auth-provider';
import { Organization, Project } from '@/types';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  currentProject: Project | null;
  organizations: Organization[];
  projects: Project[];
  setCurrentOrganization: (orgId: string) => void;
  setCurrentProject: (projectId: string) => void;
  loading: boolean;
  refreshOrganizations: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les organisations de l'utilisateur
  const refreshOrganizations = async () => {
    // Vérifier que user existe et a un id
    if (!user || !user.id) {
      console.log('User not loaded yet or missing id');
      return;
    }

    try {
      console.log('Loading organizations for user:', user.id);
      
      // Requête réelle : récupérer les organisations où l'utilisateur est propriétaire
      const orgsQuery = query(
        collection(db, 'organizations'),
        where('ownerId', '==', user.id)
      );
      
      const snapshot = await getDocs(orgsQuery);
      const orgsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Organization));
      
      console.log(`Found ${orgsData.length} organization(s):`, orgsData);
      setOrganizations(orgsData);

      // Si pas d'organisation courante mais qu'il y en a au moins une, sélectionner la première
      if (!currentOrganization && orgsData.length > 0) {
        setCurrentOrganizationState(orgsData[0]);
        localStorage.setItem('currentOrganizationId', orgsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  // Récupérer les projets de l'organisation courante
  const refreshProjects = async () => {
    if (!currentOrganization || !currentOrganization.id) {
      console.log('No organization selected');
      return;
    }

    try {
      console.log('Loading projects for organization:', currentOrganization.id);
      
      // Requête réelle : récupérer les projets de l'organisation
      const projectsQuery = query(
        collection(db, 'projects'),
        where('organizationId', '==', currentOrganization.id)
      );
      
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Project));
      
      console.log(`Found ${projectsData.length} project(s):`, projectsData);
      setProjects(projectsData);

      // Si pas de projet courant mais qu'il y en a au moins un, sélectionner le premier
      if (!currentProject && projectsData.length > 0) {
        setCurrentProjectState(projectsData[0]);
        localStorage.setItem('currentProjectId', projectsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Changer d'organisation
  const setCurrentOrganization = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrganizationState(org);
      setCurrentProjectState(null); // Reset le projet
      localStorage.setItem('currentOrganizationId', orgId);
      localStorage.removeItem('currentProjectId');
    }
  };

  // Changer de projet
  const setCurrentProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectState(project);
      localStorage.setItem('currentProjectId', projectId);
    }
  };

  // Initialisation : récupérer les organisations et restaurer la sélection depuis localStorage
  useEffect(() => {
    if (user) {
      setLoading(true);
      refreshOrganizations().then(() => {
        // Restaurer l'organisation depuis localStorage
        const savedOrgId = localStorage.getItem('currentOrganizationId');
        if (savedOrgId) {
          const org = organizations.find(o => o.id === savedOrgId);
          if (org) {
            setCurrentOrganizationState(org);
          }
        }
        setLoading(false);
      });
    }
  }, [user]);

  // Récupérer les projets quand l'organisation change
  useEffect(() => {
    if (currentOrganization) {
      refreshProjects().then(() => {
        // Restaurer le projet depuis localStorage
        const savedProjectId = localStorage.getItem('currentProjectId');
        if (savedProjectId) {
          const project = projects.find(p => p.id === savedProjectId);
          if (project) {
            setCurrentProjectState(project);
          }
        }
      });
    } else {
      setProjects([]);
      setCurrentProjectState(null);
    }
  }, [currentOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        currentProject,
        organizations,
        projects,
        setCurrentOrganization,
        setCurrentProject,
        loading,
        refreshOrganizations,
        refreshProjects,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

