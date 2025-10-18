# 📧 Guide de configuration Nodemailer pour SAKADECO

## 🎯 Configuration requise sur Render

### Variables d'environnement à ajouter :

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password
ADMIN_EMAIL=admin@sakadeco.fr
```

## 🔧 Configuration Gmail (Recommandée)

### Étape 1 : Activer la 2FA sur Gmail
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Sécurité → Authentification à 2 facteurs
3. Activez la 2FA si ce n'est pas déjà fait

### Étape 2 : Générer un App Password
1. Dans Gmail : Sécurité → Mots de passe des applications
2. Sélectionnez "Autre" et nommez "SAKADECO"
3. Copiez le mot de passe généré (16 caractères)
4. Utilisez ce mot de passe dans `EMAIL_PASS`

### Étape 3 : Configurer sur Render
1. Allez sur votre service sur Render
2. Environment → Add Environment Variable
3. Ajoutez les 5 variables ci-dessus
4. Redéployez le service

## 🔧 Configuration Outlook (Alternative)

### Variables pour Outlook :
```
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre-email@outlook.com
EMAIL_PASS=votre-mot-de-passe
ADMIN_EMAIL=admin@sakadeco.fr
```

## 🔧 Configuration Yahoo (Alternative)

### Variables pour Yahoo :
```
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=votre-email@yahoo.com
EMAIL_PASS=votre-mot-de-passe
ADMIN_EMAIL=admin@sakadeco.fr
```

## 🧪 Test de la configuration

### Vérifier les logs Render :
Cherchez ces messages :
```
✅ Service email initialisé
📧 Configuration email:
  - Host: smtp.gmail.com
  - Port: 587
  - User: votre-email@gmail.com
  - Pass: Configuré
```

### Messages d'erreur à surveiller :
```
⚠️ Configuration email manquante
❌ Erreur initialisation service email
Invalid login
Authentication failed
```

## 🛠️ Dépannage

### Problème : "Invalid login"
**Solution :**
- Pour Gmail : Utilisez un App Password (pas votre mot de passe normal)
- Activez la 2FA sur votre compte Gmail
- Vérifiez que l'App Password est correct

### Problème : "Authentication failed"
**Solution :**
- Vérifiez vos identifiants email
- Pour Gmail : Utilisez un App Password
- Vérifiez que l'email est correct

### Problème : "ECONNREFUSED"
**Solution :**
- Vérifiez EMAIL_HOST et EMAIL_PORT
- Pour Gmail : smtp.gmail.com:587
- Pour Outlook : smtp-mail.outlook.com:587

### Problème : "Configuration email manquante"
**Solution :**
- Vérifiez que toutes les variables sont ajoutées sur Render
- Redéployez le service après avoir ajouté les variables
- Vérifiez l'orthographe des noms de variables

## 📋 Checklist de configuration

- [ ] Variables d'environnement ajoutées sur Render
- [ ] Service redéployé
- [ ] 2FA activée sur Gmail (si Gmail)
- [ ] App Password généré (si Gmail)
- [ ] Logs Render vérifiés
- [ ] Test d'envoi d'email effectué

## 🎯 Résultat attendu

Une fois configuré correctement :
- ✅ Factures PDF envoyées automatiquement aux clients
- ✅ Notifications admin avec factures jointes
- ✅ Logs clairs dans Render
- ✅ Système d'emailing opérationnel

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs Render pour l'erreur exacte
2. Vérifiez que toutes les variables sont correctes
3. Testez avec un autre service email
4. Vérifiez les paramètres de sécurité de votre compte email
