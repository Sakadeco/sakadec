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

async function forceFrontendRebuild() {
  try {
    log('🚀 Vérification du statut du déploiement', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. Tester l'API des produits
    log('🌐 Test de l\'API /api/products...', 'blue');
    try {
      const response = await makeRequest(`${API_BASE_URL}/products`);
      
      if (response.status === 200) {
        log('✅ API produits accessible', 'green');
        
        const prodlocProduct = response.data.find(p => p.name && p.name.toLowerCase().includes('prodloc'));
        if (prodlocProduct) {
          log('✅ Produit prodloc trouvé via API', 'green');
          log(`   - Type customizationOptions: ${typeof prodlocProduct.customizationOptions}`, 'yellow');
          log(`   - Instance de Map: ${prodlocProduct.customizationOptions instanceof Map}`, 'yellow');
          
          if (prodlocProduct.customizationOptions && typeof prodlocProduct.customizationOptions === 'object') {
            log('✅ CustomizationOptions est un objet JavaScript', 'green');
            const optionsArray = Object.entries(prodlocProduct.customizationOptions);
            log(`   - Nombre d'options: ${optionsArray.length}`, 'yellow');
            optionsArray.forEach(([key, value]) => {
              log(`     ${key}: ${JSON.stringify(value)}`, 'yellow');
            });
          } else {
            log('❌ CustomizationOptions n\'est pas un objet', 'red');
          }
        } else {
          log('❌ Produit prodloc non trouvé', 'red');
        }
      } else {
        log(`❌ Erreur API: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur API produits: ${error.message}`, 'red');
    }

    // 2. Tester l'API des produits de location
    log('🌐 Test de l\'API /api/products?category=rent...', 'blue');
    try {
      const response = await makeRequest(`${API_BASE_URL}/products?category=rent`);
      
      if (response.status === 200) {
        log('✅ API produits de location accessible', 'green');
        log(`   - Nombre de produits: ${response.data.length}`, 'yellow');
        
        const prodlocProduct = response.data.find(p => p.name && p.name.toLowerCase().includes('prodloc'));
        if (prodlocProduct) {
          log('✅ Produit prodloc trouvé dans les produits de location', 'green');
          log(`   - Type customizationOptions: ${typeof prodlocProduct.customizationOptions}`, 'yellow');
        }
      } else {
        log(`❌ Erreur API location: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur API location: ${error.message}`, 'red');
    }

    // 3. Tester l'endpoint de dates réservées
    log('🌐 Test de l\'API /api/rental/product/68f3c5c3fdf4aba2d84c3fd2/booked-dates...', 'blue');
    try {
      const response = await makeRequest(`${API_BASE_URL}/rental/product/68f3c5c3fdf4aba2d84c3fd2/booked-dates`);
      
      if (response.status === 200) {
        log('✅ API dates réservées accessible', 'green');
        log(`   - Réponse: ${JSON.stringify(response.data)}`, 'yellow');
      } else {
        log(`❌ Erreur API dates réservées: ${response.status}`, 'red');
        log(`   - Réponse: ${response.data}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur API dates réservées: ${error.message}`, 'red');
    }

    // 4. Vérifier les headers de cache
    log('🔍 Vérification des headers de cache...', 'blue');
    try {
      const response = await makeRequest(`${API_BASE_URL}/products`);
      
      if (response.headers) {
        log('📋 Headers de réponse:', 'yellow');
        log(`   - Cache-Control: ${response.headers['cache-control'] || 'Non défini'}`, 'yellow');
        log(`   - ETag: ${response.headers['etag'] || 'Non défini'}`, 'yellow');
        log(`   - Last-Modified: ${response.headers['last-modified'] || 'Non défini'}`, 'yellow');
        log(`   - Content-Type: ${response.headers['content-type'] || 'Non défini'}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Erreur vérification headers: ${error.message}`, 'red');
    }

    // 5. Tester avec un timestamp pour éviter le cache
    log('🔄 Test avec timestamp pour éviter le cache...', 'blue');
    try {
      const timestamp = Date.now();
      const response = await makeRequest(`${API_BASE_URL}/products?t=${timestamp}`);
      
      if (response.status === 200) {
        log('✅ API accessible avec timestamp', 'green');
        
        const prodlocProduct = response.data.find(p => p.name && p.name.toLowerCase().includes('prodloc'));
        if (prodlocProduct) {
          log('✅ Produit prodloc trouvé avec timestamp', 'green');
          log(`   - Type customizationOptions: ${typeof prodlocProduct.customizationOptions}`, 'yellow');
          
          // Test spécifique de la méthode .map()
          if (prodlocProduct.customizationOptions && typeof prodlocProduct.customizationOptions === 'object') {
            try {
              const optionsArray = Object.entries(prodlocProduct.customizationOptions);
              log(`   - Test .map() réussi: ${optionsArray.length} options`, 'green');
            } catch (error) {
              log(`   - Erreur .map(): ${error.message}`, 'red');
            }
          }
        }
      } else {
        log(`❌ Erreur avec timestamp: ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ Erreur test timestamp: ${error.message}`, 'red');
    }

    // 6. Recommandations
    log('💡 Recommandations pour résoudre le problème:', 'cyan');
    log('1. Videz complètement le cache du navigateur:', 'yellow');
    log('   - Ouvrez les outils de développement (F12)', 'yellow');
    log('   - Clic droit sur le bouton de rafraîchissement', 'yellow');
    log('   - Sélectionnez "Vider le cache et recharger de force"', 'yellow');
    log('', 'reset');
    log('2. Ou utilisez la navigation privée', 'yellow');
    log('', 'reset');
    log('3. Ou attendez 5-10 minutes que le cache expire', 'yellow');
    log('', 'reset');
    log('4. Vérifiez que Render a bien redéployé l\'application', 'yellow');

    log('='.repeat(60), 'cyan');
    log('✅ Vérification terminée', 'green');

  } catch (error) {
    log(`❌ Erreur générale: ${error.message}`, 'red');
    log(`❌ Stack: ${error.stack}`, 'red');
  }
}

// Exécuter la vérification
forceFrontendRebuild();
