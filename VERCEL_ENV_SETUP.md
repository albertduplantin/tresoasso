# Configuration des Variables d'Environnement Vercel

## 🎯 Variables à Ajouter

Allez sur : https://vercel.com/albertduplantins-projects/tresoasso/settings/environment-variables

Ajoutez ces variables pour **Production**, **Preview** et **Development** :

### 1. NEXT_PUBLIC_FIREBASE_API_KEY
```
AIzaSyBMd-r9hcRfPVoPW4WqlfRaAWpFwalHGlw
```

### 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
```
tresoasso.firebaseapp.com
```

### 3. NEXT_PUBLIC_FIREBASE_PROJECT_ID
```
tresoasso
```

### 4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
```
tresoasso.firebasestorage.app
```

### 5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
```
866912082617
```

### 6. NEXT_PUBLIC_FIREBASE_APP_ID
```
1:866912082617:web:218c9ff2d27923bf325968
```

### 7. NEXT_PUBLIC_URL
```
https://tresoasso-8r2wrg9n7-albertduplantins-projects.vercel.app
```

## 🚀 Après Configuration

Une fois toutes les variables ajoutées, redéployez :

```bash
vercel --prod
```

## ⚠️ Note de Sécurité

Ces clés Firebase sont publiques (NEXT_PUBLIC_*) car elles sont exposées côté client. 
La sécurité est assurée par les règles Firestore et Storage déjà configurées.

