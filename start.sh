#!/bin/bash

# Script de démarrage automatique pour SakaDeco Group
# Ce script peut être utilisé sur n'importe quel IDE ou Replit

echo "🚀 Démarrage de SakaDeco Group..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

echo "✅ Node.js et npm détectés"

# Installer les dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
    echo "✅ Dépendances installées avec succès"
else
    echo "✅ Dépendances déjà installées"
fi

# Vérifier si la base de données est accessible
echo "🗄️ Vérification de la base de données..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL non définie. Assurez-vous que PostgreSQL est configuré."
    echo "📝 Sur Replit, la base de données sera configurée automatiquement."
else
    echo "✅ Base de données configurée"
fi

# Appliquer les migrations de base de données
echo "📊 Application des migrations de base de données..."
npm run db:push
if [ $? -ne 0 ]; then
    echo "⚠️ Erreur lors de l'application des migrations (normal si c'est le premier démarrage)"
fi

echo "🎉 Configuration terminée !"
echo ""
echo "📋 Informations importantes :"
echo "   • Site web : http://localhost:5000 (ou votre URL Replit)"
echo "   • Frontend : React + TypeScript + Tailwind CSS"
echo "   • Backend : Express + PostgreSQL + Drizzle ORM"
echo "   • 6 pôles d'activité : Shop, Créa, Rent, Events, Home, Co"
echo ""
echo "🚀 Démarrage du serveur de développement..."

# Lancer le serveur de développement
npm run dev