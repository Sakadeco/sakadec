# 🎨 Fonctionnalité de Prévisualisation 3D avec Gravure

## 📋 Vue d'ensemble

Cette fonctionnalité permet aux clients de personnaliser leurs produits avec des gravures de nom et d'image, puis de prévisualiser le résultat en 3D avant l'achat.

## ✨ Fonctionnalités

### 🔧 Pour l'Administrateur

1. **Activation des options de gravure** :
   - Dans le formulaire de création de produit
   - Cocher "Produit personnalisable"
   - Activer "Permettre la gravure de nom"
   - Activer "Permettre la gravure d'image"

2. **Configuration des options** :
   - Type de gravure (texte, image, ou les deux)
   - Position de la gravure (avant, arrière, côté, haut, bas)
   - Style de gravure (simple, élégant, gras, script, décoratif)

### 🛒 Pour le Client

1. **Personnalisation du produit** :
   - Saisie du texte à graver (nom, message, etc.)
   - Upload d'image à graver
   - Choix de la position de gravure
   - Choix du style de gravure

2. **Prévisualisation 3D** :
   - Bouton "Prévisualiser en 3D"
   - Vue interactive du produit personnalisé
   - Rotation, zoom, et navigation 3D
   - Possibilité de télécharger la prévisualisation

## 🛠️ Technologies utilisées

### Bibliothèques 3D
- **Three.js** : Moteur 3D principal
- **@react-three/fiber** : Intégration React pour Three.js
- **@react-three/drei** : Composants utilitaires pour Three.js

### Installation
```bash
npm install three @types/three @react-three/fiber @react-three/drei
```

## 📁 Structure des fichiers

```
client/src/components/
├── Product3DPreview.tsx      # Composant de prévisualisation 3D
├── ProductCustomization.tsx  # Interface de personnalisation
└── ui/                       # Composants UI existants

server/models/
└── Product.ts               # Modèle mis à jour avec options de gravure
```

## 🔄 Flux d'utilisation

1. **Admin crée un produit** avec options de gravure activées
2. **Client visite la page produit** et voit les options de personnalisation
3. **Client saisit le texte** ou upload une image
4. **Client clique sur "Prévisualiser en 3D"**
5. **Modal 3D s'ouvre** avec le produit personnalisé
6. **Client peut naviguer** dans la vue 3D
7. **Client ajoute au panier** avec les personnalisations

## 🎯 Types de personnalisation

### Gravure de texte
- **Champ de saisie** pour le texte
- **Position** : avant, arrière, côté, haut, bas
- **Style** : simple, élégant, gras, script, décoratif
- **Limite** : 50 caractères

### Gravure d'image
- **Upload d'image** (formats supportés : JPG, PNG, GIF)
- **Position** : avant, arrière, côté, haut, bas
- **Prévisualisation** de l'image sélectionnée
- **Suppression** possible de l'image

## 🎨 Styles de police disponibles

- **Simple** : Roboto Regular
- **Élégant** : Playfair Display Bold
- **Gras** : Roboto Bold
- **Script** : Dancing Script Bold
- **Décoratif** : Great Vibes Regular

## 📱 Responsive Design

- **Desktop** : Vue 3D complète avec contrôles
- **Tablet** : Vue adaptée avec contrôles tactiles
- **Mobile** : Vue simplifiée avec navigation gestuelle

## 🔧 Configuration avancée

### Polices personnalisées
Les polices doivent être placées dans le dossier `public/fonts/` :
```
public/fonts/
├── Roboto-Regular.ttf
├── Roboto-Bold.ttf
├── PlayfairDisplay-Bold.ttf
├── DancingScript-Bold.ttf
└── GreatVibes-Regular.ttf
```

### Paramètres 3D
- **Caméra** : position [3, 3, 3], FOV 50°
- **Éclairage** : ambiant + directionnel
- **Contrôles** : rotation, zoom, pan
- **Performance** : ombres activées

## 🚀 Améliorations futures

1. **Plus de styles de gravure**
2. **Animations de gravure**
3. **Export en différents formats**
4. **Partage sur réseaux sociaux**
5. **Historique des personnalisations**
6. **Templates prédéfinis**

## 🐛 Dépannage

### Problèmes courants

1. **Prévisualisation ne se charge pas** :
   - Vérifier que Three.js est installé
   - Vérifier les polices dans `/public/fonts/`

2. **Performance lente** :
   - Réduire la qualité des textures
   - Désactiver les ombres sur mobile

3. **Erreurs de texture** :
   - Vérifier les URLs des images
   - S'assurer que les images sont accessibles

## 📞 Support

Pour toute question ou problème avec cette fonctionnalité, consultez la documentation Three.js ou contactez l'équipe de développement.


