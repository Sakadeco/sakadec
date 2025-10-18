// Script pour tester un paiement et surveiller les logs
import https from 'https';

console.log('🧪 Test de paiement avec surveillance des logs...\n');

async function testPaymentWithLogs() {
  try {
    console.log('💳 Test de création de session de paiement...');
    console.log('📧 Email de test: lamawaffo11@gmail.com');
    console.log('📦 Produit: texte (68a9c4bebf2d893f209588fa)');
    console.log('');
    console.log('🔍 Surveillez les logs Render en temps réel pour voir l\'erreur exacte !');
    console.log('');

    // Test avec des données réelles
    const testOrder = {
      items: [
        {
          productId: '68a9c4bebf2d893f209588fa',
          quantity: 1,
          price: 5,
          name: 'texte',
          image: 'https://res.cloudinary.com/dh8x3myg4/image/upload/v1755956413/sakadeco/products/product-1755956413090-sp82g5znq.png'
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
      
    } else if (response.status === 500) {
      console.log('❌ Erreur 500 - Problème serveur');
      console.log('💡 Vérifiez les logs Render pour l\'erreur exacte');
      console.log('');
      console.log('🔍 Dans les logs Render, cherchez :');
      console.log('- "❌ Erreur lors de l\'initialisation de Stripe"');
      console.log('- "❌ Erreur création session Stripe"');
      console.log('- "❌ Erreur de connexion à la base de données"');
      console.log('- "❌ Erreur de calcul des prix"');
      console.log('- "❌ Erreur avec les images"');
      console.log('- "❌ Erreur de sauvegarde"');
      console.log('- "❌ Erreur de configuration Stripe"');
      console.log('- "❌ Erreur de webhook"');
      console.log('');
      console.log('📋 Actions à effectuer :');
      console.log('1. Allez sur Render → Logs');
      console.log('2. Lancez ce test et surveillez les logs');
      console.log('3. Copiez l\'erreur exacte des logs');
      console.log('4. Identifiez la cause de l\'erreur');
      console.log('5. Appliquez la solution correspondante');
      
    } else {
      console.log('❌ Erreur inattendue');
      console.log('Status:', response.status);
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
console.log('🔍 Test de paiement avec surveillance des logs :');
console.log('');
console.log('📋 Configuration actuelle (d\'après les logs) :');
console.log('✅ Service email initialisé');
console.log('✅ Stripe initialisé avec succès');
console.log('✅ Base de données connectée');
console.log('✅ Routes enregistrées');
console.log('✅ Serveur démarré sur le port 10000');
console.log('');
console.log('🚨 Points de défaillance possibles :');
console.log('- Erreur lors de la recherche du produit');
console.log('- Erreur lors du calcul des prix');
console.log('- Erreur lors de la préparation des images');
console.log('- Erreur lors de la création de la session Stripe');
console.log('- Erreur lors de la sauvegarde de la commande');
console.log('');
console.log('📋 Instructions de diagnostic :');
console.log('1. Lancez ce test');
console.log('2. Surveillez les logs Render en temps réel');
console.log('3. Identifiez l\'erreur exacte');
console.log('4. Copiez l\'erreur et partagez-la');
console.log('');

// Exécuter le test
testPaymentWithLogs();
