# 🔧 Guide de configuration Stripe sur Render

## 🚨 Problème identifié

**Stripe ne fonctionne pas** - C'est pourquoi vous ne recevez pas d'emails !
- ❌ Erreur 500 lors de la création de session de paiement
- ❌ Les emails ne peuvent pas être envoyés car le paiement échoue

## 🔍 Vérification de la configuration Stripe

### Variables d'environnement requises sur Render :

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Comment vérifier :

1. **Allez sur Render → Environment**
2. **Vérifiez que ces variables sont présentes :**
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`

3. **Si elles sont absentes, ajoutez-les :**
   - Allez sur votre dashboard Stripe
   - Copiez la clé secrète (commence par `sk_test_`)
   - Copiez la clé publique (commence par `pk_test_`)
   - Ajoutez-les sur Render

## 🔑 Où trouver vos clés Stripe

### 1. Connectez-vous à votre dashboard Stripe
- Allez sur https://dashboard.stripe.com
- Connectez-vous avec votre compte

### 2. Accédez aux clés API
- Cliquez sur "Développeurs" dans le menu
- Cliquez sur "Clés API"
- Vous verrez :
  - **Clé secrète** : `sk_test_...` (pour le serveur)
  - **Clé publique** : `pk_test_...` (pour le frontend)

### 3. Copiez les clés
- **STRIPE_SECRET_KEY** : `sk_test_...`
- **STRIPE_PUBLISHABLE_KEY** : `pk_test_...`

## ⚙️ Configuration sur Render

### 1. Allez sur Render
- Connectez-vous à https://render.com
- Allez sur votre service SAKADECO

### 2. Accédez aux variables d'environnement
- Cliquez sur "Environment"
- Vérifiez que ces variables sont présentes :
  ```
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```

### 3. Si elles sont absentes
- Cliquez sur "Add Environment Variable"
- Ajoutez `STRIPE_SECRET_KEY` avec votre clé secrète
- Ajoutez `STRIPE_PUBLISHABLE_KEY` avec votre clé publique
- Cliquez sur "Save Changes"

### 4. Redéployez le service
- Cliquez sur "Manual Deploy"
- Attendez que le déploiement soit terminé

## 🧪 Test de la configuration

### 1. Vérifiez les logs Render
- Allez sur "Logs" dans Render
- Cherchez ces messages :
  ```
  ✅ Stripe initialisé avec succès
  ```

### 2. Testez une commande
- Allez sur https://sakadeco.fr
- Ajoutez un produit au panier
- Procédez au checkout
- Utilisez la carte test : `4242 4242 4242 4242`

### 3. Surveillez les logs
- Si Stripe fonctionne, vous verrez :
  ```
  ✅ Session de paiement créée
  📧 Tentative d'envoi facture de vente avec PDF...
  ✅ Facture de vente envoyée avec PDF
  ```

## 🔧 Solutions selon les erreurs

### Si vous voyez "Stripe not initialized" :
- Vérifiez que `STRIPE_SECRET_KEY` est configuré
- Vérifiez que la clé commence par `sk_test_`
- Redéployez le service

### Si vous voyez "Invalid API key" :
- Vérifiez que la clé Stripe est correcte
- Vérifiez que le compte Stripe est actif
- Générez une nouvelle clé si nécessaire

### Si vous voyez "API key not found" :
- Vérifiez que `STRIPE_SECRET_KEY` est configuré sur Render
- Vérifiez que le nom de la variable est exactement `STRIPE_SECRET_KEY`
- Redéployez le service

## 📋 Checklist de vérification

- [ ] `STRIPE_SECRET_KEY` configuré sur Render
- [ ] `STRIPE_PUBLISHABLE_KEY` configuré sur Render
- [ ] Clés Stripe correctes (commencent par `sk_test_` et `pk_test_`)
- [ ] Compte Stripe actif
- [ ] Service redéployé après ajout des clés
- [ ] Logs Render vérifiés
- [ ] Test de commande effectué

## 🎯 Prochaines étapes

1. **Vérifiez la configuration Stripe** sur Render
2. **Ajoutez les clés manquantes** si nécessaire
3. **Redéployez** le service
4. **Testez une commande** et surveillez les logs
5. **Vérifiez votre boîte email** (spams inclus)

## 📞 Support

Si le problème persiste :
1. Vérifiez que les clés Stripe sont correctes
2. Vérifiez que le compte Stripe est actif
3. Vérifiez les logs Render pour les erreurs spécifiques
4. Testez avec un nouveau compte Stripe si nécessaire
