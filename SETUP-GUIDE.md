# 🚀 Guide de Configuration Automatisé - TrésoAsso

Ce guide vous permet de configurer Firebase et Vercel en quelques commandes !

---

## 📋 Prérequis

- [x] Firebase CLI installé (v14.18.0) ✓
- [x] Vercel CLI installé (v48.0.1) ✓
- [ ] Compte Firebase (gratuit)
- [ ] Compte Vercel (gratuit)

---

## 🔥 Étape 1 : Configuration Firebase (10 minutes)

### 1.1 Connexion à Firebase

```bash
firebase login
```

Une fenêtre de navigateur s'ouvrira. Connectez-vous avec votre compte Google.

### 1.2 Créer un nouveau projet Firebase

```bash
firebase projects:create tresoasso-prod --display-name "TrésoAsso Production"
```

Ou si vous voulez choisir un autre ID :

```bash
firebase projects:create
```

### 1.3 Lier le projet local

```bash
firebase use tresoasso-prod
```

Ou sélectionnez votre projet :

```bash
firebase use --add
```

### 1.4 Activer les services Firebase

#### Authentification
```bash
# Activer Email/Password et Google Auth via la console
# Ou directement dans la console Firebase
firebase open auth
```

Dans la console Firebase :
1. Allez dans **Authentication** > **Sign-in method**
2. Activez **Email/Password**
3. Activez **Google**

#### Firestore Database
```bash
firebase firestore:databases:create --location=europe-west1
```

Ou via la console :
```bash
firebase open firestore
```

#### Storage
```bash
firebase open storage
```

Dans la console Firebase :
1. Allez dans **Storage** > **Get started**
2. Choisissez votre région : `europe-west1`

### 1.5 Déployer les règles de sécurité

```bash
# Déployer Firestore rules
firebase deploy --only firestore:rules

# Déployer Storage rules
firebase deploy --only storage:rules

# Déployer les index Firestore
firebase deploy --only firestore:indexes
```

### 1.6 Obtenir les clés de configuration

```bash
# Créer une application web Firebase
firebase apps:create web tresoasso-web

# Afficher la configuration
firebase apps:sdkconfig web
```

Copiez la sortie et créez votre `.env.local` :

```bash
# Créer le fichier .env.local
cp .env.example .env.local
```

Remplissez les valeurs dans `.env.local` avec celles affichées par la commande précédente.

---

## 🚀 Étape 2 : Déploiement Vercel (5 minutes)

### 2.1 Connexion à Vercel

```bash
vercel login
```

### 2.2 Déploiement initial

```bash
vercel
```

Répondez aux questions :
- **Set up and deploy?** → Yes
- **Which scope?** → Choisissez votre compte
- **Link to existing project?** → No
- **Project name?** → tresoasso (ou gardez le défaut)
- **Directory?** → ./ (gardez le défaut)
- **Override settings?** → No

Le projet sera déployé en quelques secondes !

### 2.3 Configurer les variables d'environnement

#### Option A : Via la CLI (recommandé)

```bash
# Ajouter les variables une par une
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add NEXT_PUBLIC_URL production
```

Ou en une seule commande :

```bash
# Importer depuis .env.local
vercel env pull .env.local
vercel env add < .env.local
```

#### Option B : Via le Dashboard

```bash
# Ouvrir le dashboard Vercel
vercel dashboard
```

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez chaque variable manuellement

### 2.4 Redéployer avec les variables

```bash
vercel --prod
```

---

## 🧪 Étape 3 : Tester l'Application (5 minutes)

### 3.1 Test local

```bash
npm run dev
```

Ouvrez http://localhost:3000

**Testez :**
- ✅ Création de compte (Email/Password)
- ✅ Connexion avec Google
- ✅ Navigation dans le dashboard
- ✅ Création d'une transaction
- ✅ Vérifiez que les données persistent dans Firestore

### 3.2 Test en production

```bash
vercel --prod
```

URL de production : `https://tresoasso.vercel.app` (ou votre domaine personnalisé)

**Testez les mêmes fonctionnalités en production !**

---

## 🔧 Commandes Utiles

### Firebase

```bash
# Démarrer les émulateurs locaux (pour dev)
firebase emulators:start

# Voir les logs
firebase projects:list

# Ouvrir la console Firebase
firebase open

# Déployer tout
firebase deploy
```

### Vercel

```bash
# Déploiement preview (staging)
vercel

# Déploiement production
vercel --prod

# Voir les logs
vercel logs

# Lister les déploiements
vercel ls

# Ouvrir le dashboard
vercel dashboard

# Lier un domaine personnalisé
vercel domains add votre-domaine.com
```

---

## 🐛 Résolution de Problèmes

### Firebase

**Erreur : Project already exists**
```bash
# Lister vos projets
firebase projects:list

# Utiliser un projet existant
firebase use <project-id>
```

**Erreur : Permission denied**
```bash
# Se reconnecter
firebase logout
firebase login
```

### Vercel

**Erreur : Build failed**
```bash
# Tester localement d'abord
npm run build

# Vérifier les logs
vercel logs
```

**Variables d'environnement manquantes**
```bash
# Lister les variables
vercel env ls

# Vérifier les valeurs
vercel env pull .env.production
```

---

## 📊 Vérification Finale

### ✅ Checklist

- [ ] Firebase projet créé
- [ ] Authentication activée (Email + Google)
- [ ] Firestore Database créée
- [ ] Storage activé
- [ ] Règles de sécurité déployées
- [ ] Index Firestore déployés
- [ ] `.env.local` configuré avec les bonnes clés
- [ ] Application teste localement avec succès
- [ ] Vercel projet créé
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Application déployée en production
- [ ] Tests en production réussis

---

## 🎉 Félicitations !

Votre application TrésoAsso est maintenant configurée et déployée !

**URLs importantes :**
- 🌐 Production : `https://tresoasso.vercel.app`
- 🔥 Firebase Console : https://console.firebase.google.com
- ⚡ Vercel Dashboard : https://vercel.com/dashboard

---

## 📞 Aide Supplémentaire

### Documentation
- Firebase CLI : https://firebase.google.com/docs/cli
- Vercel CLI : https://vercel.com/docs/cli
- Next.js : https://nextjs.org/docs

### Support
- Firebase Support : https://firebase.google.com/support
- Vercel Support : https://vercel.com/support

---

**Prochaine étape** : Développer les fonctionnalités manquantes (Onboarding, Upload docs, Exports, etc.)

🚀 **Bon développement !**

