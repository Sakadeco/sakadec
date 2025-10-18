// Script pour tester l'envoi d'emails après un paiement
import https from 'https';

console.log('🧪 Test d\'envoi d\'emails après paiement...\n');

// Configuration de test
const API_BASE = 'https://sakadeco-api.onrender.com';
const TEST_EMAIL = 'test@sakadeco.fr';

// Simuler une commande de test
const testOrder = {
  items: [
    {
      productId: '68f3c5c3fdf4aba2d84c3fd2', // prod1
      quantity: 1,
      price: 29.99,
      name: 'Produit Test',
      image: 'https://via.placeholder.com/300x300'
    }
  ],
  customerEmail: TEST_EMAIL,
  shippingAddress: {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test Street',
    city: 'Paris',
    postalCode: '75001',
    country: 'France'
  },
  billingAddress: {
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test Street',
    city: 'Paris',
    postalCode: '75001',
    country: 'France'
  }
};

async function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'sakadeco-api.onrender.com',
      port: 443,
      path: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testPaymentFlow() {
  try {
    console.log('📧 Test de création de session de paiement...');
    console.log('📧 Email de test:', TEST_EMAIL);
    console.log('');

    // Test création session de paiement
    const response = await makeRequest('/api/payment/create-checkout-session', testOrder);
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    console.log('');

    if (response.status === 200) {
      console.log('✅ Session de paiement créée avec succès !');
      console.log('🔗 URL Stripe:', response.data.url);
      console.log('');
      console.log('📋 Prochaines étapes :');
      console.log('1. Allez sur l\'URL Stripe pour simuler le paiement');
      console.log('2. Utilisez les cartes de test Stripe :');
      console.log('   - Succès: 4242 4242 4242 4242');
      console.log('   - Échec: 4000 0000 0000 0002');
      console.log('3. Surveillez les logs Render pour les emails');
      console.log('4. Vérifiez votre boîte email');
    } else {
      console.log('❌ Erreur lors de la création de la session');
      console.log('💡 Vérifiez les logs Render pour plus de détails');
    }

  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
    console.log('');
    console.log('🔧 Solutions possibles :');
    console.log('1. Vérifiez que le service est en ligne sur Render');
    console.log('2. Vérifiez les logs Render pour les erreurs');
    console.log('3. Vérifiez la configuration email');
  }
}

// Instructions pour le test manuel
console.log('📋 Instructions pour tester manuellement :');
console.log('1. Allez sur https://sakadeco.fr');
console.log('2. Ajoutez un produit au panier');
console.log('3. Procédez au checkout');
console.log('4. Utilisez une carte de test Stripe');
console.log('5. Surveillez les logs Render');
console.log('6. Vérifiez votre boîte email');
console.log('');

// Exécuter le test
testPaymentFlow();
