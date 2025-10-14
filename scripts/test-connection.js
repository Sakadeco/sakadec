import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configuration ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

console.log('🔍 Test de connexion SakaDeco');
console.log(`📍 URL de l'API: ${API_BASE_URL}`);
console.log('📋 Variables d\'environnement:');
console.log(`   - API_BASE_URL: ${process.env.API_BASE_URL || 'non définie (défaut: http://localhost:3000)'}`);
console.log(`   - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'non définie'}`);
console.log(`   - ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? 'définie' : 'non définie'}`);

// Test de connexion simple
async function testConnection() {
  console.log('\n🔄 Test de connexion au serveur...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (response.ok) {
      console.log('✅ Serveur accessible');
      const data = await response.json();
      console.log(`📊 Statut: ${data.status || 'OK'}`);
    } else {
      console.log(`⚠️ Serveur répond mais avec erreur: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Impossible de se connecter au serveur: ${error.message}`);
    console.log('💡 Assurez-vous que le serveur est démarré avec: npm run dev');
  }
}

// Test d'endpoint d'auth
async function testAuthEndpoint() {
  console.log('\n🔐 Test de l\'endpoint d\'authentification...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/user`);
    
    if (response.ok) {
      console.log('✅ Endpoint d\'auth accessible');
    } else {
      console.log(`⚠️ Endpoint d'auth répond avec: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Erreur endpoint d'auth: ${error.message}`);
  }
}

// Test principal
async function runConnectionTest() {
  await testConnection();
  await testAuthEndpoint();
  
  console.log('\n📝 Résumé:');
  console.log('Si vous voyez des erreurs de connexion, assurez-vous que:');
  console.log('1. Le serveur est démarré (npm run dev)');
  console.log('2. L\'URL de l\'API est correcte');
  console.log('3. Les variables d\'environnement sont configurées');
}

// Exécution
runConnectionTest().catch(console.error);
