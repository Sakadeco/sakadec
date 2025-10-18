# 🛒 Guide des paniers mixtes (vente + location)

## 🔍 **Comment fonctionne le système actuel :**

### **1. Détection du panier mixte**
- Le système détecte automatiquement si le panier contient des produits de vente ET de location
- Un message d'alerte s'affiche : *"Votre panier contient des produits de vente et de location. Vous recevrez deux factures séparées lors du paiement."*

### **2. Traitement séparé des commandes**
- **Session de vente** : Créée via `/api/payment/create-checkout-session`
- **Session de location** : Créée via `/api/rental/create-checkout-session`
- **Deux paiements distincts** avec Stripe

### **3. Envoi d'emails automatique**
Après chaque paiement, le webhook Stripe déclenche l'envoi d'emails :

#### **Pour la vente :**
- ✅ **Client reçoit** : Email avec facture de vente PDF
- ✅ **Admin reçoit** : Notification avec facture de vente PDF

#### **Pour la location :**
- ✅ **Client reçoit** : Email avec facture de location PDF
- ✅ **Admin reçoit** : Notification avec facture de location PDF

## 📧 **Résultat pour le client :**

### **Le client reçoit 2 emails distincts :**

1. **Email de vente** :
   - Sujet : "Confirmation de commande - [NUMÉRO]"
   - Contenu : Détails de la commande de vente
   - Pièce jointe : Facture de vente PDF

2. **Email de location** :
   - Sujet : "Confirmation de location - [NUMÉRO]"
   - Contenu : Détails de la location
   - Pièce jointe : Facture de location PDF

## 📧 **Résultat pour l'admin :**

### **L'admin reçoit 2 emails distincts :**

1. **Notification de vente** :
   - Sujet : "🆕 Nouvelle commande reçue - [NUMÉRO]"
   - Contenu : Détails de la commande de vente
   - Pièce jointe : Facture de vente PDF

2. **Notification de location** :
   - Sujet : "🆕 Nouvelle location reçue - [NUMÉRO]"
   - Contenu : Détails de la location
   - Pièce jointe : Facture de location PDF

## 🧪 **Test du système :**

### **Étape 1 : Créer un panier mixte**
1. Allez sur https://sakadeco.fr
2. Ajoutez un produit de vente au panier
3. Ajoutez un produit de location au panier
4. Vous verrez l'alerte de panier mixte

### **Étape 2 : Procéder au checkout**
1. Cliquez sur "Procéder au paiement"
2. Le système créera 2 sessions Stripe séparées
3. Vous serez redirigé vers la première session (vente)

### **Étape 3 : Compléter les paiements**
1. **Premier paiement** (vente) : Utilisez la carte test `4242 4242 4242 4242`
2. **Deuxième paiement** (location) : Utilisez la carte test `4242 4242 4242 4242`

### **Étape 4 : Vérifier les emails**
1. **Surveillez les logs Render** pour voir les messages d'email
2. **Vérifiez votre boîte email** (spams inclus)
3. **Vérifiez l'email admin** configuré

## 📋 **Messages dans les logs Render :**

### **Pour la vente :**
```
📧 Envoi facture de vente avec PDF pour la commande: [ID]
📧 Transporter disponible: true
✅ Facture de vente envoyée avec PDF
✅ Notification admin envoyée avec PDF
```

### **Pour la location :**
```
📧 Envoi facture de location avec PDF pour: [ID]
📧 Transporter disponible: true
✅ Facture de location envoyée avec PDF
✅ Notification admin envoyée avec PDF
```

## 🎯 **Avantages du système :**

1. **Factures séparées** : Chaque type de commande a sa propre facture
2. **Emails distincts** : Le client reçoit 2 emails clairement séparés
3. **Notifications admin** : L'admin reçoit 2 notifications distinctes
4. **PDFs séparés** : Chaque facture est un PDF distinct
5. **Traçabilité** : Chaque commande a son propre numéro et statut

## 🔧 **En cas de problème :**

### **Si le client ne reçoit qu'un email :**
- Vérifiez que les deux paiements ont été complétés
- Vérifiez les logs Render pour les erreurs d'email
- Vérifiez les spams dans la boîte email

### **Si l'admin ne reçoit qu'une notification :**
- Vérifiez que `ADMIN_EMAIL` est configuré sur Render
- Vérifiez les logs Render pour les erreurs d'email
- Vérifiez les spams dans la boîte email admin

### **Si les factures PDF ne se téléchargent pas :**
- Vérifiez que les routes `/api/payment/invoice/:orderId` et `/api/rental/invoice/:rentalId` fonctionnent
- Vérifiez que les PDFs sont générés correctement
- Vérifiez les logs Render pour les erreurs de génération PDF

## 📞 **Support :**

Si le problème persiste :
1. Copiez les logs Render exacts
2. Identifiez quelle partie du processus échoue
3. Vérifiez la configuration email
4. Testez avec des données simples
