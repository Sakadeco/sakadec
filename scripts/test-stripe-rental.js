import mongoose from 'mongoose';
import https from 'https';
import http from 'http';

// Configuration
const API_BASE_URL = 'https://sakadeco.fr/api';
const DATABASE_URL = 'mongodb+srv://sakadeco:sakadeco@cluster0.oxicc0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Informations de test Stripe
const STRIPE_TEST_CARD = '4242424242424242'; // Carte Visa de test
const STRIPE_TEST_EMAIL = 'lamawaffo10@gmail.com';
const STRIPE_TEST_CVC = '123';
const STRIPE_TEST_EXP_MONTH = '12';
const STRIPE_TEST_EXP_YEAR = '2025';

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
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https:') ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testStripeRentalProcess() {
  try {
    log('🚀 Début du test complet de location avec Stripe', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. Connexion à la base de données
    log('📡 Connexion à MongoDB...', 'blue');
    await mongoose.connect(DATABASE_URL);
    log('✅ Connecté à MongoDB', 'green');

    // 2. Récupérer le produit "prodloc"
    log('🔍 Recherche du produit "prodloc"...', 'blue');
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    const product = await productsCollection.findOne({ name: { $regex: /prodloc/i } });
    if (!product) {
      log('❌ Produit "prodloc" non trouvé', 'red');
      return;
    }

    log(`✅ Produit trouvé: ${product.name}`, 'green');
    log(`   - ID: ${product._id}`, 'yellow');
    log(`   - Prix location: ${product.dailyRentalPrice}€/jour`, 'yellow');

    // 3. Calculer les dates de location (7 jours)
    const startDate = new Date();
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const dailyPrice = product.dailyRentalPrice;
    const subtotal = dailyPrice * 7;
    const deposit = subtotal * 0.2; // 20% de dépôt
    const total = subtotal + deposit;

    log('📅 Calcul des dates et prix:', 'blue');
    log(`   - Date début: ${startDate.toISOString().split('T')[0]}`, 'yellow');
    log(`   - Date fin: ${endDate.toISOString().split('T')[0]}`, 'yellow');
    log(`   - Durée: 7 jours`, 'yellow');
    log(`   - Prix/jour: ${dailyPrice}€`, 'yellow');
    log(`   - Sous-total: ${subtotal}€`, 'yellow');
    log(`   - Dépôt (20%): ${deposit}€`, 'yellow');
    log(`   - Total: ${total}€`, 'yellow');

    // 4. Préparer les données de location
    const rentalData = {
      items: [{
        product: product._id,
        quantity: 1,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        customizationData: {
          couleurs: 'noir',
          gravure_personnalisée: 'Test gravure'
        }
      }],
      user: {
        email: STRIPE_TEST_EMAIL,
        name: 'Test User',
        phone: '+33123456789'
      },
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR'
      },
      billingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR'
      },
      paymentMethod: 'stripe',
      subtotal: subtotal,
      tax: 0,
      deposit: deposit,
      total: total
    };

    log('📋 Données de location préparées:', 'blue');
    log(`   - Email: ${rentalData.user.email}`, 'yellow');
    log(`   - Total: ${rentalData.total}€`, 'yellow');

    // 5. Tester la création de session Stripe
    log('💳 Test de création de session Stripe...', 'blue');
    try {
      const stripeResponse = await makeRequest(`${API_BASE_URL}/rental/create-session`, {
        method: 'POST',
        body: JSON.stringify(rentalData)
      });

      if (stripeResponse.status === 200) {
        log('✅ Session Stripe créée avec succès', 'green');
        log(`   - Session ID: ${stripeResponse.data.sessionId}`, 'yellow');
        log(`   - URL de paiement: ${stripeResponse.data.url}`, 'yellow');
        
        // 6. Simuler le succès du paiement
        log('🎉 Simulation du succès du paiement...', 'blue');
        try {
          const successResponse = await makeRequest(`${API_BASE_URL}/rental/success/${stripeResponse.data.sessionId}`, {
            method: 'GET'
          });

          if (successResponse.status === 200) {
            log('✅ Paiement simulé avec succès', 'green');
            log(`   - Location ID: ${successResponse.data.rentalId}`, 'yellow');
            log(`   - Statut: ${successResponse.data.status}`, 'yellow');
            log(`   - Email: ${successResponse.data.user.email}`, 'yellow');
          } else {
            log(`❌ Erreur simulation paiement: ${successResponse.status}`, 'red');
            log(`   - Réponse: ${JSON.stringify(successResponse.data)}`, 'red');
          }
        } catch (error) {
          log(`❌ Erreur simulation paiement: ${error.message}`, 'red');
        }
      } else {
        log(`❌ Erreur création session Stripe: ${stripeResponse.status}`, 'red');
        log(`   - Réponse: ${JSON.stringify(stripeResponse.data)}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur création session Stripe: ${error.message}`, 'red');
    }

    // 7. Vérifier la location créée en base
    log('🔍 Vérification de la location en base...', 'blue');
    try {
      const rentalsCollection = db.collection('rentals');
      const recentRental = await rentalsCollection.findOne(
        { 'user.email': STRIPE_TEST_EMAIL },
        { sort: { createdAt: -1 } }
      );

      if (recentRental) {
        log('✅ Location trouvée en base de données', 'green');
        log(`   - ID: ${recentRental._id}`, 'yellow');
        log(`   - Statut: ${recentRental.status}`, 'yellow');
        log(`   - Paiement: ${recentRental.paymentStatus}`, 'yellow');
        log(`   - Total: ${recentRental.total}€`, 'yellow');
        log(`   - Email: ${recentRental.user.email}`, 'yellow');
      } else {
        log('❌ Aucune location trouvée en base', 'red');
      }
    } catch (error) {
      log(`❌ Erreur vérification base: ${error.message}`, 'red');
    }

    // 8. Tester l'envoi d'email de confirmation
    log('📧 Test d\'envoi d\'email de confirmation...', 'blue');
    try {
      const emailResponse = await makeRequest(`${API_BASE_URL}/rental/send-confirmation`, {
        method: 'POST',
        body: JSON.stringify({
          email: STRIPE_TEST_EMAIL,
          rentalId: 'test-rental-id'
        })
      });

      if (emailResponse.status === 200) {
        log('✅ Email de confirmation envoyé', 'green');
      } else {
        log(`⚠️  Email non envoyé: ${emailResponse.status}`, 'yellow');
      }
    } catch (error) {
      log(`⚠️  Erreur envoi email: ${error.message}`, 'yellow');
    }

    log('='.repeat(60), 'cyan');
    log('✅ Test complet terminé', 'green');
    log('📧 Vérifiez votre boîte email: lamawaffo10@gmail.com', 'cyan');

  } catch (error) {
    log(`❌ Erreur générale: ${error.message}`, 'red');
    log(`❌ Stack: ${error.stack}`, 'red');
  } finally {
    await mongoose.disconnect();
    log('🔌 Déconnecté de MongoDB', 'blue');
  }
}

// Exécuter le test
testStripeRentalProcess();
