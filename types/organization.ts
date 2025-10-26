import { Timestamp } from 'firebase/firestore';

export interface Organization {
  id: string;
  name: string;
  siret?: string;
  legalForm: 'association' | 'entreprise';
  address: string;
  email: string;
  phone: string;
  vatEnabled: boolean;
  vatRate?: number;
  logoUrl?: string;
  ownerId: string; // ID du propriétaire principal
  memberIds?: string[]; // IDs des membres (pour requêtes rapides)
  subscriptionTier: 'free' | 'starter' | 'premium' | 'enterprise';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEndsAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  fiscalYearStart: string; // 'MM-DD'
  accountingPlan: 'associatif' | 'standard';
  currency: 'EUR' | 'USD' | 'GBP';
  googleDriveFolderId?: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  budgetAlertThreshold: number; // Pourcentage (ex: 80)
  reminderDaysBeforeDue: number; // Jours avant échéance
  notifyAllCAOnNewEntry: boolean;
  notifyTreasurerOnly: boolean;
}

