# 🏗️ Architecture - TrésoAsso

## Vue d'ensemble

TrésoAsso est une application web moderne construite avec Next.js 16 et Firebase, suivant les principes de Clean Architecture et Domain-Driven Design.

## Stack Technique

### Frontend
- **Framework** : Next.js 16 (App Router, Server Actions, Turbopack)
- **React** : 19 (avec les dernières fonctionnalités)
- **TypeScript** : 5+ (strict mode activé)
- **Styling** : Tailwind CSS v4 avec variables CSS personnalisées
- **Components** : shadcn/ui (Radix UI + styles personnalisés)
- **Forms** : React Hook Form + Zod validation
- **Charts** : Recharts (à intégrer)
- **Icons** : Lucide React

### Backend
- **Database** : Firebase Firestore (NoSQL, temps réel)
- **Authentication** : Firebase Auth (Email/Password + Google OAuth)
- **Storage** : Firebase Storage
- **Functions** : Next.js API Routes + Server Actions

### Dev Tools
- **Package Manager** : npm
- **Linter** : ESLint (config Next.js)
- **Build** : Turbopack (Next.js 16)
- **Deployment** : Vercel

## Architecture des Dossiers

```
tresoasso/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Route group - Authentification
│   │   ├── login/page.tsx         # Page de connexion
│   │   ├── register/page.tsx      # Page d'inscription
│   │   └── layout.tsx             # Layout auth
│   │
│   ├── (dashboard)/               # Route group - Dashboard
│   │   ├── dashboard/page.tsx     # Page principale dashboard
│   │   ├── transactions/page.tsx  # Liste des transactions
│   │   ├── projects/page.tsx      # Liste des projets
│   │   ├── suppliers/page.tsx     # Liste des fournisseurs
│   │   ├── reports/page.tsx       # Rapports et exports
│   │   ├── analytics/page.tsx     # Analytics avancés
│   │   ├── settings/page.tsx      # Paramètres
│   │   └── layout.tsx             # Layout dashboard avec sidebar
│   │
│   ├── globals.css                # Styles globaux + Design System
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
│
├── components/
│   ├── ui/                        # Composants UI de base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── tabs.tsx
│   │   └── toast.tsx
│   │
│   ├── layouts/                   # Composants de layout
│   │   └── sidebar.tsx            # Sidebar de navigation
│   │
│   ├── transactions/              # Composants spécifiques transactions
│   │   ├── transaction-form.tsx   # Formulaire création/édition
│   │   └── status-badge.tsx       # Badges de statut
│   │
│   └── providers/                 # Context Providers React
│       └── auth-provider.tsx      # AuthContext
│
├── lib/
│   ├── firebase/                  # Configuration Firebase
│   │   └── config.ts              # Initialisation Firebase
│   │
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useAuth.ts             # Hook authentification
│   │   ├── useTransactions.ts     # Hook gestion transactions
│   │   ├── useProjects.ts         # Hook gestion projets
│   │   └── index.ts
│   │
│   ├── validations/               # Schémas de validation Zod
│   │   └── schemas.ts             # Tous les schémas de validation
│   │
│   ├── formatters.ts              # Fonctions de formatage
│   ├── calculations.ts            # Calculs métier
│   └── utils.ts                   # Utilitaires (cn, etc.)
│
├── types/                         # Définitions TypeScript
│   ├── organization.ts            # Types Organisation
│   ├── project.ts                 # Types Projet
│   ├── transaction.ts             # Types Transaction
│   ├── user.ts                    # Types User
│   ├── supplier.ts                # Types Fournisseur
│   ├── audit.ts                   # Types Audit
│   ├── subscription.ts            # Types Abonnement
│   └── index.ts                   # Export centralisé
│
├── constants/                     # Constantes de l'application
│   ├── categories.ts              # Catégories comptables
│   ├── statuses.ts                # Statuts transactions
│   ├── plans.ts                   # Plans d'abonnement
│   └── index.ts
│
└── public/                        # Assets statiques
    ├── file.svg
    ├── globe.svg
    └── ...
```

## Patterns et Principes

### 1. Clean Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components, Pages, UI)                │
├─────────────────────────────────────────┤
│         Application Layer               │
│  (Hooks, Context, State Management)     │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│  (Types, Business Logic, Validations)   │
├─────────────────────────────────────────┤
│         Infrastructure Layer            │
│  (Firebase, API, External Services)     │
└─────────────────────────────────────────┘
```

**Règles** :
- Les dépendances pointent vers l'intérieur
- Le domaine ne dépend de rien
- L'infrastructure dépend du domaine
- La présentation utilise l'application qui utilise le domaine

### 2. Domain-Driven Design (DDD)

**Entités principales** :
- `Organization` : Association (aggregate root)
- `Project` : Projet événementiel (aggregate root)
- `Transaction` : Recette/Dépense (entity)
- `Supplier` : Fournisseur (entity)
- `User` : Utilisateur (entity)

**Value Objects** :
- `TransactionStatus` : Statut de transaction
- `TransactionCertainty` : Niveau de certitude
- `BudgetCategory` : Catégorie comptable
- `Counterparty` : Partie prenante

### 3. Repository Pattern

Les hooks personnalisés (`useTransactions`, `useProjects`) agissent comme des repositories :

```typescript
// Example: useTransactions
const {
  transactions,     // État
  loading,          // Chargement
  error,            // Erreur
  createTransaction, // Créer
  updateTransaction, // Mettre à jour
  deleteTransaction, // Supprimer
} = useTransactions(orgId, projectId);
```

## Flux de Données

### Authentification

```
User Action (Login)
    ↓
AuthProvider (Context)
    ↓
useAuth Hook
    ↓
Firebase Auth API
    ↓
onAuthStateChanged
    ↓
Update Context State
    ↓
Re-render Components
```

### CRUD Transaction

```
User fills TransactionForm
    ↓
React Hook Form validation (Zod)
    ↓
onSubmit → useTransactions.createTransaction()
    ↓
Firestore addDoc()
    ↓
Real-time listener (onSnapshot)
    ↓
Update local state
    ↓
UI re-renders with new data
```

## Design System

### Variables CSS (app/globals.css)

```css
:root {
  /* Colors */
  --primary: #6366f1;        /* Indigo */
  --secondary: #8b5cf6;      /* Violet */
  --success: #10b981;        /* Vert */
  --warning: #f59e0b;        /* Orange */
  --error: #ef4444;          /* Rouge */
  
  /* Certainty */
  --certain: #10b981;        /* Vert */
  --probable: #f59e0b;       /* Orange */
  --potential: #6b7280;      /* Gris */
  
  /* Neutrals */
  --background: #ffffff;
  --foreground: #111827;
  --surface: #f9fafb;
  --border: #e5e7eb;
}

/* Dark mode via prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --foreground: #f1f5f9;
    /* ... */
  }
}
```

### Composants UI

Tous les composants UI suivent le pattern shadcn/ui :
- Unstyled de base (Radix UI)
- Styles via Tailwind + cn()
- Variants via class-variance-authority
- Fully accessible (ARIA, keyboard)

## Sécurité

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isMemberOf(orgId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)/organizations/$(orgId));
    }
    
    // Rules
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    match /organizations/{orgId} {
      allow read: if isMemberOf(orgId);
      allow write: if isMemberOf(orgId) && hasRole('admin', orgId);
    }
    
    match /transactions/{transactionId} {
      allow read: if isMemberOf(resource.data.organizationId);
      allow create: if isMemberOf(request.resource.data.organizationId);
      allow update, delete: if isMemberOf(resource.data.organizationId) && 
        (hasRole('treasurer', resource.data.organizationId) || 
         resource.data.createdBy == request.auth.uid);
    }
  }
}
```

### Protection des Routes

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuthContext();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading]);
  
  // ...
}
```

## Performance

### Optimisations

1. **Code Splitting** : Automatique avec Next.js App Router
2. **Real-time Sync** : Firestore listeners avec onSnapshot
3. **Optimistic UI** : Updates locaux avant confirmation serveur
4. **Lazy Loading** : Composants chargés à la demande
5. **SSR/SSG** : Pages statiques pré-rendues (landing page)

### Monitoring

- Build Analytics : Next.js built-in
- Firebase Analytics : À activer
- Vercel Analytics : Automatique en production

## Déploiement

### Vercel (Recommandé)

```bash
# Connecter le repo GitHub
vercel

# Configurer les variables d'environnement
# Dans Vercel Dashboard > Settings > Environment Variables

# Deploy automatique à chaque push sur main
git push origin main
```

### Variables d'environnement requises

```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_URL
```

## Testing (À implémenter)

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Stack de tests recommandée

- **Unit/Integration** : Vitest + Testing Library
- **E2E** : Playwright
- **Mocking** : MSW (Mock Service Worker)

## Évolutions Futures

### Phase 2 - SaaS
- Stripe integration
- Multi-tenancy complet
- Admin dashboard
- API publique

### Phase 3 - Avancé
- Rapprochement bancaire
- ML prédictif
- Mobile app (React Native)
- Desktop app (Electron)

---

**Dernière mise à jour** : 26 octobre 2025

