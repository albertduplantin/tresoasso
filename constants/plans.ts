import { SubscriptionPlan } from '@/types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    interval: 'month',
    features: [
      "Jusqu'à 100 transactions/an",
      '1 projet',
      '3 utilisateurs',
      'Export Excel basique',
      'Support communautaire',
    ],
    limits: {
      transactions: 100,
      projects: 1,
      users: 3,
      storage: 1 * 1024 * 1024 * 1024, // 1GB
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 1900, // 19€/mois
    interval: 'month',
    features: [
      'Transactions illimitées',
      '3 projets',
      '10 utilisateurs',
      'Exports avancés (PDF, Excel)',
      'Intégration Google Drive',
      'Support email',
      'Notifications personnalisées',
    ],
    limits: {
      transactions: Infinity,
      projects: 3,
      users: 10,
      storage: 10 * 1024 * 1024 * 1024, // 10GB
    },
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4900, // 49€/mois
    interval: 'month',
    features: [
      'Tout Starter +',
      'Projets illimités',
      'Utilisateurs illimités',
      'Rapprochement bancaire',
      'Analytics avancés',
      'Export comptable automatique',
      'API access',
      'Support prioritaire',
      'Audit trail complet',
    ],
    limits: {
      transactions: Infinity,
      projects: Infinity,
      users: Infinity,
      storage: 50 * 1024 * 1024 * 1024, // 50GB
    },
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0, // Sur devis
    interval: 'month',
    features: [
      'Tout Premium +',
      'Déploiement on-premise optionnel',
      'SSO (SAML)',
      'SLA 99.9%',
      'Support dédié 24/7',
      'Formation personnalisée',
      'Intégrations sur mesure',
      'Consulting stratégique',
    ],
    limits: {
      transactions: Infinity,
      projects: Infinity,
      users: Infinity,
      storage: Infinity,
    },
  },
];

export const getPlanByTier = (tier: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === tier);
};

