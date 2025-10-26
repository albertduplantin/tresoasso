# TrésoAsso - Gestion Financière pour Associations

Application web moderne de gestion budgétaire et comptable destinée aux associations culturelles (festivals, événements). Suivi en temps réel des recettes et dépenses, avec distinction entre montants certains et hypothétiques.

## 🚀 Technologies

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Deployment**: Vercel

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Un compte Firebase (gratuit)
- Un compte Vercel (optionnel, pour le déploiement)

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd tresoasso
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Firebase**

Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)

Activez les services suivants :
- Authentication (Email/Password et Google)
- Firestore Database
- Storage

4. **Variables d'environnement**

Créez un fichier `.env.local` à la racine :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application
NEXT_PUBLIC_URL=http://localhost:3000
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
tresoasso/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Pages du dashboard
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── projects/
│   │   ├── suppliers/
│   │   ├── reports/
│   │   ├── analytics/
│   │   └── settings/
│   ├── globals.css        # Styles globaux et design system
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
│
├── components/
│   ├── ui/                # Composants shadcn/ui
│   ├── layouts/           # Layouts (Sidebar, Header)
│   ├── transactions/      # Composants spécifiques transactions
│   └── providers/         # Context providers
│
├── lib/
│   ├── firebase/          # Configuration Firebase
│   ├── hooks/             # Custom React hooks
│   ├── validations/       # Schémas Zod
│   ├── formatters.ts      # Fonctions de formatage
│   ├── calculations.ts    # Calculs métier
│   └── utils.ts           # Utilitaires
│
├── types/                 # Définitions TypeScript
│   ├── organization.ts
│   ├── project.ts
│   ├── transaction.ts
│   ├── user.ts
│   └── supplier.ts
│
├── constants/             # Constantes de l'app
│   ├── categories.ts      # Catégories comptables
│   ├── statuses.ts        # Statuts des transactions
│   └── plans.ts           # Plans d'abonnement
│
└── public/                # Assets statiques
```

## 🎨 Design System

Le design system est basé sur les variables CSS définies dans `app/globals.css` :

- **Couleurs principales** : Primary (Indigo), Secondary (Violet), Success (Vert), Warning (Orange), Error (Rouge)
- **Couleurs de certitude** : Certain (Vert), Probable (Orange), Potentiel (Gris)
- **Mode sombre** : Supporté automatiquement via `prefers-color-scheme`
- **Typographie** : Inter (sans-serif), JetBrains Mono (monospace)
- **Composants** : shadcn/ui avec customisation

## 🔥 Fonctionnalités principales

### ✅ Implémentées (MVP)

- [x] Authentification (Email/Password + Google OAuth)
- [x] Dashboard avec KPIs en temps réel
- [x] Gestion des transactions (CRUD complet)
  - Formulaire avec validation Zod
  - Distinction certains/probables/hypothétiques
  - Statuts personnalisés dépenses/recettes
  - Catégories comptables associatives
- [x] Gestion des projets multi-projets
- [x] Gestion des fournisseurs/partenaires
- [x] Interface rapports et exports
- [x] Paramètres organisation
- [x] Navigation responsive avec sidebar
- [x] Design system complet avec mode sombre

### 🚧 En cours de développement

- [ ] Intégration Firebase complète (données réelles)
- [ ] Flow d'onboarding (création organisation + premier projet)
- [ ] Upload de documents (Firebase Storage)
- [ ] Exports Excel/CSV conformes plan comptable
- [ ] Graphiques interactifs (Recharts)
- [ ] Notifications et workflow de validation
- [ ] Permissions granulaires par rôle
- [ ] Intégration Stripe (SaaS)
- [ ] Rapprochement bancaire
- [ ] Analytics avancés

## 📊 Modèle de données

### Collections Firestore

```typescript
/organizations/{orgId}
  - name, siret, settings...

/projects/{projectId}
  - organizationId, name, fiscalYear, budgetCategories...

/transactions/{transactionId}
  - organizationId, projectId, type, amount, status, certainty...

/suppliers/{supplierId}
  - organizationId, name, type, totalTransactions...

/users/{userId}
  - email, displayName, role, organizations[], preferences...
```

## 🔐 Sécurité

- Authentification Firebase Auth
- Règles de sécurité Firestore (à configurer)
- Validation côté client (Zod) et serveur
- Protection des routes (middleware Next.js)
- Chiffrement des données sensibles

## 🚀 Déploiement

### Vercel (recommandé)

1. Push du code sur GitHub/GitLab
2. Import du projet sur Vercel
3. Configurer les variables d'environnement
4. Déploiement automatique

```bash
npm run build    # Build de production
npm run start    # Serveur de production local
```

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
```

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 👥 Contact

Pour toute question : contact@tresoasso.fr

## 🎯 Roadmap

### Phase 1 - MVP (En cours)
- ✅ Architecture de base
- ✅ Authentication
- ✅ Dashboard et navigation
- ✅ CRUD Transactions
- 🚧 Intégration Firebase complète
- 🚧 Exports comptables

### Phase 2 - SaaS
- Intégration Stripe
- Plans d'abonnement
- Admin dashboard
- Google Drive API

### Phase 3 - Avancé
- Rapprochement bancaire
- Budget prévisionnel intelligent
- Analytics ML
- Récurrence et automatisation

---

**TrésoAsso** - La gestion financière simplifiée pour les associations culturelles 🎭
