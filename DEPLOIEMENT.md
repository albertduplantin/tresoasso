# 🚀 Guide de Déploiement Rapide - TrésoAsso

## ⚡ Méthode Rapide (Recommandée)

### Étape 1 : Configuration Firebase (10 minutes)

```bash
# Ouvrir simplement le guide interactif
code SETUP-GUIDE.md
```

**OU utilisez les commandes suivantes :**

```bash
# 1. Se connecter à Firebase
firebase login

# 2. Créer un nouveau projet
firebase projects:create tresoasso-prod --display-name "TrésoAsso"

# 3. Utiliser le projet
firebase use tresoasso-prod

# 4. Créer une app web pour obtenir les clés
firebase apps:create web tresoasso-web

# 5. Afficher la configuration (COPIEZ CES VALEURS)
firebase apps:sdkconfig web

# 6. Créer votre fichier .env.local
# Copiez les valeurs affichées ci-dessus
nano .env.local
# ou
notepad .env.local
```

**Contenu de .env.local :**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_URL=http://localhost:3000
```

```bash
# 7. Activer les services (dans la console Firebase)
firebase open

# Dans la console web :
# - Allez dans Authentication > Sign-in method
#   → Activez Email/Password
#   → Activez Google
# - Allez dans Firestore Database > Create database
#   → Choisissez votre région (europe-west1)
# - Allez dans Storage > Get started
#   → Choisissez votre région

# 8. Déployer les règles de sécurité
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

### Étape 2 : Tester Localement (2 minutes)

```bash
npm run dev
```

Ouvrez http://localhost:3000 et testez :
- ✅ Créer un compte
- ✅ Se connecter
- ✅ Créer une transaction
- ✅ Vérifier que les données persistent

### Étape 3 : Déployer sur Vercel (5 minutes)

```bash
# 1. Se connecter à Vercel
vercel login

# 2. Premier déploiement (preview)
vercel

# Suivez les instructions :
# - Link to existing project? → No
# - Project name? → tresoasso
# - Directory? → ./ (appuyez sur Entrée)

# 3. Configurer les variables d'environnement
# Via le dashboard Vercel :
vercel dashboard

# Ou via la CLI (répétez pour chaque variable) :
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

# 4. Déployer en production
vercel --prod
```

---

## 🎯 Commandes NPM Disponibles

### Développement
```bash
npm run dev                    # Serveur de développement
npm run build                  # Build de production
npm run start                  # Serveur de production
npm run lint                   # Linter ESLint
```

### Firebase
```bash
npm run firebase:emulators     # Démarrer les émulateurs locaux
npm run firebase:deploy        # Déployer rules et indexes
```

### Vercel
```bash
npm run deploy                 # Déployer en production
npm run deploy:preview         # Déployer en preview (staging)
```

---

## 🔥 Émulateurs Firebase (Développement Local)

Pour développer sans utiliser Firebase réel :

```bash
# Démarrer les émulateurs
npm run firebase:emulators
```

Ouvrez http://localhost:4000 pour l'interface des émulateurs.

**Avantages :**
- ✅ Pas de coûts
- ✅ Données de test isolées
- ✅ Plus rapide
- ✅ Reset facile

**Modifier la configuration :**
```typescript
// lib/firebase/config.ts
const useEmulators = process.env.NODE_ENV === 'development';

if (useEmulators) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## 📊 Vérification Post-Déploiement

### ✅ Checklist Complète

**Firebase :**
- [ ] Projet créé
- [ ] Authentication activée (Email + Google)
- [ ] Firestore créé avec rules déployées
- [ ] Storage créé avec rules déployées
- [ ] Index Firestore déployés
- [ ] .env.local configuré localement

**Application :**
- [ ] npm run dev fonctionne
- [ ] Création de compte réussie
- [ ] Login fonctionne
- [ ] Données persistent dans Firestore
- [ ] Build réussi (npm run build)

**Vercel :**
- [ ] Projet créé
- [ ] Variables d'environnement configurées
- [ ] Déploiement production réussi
- [ ] Application accessible via URL
- [ ] Tests en production réussis

---

## 🐛 Résolution de Problèmes Courants

### Firebase : "Permission denied"

**Problème :** Les rules Firestore bloquent l'accès

**Solution :**
```bash
# Vérifier que les rules sont déployées
firebase deploy --only firestore:rules

# Vérifier les rules dans la console
firebase open firestore
```

### Vercel : "Build failed"

**Problème :** Variables d'environnement manquantes

**Solution :**
```bash
# Lister les variables configurées
vercel env ls

# Vérifier les logs
vercel logs

# Redéployer
vercel --prod
```

### Local : "Firebase not configured"

**Problème :** .env.local manquant ou incorrect

**Solution :**
```bash
# Vérifier que le fichier existe
ls -la .env.local

# Vérifier le contenu
cat .env.local

# Redémarrer le serveur
npm run dev
```

---

## 🎉 URLs Importantes

Une fois déployé, vous aurez :

- 🌐 **Production** : https://tresoasso.vercel.app
- 🔍 **Preview** : https://tresoasso-git-main-votre-compte.vercel.app
- 🔥 **Firebase Console** : https://console.firebase.google.com
- ⚡ **Vercel Dashboard** : https://vercel.com/dashboard
- 📊 **Émulateurs** : http://localhost:4000

---

## 📈 Prochaines Étapes

Après le déploiement réussi :

1. ✅ **Tester en production** - Créer un compte, tester les fonctionnalités
2. 📧 **Configurer les emails** - Template Firebase pour réinitialisation mot de passe
3. 🎨 **Personnaliser le domaine** - `vercel domains add votre-domaine.com`
4. 📊 **Monitorer** - Activer Firebase Analytics et Vercel Analytics
5. 🔒 **Sécurité** - Revoir les rules Firebase selon vos besoins
6. 🚀 **Développer** - Implémenter les fonctionnalités manquantes

---

## 💡 Conseils Pro

### Pour Firebase
- Utilisez les émulateurs pour le dev
- Configurez des budgets dans la console pour éviter les surprises
- Activez Firebase Analytics pour suivre l'usage

### Pour Vercel
- Utilisez les deployments preview pour tester avant prod
- Configurez un domaine personnalisé (gratuit avec Vercel)
- Activez Vercel Analytics (gratuit aussi)

### Pour le Développement
- Branchez sur `develop` et déployez les preview automatiquement
- Utilisez `main` uniquement pour la production
- Configurez des webhooks pour notifier Discord/Slack des déploiements

---

**Besoin d'aide ?** Consultez le `SETUP-GUIDE.md` détaillé !

🚀 **Bon déploiement !**

