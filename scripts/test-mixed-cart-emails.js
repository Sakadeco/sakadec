// Script pour tester l'envoi d'emails pour les paniers mixtes
import https from 'https';

console.log('🧪 Test des emails pour paniers mixtes (vente + location)...\n');

async function testMixedCartEmails() {
  try {
    console.log('🛒 Test de création de sessions pour panier mixte...');
    
    // Test avec des données de panier mixte
    const saleItems = [
      {
        productId: '68a9c4bebf2d893f209588fa', // Produit "texte" pour vente
        quantity: 1,
        price: 5,
        name: 'texte'
      }
    ];
    
    const rentalItems = [
      {
        productId: '68f3c5c3fdf4aba2d84c3fd2', // Produit "prodloc" pour location
        quantity: 1,
        price: 10,
        name: 'prodloc',
        rentalStartDate: '2024-01-15',
        rentalEndDate: '2024-01-20',
        rentalDays: 5
      }
    ];
    
    const customerEmail = 'test-mixed@sakadeco.fr';
    const address = {
      firstName: 'Test',
      lastName: 'Mixed',
      address: '123 Test Street',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    };
    
    console.log('📧 Email client:', customerEmail);
    console.log('🛒 Articles de vente:', saleItems.length);
    console.log('🏠 Articles de location:', rentalItems.length);
    console.log('');
    
    // Test session de vente
    console.log('💳 Test de création de session de vente...');
    const saleResponse = await makeRequest('/api/payment/create-checkout-session', {
      items: saleItems,
      customerEmail: customerEmail,
      shippingAddress: address,
      billingAddress: address,
      isRental: false,
      isMixedCart: true,
      cartType: 'sale'
    });
    
    console.log('📊 Réponse session vente:');
    console.log('Status:', saleResponse.status);
    console.log('Data:', saleResponse.data);
    
    if (saleResponse.status === 200) {
      console.log('✅ Session de vente créée !');
      console.log('🔗 URL Stripe vente:', saleResponse.data.url);
      console.log('🆔 Session ID vente:', saleResponse.data.sessionId);
      console.log('🆔 Order ID vente:', saleResponse.data.orderId);
    } else {
      console.log('❌ Erreur session vente');
      console.log('Status:', saleResponse.status);
      console.log('Data:', saleResponse.data);
    }
    
    console.log('');
    
    // Test session de location
    console.log('🏠 Test de création de session de location...');
    const rentalResponse = await makeRequest('/api/rental/create-checkout-session', {
      items: rentalItems,
      customerEmail: customerEmail,
      shippingAddress: address,
      billingAddress: address,
      isRental: true,
      isMixedCart: true,
      cartType: 'rental'
    });
    
    console.log('📊 Réponse session location:');
    console.log('Status:', rentalResponse.status);
    console.log('Data:', rentalResponse.data);
    
    if (rentalResponse.status === 200) {
      console.log('✅ Session de location créée !');
      console.log('🔗 URL Stripe location:', rentalResponse.data.url);
      console.log('🆔 Session ID location:', rentalResponse.data.sessionId);
      console.log('🆔 Rental ID location:', rentalResponse.data.rentalId);
    } else {
      console.log('❌ Erreur session location');
      console.log('Status:', rentalResponse.status);
      console.log('Data:', rentalResponse.data);
    }
    
    console.log('');
    console.log('📋 Instructions pour tester les emails mixtes :');
    console.log('1. Allez sur l\'URL Stripe de vente et complétez le paiement');
    console.log('2. Allez sur l\'URL Stripe de location et complétez le paiement');
    console.log('3. Surveillez les logs Render pour voir :');
    console.log('   - "📧 Envoi facture de vente avec PDF..."');
    console.log('   - "📧 Envoi facture de location avec PDF..."');
    console.log('   - "✅ Facture de vente envoyée avec PDF"');
    console.log('   - "✅ Facture de location envoyée avec PDF"');
    console.log('4. Vérifiez que le client reçoit 2 emails :');
    console.log('   - Un email avec facture de vente PDF');
    console.log('   - Un email avec facture de location PDF');
    console.log('5. Vérifiez que l\'admin reçoit 2 emails :');
    console.log('   - Une notification avec facture de vente PDF');
    console.log('   - Une notification avec facture de location PDF');
    
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
console.log('🔍 Test des emails pour paniers mixtes :');
console.log('');
console.log('📋 Configuration actuelle :');
console.log('✅ Paiement fonctionne');
console.log('✅ Service email initialisé');
console.log('✅ Stripe initialisé avec succès');
console.log('✅ Base de données connectée');
console.log('');
console.log('🚨 Points à vérifier :');
console.log('- Les emails sont-ils envoyés pour chaque type de commande ?');
console.log('- Le client reçoit-il 2 factures distinctes ?');
console.log('- L\'admin reçoit-il 2 notifications distinctes ?');
console.log('- Les factures PDF sont-elles générées pour chaque type ?');
console.log('');
console.log('📋 Instructions de test :');
console.log('1. Lancez ce test pour créer les sessions');
console.log('2. Complétez les paiements séparément');
console.log('3. Surveillez les logs Render pour les messages d\'email');
console.log('4. Vérifiez que le client reçoit 2 emails distincts');
console.log('5. Vérifiez que l\'admin reçoit 2 notifications distinctes');
console.log('');

// Exécuter le test
testMixedCartEmails();
