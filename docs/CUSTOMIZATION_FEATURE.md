# Fonctionnalité de Personnalisation avec Gravure

## Vue d'ensemble

Cette fonctionnalité permet aux administrateurs de créer des produits personnalisables avec des options de gravure de texte et d'image, et aux clients de prévisualiser ces personnalisations en 3D.

## Fonctionnalités principales

### 1. Options de gravure pour l'administrateur

L'administrateur peut ajouter deux types d'options de gravure lors de la création d'un produit :

- **Gravure de texte/nom** (`name_engraving`) : Permet aux clients d'entrer du texte à graver
- **Gravure d'image** (`image_upload`) : Permet aux clients d'uploader une image à graver

### 2. Configuration des options de gravure

Pour chaque option de gravure, l'administrateur peut configurer :

- **Position de la gravure** : Avant, Arrière, Côté, Haut, Bas
- **Style de gravure** : Simple, Élégant, Gras, Script, Décoratif
- **Obligatoire ou optionnel** : Si l'option est requise pour la commande

### 3. Prévisualisation 3D pour le client

Les clients peuvent :
- Entrer du texte à graver
- Uploader une image à graver
- Choisir la position et le style de gravure
- Prévisualiser le résultat en 3D avec différentes vues
- Zoomer et faire pivoter la prévisualisation

## Comment utiliser

### Pour l'administrateur

1. **Créer un produit personnalisable** :
   - Aller dans `/admin/products/add`
   - Activer "Produit personnalisable"
   - Cliquer sur "Gravure personnalisée" pour ajouter des options de gravure

2. **Configurer les options de gravure** :
   - Choisir le type (texte ou image)
   - Définir le libellé
   - Sélectionner la position et le style
   - Marquer comme obligatoire si nécessaire

### Pour le client

1. **Accéder à la démonstration** :
   - Visiter `/demo-customization` pour tester la fonctionnalité

2. **Personnaliser le produit** :
   - Choisir les options de base (taille, couleur, style)
   - Entrer du texte à graver ou uploader une image
   - Sélectionner la position et le style de gravure

3. **Prévisualiser en 3D** :
   - Cliquer sur "Prévisualiser en 3D"
   - Explorer différentes vues (avant, arrière, côté, haut, bas)
   - Utiliser les contrôles de zoom et rotation

## Structure technique

### Modèle de données

Le modèle `Product` a été étendu avec de nouveaux champs dans `customizationOptions` :

```typescript
customizationOptions: {
  type: 'name_engraving' | 'image_upload',
  label: string,
  required: boolean,
  engravingPosition: 'front' | 'back' | 'side' | 'top' | 'bottom',
  engravingStyle: 'simple' | 'elegant' | 'bold' | 'script' | 'decorative'
}
```

### Composants principaux

1. **AdminAddProduct.tsx** : Formulaire d'administration pour créer des produits avec options de gravure
2. **ProductCustomization.tsx** : Interface client pour personnaliser les produits
3. **Product3DPreview.tsx** : Prévisualisation 3D des personnalisations
4. **ProductCustomizationDemo.tsx** : Page de démonstration

### Dépendances

- **Three.js** : Pour la prévisualisation 3D (installé mais version simplifiée utilisée)
- **@react-three/fiber** : Wrapper React pour Three.js
- **@react-three/drei** : Utilitaires pour Three.js

## Exemples de produits

### Trophée personnalisable
- Gravure de nom sur l'avant
- Options de taille, couleur et style
- Position de gravure : avant
- Style de gravure : élégant

### Plaque commémorative
- Gravure de texte sur l'avant
- Gravure de logo optionnelle en haut
- Options de matériau, taille et finition

### Bracelet personnalisé
- Gravure de nom à l'intérieur
- Options de taille, style et finition
- Position de gravure : intérieur

### Montre personnalisée
- Gravure de nom au dos
- Gravure de logo optionnelle au dos
- Options de couleur, bracelet et taille

## Prévisualisation 3D

### Fonctionnalités
- **Vues multiples** : Avant, arrière, côté, haut, bas
- **Contrôles interactifs** : Rotation, zoom, reset
- **Rendu en temps réel** : Mise à jour instantanée des personnalisations
- **Effets visuels** : Ombres, reflets, profondeur

### Contrôles utilisateur
- **Rotation** : Bouton pour faire pivoter le produit
- **Zoom** : Boutons + et - pour ajuster la taille
- **Vues** : Boutons pour changer d'angle de vue
- **Reset** : Retour à la vue initiale

## Installation et configuration

### 1. Installer les dépendances

```bash
cd client
npm install three @react-three/fiber@8.15.19 @react-three/drei@9.102.6 @types/three
```

### 2. Créer des produits de test

```bash
node scripts/create-engraving-products.mjs
```

### 3. Tester la fonctionnalité

1. Visiter `/demo-customization`
2. Personnaliser un produit
3. Prévisualiser en 3D

## Personnalisation avancée

### Styles de police

Les styles de gravure correspondent à différentes classes CSS :
- **Simple** : `font-normal`
- **Élégant** : `font-serif italic`
- **Gras** : `font-bold`
- **Script** : `font-serif italic`
- **Décoratif** : `font-serif`

### Couleurs de gravure

Chaque style a sa couleur associée :
- **Simple** : Gris (`text-gray-700`)
- **Élégant** : Jaune doré (`text-yellow-600`)
- **Gras** : Gris foncé (`text-gray-800`)
- **Script** : Ambre (`text-amber-700`)
- **Décoratif** : Or (`text-gold-600`)

## Évolutions futures

### Améliorations possibles

1. **Vraie 3D** : Implémentation complète avec Three.js
2. **Plus de styles** : Ajout de polices personnalisées
3. **Animations** : Transitions fluides entre les vues
4. **Export** : Téléchargement de la prévisualisation
5. **Partage** : Partage des personnalisations sur les réseaux sociaux

### Intégrations

1. **API de gravure** : Connexion avec des services de gravure réels
2. **Calcul de prix** : Prix dynamique selon les options
3. **Validation** : Vérification des formats d'image et longueur de texte
4. **Historique** : Sauvegarde des personnalisations précédentes

## Support et maintenance

### Dépannage

1. **Problèmes de prévisualisation** : Vérifier les dépendances Three.js
2. **Erreurs d'upload** : Vérifier la configuration Cloudinary
3. **Problèmes de base de données** : Vérifier la connexion MongoDB

### Maintenance

1. **Mise à jour des dépendances** : Surveiller les nouvelles versions
2. **Optimisation des performances** : Lazy loading des composants 3D
3. **Sécurité** : Validation des uploads d'images
4. **Tests** : Tests automatisés pour les fonctionnalités de personnalisation

## Conclusion

Cette fonctionnalité offre une expérience utilisateur riche et interactive pour la personnalisation de produits. Elle permet aux clients de visualiser précisément leur produit personnalisé avant l'achat, augmentant ainsi la confiance et réduisant les retours.
