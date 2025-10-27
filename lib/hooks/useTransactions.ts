'use client';

import { useState, useEffect } from 'react';
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
import { useOrganization } from '@/lib/contexts/organization-context';
import { useAuthContext } from '@/components/providers/auth-provider';

export function useTransactions() {
  const { currentOrganization, currentProject } = useOrganization();
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listener temps réel sur les transactions
  useEffect(() => {
    if (!currentOrganization || !currentProject) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('organizationId', '==', currentOrganization.id),
      where('projectId', '==', currentProject.id),
      orderBy('transactionDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactionsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            transactionDate: data.transactionDate instanceof Timestamp 
              ? data.transactionDate.toDate() 
              : new Date(data.transactionDate),
            dueDate: data.dueDate instanceof Timestamp 
              ? data.dueDate.toDate() 
              : data.dueDate ? new Date(data.dueDate) : undefined,
            invoiceDate: data.invoiceDate instanceof Timestamp 
              ? data.invoiceDate.toDate() 
              : data.invoiceDate ? new Date(data.invoiceDate) : undefined,
            createdAt: data.createdAt instanceof Timestamp 
              ? data.createdAt.toDate() 
              : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp 
              ? data.updatedAt.toDate() 
              : new Date(data.updatedAt),
          } as any;
        });
        setTransactions(transactionsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching transactions:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentOrganization, currentProject]);

  // Créer une transaction
  const createTransaction = async (data: any) => {
    if (!currentOrganization || !currentProject || !user) {
      throw new Error('Organization, project, or user not found');
    }

    // Convertir les dates string/Date en Timestamp Firestore
    const convertToTimestamp = (date: any) => {
      if (!date) return undefined;
      if (typeof date === 'string') return Timestamp.fromDate(new Date(date));
      if (date instanceof Date) return Timestamp.fromDate(date);
      return date;
    };

    // Construire l'objet counterparty en omettant les champs undefined/vides
    const counterparty: any = {
      name: data.counterpartyName,
      type: data.counterpartyType || 'other',
    };
    
    // Ajouter les champs optionnels seulement s'ils ont une valeur
    if (data.counterpartyEmail && data.counterpartyEmail.trim() !== '') {
      counterparty.contactEmail = data.counterpartyEmail.trim();
    }
    if (data.counterpartyPhone && data.counterpartyPhone.trim() !== '') {
      counterparty.contactPhone = data.counterpartyPhone.trim();
    }

    // Transformer les champs du formulaire en structure Transaction
    const transactionData: any = {
      organizationId: currentOrganization.id,
      projectId: currentProject.id,
      type: data.type,
      amount: Number(data.amount),
      description: data.description,
      categoryId: data.categoryId,
      status: data.status,
      certainty: data.certainty,
      transactionDate: convertToTimestamp(data.transactionDate),
      counterparty: counterparty,
      createdBy: user.id,
      assignedTo: data.assignedTo || user.id,
      documents: data.documents || [],
      tags: data.tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Ajouter les champs optionnels seulement s'ils ont une valeur
    if (data.notes && data.notes.trim() !== '') {
      transactionData.notes = data.notes.trim();
    }
    if (data.invoiceNumber && data.invoiceNumber.trim() !== '') {
      transactionData.invoiceNumber = data.invoiceNumber.trim();
    }
    if (data.paymentMethod) {
      transactionData.paymentMethod = data.paymentMethod;
    }
    if (data.vatAmount && Number(data.vatAmount) > 0) {
      transactionData.vatAmount = Number(data.vatAmount);
    }
    if (data.vatRate && Number(data.vatRate) > 0) {
      transactionData.vatRate = Number(data.vatRate);
    }

    // Ajouter les champs optionnels seulement s'ils existent
    if (data.dueDate) transactionData.dueDate = convertToTimestamp(data.dueDate);
    if (data.invoiceDate) transactionData.invoiceDate = convertToTimestamp(data.invoiceDate);

    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    return docRef.id;
  };

  // Mettre à jour une transaction
  const updateTransaction = async (id: string, data: any) => {
    if (!id) throw new Error('Transaction ID is required');

    const transactionRef = doc(db, 'transactions', id);
    
    // Transformer les champs du formulaire en structure Transaction
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (data.type) updateData.type = data.type;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.description) updateData.description = data.description;
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.status) updateData.status = data.status;
    if (data.certainty) updateData.certainty = data.certainty;
    if (data.transactionDate) updateData.transactionDate = data.transactionDate;
    if (data.dueDate) updateData.dueDate = data.dueDate;
    if (data.invoiceDate) updateData.invoiceDate = data.invoiceDate;
    if (data.notes) updateData.notes = data.notes;
    if (data.invoiceNumber) updateData.invoiceNumber = data.invoiceNumber;
    if (data.paymentMethod) updateData.paymentMethod = data.paymentMethod;
    if (data.vatAmount !== undefined) updateData.vatAmount = data.vatAmount;
    if (data.vatRate !== undefined) updateData.vatRate = data.vatRate;
    if (data.tags) updateData.tags = data.tags;

    // Transformer counterparty si les champs sont fournis
    if (data.counterpartyName) {
      updateData.counterparty = {
        name: data.counterpartyName,
        type: data.counterpartyType || 'other',
        contactEmail: data.counterpartyEmail || undefined,
        contactPhone: data.counterpartyPhone || undefined,
      };
    }

    await updateDoc(transactionRef, updateData);
  };

  // Supprimer une transaction
  const deleteTransaction = async (id: string) => {
    if (!id) throw new Error('Transaction ID is required');

    const transactionRef = doc(db, 'transactions', id);
    await deleteDoc(transactionRef);
  };

  // Statistiques
  const getStats = () => {
    const confirmed = transactions.filter(t => t.certainty === 'confirmed');
    const probable = transactions.filter(t => t.certainty === 'probable');
    const potential = transactions.filter(t => t.certainty === 'potential');

    const revenues = transactions.filter(t => t.type === 'revenue');
    const expenses = transactions.filter(t => t.type === 'expense');

    return {
      total: transactions.length,
      confirmed: confirmed.length,
      probable: probable.length,
      potential: potential.length,
      
      totalRevenues: revenues.reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: expenses.reduce((sum, t) => sum + t.amount, 0),
      
      confirmedRevenues: revenues.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0),
      confirmedExpenses: expenses.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0),
      
      probableRevenues: revenues.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0),
      probableExpenses: expenses.filter(t => t.certainty === 'probable').reduce((sum, t) => sum + t.amount, 0),
      
      potentialRevenues: revenues.filter(t => t.certainty === 'potential').reduce((sum, t) => sum + t.amount, 0),
      potentialExpenses: expenses.filter(t => t.certainty === 'potential').reduce((sum, t) => sum + t.amount, 0),
      
      balance: revenues.reduce((sum, t) => sum + t.amount, 0) - expenses.reduce((sum, t) => sum + t.amount, 0),
      confirmedBalance: 
        revenues.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0) -
        expenses.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0),
    };
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getStats,
  };
}
