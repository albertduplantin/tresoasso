import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  fiscalYear: number;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'draft' | 'active' | 'closed' | 'archived';
  visibility: ProjectVisibility;
  budgetCategories: BudgetCategory[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProjectVisibility {
  visibleToAll: boolean;
  visibleToUserIds: string[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'expense' | 'revenue';
  accountingCode?: string;
  budgetedAmount: number;
  color?: string;
  parentCategoryId?: string;
}

