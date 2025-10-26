import { Timestamp } from 'firebase/firestore';

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  entityType: 'transaction' | 'project' | 'supplier' | 'user';
  entityId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}

