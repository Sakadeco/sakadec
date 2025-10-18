import https from 'https';
import http from 'http';

// Configuration
const API_BASE_URL = 'https://sakadeco.fr/api';

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
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
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
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
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

async function testCartRental() {
  try {
    log('🚀 Test du système de panier pour les locations', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. Tester l'API des produits de location
    log('🌐 Test de l\'API des produits de location...', 'blue');
    try {
      const response = await makeRequest(`${API_BASE_URL}/products?category=rent`);
      
      if (response.status === 200) {
        log('✅ API produits de location accessible', 'green');
        log(`   - Nombre de produits: ${response.data.length}`, 'yellow');
        
        const prodlocProduct = response.data.find(p => p.name && p.name.toLowerCase().includes('prodloc'));
        if (prodlocProduct) {
          log('✅ Produit prodloc trouvé', 'green');
          log(`   - ID: ${prodlocProduct._id}`, 'yellow');
          log(`   - Nom: ${prodlocProduct.name}`, 'yellow');
          log(`   - Prix location: ${prodlocProduct.dailyRentalPrice}€/jour`, 'yellow');
          log(`   - Pour location: ${prodlocProduct.isForRent}`, 'yellow');
          log(`   - Personnalisable: ${prodlocProduct.isCustomizable}`, 'yellow');
          
          // 2. Tester la création d'une session de checkout pour location
          log('💳 Test de création de session de checkout pour location...', 'blue');
          
          const rentalData = {
            items: [{
              productId: prodlocProduct._id,
              name: prodlocProduct.name,
              price: prodlocProduct.dailyRentalPrice,
              quantity: 1,
              image: prodlocProduct.mainImageUrl,
              isRental: true,
              customizations: {
                couleurs: 'noir',
                gravure_personnalisée: 'Test gravure'
              },
              customMessage: 'Test de location',
              rentalStartDate: new Date().toISOString(),
              rentalEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              rentalDays: 7,
              dailyPrice: prodlocProduct.dailyRentalPrice,
              totalPrice: prodlocProduct.dailyRentalPrice * 7
            }],
            customerEmail: 'lamawaffo10@gmail.com',
            shippingAddress: {
              firstName: 'Test',
              lastName: 'User',
              address: '123 Test Street',
              city: 'Paris',
              postalCode: '75001',
              country: 'FR',
              phone: '+33123456789'
            },
            billingAddress: {
              firstName: 'Test',
              lastName: 'User',
              address: '123 Test Street',
              city: 'Paris',
              postalCode: '75001',
              country: 'FR',
              phone: '+33123456789'
            },
            isRental: true
          };

          log('📋 Données de location préparées:', 'blue');
          log(`   - Produit: ${rentalData.items[0].name}`, 'yellow');
          log(`   - Dates: ${rentalData.items[0].rentalStartDate.split('T')[0]} → ${rentalData.items[0].rentalEndDate.split('T')[0]}`, 'yellow');
          log(`   - Durée: ${rentalData.items[0].rentalDays} jours`, 'yellow');
          log(`   - Prix/jour: ${rentalData.items[0].dailyPrice}€`, 'yellow');
          log(`   - Total: ${rentalData.items[0].totalPrice}€`, 'yellow');
          log(`   - Email: ${rentalData.customerEmail}`, 'yellow');

          // Tester l'endpoint de création de session
          try {
            const checkoutResponse = await makeRequest(`${API_BASE_URL}/rental/create-checkout-session`, {
              method: 'POST',
              body: JSON.stringify(rentalData)
            });

            if (checkoutResponse.status === 200) {
              log('✅ Session de checkout créée avec succès', 'green');
              log(`   - URL Stripe: ${checkoutResponse.data.url}`, 'yellow');
            } else {
              log(`❌ Erreur création session: ${checkoutResponse.status}`, 'red');
              log(`   - Réponse: ${JSON.stringify(checkoutResponse.data)}`, 'red');
            }
          } catch (error) {
            log(`❌ Erreur création session: ${error.message}`, 'red');
          }

        } else {
          log('❌ Produit prodloc non trouvé', 'red');
        }
      } else {
        log(`❌ Erreur API produits: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur API produits: ${error.message}`, 'red');
    }

    // 3. Tester l'endpoint des dates réservées
    log('📅 Test de l\'endpoint des dates réservées...', 'blue');
    try {
      const response = await makeRequest(`${API_BASE_URL}/rental/product/68f3c5c3fdf4aba2d84c3fd2/booked-dates`);
      
      if (response.status === 200) {
        log('✅ Endpoint dates réservées accessible', 'green');
        log(`   - Réponse: ${JSON.stringify(response.data)}`, 'yellow');
      } else {
        log(`❌ Erreur dates réservées: ${response.status}`, 'red');
        log(`   - Réponse: ${response.data}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur dates réservées: ${error.message}`, 'red');
    }

    // 4. Tester l'endpoint de disponibilité
    log('🔍 Test de l\'endpoint de disponibilité...', 'blue');
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await makeRequest(`${API_BASE_URL}/rentals/availability/68f3c5c3fdf4aba2d84c3fd2?startDate=${startDate}&endDate=${endDate}`);
      
      if (response.status === 200) {
        log('✅ Endpoint disponibilité accessible', 'green');
        log(`   - Disponible: ${response.data.available}`, 'yellow');
      } else {
        log(`❌ Erreur disponibilité: ${response.status}`, 'red');
        log(`   - Réponse: ${response.data}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur disponibilité: ${error.message}`, 'red');
    }

    // 5. Recommandations
    log('💡 Recommandations pour résoudre le problème:', 'cyan');
    log('1. Vérifiez que l\'endpoint /api/rental/create-checkout-session existe', 'yellow');
    log('2. Vérifiez que les produits de location ont isForRent: true', 'yellow');
    log('3. Vérifiez que le frontend envoie les bonnes données', 'yellow');
    log('4. Vérifiez les logs du serveur pour les erreurs', 'yellow');

    log('='.repeat(60), 'cyan');
    log('✅ Test terminé', 'green');

  } catch (error) {
    log(`❌ Erreur générale: ${error.message}`, 'red');
    log(`❌ Stack: ${error.stack}`, 'red');
  }
}

// Exécuter le test
testCartRental();
