#!/bin/bash

# 🚀 Script de Déploiement SakaDeco
echo "🚀 Déploiement SakaDeco sur Render..."

# Vérifier que git est configuré
if ! git config user.name > /dev/null 2>&1; then
    echo "❌ Git n'est pas configuré. Configurez votre nom et email :"
    echo "git config --global user.name 'Votre Nom'"
    echo "git config --global user.email 'votre@email.com'"
    exit 1
fi

# Vérifier les changements non commités
if ! git diff-index --quiet HEAD --; then
    echo "📝 Changements détectés. Committing..."
    git add .
    git commit -m "🚀 Déploiement automatique - $(date)"
fi

# Pousser vers GitHub
echo "📤 Poussage vers GitHub..."
git push origin main

echo "✅ Code poussé vers GitHub !"
echo ""
echo "🌐 Prochaines étapes :"
echo "1. Allez sur https://render.com"
echo "2. Créez un nouveau Web Service"
echo "3. Connectez votre repository GitHub"
echo "4. Configurez les variables d'environnement :"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=votre-url-mongodb"
echo "   - STRIPE_PUBLIC_KEY=pk_test_..."
echo "   - STRIPE_SECRET_KEY=sk_test_..."
echo "   - STRIPE_WEBHOOK_SECRET=whsec_..."
echo ""
echo "📖 Consultez deploy.md pour le guide complet"
