import mongoose from 'mongoose';
import { Product } from './models/Product';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = 'mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/SDK?retryWrites=true&w=majority&appName=Cluster0';

const products = [
  {
    name: "Ballons de Fête Colorés",
    description: "Lot de 50 ballons de fête multicolores de haute qualité, parfaits pour toutes vos célébrations. Ballons en latex naturel, résistants et durables.",
    price: 25.99,
    category: "shop",
    subcategory: "ballons",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
    isCustomizable: true,
    isRentable: false,
    stockQuantity: 100,
    customizationOptions: {
      colors: ["rouge", "bleu", "vert", "jaune", "rose", "orange", "violet"],
      sizes: ["petit", "moyen", "grand"],
      text: true
    }
  },
  {
    name: "Bouquet de Roses Premium",
    description: "Magnifique bouquet de 12 roses rouges fraîches, arrangées avec soin et accompagnées de verdure. Idéal pour les occasions romantiques et les événements spéciaux.",
    price: 89.99,
    category: "shop",
    subcategory: "fleurs",
    imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=300&fit=crop",
    isCustomizable: true,
    isRentable: false,
    stockQuantity: 25,
    customizationOptions: {
      colors: ["rouge", "blanc", "rose", "jaune", "orange"],
      arrangements: ["classique", "moderne", "romantique"],
      message: true
    }
  },
  {
    name: "Arche de Ballons Événementielle",
    description: "Arche de ballons professionnelle pour vos événements. Installation complète avec support métallique, ballons de qualité et service de montage inclus.",
    price: 299.99,
    category: "events",
    subcategory: "décoration",
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
    isCustomizable: true,
    isRentable: true,
    stockQuantity: 5,
    dailyRentalPrice: 150.00,
    customizationOptions: {
      colors: ["thème personnalisé", "couleurs de votre choix"],
      tailles: ["3m", "4m", "5m"],
      styles: ["classique", "moderne", "fantaisie"]
    }
  },
  {
    name: "Pack Décoration Mariage Complet",
    description: "Pack complet de décoration pour mariage incluant : guirlandes, photobooth, centre de table, accessoires photo et service de décoration personnalisée.",
    price: 599.99,
    category: "events",
    subcategory: "mariage",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
    isCustomizable: true,
    isRentable: true,
    stockQuantity: 3,
    dailyRentalPrice: 250.00,
    customizationOptions: {
      thèmes: ["romantique", "moderne", "vintage", "bohème", "élégant"],
      couleurs: ["personnalisées selon vos goûts"],
      services: ["installation", "démontage", "coordination"]
    }
  },
  {
    name: "Éclairage LED Professionnel",
    description: "Kit d'éclairage LED professionnel pour événements. Inclut projecteurs, spots colorés, contrôleur DMX et service d'installation technique.",
    price: 799.99,
    category: "rent",
    subcategory: "éclairage",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    isCustomizable: false,
    isRentable: true,
    stockQuantity: 8,
    dailyRentalPrice: 120.00
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products:`);
    
    createdProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.category})`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
