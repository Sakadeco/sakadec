// Script pour tester la configuration du webhook Stripe
import https from 'https';

console.log('🔍 Test de la configuration du webhook Stripe...\n');

async function testWebhookConfig() {
  try {
    console.log('🔗 Test de l\'endpoint webhook...');
    
    // Test de l'endpoint webhook
    const response = await makeRequest('/api/payment/webhook', {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_webhook_test',
          payment_intent: 'pi_test_webhook_test'
        }
      }
    });
    
    console.log('📊 Réponse du webhook:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.status === 200) {
      console.log('✅ Webhook endpoint accessible');
      console.log('💡 Le webhook est configuré et accessible');
      
    } else if (response.status === 400) {
      console.log('⚠️ Webhook endpoint accessible mais erreur de signature');
      console.log('💡 C\'est normal - le webhook nécessite une signature Stripe valide');
      
    } else {
      console.log('❌ Webhook endpoint non accessible');
      console.log('💡 Vérifiez que l\'URL est correcte : https://sakadeco.fr/api/payment/webhook');
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
console.log('🔍 Test de la configuration du webhook Stripe :');
console.log('');
console.log('📋 Configuration requise :');
console.log('1. Webhook Stripe configuré sur : https://sakadeco.fr/api/payment/webhook');
console.log('2. Événement : checkout.session.completed');
console.log('3. STRIPE_WEBHOOK_SECRET configuré sur Render');
console.log('');
console.log('🚨 Problèmes possibles :');
console.log('- URL webhook incorrecte');
console.log('- Événement non sélectionné');
console.log('- Clé webhook manquante sur Render');
console.log('- Webhook non activé');
console.log('');
console.log('📋 Actions à effectuer :');
console.log('1. Vérifiez la configuration du webhook sur Stripe');
console.log('2. Vérifiez que STRIPE_WEBHOOK_SECRET est configuré sur Render');
console.log('3. Redéployez le service');
console.log('4. Testez un nouvel achat');
console.log('5. Surveillez les logs Render');
console.log('');

// Exécuter le test
testWebhookConfig();
