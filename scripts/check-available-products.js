// Script pour vérifier les produits disponibles
import https from 'https';

console.log('🔍 Vérification des produits disponibles...\n');

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'sakadeco-api.onrender.com',
      port: 443,
      path: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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

    req.end();
  });
}

async function checkProducts() {
  try {
    console.log('📦 Récupération des produits...');
    
    const response = await makeRequest('/api/products');
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    
    if (response.status === 200 && Array.isArray(response.data)) {
      console.log('✅ Produits trouvés:', response.data.length);
      console.log('');
      
      response.data.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Prix: ${product.price}€`);
        console.log(`   Vente: ${product.isForSale ? '✅' : '❌'}`);
        console.log(`   Location: ${product.isForRent ? '✅' : '❌'}`);
        console.log('');
      });
      
      // Trouver un produit de vente
      const saleProduct = response.data.find(p => p.isForSale);
      if (saleProduct) {
        console.log('🛒 Produit recommandé pour le test:');
        console.log(`   Nom: ${saleProduct.name}`);
        console.log(`   ID: ${saleProduct._id}`);
        console.log(`   Prix: ${saleProduct.price}€`);
        console.log('');
        console.log('🧪 Test de commande avec ce produit:');
        console.log(`   curl -X POST https://sakadeco-api.onrender.com/api/payment/create-checkout-session \\`);
        console.log(`   -H "Content-Type: application/json" \\`);
        console.log(`   -d '{"items":[{"productId":"${saleProduct._id}","quantity":1,"price":${saleProduct.price},"name":"${saleProduct.name}","image":"${saleProduct.mainImageUrl || 'https://via.placeholder.com/300x300'}"}],"customerEmail":"test@sakadeco.fr","shippingAddress":{"firstName":"Test","lastName":"User","address":"123 Test Street","city":"Paris","postalCode":"75001","country":"France"},"billingAddress":{"firstName":"Test","lastName":"User","address":"123 Test Street","city":"Paris","postalCode":"75001","country":"France"}}'`);
      }
      
    } else {
      console.log('❌ Erreur lors de la récupération des produits');
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.error('💥 Erreur lors de la vérification:', error.message);
  }
}

// Exécuter la vérification
checkProducts();
