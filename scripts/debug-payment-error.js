// Script pour diagnostiquer l'erreur de paiement spécifique
import https from 'https';

console.log('🔍 Diagnostic détaillé de l\'erreur de paiement...\n');

async function debugPaymentError() {
  try {
    console.log('📧 Test avec un produit existant...');
    
    // Test avec un produit qui existe vraiment
    const testOrder = {
      items: [
        {
          productId: '68a9c4bebf2d893f209588fa', // Produit "texte" existant
          quantity: 1,
          price: 5,
          name: 'texte',
          image: 'https://res.cloudinary.com/dh8x3myg4/image/upload/v1755956413/sakadeco/products/product-1755956413090-sp82g5znq.png'
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

    const response = await makeRequest('/api/payment/create-checkout-session', testOrder);
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.status === 500) {
      console.log('\n🔍 Analyse de l\'erreur 500 :');
      console.log('L\'erreur se produit probablement à l\'une de ces étapes :');
      console.log('');
      console.log('1. 🔍 Recherche du produit dans la base de données (ligne 53)');
      console.log('   - Product.findById(item.productId)');
      console.log('   - Vérifiez que le produit existe');
      console.log('');
      console.log('2. 💰 Calcul des prix (lignes 58-78)');
      console.log('   - Calcul du prix de base');
      console.log('   - Calcul des personnalisations');
      console.log('   - Vérifiez que les prix sont valides');
      console.log('');
      console.log('3. 🖼️ Préparation des images (lignes 81-90)');
      console.log('   - Vérification des URLs d\'images');
      console.log('   - Conversion en URLs HTTPS');
      console.log('');
      console.log('4. 🛒 Création de la session Stripe (ligne 138)');
      console.log('   - stripe.checkout.sessions.create()');
      console.log('   - Vérifiez la configuration Stripe');
      console.log('');
      console.log('5. 💾 Sauvegarde de la commande (ligne 203)');
      console.log('   - order.save()');
      console.log('   - Vérifiez la connexion à la base de données');
      console.log('');
      console.log('🔧 Solutions selon l\'erreur :');
      console.log('');
      console.log('Si "Produit non trouvé" :');
      console.log('- Vérifiez que le produit existe dans la base de données');
      console.log('- Vérifiez que l\'ID du produit est correct');
      console.log('- Vérifiez la connexion à la base de données');
      console.log('');
      console.log('Si "Erreur Stripe" :');
      console.log('- Vérifiez que STRIPE_SECRET_KEY est configuré');
      console.log('- Vérifiez que la clé Stripe est valide');
      console.log('- Vérifiez que le compte Stripe est actif');
      console.log('');
      console.log('Si "Erreur base de données" :');
      console.log('- Vérifiez que DATABASE_URL est configuré');
      console.log('- Vérifiez que la base de données est accessible');
      console.log('- Vérifiez que les modèles sont corrects');
      console.log('');
      console.log('📋 Actions de diagnostic :');
      console.log('1. Vérifiez les logs Render en temps réel');
      console.log('2. Cherchez l\'erreur exacte dans les logs');
      console.log('3. Vérifiez que le produit existe dans la base de données');
      console.log('4. Vérifiez la configuration Stripe');
      console.log('5. Vérifiez la connexion à la base de données');
      
    } else if (response.status === 200) {
      console.log('✅ Session de paiement créée avec succès !');
      console.log('🔗 URL Stripe:', response.data.url);
      
    } else {
      console.log('❌ Erreur inattendue');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.error('💥 Erreur lors du diagnostic:', error.message);
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
console.log('🔍 Diagnostic de l\'erreur de paiement :');
console.log('');
console.log('📋 Étapes du processus de paiement :');
console.log('1. Vérification de Stripe (lignes 35-40)');
console.log('2. Validation des données (lignes 44-46)');
console.log('3. Recherche du produit (ligne 53)');
console.log('4. Calcul des prix (lignes 58-78)');
console.log('5. Préparation des images (lignes 81-90)');
console.log('6. Création de la session Stripe (ligne 138)');
console.log('7. Sauvegarde de la commande (ligne 203)');
console.log('');
console.log('🚨 Points de défaillance possibles :');
console.log('- Produit non trouvé dans la base de données');
console.log('- Erreur de calcul des prix');
console.log('- Problème avec les images');
console.log('- Erreur de configuration Stripe');
console.log('- Problème de connexion à la base de données');
console.log('');

// Exécuter le diagnostic
debugPaymentError();
