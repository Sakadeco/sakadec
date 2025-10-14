# 🌟 SKD - Site Web de Décoration et Événements

Site web professionnel pour SKD, spécialisé dans la décoration d'événements, la vente de produits, la location d'équipements et le paiement en ligne avec Stripe.

## ✨ Nouvelles Fonctionnalités

- 💳 **Paiement sécurisé** avec Stripe Checkout
- 📦 **Gestion des commandes** complète
- 👨‍💼 **Interface administrateur** avancée
- 🎨 **Personnalisation des produits** (couleurs, tailles)
- 🖼️ **Upload d'images** automatique
- 📱 **Design responsive** moderne

## 🚀 Déploiement sur Render

### ✅ Site en ligne
**URL de production :** https://sakadeco-api.onrender.com

### 🏗️ Architecture
- **Frontend** : React + TypeScript + Tailwind CSS
- **Backend** : Express.js + Node.js
- **Base de données** : MongoDB Atlas
- **Hébergement** : Render (Backend + Frontend unifiés)

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte MongoDB Atlas
- Compte Render (gratuit)

## 🛠️ Installation locale

```bash
# Cloner le repository
git clone https://github.com/borelkamsu/SAKADECO.git
cd SAKADECO

# Installer les dépendances
npm install

# Créer le fichier .env
node create-env-example.cjs

# Configurer les variables d'environnement
# Remplacez les valeurs dans le fichier .env avec vos vraies clés :
# - DATABASE_URL (MongoDB Atlas)
# - STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
# - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# Lancer en développement
npm run dev
```

## 🌐 Déploiement sur Render

### 1. Préparer le projet
```bash
# Commiter tous les changements
git add .
git commit -m "✨ Prêt pour déploiement Render"
git push origin main
```

### 2. Créer un service sur Render

1. **Aller sur** [render.com](https://render.com)
2. **Créer un compte** (gratuit)
3. **Cliquer "New +"** → **"Web Service"**
4. **Connecter GitHub** et sélectionner le repository

### 3. Configuration du service

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `sakadeco-api` |
| **Environment** | `Node` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 4. Variables d'environnement

Dans "Environment Variables", ajouter :

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `mongodb+srv://username:password@cluster.mongodb.net/SDK?retryWrites=true&w=majority` |
| `SESSION_SECRET` | `un_secret_tres_long_et_complexe_123456789` |
| `PORT` | `10000` |
| `STRIPE_PUBLIC_KEY` | `pk_test_votre_cle_publique` |
| `STRIPE_SECRET_KEY` | `sk_test_votre_cle_secrete` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_votre_webhook_secret` |

### 5. Déployer
- Cliquer sur **"Create Web Service"**
- Attendre **2-3 minutes** pour le déploiement

## 🧪 Tests de déploiement

Une fois déployé, tester :

```bash
# Health check
curl https://sakadeco-api.onrender.com/api/health

# Produits
curl https://sakadeco-api.onrender.com/api/products

# Page d'accueil
curl https://sakadeco-api.onrender.com
```

## 📁 Structure du projet

```
SAKADECO/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/         # Pages de l'application
│   │   └── lib/           # Utilitaires
│   └── index.html
├── server/                # Backend Express
│   ├── routes.ts          # Routes API
│   ├── models.ts          # Modèles MongoDB
│   ├── storage.ts         # Opérations base de données
│   └── index.ts           # Point d'entrée serveur
├── render.yaml            # Configuration Render
├── package.json           # Dépendances et scripts
└── README.md              # Documentation
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build production
npm run start            # Serveur production

# Base de données
npm run test-db          # Test connexion MongoDB
npm run seed              # Peupler la base de données
```

## 🌟 Fonctionnalités

### 🛍️ Boutique
- Catalogue de produits
- Filtrage par catégorie
- Système de panier
- Personnalisation des produits

### 🎉 Événements
- Services de décoration
- Galerie de réalisations
- Devis personnalisés
- Réservation d'événements

### 📦 Location
- Équipements disponibles
- Tarification journalière
- Système de réservation
- Gestion des disponibilités

### 📞 Contact
- Formulaire de contact
- Newsletter
- Témoignages clients
- Informations de contact

## 🔒 Sécurité

- **HTTPS** automatique sur Render
- **Variables d'environnement** sécurisées
- **Validation des données** avec Zod
- **Sessions sécurisées** avec MongoDB

## 📊 Monitoring

- **Logs en temps réel** sur Render Dashboard
- **Health checks** automatiques
- **Redémarrage automatique** en cas d'erreur
- **Métriques de performance**

## 🚀 Déploiement automatique

- **GitHub Integration** : Déploiement automatique à chaque push
- **Build cache** : Optimisation des temps de build
- **Rollback** : Possibilité de revenir à une version précédente

## 🆘 Dépannage

### Problèmes courants

1. **Build échoue**
   - Vérifier la commande de build
   - S'assurer que toutes les dépendances sont installées

2. **Base de données non connectée**
   - Vérifier `DATABASE_URL` dans les variables d'environnement
   - Contrôler les paramètres MongoDB Atlas

3. **Variables d'environnement manquantes**
   - Vérifier toutes les variables requises
   - Redéployer après modification

### Support

- **Logs Render** : Dashboard Render → Logs
- **Documentation** : [docs.render.com](https://docs.render.com)
- **GitHub Issues** : [Repository Issues](https://github.com/borelkamsu/SAKADECO/issues)

## 📈 Évolutions futures

- [ ] Système d'authentification complet
- [ ] Paiements en ligne (Stripe)
- [ ] Dashboard administrateur
- [ ] Notifications email
- [ ] Application mobile

---

**🎉 Votre site SKD est maintenant en ligne et opérationnel !**

**URL :** https://sakadeco-api.onrender.com