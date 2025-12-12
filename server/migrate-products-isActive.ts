import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Importer le modèle Product
import { Product } from './models/Product';

async function migrateProducts() {
  try {
    // Connexion à MongoDB (même logique que server/db.ts)
    const mongoUri = process.env.DATABASE_URL || 'mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/SDK?retryWrites=true&w=majority&appName=Cluster0';
    
    if (!mongoUri) {
      throw new Error('DATABASE_URL n\'est pas défini dans les variables d\'environnement');
    }

    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ Connecté à MongoDB');

    // Trouver tous les produits sans le champ isActive
    const productsWithoutIsActive = await Product.find({
      $or: [
        { isActive: { $exists: false } },
        { isActive: null }
      ]
    });

    console.log(`📦 Trouvé ${productsWithoutIsActive.length} produits sans le champ isActive`);

    if (productsWithoutIsActive.length === 0) {
      console.log('✅ Tous les produits ont déjà le champ isActive');
      await mongoose.disconnect();
      return;
    }

    // Mettre à jour tous les produits pour ajouter isActive: true
    const result = await Product.updateMany(
      {
        $or: [
          { isActive: { $exists: false } },
          { isActive: null }
        ]
      },
      {
        $set: { isActive: true }
      }
    );

    console.log(`✅ ${result.modifiedCount} produits mis à jour avec isActive: true`);
    console.log('✅ Migration terminée avec succès');

    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateProducts();

