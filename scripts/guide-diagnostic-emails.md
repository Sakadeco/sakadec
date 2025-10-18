# 🔍 Guide de diagnostic des emails SAKADECO

## ✅ Configuration actuelle (d'après les logs)

Votre configuration email fonctionne :
- ✅ **Service email initialisé**
- ✅ **Host**: smtp.gmail.com
- ✅ **Port**: 587
- ✅ **User**: lamawaffo11@gmail.com
- ✅ **Pass**: Configuré

## 🚨 Problème identifié

Vous ne recevez pas d'emails après achat. Voici les causes possibles :

### 1. **ADMIN_EMAIL manquant sur Render**
**Solution :**
- Allez sur Render → Environment
- Ajoutez : `ADMIN_EMAIL=admin@sakadeco.fr`
- Redéployez le service

### 2. **Problème d'authentification Gmail**
**Vérifications :**
- Votre App Password `ledfpdzhofgiiwnn` est-il correct ?
- Avez-vous activé la 2FA sur Gmail ?
- L'App Password a-t-il été généré récemment ?

### 3. **Emails bloqués par Gmail**
**Vérifications :**
- Vérifiez les **spams** dans votre boîte email
- Vérifiez le dossier **"Promotions"** dans Gmail
- Vérifiez le dossier **"Indésirables"**

### 4. **Problème avec PDFKit**
**Vérifications :**
- PDFKit est-il installé correctement ?
- Y a-t-il des erreurs dans les logs Render ?

## 🧪 Test de diagnostic

### Étape 1 : Vérifier ADMIN_EMAIL
1. Allez sur Render → Environment
2. Vérifiez que `ADMIN_EMAIL` est présent
3. Si absent, ajoutez-le et redéployez

### Étape 2 : Tester une commande
1. Allez sur https://sakadeco.fr
2. Ajoutez un produit au panier
3. Procédez au checkout
4. Utilisez la carte test : `4242 4242 4242 4242`
5. **Surveillez les logs Render en temps réel**

### Étape 3 : Vérifier les logs Render
Cherchez ces messages dans les logs :

#### ✅ Messages de succès :
```
📧 Tentative d'envoi facture de vente avec PDF...
📧 Transporter disponible: true
✅ Facture de vente envoyée avec PDF
✅ Notification admin envoyée avec PDF
```

#### ❌ Messages d'erreur :
```
⚠️ Service email non configuré
❌ Erreur envoi facture PDF
Invalid login
Authentication failed
```

## 🔧 Solutions selon les erreurs

### Si vous voyez "Service email non configuré" :
- Vérifiez que toutes les variables sont sur Render
- Redéployez le service

### Si vous voyez "Invalid login" :
- Vérifiez votre App Password Gmail
- Générez un nouveau App Password
- Vérifiez que la 2FA est activée

### Si vous voyez "Erreur envoi facture PDF" :
- Vérifiez que PDFKit est installé
- Vérifiez les logs pour l'erreur exacte

### Si vous ne voyez aucun message d'email :
- Le webhook Stripe ne se déclenche pas
- Vérifiez la configuration Stripe
- Vérifiez les logs pour les erreurs

## 📋 Checklist de diagnostic

- [ ] ADMIN_EMAIL configuré sur Render
- [ ] Service redéployé après ajout d'ADMIN_EMAIL
- [ ] Test d'une commande effectué
- [ ] Logs Render surveillés en temps réel
- [ ] Boîte email vérifiée (spams inclus)
- [ ] App Password Gmail vérifié
- [ ] 2FA activée sur Gmail

## 🎯 Prochaines étapes

1. **Ajoutez ADMIN_EMAIL** sur Render si manquant
2. **Redéployez** le service
3. **Testez une commande** et surveillez les logs
4. **Vérifiez votre boîte email** (spams inclus)
5. **Copiez-moi les logs** si vous voyez des erreurs

## 📞 Support

Si le problème persiste :
1. Copiez les logs Render exacts
2. Confirmez que ADMIN_EMAIL est configuré
3. Vérifiez que l'App Password Gmail est correct
4. Testez avec un autre email de destination
