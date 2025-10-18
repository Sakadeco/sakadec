# 🚀 Guide complet SendGrid pour SAKADECO

## 📋 Vue d'ensemble
SendGrid est un service d'emailing professionnel qui va remplacer Nodemailer. Il est plus simple, plus fiable et offre 100 emails/jour gratuits.

## 🎯 Étapes de configuration

### ÉTAPE 1 : Créer un compte SendGrid (5 minutes)

**1.1 Aller sur SendGrid**
- Ouvrez votre navigateur
- Allez sur [https://sendgrid.com](https://sendgrid.com)
- Cliquez sur **"Start for free"** ou **"Get Started"**

**1.2 Créer le compte**
- **Email** : Utilisez votre email principal
- **Mot de passe** : Créez un mot de passe fort
- **Nom de l'entreprise** : "SAKADECO"
- **Pays** : France
- Cliquez sur **"Create Account"**

**1.3 Vérifier l'email**
- Allez dans votre boîte email
- Ouvrez l'email de SendGrid
- Cliquez sur le lien de vérification
- Retournez sur SendGrid

**1.4 Compléter le profil**
- **Prénom** : Votre prénom
- **Nom** : Votre nom
- **Téléphone** : Votre numéro (optionnel)
- **Site web** : https://sakadeco.fr
- Cliquez sur **"Get Started"**

### ÉTAPE 2 : Générer une API Key (3 minutes)

**2.1 Accéder aux API Keys**
- Dans le dashboard SendGrid
- Allez dans **Settings** (en bas à gauche)
- Cliquez sur **"API Keys"**

**2.2 Créer une nouvelle API Key**
- Cliquez sur **"Create API Key"**
- **API Key Name** : "SAKADECO Production"
- **API Key Permissions** : Sélectionnez **"Full Access"** (ou au minimum "Mail Send")
- Cliquez sur **"Create & View"**

**2.3 Copier l'API Key**
- ⚠️ **IMPORTANT** : Copiez l'API Key immédiatement
- Elle commence par `SG.` suivi de caractères
- Exemple : `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- ⚠️ **Vous ne pourrez plus la voir après !**

### ÉTAPE 3 : Configurer l'expéditeur (optionnel mais recommandé)

**3.1 Authentification de l'expéditeur**
- Allez dans **Settings** → **Sender Authentication**
- Cliquez sur **"Authenticate Your Domain"** (recommandé)
- Ou cliquez sur **"Single Sender Verification"** (plus simple)

**3.2 Single Sender Verification (plus simple)**
- Cliquez sur **"Create New Sender"**
- **From Name** : "SAKADECO"
- **From Email** : "noreply@sakadeco.fr" (ou votre email)
- **Reply To** : "contact@sakadeco.fr"
- **Company Address** : Votre adresse
- **City** : Votre ville
- **Country** : France
- Cliquez sur **"Create"**

**3.3 Vérifier l'expéditeur**
- Allez dans votre boîte email
- Ouvrez l'email de SendGrid
- Cliquez sur **"Verify Single Sender"**

### ÉTAPE 4 : Configurer sur Render (2 minutes)

**4.1 Aller sur Render**
- Allez sur [https://render.com](https://render.com)
- Connectez-vous à votre compte
- Sélectionnez votre service backend SAKADECO

**4.2 Ajouter les variables d'environnement**
- Cliquez sur **"Environment"** dans le menu
- Cliquez sur **"Add Environment Variable"**

**4.3 Ajouter les variables suivantes :**

```
Nom: SENDGRID_API_KEY
Valeur: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```
Nom: SENDER_EMAIL
Valeur: noreply@sakadeco.fr
```

```
Nom: ADMIN_EMAIL
Valeur: admin@sakadeco.fr
```

**4.4 Sauvegarder et redéployer**
- Cliquez sur **"Save Changes"**
- Cliquez sur **"Manual Deploy"** ou attendez le prochain déploiement automatique

### ÉTAPE 5 : Tester la configuration (2 minutes)

**5.1 Vérifier les logs Render**
- Allez dans l'onglet **"Logs"** de votre service
- Cherchez ces messages :
  - `✅ SendGrid configuré`
  - `📧 Utilisation de SendGrid...`

**5.2 Tester une commande**
- Allez sur https://sakadeco.fr
- Ajoutez un produit au panier
- Procédez au checkout
- Utilisez la carte de test : `4242 4242 4242 4242`
- Vérifiez votre boîte email

## 🔍 Vérification de la configuration

### Messages de succès dans les logs :
```
✅ SendGrid configuré
📧 Utilisation de SendGrid...
✅ Facture de vente envoyée via SendGrid
✅ Notification admin envoyée via SendGrid
```

### Messages d'erreur à surveiller :
```
❌ SENDGRID_API_KEY non configurée
❌ SendGrid non configuré - facture non envoyée
❌ Erreur envoi facture SendGrid: Unauthorized
```

## 🛠️ Dépannage

### Problème : "Unauthorized"
**Solution :**
- Vérifiez que l'API Key est correcte
- Vérifiez que l'API Key a les permissions "Mail Send"
- Régénérez une nouvelle API Key si nécessaire

### Problème : "Forbidden"
**Solution :**
- L'API Key n'a pas les bonnes permissions
- Créez une nouvelle API Key avec "Full Access"

### Problème : "Bad Request"
**Solution :**
- L'email expéditeur n'est pas vérifié
- Vérifiez l'expéditeur dans SendGrid
- Ou utilisez un email vérifié

### Problème : Emails non reçus
**Solutions :**
- Vérifiez les spams
- Vérifiez que l'expéditeur est vérifié
- Vérifiez les logs Render pour les erreurs

## 📊 Avantages de SendGrid

### ✅ Simplicité
- Une seule API Key (pas de host/port/password)
- Configuration en 5 minutes
- Interface intuitive

### ✅ Fiabilité
- 99.9% de délivrabilité
- Infrastructure professionnelle
- Gestion des bounces automatique

### ✅ Gratuit
- 100 emails/jour gratuits
- Suffisant pour la plupart des sites
- Pas de limite de temps

### ✅ Fonctionnalités
- Templates HTML
- Pièces jointes PDF
- Tracking des emails
- Analytics détaillées

## 🎯 Résultat final

Une fois configuré, votre système SAKADECO :
- ✅ Enverra automatiquement les factures PDF aux clients
- ✅ Notifiera l'admin avec les factures jointes
- ✅ Gérera les paniers mixtes avec factures séparées
- ✅ Affichera des templates professionnels
- ✅ Fonctionnera de manière fiable

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Render
2. Vérifiez la configuration SendGrid
3. Testez avec l'email de test
4. Contactez le support SendGrid si nécessaire

**Temps total de configuration : 10-15 minutes**
**Coût : 0€ (plan gratuit)**
**Fiabilité : 99.9%**
