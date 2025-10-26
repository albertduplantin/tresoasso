import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'treasurer' | 'board_member' | 'viewer';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  organizations: OrganizationMembership[];
  preferences: UserPreferences;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface OrganizationMembership {
  organizationId: string;
  role: UserRole;
  permissions: string[];
  joinedAt: Timestamp;
}

export interface UserPreferences {
  language: 'fr' | 'en';
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

