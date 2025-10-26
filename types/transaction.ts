import { Timestamp } from 'firebase/firestore';

export type TransactionStatus = 
  // Recettes
  | 'revenue_verbal_promise'
  | 'revenue_application_sent'
  | 'revenue_confirmed'
  | 'revenue_received'
  // Dépenses
  | 'expense_quote_requested'
  | 'expense_quote_received'
  | 'expense_purchase_order_sent'
  | 'expense_invoice_received'
  | 'expense_paid'
  // Annulé
  | 'cancelled';

export type TransactionCertainty = 'confirmed' | 'probable' | 'potential';

export interface Transaction {
  id: string;
  organizationId: string;
  projectId: string;
  type: 'expense' | 'revenue';
  
  // Informations principales
  amount: number;
  description: string;
  categoryId: string;
  
  // Statut et cycle de vie
  status: TransactionStatus;
  certainty: TransactionCertainty;
  
  // Dates
  transactionDate: Timestamp;
  dueDate?: Timestamp;
  completedDate?: Timestamp;
  
  // Parties prenantes
  counterparty: Counterparty;
  
  // Suivi et responsabilité
  createdBy: string;
  assignedTo: string;
  validatedBy?: string;
  validatedAt?: Timestamp;
  
  // Documents
  documents: DocumentReference[];
  
  // Métadonnées
  tags: string[];
  notes?: string;
  internalNotes?: string;
  
  // Facturation
  invoiceNumber?: string;
  invoiceDate?: Timestamp;
  paymentMethod?: 'bank_transfer' | 'check' | 'cash' | 'card' | 'other';
  
  // TVA
  vatAmount?: number;
  vatRate?: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Récurrence
  isRecurring?: boolean;
  recurringConfig?: RecurringConfig;
}

export interface Counterparty {
  name: string;
  type: 'supplier' | 'sponsor' | 'grant' | 'individual' | 'other';
  contactEmail?: string;
  contactPhone?: string;
  siret?: string;
}

export interface DocumentReference {
  id: string;
  name: string;
  type: 'invoice' | 'quote' | 'contract' | 'grant_application' | 'receipt' | 'other';
  storageProvider: 'firebase' | 'google_drive';
  url: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
  size?: number;
  mimeType?: string;
}

export interface RecurringConfig {
  frequency: 'monthly' | 'quarterly' | 'yearly';
  startDate: Timestamp;
  endDate?: Timestamp;
  nextOccurrence: Timestamp;
}

