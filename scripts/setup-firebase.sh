#!/bin/bash

# Script de configuration automatisé Firebase
# Usage: npm run setup:firebase

echo "🔥 Configuration Firebase pour TrésoAsso"
echo "========================================"
echo ""

# Vérifier si Firebase CLI est installé
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI n'est pas installé"
    echo "Installation: npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI détecté"
echo ""

# Connexion Firebase
echo "📝 Connexion à Firebase..."
firebase login

# Lister les projets
echo ""
echo "📋 Vos projets Firebase existants:"
firebase projects:list

# Demander le projet à utiliser
echo ""
echo "Voulez-vous créer un nouveau projet? (o/n)"
read -r CREATE_NEW

if [ "$CREATE_NEW" = "o" ]; then
    echo "Entrez l'ID du projet (ex: tresoasso-prod):"
    read -r PROJECT_ID
    
    echo "Création du projet $PROJECT_ID..."
    firebase projects:create "$PROJECT_ID" --display-name "TrésoAsso"
    
    echo "✅ Projet créé !"
else
    echo "Entrez l'ID du projet existant:"
    read -r PROJECT_ID
fi

# Utiliser le projet
echo ""
echo "📌 Sélection du projet $PROJECT_ID..."
firebase use "$PROJECT_ID"

# Déployer les règles
echo ""
echo "🚀 Déploiement des règles de sécurité..."
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

echo ""
echo "✅ Configuration Firebase terminée !"
echo ""
echo "⚠️  N'oubliez pas d'activer manuellement :"
echo "   1. Authentication (Email/Password + Google)"
echo "   2. Firestore Database"
echo "   3. Storage"
echo ""
echo "🔑 Pour obtenir les clés de configuration :"
echo "   firebase apps:sdkconfig web"
echo ""

