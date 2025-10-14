import mongoose from 'mongoose';
import { Product } from '../server/models/Product.js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration de la base de données
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/sakadeco';

// Images de test (URLs d'images gratuites)
const TEST_IMAGES = {
  tables: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
  ],
  chairs: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
  ],
  lighting: [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop'
  ],
  decor: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop'
  ]
};

// Produits destinés à la location
const rentalProducts = [
  {
    name: "Tables de réception élégantes",
    description: "Tables de réception de haute qualité pour vos événements. Disponibles en différentes tailles et finitions pour s'adapter à tous vos besoins.",
    price: 0, // Prix de vente (non applicable pour la location)
    category: "rent",
    subcategory: "mobilier",
    mainImageUrl: TEST_IMAGES.tables[0],
    additionalImages: TEST_IMAGES.tables.slice(1),
    isCustomizable: true,
    isForSale: false,
    isForRent: true,
    stockQuantity: 20,
    dailyRentalPrice: 45.00,
    customizationOptions: {
      taille: {
        type: 'dropdown',
        label: 'Taille de la table',
        required: true,
        options: ['Ronde 120cm (8-10 personnes)', 'Ronde 150cm (10-12 personnes)', 'Rectangulaire 180x75cm (6-8 personnes)', 'Rectangulaire 240x75cm (8-10 personnes)']
      },
      style: {
        type: 'dropdown',
        label: 'Style de table',
        required: true,
        options: ['Moderne', 'Classique', 'Rustique', 'Luxe', 'Minimaliste']
      },
      couleur: {
        type: 'dropdown',
        label: 'Couleur',
        required: true,
        options: ['Blanc', 'Crème', 'Noir', 'Bois naturel', 'Chêne', 'Noyer']
      },
      quantite: {
        type: 'dropdown',
        label: 'Nombre de tables',
        required: true,
        options: ['1', '2', '3', '4', '5', '6', '8', '10']
      },
      nappes: {
        type: 'checkbox',
        label: 'Inclure des nappes assorties',
        required: false,
        options: ['Oui, inclure des nappes (+5€/table/jour)']
      }
    }
  },
  {
    name: "Chaises de réception confortables",
    description: "Chaises de réception élégantes et confortables. Parfaites pour vos mariages, événements d'entreprise et réceptions.",
    price: 0,
    category: "rent",
    subcategory: "mobilier",
    mainImageUrl: TEST_IMAGES.chairs[0],
    additionalImages: TEST_IMAGES.chairs.slice(1),
    isCustomizable: true,
    isForSale: false,
    isForRent: true,
    stockQuantity: 100,
    dailyRentalPrice: 8.50,
    customizationOptions: {
      style: {
        type: 'dropdown',
        label: 'Style de chaise',
        required: true,
        options: ['Chiavari classique', 'Chiavari moderne', 'Chiavari luxe', 'Chiavari rustique', 'Chiavari minimaliste']
      },
      couleur: {
        type: 'dropdown',
        label: 'Couleur',
        required: true,
        options: ['Blanc', 'Crème', 'Noir', 'Or', 'Argent', 'Bois naturel', 'Chêne', 'Noyer']
      },
      quantite: {
        type: 'dropdown',
        label: 'Nombre de chaises',
        required: true,
        options: ['10', '20', '30', '40', '50', '60', '80', '100', '120', '150']
      },
      coussins: {
        type: 'checkbox',
        label: 'Inclure des coussins assortis',
        required: false,
        options: ['Oui, inclure des coussins (+2€/chaise/jour)']
      },
      livraison: {
        type: 'checkbox',
        label: 'Service de livraison et installation',
        required: false,
        options: ['Oui, service complet (+50€)']
      }
    }
  },
  {
    name: "Éclairage d'ambiance professionnel",
    description: "Système d'éclairage d'ambiance professionnel pour créer l'atmosphère parfaite lors de vos événements.",
    price: 0,
    category: "rent",
    subcategory: "éclairage",
    mainImageUrl: TEST_IMAGES.lighting[0],
    additionalImages: TEST_IMAGES.lighting.slice(1),
    isCustomizable: true,
    isForSale: false,
    isForRent: true,
    stockQuantity: 15,
    dailyRentalPrice: 120.00,
    customizationOptions: {
      type: {
        type: 'dropdown',
        label: 'Type d\'éclairage',
        required: true,
        options: ['Éclairage LED RGB', 'Éclairage à spots', 'Éclairage d\'ambiance', 'Éclairage de scène', 'Éclairage complet (LED + spots)']
      },
      couleurs: {
        type: 'dropdown',
        label: 'Couleurs disponibles',
        required: true,
        options: ['Blanc chaud', 'Blanc froid', 'RGB multicolore', 'Or', 'Rose', 'Bleu', 'Vert', 'Personnalisé']
      },
      puissance: {
        type: 'dropdown',
        label: 'Puissance d\'éclairage',
        required: true,
        options: ['Standard (salle jusqu\'à 100m²)', 'Puissant (salle jusqu\'à 200m²)', 'Professionnel (salle jusqu\'à 500m²)', 'Événementiel (grands espaces)']
      },
      installation: {
        type: 'checkbox',
        label: 'Installation et configuration',
        required: false,
        options: ['Oui, installation professionnelle (+80€)', 'Oui, avec technicien sur place (+150€)']
      },
      controle: {
        type: 'dropdown',
        label: 'Contrôle d\'éclairage',
        required: true,
        options: ['Télécommande simple', 'Contrôleur DMX', 'Application mobile', 'Contrôle automatique']
      }
    }
  },
  {
    name: "Décoration florale et accessoires",
    description: "Ensemble de décoration florale et accessoires pour embellir vos événements. Comprend vases, supports et éléments décoratifs.",
    price: 0,
    category: "rent",
    subcategory: "décoration",
    mainImageUrl: TEST_IMAGES.decor[0],
    additionalImages: TEST_IMAGES.decor.slice(1),
    isCustomizable: true,
    isForSale: false,
    isForRent: true,
    stockQuantity: 30,
    dailyRentalPrice: 85.00,
    customizationOptions: {
      style: {
        type: 'dropdown',
        label: 'Style de décoration',
        required: true,
        options: ['Romantique', 'Moderne', 'Rustique', 'Élégant', 'Coloré', 'Pastel', 'Luxe', 'Minimaliste']
      },
      elements: {
        type: 'dropdown',
        label: 'Éléments inclus',
        required: true,
        options: ['Vases et supports uniquement', 'Vases + fleurs artificielles', 'Vases + fleurs + accessoires', 'Pack complet (vases + fleurs + accessoires + bougies)']
      },
      quantite: {
        type: 'dropdown',
        label: 'Nombre d\'éléments',
        required: true,
        options: ['5 éléments', '10 éléments', '15 éléments', '20 éléments', '25 éléments', '30 éléments']
      },
      couleurs: {
        type: 'dropdown',
        label: 'Palette de couleurs',
        required: true,
        options: ['Blancs et verts', 'Roses et blancs', 'Rouges et roses', 'Jaunes et oranges', 'Violets et blancs', 'Multicolore', 'Pastels', 'Personnalisé']
      },
      installation: {
        type: 'checkbox',
        label: 'Installation et décoration sur place',
        required: false,
        options: ['Oui, installation par nos décorateurs (+100€)', 'Oui, avec retrait le lendemain (+50€)']
      }
    }
  }
];

async function createRentalProducts() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciens produits de test
    console.log('🧹 Nettoyage des anciens produits de location...');
    await Product.deleteMany({ 
      name: { 
        $in: rentalProducts.map(p => p.name) 
      } 
    });

    // Créer les nouveaux produits
    console.log('📦 Création des produits destinés à la location...');
    const createdProducts = await Product.insertMany(rentalProducts);

    console.log('✅ Produits de location créés avec succès:');
    createdProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.dailyRentalPrice}€/jour)`);
    });

    console.log(`\n🎉 ${createdProducts.length} produits destinés à la location ont été créés !`);
    console.log('📍 Vous pouvez maintenant les voir dans votre section "SDK Rend".');

  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
createRentalProducts();

