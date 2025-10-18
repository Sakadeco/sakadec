// Script pour tester une commande réelle et diagnostiquer les emails
import https from 'https';

console.log('🧪 Test de commande réelle pour diagnostiquer les emails...\n');

// Produit existant pour le test
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
  customerEmail: 'lamawaffo11@gmail.com', // Votre email pour recevoir la facture
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

async function testRealPurchase() {
  try {
    console.log('📧 Test de création de session de paiement...');
    console.log('📧 Email client:', testOrder.customerEmail);
    console.log('📧 Email admin:', 'lamawaffo11@gmail.com');
    console.log('');

    // Test création session de paiement
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
      console.log('5. Vérifiez votre boîte email (lamawaffo11@gmail.com)');
      console.log('6. Vérifiez les spams et promotions');
      
    } else if (response.status === 400) {
      console.log('❌ Erreur 400 - Vérifiez les données de la commande');
      console.log('Data:', response.data);
      
    } else if (response.status === 500) {
      console.log('❌ Erreur 500 - Problème serveur');
      console.log('💡 Vérifiez les logs Render pour plus de détails');
      console.log('Data:', response.data);
      console.log('');
      console.log('🔧 Causes possibles de l\'erreur 500 :');
      console.log('1. Problème avec Stripe (clés API)');
      console.log('2. Problème avec PDFKit');
      console.log('3. Problème avec Nodemailer');
      console.log('4. Problème avec la base de données');
      console.log('');
      console.log('📋 Actions à effectuer :');
      console.log('1. Vérifiez les logs Render en temps réel');
      console.log('2. Cherchez les erreurs spécifiques');
      console.log('3. Vérifiez la configuration Stripe');
      console.log('4. Vérifiez que PDFKit est installé');
      
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

// Diagnostic des variables d'environnement
console.log('🔍 Diagnostic des variables d\'environnement :');
console.log('');
console.log('✅ Variables confirmées sur Render :');
console.log('  - EMAIL_HOST: smtp.gmail.com');
console.log('  - EMAIL_PORT: 587');
console.log('  - EMAIL_USER: lamawaffo11@gmail.com');
console.log('  - EMAIL_PASS: ledfpdzhofgiiwnn');
console.log('  - ADMIN_EMAIL: lamawaffo11@gmail.com');
console.log('');
console.log('🔧 Problèmes possibles :');
console.log('1. App Password Gmail incorrect ou expiré');
console.log('2. 2FA non activée sur Gmail');
console.log('3. Gmail bloque les emails automatiques');
console.log('4. Problème avec PDFKit');
console.log('5. Problème avec Stripe');
console.log('');
console.log('📋 Actions de diagnostic :');
console.log('1. Vérifiez les logs Render en temps réel');
console.log('2. Testez une commande et surveillez les logs');
console.log('3. Vérifiez votre boîte email (spams inclus)');
console.log('4. Vérifiez que l\'App Password Gmail est correct');
console.log('5. Vérifiez que la 2FA est activée sur Gmail');
console.log('');

// Exécuter le test
testRealPurchase();
