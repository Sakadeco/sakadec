// Script pour tester Stripe avec des données minimales
import https from 'https';

console.log('🧪 Test de Stripe avec des données minimales...\n');

async function testStripeMinimal() {
  try {
    console.log('💳 Test de création de session Stripe...');
    
    // Test avec des données minimales et simplifiées
    const minimalOrder = {
      items: [
        {
          productId: '68a9c4bebf2d893f209588fa',
          quantity: 1,
          price: 5,
          name: 'texte'
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

    const response = await makeRequest('/api/payment/create-checkout-session', minimalOrder);
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.status === 200) {
      console.log('✅ Session Stripe créée avec succès !');
      console.log('🔗 URL Stripe:', response.data.url);
      console.log('🆔 Session ID:', response.data.sessionId);
      console.log('🆔 Order ID:', response.data.orderId);
      
    } else if (response.status === 500) {
      console.log('❌ Erreur 500 - Problème serveur');
      console.log('💡 L\'erreur se produit probablement dans le code de paiement');
      console.log('');
      console.log('🔍 Analyse de l\'erreur :');
      console.log('Le produit existe et a les bonnes propriétés, donc l\'erreur vient de :');
      console.log('');
      console.log('1. 🔍 Recherche du produit dans la base de données (ligne 53)');
      console.log('   - Product.findById(item.productId)');
      console.log('   - Problème possible : erreur de connexion à la base de données');
      console.log('');
      console.log('2. 💰 Calcul des prix (lignes 58-78)');
      console.log('   - Calcul du prix de base');
      console.log('   - Calcul des personnalisations');
      console.log('   - Problème possible : erreur dans le calcul des prix');
      console.log('');
      console.log('3. 🖼️ Préparation des images (lignes 81-90)');
      console.log('   - Vérification des URLs d\'images');
      console.log('   - Problème possible : erreur avec les images');
      console.log('');
      console.log('4. 🛒 Création de la session Stripe (ligne 138)');
      console.log('   - stripe.checkout.sessions.create()');
      console.log('   - Problème possible : erreur de configuration Stripe');
      console.log('');
      console.log('5. 💾 Sauvegarde de la commande (ligne 203)');
      console.log('   - order.save()');
      console.log('   - Problème possible : erreur de sauvegarde en base');
      console.log('');
      console.log('🔧 Solutions selon l\'erreur :');
      console.log('');
      console.log('Si "Erreur de connexion à la base de données" :');
      console.log('- Vérifiez que DATABASE_URL est configuré');
      console.log('- Vérifiez que la base de données est accessible');
      console.log('- Vérifiez que les modèles sont corrects');
      console.log('');
      console.log('Si "Erreur de calcul des prix" :');
      console.log('- Vérifiez que les prix sont valides');
      console.log('- Vérifiez que les personnalisations sont correctes');
      console.log('- Vérifiez que les calculs sont corrects');
      console.log('');
      console.log('Si "Erreur avec les images" :');
      console.log('- Vérifiez que les URLs d\'images sont valides');
      console.log('- Vérifiez que les images sont accessibles');
      console.log('- Vérifiez que les images sont en HTTPS');
      console.log('');
      console.log('Si "Erreur de configuration Stripe" :');
      console.log('- Vérifiez que STRIPE_SECRET_KEY est configuré');
      console.log('- Vérifiez que la clé Stripe est valide');
      console.log('- Vérifiez que le compte Stripe est actif');
      console.log('');
      console.log('Si "Erreur de sauvegarde" :');
      console.log('- Vérifiez que la base de données est accessible');
      console.log('- Vérifiez que les modèles sont corrects');
      console.log('- Vérifiez que les données sont valides');
      console.log('');
      console.log('📋 Actions de diagnostic :');
      console.log('1. Vérifiez les logs Render en temps réel');
      console.log('2. Cherchez l\'erreur exacte dans les logs');
      console.log('3. Vérifiez la configuration Stripe');
      console.log('4. Vérifiez la connexion à la base de données');
      console.log('5. Vérifiez que les données sont valides');
      
    } else {
      console.log('❌ Erreur inattendue');
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
console.log('🔍 Test de Stripe avec des données minimales :');
console.log('');
console.log('📋 Données de test :');
console.log('- Produit ID: 68a9c4bebf2d893f209588fa');
console.log('- Quantité: 1');
console.log('- Prix: 5');
console.log('- Email: test@sakadeco.fr');
console.log('- Adresse: 123 Test Street, Paris');
console.log('');
console.log('🚨 Points de défaillance possibles :');
console.log('- Erreur de connexion à la base de données');
console.log('- Erreur de calcul des prix');
console.log('- Problème avec les images');
console.log('- Erreur de configuration Stripe');
console.log('- Erreur de sauvegarde en base');
console.log('');

// Exécuter le test
testStripeMinimal();
