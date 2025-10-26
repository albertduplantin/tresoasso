#!/bin/bash

# Script de déploiement automatisé Vercel
# Usage: npm run setup:vercel

echo "⚡ Déploiement Vercel pour TrésoAsso"
echo "====================================="
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI n'est pas installé"
    echo "Installation: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI détecté"
echo ""

# Connexion Vercel
echo "📝 Connexion à Vercel..."
vercel login

# Premier déploiement
echo ""
echo "🚀 Premier déploiement..."
vercel

echo ""
echo "✅ Déploiement initial terminé !"
echo ""
echo "⚠️  Configurez maintenant les variables d'environnement :"
echo "   1. Allez sur le dashboard Vercel"
echo "   2. Settings > Environment Variables"
echo "   3. Ajoutez toutes les variables de .env.local"
echo ""
echo "Ou utilisez la commande :"
echo "   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production"
echo ""
echo "Une fois configuré, redéployez en production :"
echo "   vercel --prod"
echo ""

