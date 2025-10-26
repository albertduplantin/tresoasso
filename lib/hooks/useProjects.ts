'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Project } from '@/types';

export function useProjects(organizationId: string | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const projectsRef = collection(db, 'projects');
    const q = query(
      projectsRef,
      where('organizationId', '==', organizationId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        
        setProjects(projectsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [organizationId]);

  const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
  };
}

