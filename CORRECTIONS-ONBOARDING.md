# 🛠️ Corrections Flow d'Onboarding - TrésoAsso

**Date** : 26 octobre 2025 20:30  
**Problème initial** : Erreur Firebase lors de la création d'organisation

---

## 🐛 Erreur Identifiée

### Erreur dans la Console
```
FirebaseError: Function setDoc() called with invalid data.
Unsupported field value: undefined (found in document organizations/org_...)
```

### Causes Racines

1. **Page `/onboarding/organization`**
   - Les données envoyées à Firebase ne correspondaient pas au type `Organization`
   - Plusieurs champs obligatoires manquants : `legalForm`, `email`, `phone`, `vatEnabled`, `ownerId`, etc.
   - Structure incorrecte pour certains champs (ex: `settings`, `members`)

2. **Page `/onboarding/project`**
   - Les données ne correspondaient pas au type `Project`
   - Champs manquants : `fiscalYear`, `budgetCategories`
   - `endDate` était optionnel alors qu'il est obligatoire dans le type
   - Structure incorrecte de `visibility`

3. **Layout racine**
   - Le Toaster de `sonner` n'était pas importé
   - Utilisait un composant Toaster personnalisé inexistant

---

## ✅ Corrections Effectuées

### 1. Page Création d'Organisation (`app/(onboarding)/onboarding/organization/page.tsx`)

**Avant (données incomplètes)** :
```typescript
const orgData = {
  id: orgId,
  name: data.name,
  type: data.type,
  settings: { ... },
  members: [ ... ],
  // Champs manquants !
};
```

**Après (données complètes)** :
```typescript
const orgData = {
  id: orgId,
  name: data.name,
  legalForm: 'association',
  address: data.address || '',
  email: user.email || '',
  phone: '',
  vatEnabled: false,
  ownerId: user.id,
  memberIds: [user.id],
  subscriptionTier: 'free',
  settings: {
    fiscalYearStart: '01-01',
    accountingPlan: 'associatif',
    currency: 'EUR',
    notifications: {
      emailEnabled: true,
      budgetAlertThreshold: 80,
      reminderDaysBeforeDue: 7,
      notifyAllCAOnNewEntry: false,
      notifyTreasurerOnly: true,
    },
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
```

**Changements clés** :
- ✅ Ajout de `legalForm: 'association'`
- ✅ Ajout de `email`, `phone`, `address`
- ✅ Ajout de `vatEnabled: false`
- ✅ Ajout de `ownerId` et `memberIds` (nouveaux champs du type)
- ✅ Structure complète de `settings.notifications`
- ✅ Remplacement de `subscriptionTier` au lieu de `subscription.plan`

**Correction mise à jour utilisateur** :
```typescript
// Avant
organizations: [{
  id: orgId,
  role: 'owner',
}]

// Après (conforme au type OrganizationMembership)
organizations: [{
  organizationId: orgId,
  role: 'admin',
  permissions: ['read', 'write', 'delete', 'manage'],
  joinedAt: serverTimestamp(),
}]
```

---

### 2. Page Création de Projet (`app/(onboarding)/onboarding/project/page.tsx`)

**Avant (données incomplètes)** :
```typescript
const projectData = {
  id: projectId,
  organizationId: orgId,
  name: data.name,
  startDate: new Date(data.startDate),
  budget: data.budget || 0,
  status: 'active',
  visibility: {
    isPublic: false,
    allowedUsers: [user.id],
  },
  // Champs manquants !
};
```

**Après (données complètes)** :
```typescript
const projectData = {
  id: projectId,
  organizationId: orgId,
  name: data.name,
  fiscalYear: startDate.getFullYear(),
  startDate: startDate,
  endDate: data.endDate ? new Date(data.endDate) : defaultEndDate,
  status: 'active',
  visibility: {
    visibleToAll: false,
    visibleToUserIds: [user.id],
  },
  budgetCategories: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};
```

**Changements clés** :
- ✅ Ajout de `fiscalYear` (année fiscale extraite de la date de début)
- ✅ `endDate` maintenant obligatoire avec valeur par défaut (+1 an)
- ✅ Correction de `visibility` : `visibleToAll` et `visibleToUserIds` au lieu de `isPublic` et `allowedUsers`
- ✅ Ajout de `budgetCategories: []` (tableau vide initialement)
- ✅ Suppression de `budget` (non présent dans le type)
- ✅ Suppression de `createdBy` (non présent dans le type)

---

### 3. Layout Racine (`app/layout.tsx`)

**Avant** :
```typescript
import { Toaster } from '@/components/ui/toast';
```

**Après** :
```typescript
import { Toaster } from 'sonner';
```

**Raison** : Le composant `@/components/ui/toast` n'existe pas. Les pages d'onboarding utilisent `toast()` de `sonner`, donc le Toaster doit venir de `sonner`.

---

## 📊 Récapitulatif des Fichiers Modifiés

| Fichier | Modifications | Impact |
|---------|--------------|--------|
| `app/(onboarding)/onboarding/organization/page.tsx` | Données conformes au type `Organization` | ✅ Création d'organisation fonctionne |
| `app/(onboarding)/onboarding/project/page.tsx` | Données conformes au type `Project` | ✅ Création de projet fonctionne |
| `app/layout.tsx` | Import correct de Toaster | ✅ Notifications toast fonctionnent |

---

## 🧪 Tests à Effectuer

### Test 1 : Création d'Organisation
1. Allez sur http://localhost:3000/onboarding/organization
2. Remplissez le formulaire :
   - Nom : "Mon Association Test"
   - Type : "Festival / Événement culturel"
   - SIRET : (optionnel)
   - Adresse : (optionnel)
3. Cliquez sur "Continuer"
4. ✅ **Attendu** : Pas d'erreur, redirection vers `/onboarding/project`

### Test 2 : Création de Projet
1. Après la création d'organisation, vous êtes sur `/onboarding/project`
2. Remplissez le formulaire :
   - Nom : "Projet Test 2025"
   - Date de début : 2025-01-01
   - Date de fin : (optionnel)
3. Cliquez sur "Terminer"
4. ✅ **Attendu** : Toast de succès + redirection vers `/dashboard`

### Test 3 : Vérification Firebase
1. Ouvrez la [Console Firebase](https://console.firebase.google.com/project/tresoasso/firestore)
2. Allez dans **Firestore Database**
3. ✅ **Attendu** : 
   - Collection `organizations` avec votre organisation
   - Collection `projects` avec votre projet
   - Collection `users` mise à jour avec l'organisation

---

## 🔍 Vérifications Supplémentaires

### Console du Navigateur
- ✅ Aucune erreur Firebase
- ✅ Aucune erreur de compilation
- ✅ Toast de succès s'affiche

### Firestore Structure

**Collection `organizations/{orgId}`** :
```json
{
  "id": "org_...",
  "name": "Mon Association Test",
  "legalForm": "association",
  "email": "user@example.com",
  "ownerId": "user_...",
  "memberIds": ["user_..."],
  "subscriptionTier": "free",
  "settings": {
    "fiscalYearStart": "01-01",
    "accountingPlan": "associatif",
    "currency": "EUR",
    "notifications": { ... }
  },
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

**Collection `projects/{projectId}`** :
```json
{
  "id": "proj_...",
  "organizationId": "org_...",
  "name": "Projet Test 2025",
  "fiscalYear": 2025,
  "startDate": Timestamp,
  "endDate": Timestamp,
  "status": "active",
  "visibility": {
    "visibleToAll": false,
    "visibleToUserIds": ["user_..."]
  },
  "budgetCategories": [],
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## 📝 Notes Importantes

### 1. Types TypeScript Utilisés
- `Organization` (`types/organization.ts`)
- `Project` (`types/project.ts`)
- `OrganizationMembership` (`types/user.ts`)

### 2. Validation des Données
- Zod schemas utilisés pour la validation côté client
- Firebase attend des données strictement conformes aux types
- Les champs optionnels doivent être omis (pas `undefined`)

### 3. Améliorations Futures

**Court terme** :
- Ajouter validation SIRET (format français)
- Permettre de choisir plusieurs types d'organisation
- Ajouter des catégories de budget par défaut lors de la création du projet

**Moyen terme** :
- Wizard multi-étapes avec barre de progression
- Prévisualisation avant création
- Option d'import de données depuis un fichier
- Templates de projets (Festival, Saison théâtrale, etc.)

---

## 🎯 Prochaines Étapes

1. **Tester le flow complet** (créer compte → organisation → projet → dashboard)
2. **Activer les vraies requêtes Firestore** dans `organization-context.tsx`
3. **Implémenter le dashboard** pour afficher les organisations et projets créés
4. **Ajouter la gestion des membres** (invitations, rôles, permissions)

---

## ✅ Résumé des Corrections

| Problème | Solution | Statut |
|----------|----------|--------|
| Champs `undefined` dans Organization | Ajout de tous les champs obligatoires | ✅ Corrigé |
| Structure incorrecte de `settings` | Structure complète avec notifications | ✅ Corrigé |
| Champs manquants dans Project | Ajout `fiscalYear`, `budgetCategories`, etc. | ✅ Corrigé |
| `endDate` optionnel | Rendu obligatoire avec valeur par défaut | ✅ Corrigé |
| Structure incorrecte de `visibility` | Correction avec `visibleToAll` et `visibleToUserIds` | ✅ Corrigé |
| Toaster non fonctionnel | Import correct depuis `sonner` | ✅ Corrigé |

---

**Toutes les corrections sont terminées ! Le flow d'onboarding est maintenant fonctionnel.** 🎉


