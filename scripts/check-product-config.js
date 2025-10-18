import mongoose from 'mongoose';

// Configuration
const DATABASE_URL = 'mongodb+srv://sakadeco:sakadeco@cluster0.oxicc0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkProductConfig() {
  try {
    log('🚀 Vérification de la configuration des produits', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. Connexion à la base de données
    log('📡 Connexion à MongoDB...', 'blue');
    await mongoose.connect(DATABASE_URL);
    log('✅ Connecté à MongoDB', 'green');

    const db = mongoose.connection.db;

    // 2. Récupérer tous les produits
    log('🔍 Recherche de tous les produits...', 'blue');
    const productsCollection = db.collection('products');
    const products = await productsCollection.find({}).toArray();

    log(`✅ ${products.length} produits trouvés`, 'green');

    // 3. Analyser chaque produit
    log('📋 Analyse des produits:', 'blue');
    products.forEach((product, index) => {
      log(`\n${index + 1}. ${product.name}`, 'yellow');
      log(`   - ID: ${product._id}`, 'yellow');
      log(`   - Catégorie: ${product.category}`, 'yellow');
      log(`   - Pour vente: ${product.isForSale}`, 'yellow');
      log(`   - Pour location: ${product.isForRent}`, 'yellow');
      log(`   - Prix: ${product.price}€`, 'yellow');
      log(`   - Prix location: ${product.dailyRentalPrice || 'Non défini'}€/jour`, 'yellow');
      log(`   - Personnalisable: ${product.isCustomizable}`, 'yellow');
      
      // Vérifier si le produit est "prod1"
      if (product.name.toLowerCase().includes('prod1')) {
        log(`   ⚠️  PRODUIT PROD1 TROUVÉ - Configuration:`, 'red');
        log(`      - isForSale: ${product.isForSale}`, 'red');
        log(`      - isForRent: ${product.isForRent}`, 'red');
        log(`      - dailyRentalPrice: ${product.dailyRentalPrice}`, 'red');
        
        if (!product.isForRent) {
          log(`   ❌ PROBLÈME: prod1 n'est pas configuré pour la location!`, 'red');
        }
      }
    });

    // 4. Vérifier spécifiquement prod1
    log('\n🔍 Recherche spécifique de prod1...', 'blue');
    const prod1 = await productsCollection.findOne({ name: { $regex: /prod1/i } });
    
    if (prod1) {
      log('✅ Produit prod1 trouvé', 'green');
      log(`   - Nom: ${prod1.name}`, 'yellow');
      log(`   - isForSale: ${prod1.isForSale}`, 'yellow');
      log(`   - isForRent: ${prod1.isForRent}`, 'yellow');
      log(`   - dailyRentalPrice: ${prod1.dailyRentalPrice}`, 'yellow');
      
      if (!prod1.isForRent) {
        log('❌ PROBLÈME: prod1 n\'est pas configuré pour la location', 'red');
        log('💡 Solution: Mettre à jour prod1 pour la location', 'cyan');
        
        // Proposer la correction
        log('\n🔧 Correction proposée:', 'blue');
        log('1. Mettre isForRent à true', 'yellow');
        log('2. Définir un dailyRentalPrice', 'yellow');
        log('3. Ou séparer les produits de vente et de location', 'yellow');
      } else {
        log('✅ prod1 est correctement configuré pour la location', 'green');
      }
    } else {
      log('❌ Produit prod1 non trouvé', 'red');
    }

    // 5. Analyser le problème du panier mixte
    log('\n🛒 Analyse du problème du panier mixte:', 'blue');
    log('Le problème vient du fait que le panier contient:', 'yellow');
    log('- Des produits de vente (prod1)', 'yellow');
    log('- Des produits de location (prodloc)', 'yellow');
    log('', 'reset');
    log('Le système essaie de traiter tout comme des locations', 'yellow');
    log('Mais prod1 n\'est pas configuré pour la location', 'yellow');

    // 6. Solutions proposées
    log('\n💡 Solutions proposées:', 'cyan');
    log('1. Séparer les paniers: vente et location', 'yellow');
    log('2. Configurer prod1 pour la location aussi', 'yellow');
    log('3. Modifier la logique pour gérer les paniers mixtes', 'yellow');
    log('4. Empêcher l\'ajout de produits non-location dans un panier de location', 'yellow');

    log('='.repeat(60), 'cyan');
    log('✅ Analyse terminée', 'green');

  } catch (error) {
    log(`❌ Erreur générale: ${error.message}`, 'red');
    log(`❌ Stack: ${error.stack}`, 'red');
  } finally {
    await mongoose.disconnect();
    log('🔌 Déconnecté de MongoDB', 'blue');
  }
}

// Exécuter l'analyse
checkProductConfig();
