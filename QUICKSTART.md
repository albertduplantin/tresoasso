# 🚀 Guide de Démarrage Rapide - TrésoAsso

## Configuration Initiale (5 minutes)

### 1. Créer un projet Firebase

1. Rendez-vous sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: `tresoasso-dev`)
4. Suivez l'assistant de création

### 2. Activer les services Firebase

#### Authentication
1. Dans la console, allez dans **Authentication** > **Get started**
2. Activez les fournisseurs :
   - **Email/Password** : Activer
   - **Google** : Activer et configurer

#### Firestore Database
1. Allez dans **Firestore Database** > **Create database**
2. Choisissez **Start in production mode** (nous configurerons les règles après)
3. Choisissez votre région (ex: `europe-west1`)

#### Storage
1. Allez dans **Storage** > **Get started**
2. Choisissez **Start in production mode**

### 3. Obtenir les clés de configuration

1. Dans **Project Settings** (roue dentée) > **General**
2. Sous "Your apps", cliquez sur le bouton Web `</>`
3. Enregistrez l'app (nom: `TrésoAsso Web`)
4. Copiez les valeurs de configuration

### 4. Configuration locale

#### Créer le fichier `.env.local`

```bash
# À la racine du projet
touch .env.local
```

Collez cette configuration (remplacez les valeurs) :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Application
NEXT_PUBLIC_URL=http://localhost:3000
```

### 5. Configurer les règles de sécurité Firestore

Dans **Firestore Database** > **Rules**, collez ceci :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organizations
    match /organizations/{orgId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Projects
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Suppliers
    match /suppliers/{supplierId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Cliquez sur **Publier**.

### 6. Règles de sécurité Storage

Dans **Storage** > **Rules**, collez ceci :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Cliquez sur **Publier**.

## 🎯 Lancer l'application

```bash
# Installer les dépendances (si ce n'est pas déjà fait)
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📝 Premiers pas

### 1. Créer un compte

1. Cliquez sur **"Créer un compte"**
2. Remplissez le formulaire ou utilisez **"Continuer avec Google"**
3. Vous êtes redirigé vers le dashboard !

### 2. Explorer l'interface

- **Dashboard** : Vue d'ensemble avec KPIs et graphiques
- **Transactions** : Gérer recettes et dépenses
- **Projets** : Créer et suivre vos projets
- **Fournisseurs** : Carnet d'adresses
- **Rapports** : Exports comptables
- **Paramètres** : Configuration

### 3. Créer votre première transaction

1. Allez dans **Transactions**
2. Cliquez sur **"+ Nouvelle transaction"**
3. Remplissez le formulaire :
   - Type : Dépense ou Recette
   - Montant : 1000
   - Description : "Test première transaction"
   - Catégorie : Choisissez une catégorie
   - Statut : Choisissez un statut
   - Certitude : Certain / Probable / Hypothétique
4. Cliquez sur **"Créer"**

## 🐛 Résolution de problèmes

### L'authentification ne fonctionne pas

- Vérifiez que vous avez bien activé Email/Password et Google dans Firebase Auth
- Vérifiez vos variables d'environnement dans `.env.local`
- Redémarrez le serveur de développement

### Les données ne s'enregistrent pas

- Vérifiez les règles Firestore (elles doivent autoriser l'accès authentifié)
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que vous êtes bien connecté

### Erreur de build

```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run dev
```

## 📚 Prochaines étapes

1. **Configurer votre organisation** : Allez dans Paramètres > Organisation
2. **Créer votre premier projet** : Projets > Nouveau projet
3. **Importer vos catégories comptables** : Les catégories par défaut sont déjà disponibles
4. **Inviter les membres du CA** : Paramètres > Équipe (fonctionnalité à venir)

## 🔗 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

## 💡 Conseils

- Utilisez **Ctrl+K** (ou Cmd+K sur Mac) pour la recherche rapide (à venir)
- Le mode sombre s'active automatiquement selon vos préférences système
- Toutes les données sont sauvegardées en temps réel dans Firebase

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Consultez les logs dans la console du navigateur (F12)
2. Consultez les logs Firebase dans la console Firebase
3. Créez une issue sur le repository GitHub

