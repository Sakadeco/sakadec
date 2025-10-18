// Script pour tester le processus complet de paiement et d'emails
import https from 'https';

console.log('🧪 Test du processus complet de paiement et d\'emails...\n');

async function testCompletePayment() {
  try {
    console.log('💳 Test de création de session de paiement...');
    
    const testOrder = {
      items: [
        {
          productId: '68f3c542fdf4aba2d84c3fca', // Produit "prod1" qui fonctionne
          quantity: 1,
          price: 12,
          name: 'prod1'
        }
      ],
      customerEmail: 'lamawaffo11@gmail.com',
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

    const response = await makeRequest('/api/payment/create-checkout-session', testOrder);
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.status === 200) {
      console.log('✅ Session de paiement créée avec succès !');
      console.log('🔗 URL Stripe:', response.data.url);
      console.log('🆔 Session ID:', response.data.sessionId);
      console.log('🆔 Order ID:', response.data.orderId);
      console.log('');
      console.log('📋 Instructions pour tester les emails :');
      console.log('1. Allez sur l\'URL Stripe ci-dessus');
      console.log('2. Utilisez la carte test : 4242 4242 4242 4242');
      console.log('3. Complétez le paiement');
      console.log('4. Surveillez les logs Render pour voir :');
      console.log('   - "📧 Tentative d\'envoi facture de vente avec PDF..."');
      console.log('   - "📧 Transporter disponible: true"');
      console.log('   - "✅ Facture de vente envoyée avec PDF"');
      console.log('   - "✅ Notification admin envoyée avec PDF"');
      console.log('5. Vérifiez votre boîte email (lamawaffo11@gmail.com)');
      console.log('6. Vérifiez les spams et promotions');
      console.log('7. Cherchez les factures PDF en pièces jointes');
      
    } else {
      console.log('❌ Erreur lors de la création de la session');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
  }
}

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

// Instructions de diagnostic
console.log('🔍 Test du processus complet de paiement et d\'emails :');
console.log('');
console.log('📋 Configuration actuelle :');
console.log('✅ Paiement fonctionne (d\'après les logs)');
console.log('✅ Service email initialisé');
console.log('✅ Stripe initialisé avec succès');
console.log('✅ Base de données connectée');
console.log('');
console.log('🚨 Points à vérifier :');
console.log('- Les emails sont-ils envoyés après le paiement ?');
console.log('- Les factures PDF sont-elles générées ?');
console.log('- Les emails arrivent-ils dans la boîte de réception ?');
console.log('- Y a-t-il des erreurs dans les logs après le paiement ?');
console.log('');
console.log('📋 Instructions de test :');
console.log('1. Lancez ce test pour créer une session de paiement');
console.log('2. Allez sur l\'URL Stripe générée');
console.log('3. Complétez le paiement avec la carte test');
console.log('4. Surveillez les logs Render pour les messages d\'email');
console.log('5. Vérifiez votre boîte email (spams inclus)');
console.log('');

// Exécuter le test
testCompletePayment();
