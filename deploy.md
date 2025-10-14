# 🚀 Guide de Déploiement SakaDeco sur Render avec Stripe

## 📋 Prérequis

1. **Compte Render** : https://render.com
2. **Compte Stripe** : https://stripe.com
3. **Repository GitHub** avec le code

## 🔧 Configuration Stripe

### 1. **Créer un compte Stripe**
- Allez sur https://stripe.com
- Créez un compte gratuit
- Activez votre compte

### 2. **Récupérer les clés API**
1. Dans le dashboard Stripe, allez dans **Developers > API keys**
2. Copiez les clés suivantes :
   - **Publishable key** (commence par `pk_test_` ou `pk_live_`)
   - **Secret key** (commence par `sk_test_` ou `sk_live_`)

### 3. **Configurer les Webhooks**
1. Dans Stripe, allez dans **Developers > Webhooks**
2. Cliquez sur **Add endpoint**
3. URL : `https://votre-app.onrender.com/api/payment/webhook`
4. Événements à sélectionner :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `payment_intent.succeeded`
5. Copiez le **Webhook signing secret** (commence par `whsec_`)

## 🌐 Déploiement sur Render

### 1. **Connecter le Repository**
1. Allez sur https://render.com
2. Cliquez sur **New +** > **Web Service**
3. Connectez votre repository GitHub
4. Sélectionnez le repository SakaDeco

### 2. **Configuration du Service**
- **Name** : `sakadeco-api`
- **Environment** : `Node`
- **Region** : Choisissez la plus proche
- **Branch** : `main`
- **Build Command** : `npm install --include=dev && npm run build && mkdir -p uploads/products`
- **Start Command** : `npm start`

### 3. **Variables d'Environnement**
Dans la section **Environment Variables**, ajoutez :

```
NODE_ENV=production
DATABASE_URL=mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/SDK?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=votre-session-secret-ici
PORT=10000
STRIPE_PUBLIC_KEY=pk_test_votre-cle-publique
STRIPE_SECRET_KEY=sk_test_votre-cle-secrete
STRIPE_WEBHOOK_SECRET=whsec_votre-webhook-secret
```

### 4. **Déployer**
1. Cliquez sur **Create Web Service**
2. Attendez que le déploiement se termine
3. Votre app sera disponible sur `https://sakadeco-api.onrender.com`

## 🔄 Mise à jour du Code Frontend

### 1. **Mettre à jour l'URL de l'API**
Dans `client/src/pages/CartPage.tsx`, changez :
```typescript
const stripePromise = loadStripe('pk_test_votre-cle-publique');
```

### 2. **Mettre à jour les URLs de l'API**
Dans tous les fichiers frontend, remplacez :
```typescript
// Au lieu de
fetch('/api/...')

// Utilisez
fetch('https://sakadeco-api.onrender.com/api/...')
```

## 🧪 Test du Système

### 1. **Test Local**
```bash
npm run dev
# Testez sur http://localhost:5000
```

### 2. **Test en Production**
1. Allez sur votre URL Render
2. Testez l'ajout au panier
3. Testez le paiement avec une carte de test Stripe

### 3. **Cartes de Test Stripe**
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **Date** : N'importe quelle date future
- **CVC** : N'importe quels 3 chiffres

## 🔍 Monitoring

### 1. **Logs Render**
- Dans le dashboard Render, allez dans **Logs**
- Surveillez les erreurs et les requêtes

### 2. **Logs Stripe**
- Dans le dashboard Stripe, allez dans **Developers > Logs**
- Surveillez les événements de paiement

### 3. **Webhooks**
- Dans Stripe, vérifiez que les webhooks sont bien reçus
- Les statuts doivent être verts

## 🚨 Dépannage

### Erreur "Neither apiKey nor config.authenticator provided"
- Vérifiez que `STRIPE_SECRET_KEY` est bien configuré dans Render
- Redéployez l'application

### Erreur "Not a valid URL" pour les images
- Les images locales ne fonctionnent pas en production
- Utilisez des URLs HTTPS pour les images de produits

### Webhooks non reçus
- Vérifiez l'URL du webhook dans Stripe
- Assurez-vous que l'endpoint `/api/payment/webhook` existe

## 📞 Support

- **Render** : https://render.com/docs
- **Stripe** : https://stripe.com/docs
- **MongoDB Atlas** : https://docs.atlas.mongodb.com

## 🎉 Félicitations !

Votre application SakaDeco est maintenant déployée avec un système de paiement Stripe fonctionnel !
