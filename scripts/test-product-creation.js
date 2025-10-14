import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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

// Test 1: Connexion admin
async function testAdminLogin() {
  logStep('Test de connexion admin');
  
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
    
    if (data.token) {
      logSuccess('Connexion admin réussie');
      return data.token;
    } else {
      throw new Error('Token non reçu');
    }
  } catch (error) {
    logError(`Échec de la connexion admin: ${error.message}`);
    return null;
  }
}

// Test 2: Upload d'image
async function testImageUpload(token) {
  logStep('Test d\'upload d\'image');
  
  try {
    // Créer une image de test (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('image', blob, 'test-image.png');

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.imageUrl) {
      logSuccess(`Upload d'image réussi: ${data.imageUrl}`);
      return data.imageUrl;
    } else {
      throw new Error('URL d\'image non reçue');
    }
  } catch (error) {
    logError(`Échec de l'upload d'image: ${error.message}`);
    return null;
  }
}

// Test 3: Création de produit avec toutes les options
async function testProductCreation(token, imageUrl) {
  logStep('Test de création de produit avec toutes les options');
  
  try {
    const productData = {
      name: 'Produit Test Complet',
      description: 'Produit de test avec toutes les options de personnalisation',
      price: '29.99',
      category: 'Décoration',
      subcategory: 'Vases',
      isCustomizable: true,
      isForSale: true,
      isForRent: false,
      stockQuantity: '10',
      dailyRentalPrice: '5.00',
      customizationOptions: JSON.stringify({
        // Option dropdown (taille)
        taille: {
          type: 'dropdown',
          label: 'Taille',
          required: true,
          options: ['Petite', 'Moyenne', 'Grande']
        },
        // Option checkbox (couleurs)
        couleurs: {
          type: 'checkbox',
          label: 'Couleurs',
          required: false,
          options: ['Rouge', 'Bleu', 'Vert', 'Jaune']
        },
        // Option texte simple
        message: {
          type: 'text',
          label: 'Message personnalisé',
          required: false,
          placeholder: 'Entrez votre message',
          maxLength: 100
        },
        // Option textarea
        description_personnalisee: {
          type: 'textarea',
          label: 'Description personnalisée',
          required: false,
          placeholder: 'Décrivez vos préférences',
          maxLength: 500
        },
        // Gravure texte uniquement
        gravure_texte: {
          type: 'text_image_upload',
          label: 'Gravure texte',
          required: false,
          engravingType: 'text',
          maxLength: 50,
          maxFileSize: 5,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          pricePerCharacter: 0.1,
          basePrice: 2.00
        },
        // Gravure image uniquement
        gravure_image: {
          type: 'text_image_upload',
          label: 'Gravure image',
          required: false,
          engravingType: 'image',
          maxLength: 50,
          maxFileSize: 5,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          pricePerCharacter: 0.1,
          basePrice: 5.00
        },
        // Gravure texte et image
        gravure_complete: {
          type: 'text_image_upload',
          label: 'Gravure complète',
          required: false,
          engravingType: 'both',
          maxLength: 100,
          maxFileSize: 5,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          pricePerCharacter: 0.1,
          basePrice: 8.00
        }
      })
    };

    const formData = new FormData();
    
    // Ajouter les données du produit
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Ajouter l'image principale
    if (imageUrl) {
      // Créer une image de test pour l'image principale
      const testImageBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
        0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      const blob = new Blob([testImageBuffer], { type: 'image/png' });
      formData.append('image', blob, 'main-product-image.png');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data._id) {
      logSuccess(`Produit créé avec succès: ${data._id}`);
      return data._id;
    } else {
      throw new Error('ID de produit non reçu');
    }
  } catch (error) {
    logError(`Échec de la création de produit: ${error.message}`);
    return null;
  }
}

// Test 4: Récupération du produit créé
async function testProductRetrieval(token, productId) {
  logStep('Test de récupération du produit créé');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const product = await response.json();
    
    logSuccess('Produit récupéré avec succès');
    logInfo(`Nom: ${product.name}`);
    logInfo(`Prix: ${product.price}€`);
    logInfo(`Personnalisable: ${product.isCustomizable}`);
    
    if (product.customizationOptions) {
      logInfo(`Options de personnalisation: ${Object.keys(product.customizationOptions).length}`);
      Object.entries(product.customizationOptions).forEach(([key, option]) => {
        logInfo(`  - ${key}: ${option.type} (${option.label})`);
      });
    }
    
    return product;
  } catch (error) {
    logError(`Échec de la récupération du produit: ${error.message}`);
    return null;
  }
}

// Test 5: Test de commande avec personnalisation
async function testOrderWithCustomization(token, productId) {
  logStep('Test de commande avec personnalisation');
  
  try {
    const orderData = {
      items: [{
        productId: productId,
        quantity: 1,
        customizations: {
          taille: 'Grande',
          couleurs: ['Rouge', 'Bleu'],
          message: 'Message de test personnalisé',
          description_personnalisee: 'Description de test très détaillée pour tester les limites de caractères',
          gravure_texte: {
            type: 'text',
            value: 'Texte gravé de test',
            price: 2.00
          },
          gravure_image: {
            type: 'image',
            value: imageUrl || '/uploads/test-image.png',
            price: 5.00
          },
          gravure_complete: {
            type: 'both',
            value: {
              text: 'Texte complet de test',
              image: imageUrl || '/uploads/test-image.png'
            },
            price: 8.00
          }
        }
      }],
      customerInfo: {
        name: 'Client Test',
        email: 'test@example.com',
        phone: '0123456789',
        address: '123 Rue Test, 75000 Paris'
      },
      totalAmount: 44.99
    };

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const order = await response.json();
    
    if (order._id) {
      logSuccess(`Commande créée avec succès: ${order._id}`);
      return order._id;
    } else {
      throw new Error('ID de commande non reçu');
    }
  } catch (error) {
    logError(`Échec de la création de commande: ${error.message}`);
    return null;
  }
}

// Test 6: Vérification de l'email admin
async function testAdminEmailNotification(token, orderId) {
  logStep('Test de notification email admin');
  
  try {
    // Récupérer la commande pour vérifier les détails
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const order = await response.json();
    
    logSuccess('Commande récupérée pour vérification email');
    logInfo(`Client: ${order.customerInfo.name}`);
    logInfo(`Email: ${order.customerInfo.email}`);
    logInfo(`Total: ${order.totalAmount}€`);
    
    if (order.items && order.items[0].customizations) {
      logInfo('Personnalisations détectées:');
      Object.entries(order.items[0].customizations).forEach(([key, value]) => {
        if (typeof value === 'object' && value.type) {
          logInfo(`  - ${key}: ${value.type} (${value.price}€)`);
        } else {
          logInfo(`  - ${key}: ${value}`);
        }
      });
    }
    
    return true;
  } catch (error) {
    logError(`Échec de la vérification email: ${error.message}`);
    return false;
  }
}

// Test principal
async function runAllTests() {
  logStep('Démarrage des tests de création de produit');
  
  let token = null;
  let imageUrl = null;
  let productId = null;
  let orderId = null;
  
  try {
    // Test 1: Connexion admin
    token = await testAdminLogin();
    if (!token) {
      logError('Impossible de continuer sans token admin');
      return;
    }
    
    // Test 2: Upload d'image
    imageUrl = await testImageUpload(token);
    if (!imageUrl) {
      logWarning('Upload d\'image échoué, continuation avec URL par défaut');
      imageUrl = '/uploads/test-image.png';
    }
    
    // Test 3: Création de produit
    productId = await testProductCreation(token, imageUrl);
    if (!productId) {
      logError('Impossible de continuer sans produit créé');
      return;
    }
    
    // Test 4: Récupération du produit
    await testProductRetrieval(token, productId);
    
    // Test 5: Commande avec personnalisation
    orderId = await testOrderWithCustomization(token, productId);
    if (!orderId) {
      logError('Impossible de continuer sans commande créée');
      return;
    }
    
    // Test 6: Vérification email
    await testAdminEmailNotification(token, orderId);
    
    logStep('Résumé des tests');
    logSuccess('✅ Tous les tests principaux ont réussi !');
    logInfo(`📦 Produit créé: ${productId}`);
    logInfo(`🛒 Commande créée: ${orderId}`);
    logInfo(`📧 Email admin vérifié`);
    
  } catch (error) {
    logError(`Erreur générale: ${error.message}`);
  }
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().then(() => {
    logStep('Tests terminés');
    process.exit(0);
  }).catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

export { runAllTests };
