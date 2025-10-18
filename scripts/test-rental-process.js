import mongoose from 'mongoose';
import https from 'https';
import http from 'http';

// Configuration
const API_BASE_URL = 'https://sakadeco.fr/api';
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

// Fonction pour faire des requêtes HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Erreur parsing JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function testRentalProcess() {
  try {
    log('🚀 Début du test du processus de location', 'cyan');
    log('=' * 50, 'cyan');

    // 1. Connexion à la base de données
    log('📡 Connexion à MongoDB...', 'blue');
    await mongoose.connect(DATABASE_URL);
    log('✅ Connecté à MongoDB', 'green');

    // 2. Récupérer le produit "prodloc"
    log('🔍 Recherche du produit "prodloc"...', 'blue');
    const { Product } = await import('../server/models/Product.ts');
    
    const product = await Product.findOne({ name: { $regex: /prodloc/i } });
    if (!product) {
      log('❌ Produit "prodloc" non trouvé', 'red');
      return;
    }

    log(`✅ Produit trouvé: ${product.name}`, 'green');
    log(`   - ID: ${product._id}`, 'yellow');
    log(`   - Catégorie: ${product.category}`, 'yellow');
    log(`   - Prix: ${product.price}€`, 'yellow');
    log(`   - Prix location: ${product.dailyRentalPrice}€/jour`, 'yellow');
    log(`   - Personnalisable: ${product.isCustomizable}`, 'yellow');
    log(`   - Pour location: ${product.isForRent}`, 'yellow');

    // 3. Vérifier les customizationOptions
    log('🔧 Vérification des customizationOptions...', 'blue');
    log(`   - Type: ${typeof product.customizationOptions}`, 'yellow');
    log(`   - Instance de Map: ${product.customizationOptions instanceof Map}`, 'yellow');
    
    if (product.customizationOptions instanceof Map) {
      log('   - Contenu de la Map:', 'yellow');
      for (const [key, value] of product.customizationOptions) {
        log(`     ${key}: ${JSON.stringify(value)}`, 'yellow');
      }
    } else {
      log(`   - Contenu: ${JSON.stringify(product.customizationOptions)}`, 'yellow');
    }

    // 4. Tester la sérialisation
    log('🔄 Test de sérialisation...', 'blue');
    const productObj = product.toObject();
    log(`   - Type après toObject: ${typeof productObj.customizationOptions}`, 'yellow');
    log(`   - Instance de Map après toObject: ${productObj.customizationOptions instanceof Map}`, 'yellow');

    if (productObj.customizationOptions instanceof Map) {
      log('   - Conversion Map vers objet...', 'yellow');
      productObj.customizationOptions = Object.fromEntries(productObj.customizationOptions);
      log(`   - Type après conversion: ${typeof productObj.customizationOptions}`, 'yellow');
      log(`   - Contenu après conversion: ${JSON.stringify(productObj.customizationOptions)}`, 'yellow');
    }

    // 5. Tester l'API GET /api/products
    log('🌐 Test de l\'API GET /api/products...', 'blue');
    try {
      const products = await makeRequest(`${API_BASE_URL}/products`);
      
      const prodlocFromAPI = products.find(p => p.name && p.name.toLowerCase().includes('prodloc'));
      if (prodlocFromAPI) {
        log('✅ Produit trouvé via API', 'green');
        log(`   - Type customizationOptions: ${typeof prodlocFromAPI.customizationOptions}`, 'yellow');
        log(`   - Contenu: ${JSON.stringify(prodlocFromAPI.customizationOptions)}`, 'yellow');
        
        // Vérifier si on peut appeler .map() sur les options
        if (prodlocFromAPI.customizationOptions && typeof prodlocFromAPI.customizationOptions === 'object') {
          try {
            const optionsArray = Object.entries(prodlocFromAPI.customizationOptions);
            log(`   - Test .map() sur les options: ${optionsArray.length} options trouvées`, 'green');
            optionsArray.forEach(([key, value]) => {
              log(`     ${key}: ${JSON.stringify(value)}`, 'yellow');
            });
          } catch (error) {
            log(`   - Erreur lors du test .map(): ${error.message}`, 'red');
          }
        }
      } else {
        log('❌ Produit non trouvé via API', 'red');
      }
    } catch (error) {
      log(`❌ Erreur API: ${error.message}`, 'red');
    }

    // 6. Tester l'API GET /api/products avec catégorie rent
    log('🌐 Test de l\'API GET /api/products?category=rent...', 'blue');
    try {
      const products = await makeRequest(`${API_BASE_URL}/products?category=rent`);
      
      log(`✅ ${products.length} produits de location trouvés`, 'green');
      
      const prodlocFromRentAPI = products.find(p => p.name && p.name.toLowerCase().includes('prodloc'));
      if (prodlocFromRentAPI) {
        log('✅ Produit prodloc trouvé dans les produits de location', 'green');
        log(`   - Type customizationOptions: ${typeof prodlocFromRentAPI.customizationOptions}`, 'yellow');
        log(`   - Contenu: ${JSON.stringify(prodlocFromRentAPI.customizationOptions)}`, 'yellow');
      } else {
        log('❌ Produit prodloc non trouvé dans les produits de location', 'red');
      }
    } catch (error) {
      log(`❌ Erreur API rent: ${error.message}`, 'red');
    }

    // 7. Tester la création d'une location (simulation)
    log('🛒 Test de simulation de création de location...', 'blue');
    try {
      const rentalData = {
        items: [{
          product: product._id,
          quantity: 1,
          rentalStartDate: new Date(),
          rentalEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 jours
          customizationData: {}
        }],
        user: 'test-user-id',
        status: 'pending',
        paymentStatus: 'pending',
        subtotal: product.dailyRentalPrice * 7,
        tax: 0,
        deposit: product.dailyRentalPrice * 7 * 0.2, // 20% de dépôt
        total: product.dailyRentalPrice * 7 * 1.2
      };

      log('✅ Données de location préparées', 'green');
      log(`   - Produit: ${product.name}`, 'yellow');
      log(`   - Durée: 7 jours`, 'yellow');
      log(`   - Prix/jour: ${product.dailyRentalPrice}€`, 'yellow');
      log(`   - Total: ${rentalData.total}€`, 'yellow');
    } catch (error) {
      log(`❌ Erreur préparation location: ${error.message}`, 'red');
    }

    log('=' * 50, 'cyan');
    log('✅ Test terminé', 'green');

  } catch (error) {
    log(`❌ Erreur générale: ${error.message}`, 'red');
    log(`❌ Stack: ${error.stack}`, 'red');
  } finally {
    await mongoose.disconnect();
    log('🔌 Déconnecté de MongoDB', 'blue');
  }
}

// Exécuter le test
testRentalProcess();
