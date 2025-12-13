import mongoose from 'mongoose';
import { Realisation } from './models/Realisation';
import { connectDB } from './db';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Les images sont stockées localement dans client/src/assets/images
// Après le build Vite, elles seront dans dist/assets/images
// Pour le seed, on utilise des chemins relatifs qui seront résolus depuis la racine du site
const realisations = [
  {
    title: "Mariage Élégant - Château de Bordeaux",
    category: "Mariage",
    date: new Date("2024-06-15"),
    location: "Bordeaux, France",
    guests: 120,
    description: "Un mariage romantique dans un château historique avec une décoration florale sophistiquée. Arches de roses blanches et rouges, centres de table personnalisés et éclairage d'ambiance. La décoration a été pensée dans les moindres détails pour créer une atmosphère élégante et raffinée.",
    images: [
      "/assets/images/DSC_6144-HDR.JPG",
      "/assets/images/DSC_6145-HDR.JPG",
      "/assets/images/DSC_6148-HDR.JPG"
    ],
    highlights: [
      "Arches florales",
      "Centres de table personnalisés",
      "Éclairage d'ambiance",
      "Coordination complète"
    ],
    rating: 5,
    isPublished: true
  },
  {
    title: "Anniversaire 50 ans - Villa Moderne",
    category: "Anniversaire",
    date: new Date("2024-05-22"),
    location: "Arcachon, France",
    guests: 80,
    description: "Célébration d'un demi-siècle avec une décoration moderne et élégante. Thème doré et blanc, installations lumineuses, et mobilier de location personnalisé. L'événement a été un véritable succès avec une décoration qui a su allier modernité et élégance.",
    images: [
      "/assets/images/DSC_6151-HDR.JPG",
      "/assets/images/DSC_6157-HDR.JPG",
      "/assets/images/DSC_6160-HDR.JPG"
    ],
    highlights: [
      "Thème doré et blanc",
      "Installations lumineuses",
      "Mobilier personnalisé",
      "Coordination événementielle"
    ],
    rating: 5,
    isPublished: true
  },
  {
    title: "Baby Shower - Espace Privé",
    category: "Baby Shower",
    date: new Date("2024-04-08"),
    location: "Bordeaux Centre, France",
    guests: 45,
    description: "Un baby shower tendre et raffiné avec une décoration pastel et des installations douces. Ballons personnalisés, centre de table floraux et animations pour les invités. Une décoration délicate qui a su créer une atmosphère chaleureuse et joyeuse pour célébrer l'arrivée du bébé.",
    images: [
      "/assets/images/DSC_6163-HDR.JPG",
      "/assets/images/DSC_6175-HDR.JPG",
      "/assets/images/DSC_6178-HDR.JPG"
    ],
    highlights: [
      "Décoration pastel",
      "Ballons personnalisés",
      "Centres de table floraux",
      "Animations douces"
    ],
    rating: 5,
    isPublished: true
  }
];

async function seedRealisations() {
  try {
    // Connexion à MongoDB
    await connectDB();
    console.log('✅ Connecté à MongoDB');

    // Supprimer les réalisations existantes (optionnel)
    const deleted = await Realisation.deleteMany({});
    console.log(`🗑️  ${deleted.deletedCount} réalisations supprimées`);

    // Insérer les nouvelles réalisations
    const inserted = await Realisation.insertMany(realisations);
    console.log(`✅ ${inserted.length} réalisations créées avec succès`);

    // Afficher les réalisations créées
    inserted.forEach((realisation, index) => {
      console.log(`\n📸 Réalisation ${index + 1}:`);
      console.log(`   - Titre: ${realisation.title}`);
      console.log(`   - Catégorie: ${realisation.category}`);
      console.log(`   - Images: ${realisation.images.length}`);
    });

    console.log('\n✅ Seed terminé avec succès !');
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

// Exécuter le seed
seedRealisations();

