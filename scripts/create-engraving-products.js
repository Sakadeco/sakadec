import mongoose from 'mongoose';
import { Product } from '../server/models/Product.ts';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration de la base de données
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/sakadeco';

// Images de test (URLs d'images gratuites)
const TEST_IMAGES = {
  trophy: [
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
  ],
  plaque: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
  ],
  watch: [
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop'
  ]
};

// Produits avec options de gravure
const engravingProducts = [
  {
    name: "Trophée personnalisable",
    description: "Trophée élégant en métal avec possibilité de gravure personnalisée. Parfait pour les récompenses d'entreprise, événements sportifs ou reconnaissances spéciales.",
    price: 89.99,
    category: "shop",
    subcategory: "trophées",
    mainImageUrl: TEST_IMAGES.trophy[0],
    additionalImages: TEST_IMAGES.trophy.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 30,
    customizationOptions: {
      nom_a_graver: {
        type: 'name_engraving',
        label: 'Nom à graver',
        required: true,
        engravingPosition: 'front',
        engravingStyle: 'elegant'
      },
      taille: {
        type: 'dropdown',
        label: 'Taille du trophée',
        required: true,
        options: ['Petit (15cm)', 'Moyen (25cm)', 'Grand (35cm)', 'Extra Large (45cm)']
      },
      couleur: {
        type: 'dropdown',
        label: 'Couleur du métal',
        required: true,
        options: ['Or', 'Argent', 'Bronze', 'Chrome', 'Laiton']
      },
      style: {
        type: 'dropdown',
        label: 'Style du trophée',
        required: true,
        options: ['Classique', 'Moderne', 'Sportif', 'Élégant', 'Minimaliste']
      }
    }
  },
  {
    name: "Plaque commémorative gravée",
    description: "Plaque commémorative en bois noble avec gravure personnalisée. Idéale pour les événements, inaugurations ou souvenirs spéciaux.",
    price: 149.99,
    category: "shop",
    subcategory: "plaques",
    mainImageUrl: TEST_IMAGES.plaque[0],
    additionalImages: TEST_IMAGES.plaque.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 20,
    customizationOptions: {
      texte_a_graver: {
        type: 'name_engraving',
        label: 'Texte à graver',
        required: true,
        engravingPosition: 'front',
        engravingStyle: 'script'
      },
      logo_a_graver: {
        type: 'image_upload',
        label: 'Logo à graver (optionnel)',
        required: false,
        engravingPosition: 'top',
        engravingStyle: 'simple'
      },
      materiau: {
        type: 'dropdown',
        label: 'Matériau',
        required: true,
        options: ['Chêne', 'Noyer', 'Acajou', 'Érable', 'Merisier']
      },
      taille: {
        type: 'dropdown',
        label: 'Taille de la plaque',
        required: true,
        options: ['Petite (20x30cm)', 'Moyenne (30x40cm)', 'Grande (40x60cm)', 'Extra Large (50x80cm)']
      },
      finition: {
        type: 'dropdown',
        label: 'Finition',
        required: true,
        options: ['Naturelle', 'Cire', 'Vernis mat', 'Vernis brillant', 'Huile']
      }
    }
  },
  {
    name: "Bracelet personnalisé gravé",
    description: "Bracelet en argent sterling avec gravure personnalisée. Parfait cadeau pour les anniversaires, mariages ou occasions spéciales.",
    price: 79.99,
    category: "shop",
    subcategory: "bijoux",
    mainImageUrl: TEST_IMAGES.jewelry[0],
    additionalImages: TEST_IMAGES.jewelry.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 50,
    customizationOptions: {
      nom_a_graver: {
        type: 'name_engraving',
        label: 'Nom ou message à graver',
        required: true,
        engravingPosition: 'inside',
        engravingStyle: 'elegant'
      },
      taille_bracelet: {
        type: 'dropdown',
        label: 'Taille du bracelet',
        required: true,
        options: ['16cm', '17cm', '18cm', '19cm', '20cm', '21cm', '22cm']
      },
      style: {
        type: 'dropdown',
        label: 'Style du bracelet',
        required: true,
        options: ['Classique', 'Moderne', 'Vintage', 'Minimaliste', 'Décoratif']
      },
      finition: {
        type: 'dropdown',
        label: 'Finition',
        required: true,
        options: ['Brillant', 'Mat', 'Brossé', 'Antique']
      }
    }
  },
  {
    name: "Montre personnalisée gravée",
    description: "Montre élégante avec boîtier personnalisable et gravure au dos. Idéale pour les cadeaux d'entreprise ou occasions spéciales.",
    price: 299.99,
    category: "shop",
    subcategory: "montres",
    mainImageUrl: TEST_IMAGES.watch[0],
    additionalImages: TEST_IMAGES.watch.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 15,
    customizationOptions: {
      nom_a_graver: {
        type: 'name_engraving',
        label: 'Nom ou message à graver',
        required: true,
        engravingPosition: 'back',
        engravingStyle: 'bold'
      },
      logo_a_graver: {
        type: 'image_upload',
        label: 'Logo à graver (optionnel)',
        required: false,
        engravingPosition: 'back',
        engravingStyle: 'simple'
      },
      couleur_cadran: {
        type: 'dropdown',
        label: 'Couleur du cadran',
        required: true,
        options: ['Noir', 'Blanc', 'Bleu', 'Vert', 'Gris', 'Marron']
      },
      bracelet: {
        type: 'dropdown',
        label: 'Type de bracelet',
        required: true,
        options: ['Cuir noir', 'Cuir marron', 'Métal argenté', 'Métal doré', 'Caoutchouc']
      },
      taille: {
        type: 'dropdown',
        label: 'Taille du boîtier',
        required: true,
        options: ['38mm', '40mm', '42mm', '44mm', '46mm']
      }
    }
  }
];

async function createEngravingProducts() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciens produits de test
    console.log('🧹 Nettoyage des anciens produits de gravure...');
    await Product.deleteMany({ 
      name: { 
        $in: engravingProducts.map(p => p.name) 
      } 
    });

    // Créer les nouveaux produits
    console.log('📦 Création des produits avec options de gravure...');
    const createdProducts = await Product.insertMany(engravingProducts);

    console.log('✅ Produits créés avec succès:');
    createdProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.price}€)`);
      console.log(`    Options de gravure: ${Object.keys(product.customizationOptions).filter(key => 
        product.customizationOptions[key].type === 'name_engraving' || 
        product.customizationOptions[key].type === 'image_upload'
      ).length}`);
    });

    console.log(`\n🎉 ${createdProducts.length} produits avec options de gravure ont été créés !`);
    console.log('📍 Vous pouvez maintenant les voir dans votre boutique.');
    console.log('🔧 Les clients pourront personnaliser ces produits avec gravure de texte ou d\'image.');

  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
createEngravingProducts();
