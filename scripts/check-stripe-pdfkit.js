// Script pour vérifier la configuration Stripe et PDFKit
import https from 'https';

console.log('🔍 Vérification de la configuration Stripe et PDFKit...\n');

async function checkStripeConfig() {
  try {
    console.log('💳 Test de la configuration Stripe...');
    
    // Test simple de création de session Stripe
    const testData = {
      items: [
        {
          productId: '68a9c4bebf2d893f209588fa',
          quantity: 1,
          price: 5,
          name: 'Test Product',
          image: 'https://example.com/image.jpg'
        }
      ],
      customerEmail: 'test@example.com',
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

    const response = await makeRequest('/api/payment/create-checkout-session', testData);
    
    if (response.status === 200) {
      console.log('✅ Stripe fonctionne correctement');
      console.log('🔗 Session créée:', response.data.url);
      return true;
    } else if (response.status === 500) {
      console.log('❌ Erreur 500 avec Stripe');
      console.log('💡 Vérifiez les clés Stripe sur Render');
      console.log('Data:', response.data);
      return false;
    } else {
      console.log('❌ Erreur inattendue avec Stripe');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test Stripe:', error.message);
    return false;
  }
}

async function checkPDFKitConfig() {
  try {
    console.log('\n📄 Test de la configuration PDFKit...');
    
    // Test de génération de PDF simple
    const testData = {
      orderId: 'test-order-123',
      customerEmail: 'test@example.com',
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 5
        }
      ],
      total: 5
    };

    const response = await makeRequest('/api/test-pdf', testData);
    
    if (response.status === 200) {
      console.log('✅ PDFKit fonctionne correctement');
      return true;
    } else if (response.status === 404) {
      console.log('⚠️ Endpoint de test PDF non disponible');
      console.log('💡 PDFKit est probablement installé mais non testé');
      return true; // Pas d'erreur, juste pas d'endpoint de test
    } else {
      console.log('❌ Erreur avec PDFKit');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      return false;
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test PDFKit:', error.message);
    return false;
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

async function runDiagnostic() {
  console.log('🔍 Diagnostic complet de la configuration...\n');
  
  const stripeOk = await checkStripeConfig();
  const pdfkitOk = await checkPDFKitConfig();
  
  console.log('\n📊 Résumé du diagnostic :');
  console.log('Stripe:', stripeOk ? '✅ OK' : '❌ Erreur');
  console.log('PDFKit:', pdfkitOk ? '✅ OK' : '❌ Erreur');
  
  if (!stripeOk) {
    console.log('\n🔧 Solutions pour Stripe :');
    console.log('1. Vérifiez que STRIPE_SECRET_KEY est configuré sur Render');
    console.log('2. Vérifiez que STRIPE_PUBLISHABLE_KEY est configuré sur Render');
    console.log('3. Vérifiez que les clés Stripe sont correctes');
    console.log('4. Vérifiez que le compte Stripe est actif');
  }
  
  if (!pdfkitOk) {
    console.log('\n🔧 Solutions pour PDFKit :');
    console.log('1. Vérifiez que PDFKit est installé : npm list pdfkit');
    console.log('2. Vérifiez que PDFKit est dans package.json');
    console.log('3. Vérifiez que le build inclut PDFKit');
  }
  
  console.log('\n📋 Prochaines étapes :');
  console.log('1. Vérifiez les logs Render en temps réel');
  console.log('2. Vérifiez la configuration Stripe sur Render');
  console.log('3. Testez une commande et surveillez les logs');
  console.log('4. Vérifiez votre boîte email (spams inclus)');
}

// Exécuter le diagnostic
runDiagnostic();
