# 🔍 Diagnostic complet de la configuration email

## 📧 Variables configurées sur Render

Vous avez déjà configuré :
- ✅ **EMAIL_HOST**: smtp.gmail.com
- ✅ **EMAIL_PORT**: 587  
- ✅ **EMAIL_USER**: lamawaffo11@gmail.com
- ✅ **EMAIL_PASS**: ledfpdzhofgiiwnn

## ❓ Variable manquante

**Il manque probablement :**
```
ADMIN_EMAIL=admin@sakadeco.fr
```

## 🔧 Actions à effectuer

### 1. Ajouter la variable manquante sur Render
1. Allez sur votre dashboard Render
2. Sélectionnez votre service backend
3. Cliquez sur "Environment"
4. Ajoutez cette variable :
   ```
   Nom: ADMIN_EMAIL
   Valeur: admin@sakadeco.fr
   ```
5. Cliquez sur "Save Changes"
6. Redéployez le service

### 2. Vérifier la configuration Gmail

**Votre mot de passe `ledfpdzhofgiiwnn` ressemble à un App Password Gmail :**
- ✅ C'est correct si vous avez activé la 2FA sur Gmail
- ✅ C'est correct si vous avez généré un App Password
- ❌ Ce n'est PAS votre mot de passe Gmail normal

### 3. Vérifier les logs Render

**Allez dans l'onglet "Logs" de votre service et cherchez :**

#### ✅ Messages de succès :
```
✅ Service email initialisé
📧 Configuration email:
  - Host: smtp.gmail.com
  - Port: 587
  - User: lamawaffo11@gmail.com
  - Pass: Configuré
```

#### ❌ Messages d'erreur à surveiller :
```
⚠️ Configuration email manquante
❌ Erreur initialisation service email
Invalid login
Authentication failed
ECONNREFUSED
```

## 🛠️ Dépannage selon les erreurs

### Si vous voyez "Configuration email manquante" :
- Vérifiez que toutes les variables sont ajoutées sur Render
- Redéployez le service après avoir ajouté les variables

### Si vous voyez "Invalid login" ou "Authentication failed" :
- Vérifiez que `ledfpdzhofgiiwnn` est bien un App Password Gmail
- Activez la 2FA sur votre compte Gmail si ce n'est pas fait
- Générez un nouveau App Password si nécessaire

### Si vous voyez "ECONNREFUSED" :
- Vérifiez EMAIL_HOST et EMAIL_PORT
- Pour Gmail : smtp.gmail.com:587 (correct)

### Si vous voyez une erreur 500 :
- Vérifiez les logs Render pour l'erreur exacte
- Vérifiez que Stripe est correctement configuré
- Vérifiez que toutes les variables d'environnement sont présentes

## 🧪 Test de la configuration

### 1. Vérifier les variables sur Render
Assurez-vous d'avoir ces 5 variables :
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=lamawaffo11@gmail.com
EMAIL_PASS=ledfpdzhofgiiwnn
ADMIN_EMAIL=admin@sakadeco.fr
```

### 2. Redéployer le service
Après avoir ajouté ADMIN_EMAIL, redéployez le service.

### 3. Tester une commande
1. Allez sur https://sakadeco.fr
2. Ajoutez un produit au panier
3. Procédez au checkout
4. Utilisez la carte de test : `4242 4242 4242 4242`
5. Surveillez les logs Render
6. Vérifiez votre boîte email

## 📋 Checklist de configuration

- [ ] EMAIL_HOST configuré
- [ ] EMAIL_PORT configuré  
- [ ] EMAIL_USER configuré
- [ ] EMAIL_PASS configuré (App Password Gmail)
- [ ] ADMIN_EMAIL configuré
- [ ] Service redéployé
- [ ] 2FA activée sur Gmail
- [ ] App Password généré
- [ ] Logs Render vérifiés
- [ ] Test d'envoi d'email effectué

## 🎯 Résultat attendu

Une fois configuré correctement :
- ✅ Factures PDF envoyées automatiquement aux clients
- ✅ Notifications admin avec factures jointes
- ✅ Logs clairs dans Render
- ✅ Système d'emailing opérationnel

## 📞 Prochaines étapes

1. **Ajoutez ADMIN_EMAIL** sur Render
2. **Redéployez** le service
3. **Vérifiez les logs** Render
4. **Testez une commande** sur votre site
5. **Confirmez** que les emails sont envoyés
