// Script pour tester l'envoi d'emails avec un produit réel
import https from 'https';

console.log('🧪 Test d\'envoi d\'emails avec produit réel...\n');

// Produit réel trouvé
const REAL_PRODUCT = {
  id: '68a9c4bebf2d893f209588fa',
  name: 'texte',
  price: 5,
  image: 'https://res.cloudinary.com/dh8x3myg4/image/upload/v1755956413/sakadeco/products/product-1755956413090-sp82g5znq.png'
};

const testOrder = {
  items: [
    {
      productId: REAL_PRODUCT.id,
      quantity: 1,
      price: REAL_PRODUCT.price,
      name: REAL_PRODUCT.name,
      image: REAL_PRODUCT.image
    }
  ],
  customerEmail: 'test@sakadeco.fr',
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

async function testEmailFlow() {
  try {
    console.log('📧 Test avec produit réel:');
    console.log(`   Produit: ${REAL_PRODUCT.name}`);
    console.log(`   Prix: ${REAL_PRODUCT.price}€`);
    console.log(`   Email: ${testOrder.customerEmail}`);
    console.log('');

    console.log('🔄 Création de session de paiement...');
    const response = await makeRequest('/api/payment/create-checkout-session', testOrder);
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Session de paiement créée !');
      console.log('🔗 URL Stripe:', response.data.url);
      console.log('');
      console.log('📋 Instructions pour tester les emails :');
      console.log('1. Allez sur l\'URL Stripe ci-dessus');
      console.log('2. Utilisez une carte de test : 4242 4242 4242 4242');
      console.log('3. Complétez le paiement');
      console.log('4. Surveillez les logs Render pour voir :');
      console.log('   - "📧 Tentative d\'envoi facture de vente avec PDF..."');
      console.log('   - "📧 Transporter disponible: true"');
      console.log('   - "✅ Facture de vente envoyée avec PDF"');
      console.log('   - "✅ Notification admin envoyée avec PDF"');
      console.log('5. Vérifiez votre boîte email (test@sakadeco.fr)');
      console.log('6. Vérifiez l\'email admin configuré');
      
    } else if (response.status === 400) {
      console.log('❌ Erreur 400 - Vérifiez les données de la commande');
      console.log('Data:', response.data);
      
    } else if (response.status === 500) {
      console.log('❌ Erreur 500 - Problème serveur');
      console.log('💡 Vérifiez les logs Render pour plus de détails');
      console.log('Data:', response.data);
      
    } else {
      console.log('❌ Erreur inattendue');
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
    console.log('');
    console.log('🔧 Solutions possibles :');
    console.log('1. Vérifiez que le service est en ligne');
    console.log('2. Vérifiez les logs Render');
    console.log('3. Vérifiez la configuration Stripe');
  }
}

// Instructions de diagnostic
console.log('🔍 Diagnostic des emails :');
console.log('1. Vérifiez les logs Render pour :');
console.log('   - "✅ Service email initialisé"');
console.log('   - "📧 Configuration email:"');
console.log('2. Si vous voyez "⚠️ Service email non configuré" :');
console.log('   → Les variables d\'environnement ne sont pas correctes');
console.log('3. Si vous voyez "❌ Erreur envoi facture" :');
console.log('   → Problème d\'authentification email');
console.log('');

// Exécuter le test
testEmailFlow();
