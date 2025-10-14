import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env') });

const API_BASE_URL = 'http://localhost:3000';

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

// Test simple d'upload d'image
async function testImageUpload() {
  logStep('Test d\'upload d\'image local');
  
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

// Test de création de produit simple
async function testSimpleProductCreation() {
  logStep('Test de création de produit simple');
  
  try {
    const productData = {
      name: 'Produit Test Simple',
      description: 'Produit de test simple',
      price: '19.99',
      category: 'Test',
      subcategory: 'Test',
      isCustomizable: true,
      isForSale: true,
      isForRent: false,
      stockQuantity: '5',
      dailyRentalPrice: '3.00',
      customizationOptions: JSON.stringify({
        taille: {
          type: 'dropdown',
          label: 'Taille',
          required: true,
          options: ['Petite', 'Grande']
        },
        gravure: {
          type: 'text_image_upload',
          label: 'Gravure',
          required: false,
          engravingType: 'text',
          maxLength: 50,
          maxFileSize: 5,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          pricePerCharacter: 0.1,
          basePrice: 2.00
        }
      })
    };

    const formData = new FormData();
    
    // Ajouter les données du produit
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

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

    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
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

// Test principal
async function runLocalTests() {
  logStep('Démarrage des tests locaux');
  
  try {
    // Test 1: Upload d'image
    const imageUrl = await testImageUpload();
    
    // Test 2: Création de produit
    const productId = await testSimpleProductCreation();
    
    if (productId) {
      logSuccess('✅ Tests locaux réussis !');
      logInfo(`📦 Produit créé: ${productId}`);
      if (imageUrl) {
        logInfo(`🖼️ Image uploadée: ${imageUrl}`);
      }
    } else {
      logError('❌ Tests locaux échoués');
    }
    
  } catch (error) {
    logError(`Erreur générale: ${error.message}`);
  }
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
  runLocalTests().then(() => {
    logStep('Tests locaux terminés');
    process.exit(0);
  }).catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

export { runLocalTests };
