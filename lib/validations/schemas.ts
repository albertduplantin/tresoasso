import { z } from 'zod';

// Transaction Schema
export const transactionSchema = z.object({
  type: z.enum(['expense', 'revenue'], 'Le type de transaction est requis'),
  amount: z.number().positive('Le montant doit être positif'),
  description: z.string().min(3, 'La description doit contenir au moins 3 caractères'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  status: z.string(),
  certainty: z.enum(['confirmed', 'probable', 'potential']),
  transactionDate: z.date(),
  dueDate: z.date().optional(),
  counterpartyName: z.string().min(2, 'Le nom du partenaire est requis'),
  counterpartyType: z.enum(['supplier', 'sponsor', 'grant', 'individual', 'other']),
  counterpartyEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  counterpartyPhone: z.string().optional(),
  counterpartySiret: z.string().optional(),
  assignedTo: z.string().min(1, 'Responsable requis'),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  invoiceNumber: z.string().optional(),
  paymentMethod: z.enum(['bank_transfer', 'check', 'cash', 'card', 'other']).optional(),
  vatRate: z.number().min(0).max(100).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// Organization Schema
export const organizationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  legalForm: z.enum(['association', 'entreprise']),
  address: z.string().min(5, 'Adresse requise'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  siret: z.string().length(14, 'Le SIRET doit contenir 14 chiffres').optional().or(z.literal('')),
  vatEnabled: z.boolean().default(false),
  vatRate: z.number().min(0).max(100).optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Project Schema
export const projectSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  fiscalYear: z.number().int().min(2000).max(2100),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['draft', 'active', 'closed', 'archived']),
  visibleToAll: z.boolean().default(true),
  visibleToUserIds: z.array(z.string()).default([]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Supplier Schema
export const supplierSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  type: z.enum(['supplier', 'sponsor', 'grant_agency', 'partner']),
  contactName: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  siret: z.string().length(14, 'Le SIRET doit contenir 14 chiffres').optional().or(z.literal('')),
  iban: z.string().optional(),
  bic: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

// User Profile Schema
export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  language: z.enum(['fr', 'en']),
  theme: z.enum(['light', 'dark', 'auto']),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

