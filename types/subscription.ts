export type SubscriptionTier = 'free' | 'starter' | 'premium' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number; // en centimes
  interval: 'month' | 'year';
  features: string[];
  limits: SubscriptionLimits;
  stripePriceId?: string;
}

export interface SubscriptionLimits {
  transactions: number;
  projects: number;
  users: number;
  storage: number; // en bytes
}

