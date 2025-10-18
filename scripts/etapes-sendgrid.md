# 🚀 Étapes pour configurer SendGrid

## ✅ RÉPONSE À VOS QUESTIONS

### 1. Faut-il créer un compte chez SendGrid ?
**OUI** - Vous devez créer un compte gratuit sur SendGrid.

### 2. Faut-il configurer sur Render ?
**OUI** - Vous devez ajouter des variables d'environnement sur Render.

### 3. Combien ça coûte ?
**0€** - Plan gratuit avec 100 emails/jour (suffisant pour SAKADECO).

## 📋 ÉTAPES À SUIVRE (10-15 minutes)

### ÉTAPE 1 : Créer le compte SendGrid (5 min)
1. **Aller sur** : https://sendgrid.com
2. **Cliquer** : "Start for free"
3. **Remplir** :
   - Email : votre email
   - Mot de passe : créez un mot de passe
   - Nom entreprise : "SAKADECO"
   - Pays : France
4. **Vérifier** votre email (cliquer sur le lien reçu)

### ÉTAPE 2 : Générer l'API Key (3 min)
1. **Dans SendGrid** : Settings → API Keys
2. **Cliquer** : "Create API Key"
3. **Nom** : "SAKADECO"
4. **Permissions** : "Full Access"
5. **Copier** l'API Key (commence par SG.)
6. **⚠️ IMPORTANT** : Sauvegardez-la, vous ne la reverrez plus !

### ÉTAPE 3 : Configurer l'expéditeur (2 min)
1. **Dans SendGrid** : Settings → Sender Authentication
2. **Cliquer** : "Single Sender Verification"
3. **Remplir** :
   - From Name : "SAKADECO"
   - From Email : "noreply@sakadeco.fr"
   - Reply To : "contact@sakadeco.fr"
4. **Vérifier** l'email reçu

### ÉTAPE 4 : Ajouter sur Render (2 min)
1. **Aller sur** : https://render.com
2. **Sélectionner** votre service backend
3. **Cliquer** : "Environment"
4. **Ajouter** ces 3 variables :

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

5. **Cliquer** : "Save Changes"
6. **Redéployer** le service

### ÉTAPE 5 : Tester (2 min)
1. **Aller sur** : https://sakadeco.fr
2. **Ajouter** un produit au panier
3. **Checkout** avec carte test : `4242 4242 4242 4242`
4. **Vérifier** votre boîte email
5. **Vérifier** les logs Render

## 🔍 VÉRIFICATION

### Dans les logs Render, vous devriez voir :
```
✅ SendGrid configuré
📧 Utilisation de SendGrid...
✅ Facture de vente envoyée via SendGrid
```

### Si vous voyez :
```
❌ SendGrid non configuré - facture non envoyée
```
→ Les variables ne sont pas correctement ajoutées sur Render

## 🎯 RÉSULTAT FINAL

Une fois configuré :
- ✅ **Factures PDF automatiques** envoyées aux clients
- ✅ **Notifications admin** avec factures jointes
- ✅ **Templates professionnels** avec votre design
- ✅ **100 emails/jour gratuits** (suffisant)
- ✅ **99.9% de délivrabilité** (très fiable)

## ⏱️ TEMPS TOTAL : 10-15 minutes
## 💰 COÛT : 0€ (plan gratuit)
## 🎉 DIFFICULTÉ : Facile

**Prêt à commencer ? Suivez les étapes ci-dessus !** 🚀
