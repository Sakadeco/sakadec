# 🔧 Guide de dépannage Render - SakaDeco

## ❌ Erreur 502 (Bad Gateway)

### Causes possibles :
1. **Variables d'environnement manquantes**
2. **Erreur de démarrage du serveur**
3. **Dépendances manquantes**
4. **Problème de build**

### 🔍 Étapes de diagnostic :

#### 1. Vérifier les logs Render
- Allez sur [Render Dashboard](https://dashboard.render.com)
- Sélectionnez votre service `sakadeco-api`
- Cliquez sur "Logs"
- Cherchez les erreurs de démarrage

#### 2. Vérifier les variables d'environnement
Assurez-vous que ces variables sont configurées sur Render :

**Variables requises :**
```
DATABASE_URL=mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/SDK?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=10000
SESSION_SECRET=un_secret_tres_long_et_complexe_123456789
```

**Variables Stripe :**
```
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_stripe
```

**Variables Cloudinary :**
```
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

#### 3. Vérifier la configuration Render
Le fichier `render.yaml` doit contenir toutes les variables d'environnement listées ci-dessus.

### 🛠️ Solutions :

#### 1. Redéployer avec les bonnes variables
```bash
# 1. Vérifier que le code est à jour
git status
git add .
git commit -m "Fix Render deployment issues"
git push origin main

# 2. Sur Render Dashboard :
# - Allez dans votre service
# - Cliquez sur "Environment"
# - Ajoutez/modifiez les variables manquantes
# - Cliquez sur "Manual Deploy" > "Deploy latest commit"
```

#### 2. Vérifier les logs de build
Si le build échoue, vérifiez :
- Les dépendances dans `package.json`
- Les scripts de build et start
- Les erreurs TypeScript

#### 3. Test local de production
```bash
# Tester le build localement
npm run build
npm start
```

### 📞 Support

Si le problème persiste :
1. **Capturez les logs d'erreur** depuis Render Dashboard
2. **Vérifiez que toutes les variables d'environnement** sont configurées
3. **Testez le build localement** avant de redéployer

### ✅ Vérification finale

Après correction, votre API devrait être accessible sur :
`https://sakadeco-api.onrender.com`

Testez avec :
```bash
curl https://sakadeco-api.onrender.com/api/products
```

Si vous obtenez une réponse JSON, le serveur fonctionne correctement !
