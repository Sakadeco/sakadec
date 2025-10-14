import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sakadeco.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

function logStep(message) {
  log(`\n${colors.cyan}=== ${message} ===${colors.reset}`);
}

// Connexion admin
async function getAdminToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    logError(`Échec de la connexion admin: ${error.message}`);
    return null;
  }
}

// Supprimer les produits de test
async function cleanupTestProducts(token) {
  logStep('Nettoyage des produits de test');
  
  try {
    // Récupérer tous les produits
    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    let deletedCount = 0;

    // Supprimer les produits contenant "Test" dans le nom
    for (const product of products) {
      if (product.name && product.name.toLowerCase().includes('test')) {
        try {
          const deleteResponse = await fetch(`${API_BASE_URL}/api/admin/products/${product._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (deleteResponse.ok) {
            logSuccess(`Produit supprimé: ${product.name}`);
            deletedCount++;
          } else {
            logError(`Échec suppression produit ${product.name}: ${deleteResponse.status}`);
          }
        } catch (error) {
          logError(`Erreur suppression produit ${product.name}: ${error.message}`);
        }
      }
    }

    logInfo(`${deletedCount} produits de test supprimés`);
    return deletedCount;
  } catch (error) {
    logError(`Échec du nettoyage des produits: ${error.message}`);
    return 0;
  }
}

// Supprimer les commandes de test
async function cleanupTestOrders(token) {
  logStep('Nettoyage des commandes de test');
  
  try {
    // Récupérer toutes les commandes
    const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const orders = await response.json();
    let deletedCount = 0;

    // Supprimer les commandes avec email de test
    for (const order of orders) {
      if (order.customerInfo && order.customerInfo.email === 'test@example.com') {
        try {
          const deleteResponse = await fetch(`${API_BASE_URL}/api/admin/orders/${order._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (deleteResponse.ok) {
            logSuccess(`Commande supprimée: ${order._id}`);
            deletedCount++;
          } else {
            logError(`Échec suppression commande ${order._id}: ${deleteResponse.status}`);
          }
        } catch (error) {
          logError(`Erreur suppression commande ${order._id}: ${error.message}`);
        }
      }
    }

    logInfo(`${deletedCount} commandes de test supprimées`);
    return deletedCount;
  } catch (error) {
    logError(`Échec du nettoyage des commandes: ${error.message}`);
    return 0;
  }
}

// Nettoyage principal
async function runCleanup() {
  logStep('Démarrage du nettoyage des données de test');
  
  try {
    // Connexion admin
    const token = await getAdminToken();
    if (!token) {
      logError('Impossible de continuer sans token admin');
      return;
    }

    // Nettoyage des produits
    const productsDeleted = await cleanupTestProducts(token);
    
    // Nettoyage des commandes
    const ordersDeleted = await cleanupTestOrders(token);
    
    logStep('Résumé du nettoyage');
    logSuccess('✅ Nettoyage terminé !');
    logInfo(`📦 Produits supprimés: ${productsDeleted}`);
    logInfo(`🛒 Commandes supprimées: ${ordersDeleted}`);
    
  } catch (error) {
    logError(`Erreur générale: ${error.message}`);
  }
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
  runCleanup().then(() => {
    logStep('Nettoyage terminé');
    process.exit(0);
  }).catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

export { runCleanup };
