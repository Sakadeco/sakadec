import mongoose from 'mongoose';
import { Product } from '../server/models/Product.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env') });

// Configuration de la base de données
const DATABASE_URL = 'mongodb://localhost:27017/sakadeco';

// Images de test (URLs d'images gratuites)
const TEST_IMAGES = {
  balloons: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
  ],
  flowers: [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&h=400&fit=crop'
  ],
  candles: [
    'https://images.unsplash.com/photo-1603006905004-6f2c0c0c0c0c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603006905004-6f2c0c0c0c0c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603006905004-6f2c0c0c0c0c?w=400&h=400&fit=crop'
  ],
  tableware: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
  ]
};

// Produits destinés à la vente
const saleProducts = [
  {
    name: "Ballons de décoration premium",
    description: "Ballons de haute qualité pour vos événements. Disponibles en différentes tailles et couleurs pour personnaliser votre décoration selon vos besoins.",
    price: 24.99,
    category: "shop",
    subcategory: "décoration",
    mainImageUrl: TEST_IMAGES.balloons[0],
    additionalImages: TEST_IMAGES.balloons.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 50,
    customizationOptions: {
      taille: {
        type: 'dropdown',
        label: 'Taille du ballon',
        required: true,
        options: ['Petit (20cm)', 'Moyen (30cm)', 'Grand (40cm)', 'Extra Large (50cm)']
      },
      couleur: {
        type: 'dropdown',
        label: 'Couleur',
        required: true,
        options: ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Violet', 'Orange', 'Blanc', 'Or', 'Argent']
      },
      quantite: {
        type: 'dropdown',
        label: 'Quantité',
        required: true,
        options: ['1', '5', '10', '15', '20', '25', '30']
      },
      personnalisation: {
        type: 'text_image_upload',
        label: 'Personnalisation (texte ou image)',
        required: false,
        placeholder: 'Entrez votre texte personnalisé ou téléchargez une image',
        maxLength: 50,
        maxFileSize: 5,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
        pricePerCharacter: 0.1,
        basePrice: 5
      }
    }
  },
  {
    name: "Bouquet de fleurs artificielles",
    description: "Magnifique bouquet de fleurs artificielles de haute qualité. Parfait pour une décoration durable et élégante.",
    price: 89.99,
    category: "shop",
    subcategory: "fleurs",
    mainImageUrl: TEST_IMAGES.flowers[0],
    additionalImages: TEST_IMAGES.flowers.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 25,
    customizationOptions: {
      style: {
        type: 'dropdown',
        label: 'Style de bouquet',
        required: true,
        options: ['Romantique', 'Moderne', 'Rustique', 'Élégant', 'Coloré', 'Pastel']
      },
      couleurs: {
        type: 'dropdown',
        label: 'Combinaison de couleurs',
        required: true,
        options: ['Roses et blancs', 'Rouges et roses', 'Jaunes et oranges', 'Violets et blancs', 'Multicolore', 'Blancs uniquement']
      },
      taille: {
        type: 'dropdown',
        label: 'Taille du bouquet',
        required: true,
        options: ['Petit (30cm)', 'Moyen (45cm)', 'Grand (60cm)', 'Extra Large (80cm)']
      },
      vase: {
        type: 'checkbox',
        label: 'Inclure un vase assorti',
        required: false,
        options: ['Oui, inclure un vase (+15€)']
      },
      personnalisation: {
        type: 'text_image_upload',
        label: 'Message ou logo personnalisé',
        required: false,
        placeholder: 'Ajoutez un message spécial ou votre logo',
        maxLength: 30,
        maxFileSize: 3,
        allowedFileTypes: ['image/jpeg', 'image/png'],
        pricePerCharacter: 0.15,
        basePrice: 8
      }
    }
  },
  {
    name: "Bougies décoratives parfumées",
    description: "Bougies décoratives parfumées pour créer une ambiance chaleureuse et romantique. Parfaites pour les dîners aux chandelles.",
    price: 34.99,
    category: "shop",
    subcategory: "éclairage",
    mainImageUrl: TEST_IMAGES.candles[0],
    additionalImages: TEST_IMAGES.candles.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 40,
    customizationOptions: {
      parfum: {
        type: 'dropdown',
        label: 'Parfum',
        required: true,
        options: ['Vanille', 'Lavande', 'Rose', 'Citron', 'Cannelle', 'Jasmin', 'Sans parfum']
      },
      couleur: {
        type: 'dropdown',
        label: 'Couleur de la bougie',
        required: true,
        options: ['Blanc', 'Crème', 'Rose', 'Bleu', 'Vert', 'Violet', 'Rouge', 'Or']
      },
      taille: {
        type: 'dropdown',
        label: 'Taille',
        required: true,
        options: ['Petite (4h)', 'Moyenne (8h)', 'Grande (12h)', 'Extra Large (24h)']
      },
      quantite: {
        type: 'dropdown',
        label: 'Nombre de bougies',
        required: true,
        options: ['1', '2', '3', '4', '6', '8', '12']
      },
      personnalisation: {
        type: 'text_image_upload',
        label: 'Gravure personnalisée',
        required: false,
        placeholder: 'Texte ou image à graver sur la bougie',
        maxLength: 20,
        maxFileSize: 2,
        allowedFileTypes: ['image/jpeg', 'image/png'],
        pricePerCharacter: 0.2,
        basePrice: 10
      }
    }
  },
  {
    name: "Service de vaisselle élégant",
    description: "Service de vaisselle élégant et raffiné pour vos événements spéciaux. Design moderne et durable.",
    price: 149.99,
    category: "shop",
    subcategory: "vaisselle",
    mainImageUrl: TEST_IMAGES.tableware[0],
    additionalImages: TEST_IMAGES.tableware.slice(1),
    isCustomizable: true,
    isForSale: true,
    isForRent: false,
    stockQuantity: 15,
    customizationOptions: {
      style: {
        type: 'dropdown',
        label: 'Style de vaisselle',
        required: true,
        options: ['Moderne', 'Classique', 'Rustique', 'Minimaliste', 'Luxe', 'Vintage']
      },
      couleur: {
        type: 'dropdown',
        label: 'Couleur',
        required: true,
        options: ['Blanc', 'Crème', 'Noir', 'Gris', 'Bleu', 'Rose', 'Vert', 'Doré']
      },
      pieces: {
        type: 'dropdown',
        label: 'Nombre de pièces',
        required: true,
        options: ['4 personnes', '6 personnes', '8 personnes', '12 personnes', '16 personnes']
      },
      type: {
        type: 'dropdown',
        label: 'Type de service',
        required: true,
        options: ['Assiettes plates uniquement', 'Service complet (assiettes + couverts)', 'Service premium (assiettes + couverts + verres)']
      },
      personnalisation: {
        type: 'text_image_upload',
        label: 'Personnalisation du service',
        required: false,
        placeholder: 'Ajoutez votre nom ou logo sur les assiettes',
        maxLength: 25,
        maxFileSize: 4,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
        pricePerCharacter: 0.25,
        basePrice: 15
      }
    }
  }
];

async function createSaleProducts() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciens produits de test
    console.log('🧹 Nettoyage des anciens produits de test...');
    await Product.deleteMany({ 
      name: { 
        $in: saleProducts.map(p => p.name) 
      } 
    });

    // Créer les nouveaux produits
    console.log('📦 Création des produits destinés à la vente...');
    const createdProducts = await Product.insertMany(saleProducts);

    console.log('✅ Produits créés avec succès:');
    createdProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.price}€)`);
    });

    console.log(`\n🎉 ${createdProducts.length} produits destinés à la vente ont été créés !`);
    console.log('📍 Vous pouvez maintenant les voir dans votre boutique.');

  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
createSaleProducts();

