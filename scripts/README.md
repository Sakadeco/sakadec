# Scripts de Test SakaDeco

Ce dossier contient des scripts de test pour vérifier le bon fonctionnement de l'application SakaDeco.

## 📋 Scripts disponibles

### 1. `test-product-creation.js` - Test complet
Script de test complet qui teste toutes les fonctionnalités de création de produits avec personnalisation.

**Fonctionnalités testées :**
- ✅ Connexion admin
- ✅ Upload d'images
- ✅ Création de produit avec toutes les options de personnalisation
- ✅ Récupération du produit créé
- ✅ Création de commande avec personnalisation
- ✅ Vérification des notifications email

**Options de personnalisation testées :**
- Dropdown (taille)
- Checkbox (couleurs)
- Texte simple
- Textarea
- Gravure texte uniquement
- Gravure image uniquement
- Gravure texte et image

### 2. `test-local.js` - Test local simple
Script de test simplifié pour tester rapidement les fonctionnalités de base.

**Fonctionnalités testées :**
- ✅ Upload d'image
- ✅ Création de produit simple avec personnalisation

### 3. `cleanup-test-data.js` - Nettoyage des données de test
Script pour supprimer les données de test créées par les scripts de test.

**Données nettoyées :**
- ✅ Produits contenant "Test" dans le nom
- ✅ Commandes avec email `test@example.com`

## 🚀 Utilisation

### Prérequis
1. Assurez-vous que le serveur est démarré
2. Vérifiez que les variables d'environnement sont configurées dans `.env`

### Test local (recommandé pour commencer)
```bash
# Test simple local
npx tsx scripts/test-local.js
```

### Test complet
```bash
# Test complet avec toutes les fonctionnalités
npx tsx scripts/test-product-creation.js
```

### Nettoyage des données de test
```bash
# Supprimer les données de test
npx tsx scripts/cleanup-test-data.js
```

## 🔧 Configuration

### Variables d'environnement requises
```env
# URL de l'API (local ou production)
API_BASE_URL=http://localhost:3000

# Identifiants admin
ADMIN_EMAIL=admin@sakadeco.com
ADMIN_PASSWORD=admin123
```

### Test sur Render (production)
Pour tester sur Render, modifiez `API_BASE_URL` dans le script :
```javascript
const API_BASE_URL = 'https://sakadeco-api.onrender.com';
```

## 📊 Interprétation des résultats

### Logs colorés
- 🟢 **Vert** : Succès
- 🔴 **Rouge** : Erreur
- 🟡 **Jaune** : Avertissement
- 🔵 **Bleu** : Information
- 🔵 **Cyan** : Étapes du test

### Exemple de sortie réussie
```
=== Test de connexion admin ===
✅ Connexion admin réussie

=== Test d'upload d'image ===
✅ Upload d'image réussi: /uploads/customizations/test-image.png

=== Test de création de produit ===
✅ Produit créé avec succès: 507f1f77bcf86cd799439011

=== Résumé des tests ===
✅ Tous les tests principaux ont réussi !
📦 Produit créé: 507f1f77bcf86cd799439011
🛒 Commande créée: 507f1f77bcf86cd799439012
📧 Email admin vérifié
```

## 🐛 Dépannage

### Erreurs courantes

#### 1. Erreur de connexion admin
```
❌ Échec de la connexion admin: HTTP 401: Unauthorized
```
**Solution :** Vérifiez les identifiants admin dans `.env`

#### 2. Erreur d'upload d'image
```
❌ Échec de l'upload d'image: HTTP 500: Internal Server Error
```
**Solution :** Vérifiez que le dossier `uploads/customizations` existe

#### 3. Erreur de création de produit
```
❌ Échec de la création de produit: HTTP 400: Bad Request
```
**Solution :** Vérifiez que toutes les options de personnalisation sont correctement formatées

### Debug avancé
Pour plus de détails sur les erreurs, ajoutez des logs dans les scripts :
```javascript
console.log('Debug - Données envoyées:', productData);
console.log('Debug - Réponse reçue:', await response.text());
```

## 🔄 Workflow de test recommandé

1. **Test local simple** : `npx tsx scripts/test-local.js`
2. **Correction des erreurs** si nécessaire
3. **Test complet** : `npx tsx scripts/test-product-creation.js`
4. **Nettoyage** : `npx tsx scripts/cleanup-test-data.js`
5. **Test sur Render** (modifier `API_BASE_URL`)

## 📝 Notes importantes

- Les scripts créent des données de test réelles dans la base de données
- Utilisez toujours le script de nettoyage après les tests
- Les images de test sont des PNG 1x1 pixel (très légères)
- Les scripts sont conçus pour être idempotents (peuvent être exécutés plusieurs fois)

## 🤝 Contribution

Pour ajouter de nouveaux tests :
1. Créez un nouveau script dans ce dossier
2. Suivez la convention de nommage et de logging
3. Ajoutez la documentation dans ce README
4. Testez le script avant de le commiter
