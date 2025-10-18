# Configuration Email sur Render

## 🚨 Problème identifié
Les variables d'environnement email ne sont pas configurées sur Render, ce qui empêche l'envoi d'emails.

## 🔧 Solution : Configuration des variables d'environnement

### 1. Accéder au dashboard Render
1. Allez sur [render.com](https://render.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre service backend SAKADECO

### 2. Configurer les variables d'environnement
1. Dans votre service, cliquez sur **"Environment"**
2. Ajoutez les variables suivantes :

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
ADMIN_EMAIL=admin@sakadeco.fr
```

### 3. Configuration Gmail (recommandée)

#### Étape 1 : Activer la 2FA
1. Allez dans votre compte Google
2. Sécurité → Authentification à 2 facteurs
3. Activez la 2FA

#### Étape 2 : Générer un mot de passe d'application
1. Compte Google → Sécurité
2. "Mots de passe des applications"
3. Sélectionnez "Autre" et nommez "SAKADECO"
4. Copiez le mot de passe généré (16 caractères)

#### Étape 3 : Utiliser le mot de passe d'application
- Utilisez ce mot de passe dans `EMAIL_PASS`
- **NE PAS** utiliser votre mot de passe Gmail normal

### 4. Alternative : Autres services email

#### Outlook/Hotmail
```
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre-email@outlook.com
EMAIL_PASS=votre-mot-de-passe
```

#### Yahoo
```
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=votre-email@yahoo.com
EMAIL_PASS=votre-mot-de-passe
```

### 5. Redéployer le service
1. Après avoir ajouté les variables
2. Cliquez sur **"Manual Deploy"** ou attendez le prochain déploiement
3. Vérifiez les logs pour confirmer l'initialisation

## 🧪 Test de la configuration

### Vérifier les logs Render
1. Allez dans "Logs" de votre service
2. Cherchez les messages :
   - `✅ Service email initialisé`
   - `📧 Configuration email:`

### Tester un paiement
1. Effectuez une commande test
2. Vérifiez que les emails sont envoyés
3. Vérifiez les logs pour les erreurs

## 🔍 Dépannage

### Problèmes courants
1. **Mot de passe incorrect** : Utilisez un App Password pour Gmail
2. **Port incorrect** : Utilisez 587 pour TLS, 465 pour SSL
3. **Host incorrect** : Vérifiez le serveur SMTP de votre fournisseur
4. **2FA non activée** : Obligatoire pour Gmail avec App Password

### Logs à surveiller
- `❌ Erreur initialisation service email`
- `⚠️ Configuration email manquante`
- `✅ Service email initialisé`

## 📞 Support
Si le problème persiste, vérifiez :
1. Les variables d'environnement sur Render
2. Les logs du service
3. La configuration de votre compte email
4. Les paramètres de sécurité de votre compte email
