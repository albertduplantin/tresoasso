import { Timestamp } from 'firebase/firestore';

export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  type: 'supplier' | 'sponsor' | 'grant_agency' | 'partner';
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  siret?: string;
  iban?: string;
  bic?: string;
  notes?: string;
  tags: string[];
  totalTransactions: number;
  totalAmount: number;
  lastTransactionDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

