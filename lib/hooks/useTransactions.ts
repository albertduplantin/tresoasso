'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Transaction } from '@/types';

export function useTransactions(organizationId: string | null, projectId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId || !projectId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('organizationId', '==', organizationId),
      where('projectId', '==', projectId),
      orderBy('transactionDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const transactionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[];
        
        setTransactions(transactionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching transactions:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [organizationId, projectId]);

  const createTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const transactionsRef = collection(db, 'transactions');
    const docRef = await addDoc(transactionsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const transactionRef = doc(db, 'transactions', id);
    await updateDoc(transactionRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteTransaction = async (id: string) => {
    const transactionRef = doc(db, 'transactions', id);
    await deleteDoc(transactionRef);
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

