// Script pour vérifier si le produit existe dans la base de données
import https from 'https';

console.log('🔍 Vérification de l\'existence du produit dans la base de données...\n');

async function checkProductExists() {
  try {
    console.log('📦 Test de récupération du produit...');
    
    // Test de récupération du produit via l'API publique
    const response = await makeRequest('/api/products');
    
    console.log('📊 Réponse du serveur:');
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ API produits fonctionne');
      console.log('📦 Nombre de produits:', response.data.length);
      
      // Chercher le produit spécifique
      const targetProductId = '68a9c4bebf2d893f209588fa';
      const product = response.data.find(p => p._id === targetProductId);
      
      if (product) {
        console.log('✅ Produit trouvé !');
        console.log('📦 Détails du produit:');
        console.log('  - ID:', product._id);
        console.log('  - Nom:', product.name);
        console.log('  - Prix:', product.price);
        console.log('  - Image:', product.mainImageUrl);
        console.log('  - Personnalisable:', product.isCustomizable);
        console.log('  - Options de personnalisation:', product.customizationOptions);
        
        // Vérifier les propriétés importantes pour le paiement
        console.log('\n🔍 Vérification des propriétés pour le paiement:');
        console.log('  - Prix valide:', typeof product.price === 'number' && product.price > 0);
        console.log('  - Nom valide:', typeof product.name === 'string' && product.name.length > 0);
        console.log('  - Image valide:', product.mainImageUrl && product.mainImageUrl.length > 0);
        
        if (product.customizationOptions) {
          console.log('  - Options de personnalisation:', Object.keys(product.customizationOptions));
        }
        
      } else {
        console.log('❌ Produit non trouvé avec l\'ID:', targetProductId);
        console.log('📦 Produits disponibles:');
        response.data.forEach((p, index) => {
          console.log(`  ${index + 1}. ${p.name} (${p._id})`);
        });
      }
      
    } else if (response.status === 500) {
      console.log('❌ Erreur 500 - Problème serveur');
      console.log('💡 Vérifiez les logs Render pour plus de détails');
      console.log('Data:', response.data);
      
    } else {
      console.log('❌ Erreur inattendue');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.error('💥 Erreur lors de la vérification:', error.message);
  }
}

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

// Instructions de diagnostic
console.log('🔍 Diagnostic de l\'existence du produit :');
console.log('');
console.log('📋 Vérifications à effectuer :');
console.log('1. Le produit existe-t-il dans la base de données ?');
console.log('2. Le produit a-t-il toutes les propriétés requises ?');
console.log('3. Y a-t-il des erreurs de connexion à la base de données ?');
console.log('4. Y a-t-il des erreurs de sérialisation des données ?');
console.log('');
console.log('🚨 Causes possibles de l\'erreur 500 :');
console.log('- Produit non trouvé dans la base de données');
console.log('- Erreur de connexion à la base de données');
console.log('- Erreur de sérialisation des données');
console.log('- Problème avec les options de personnalisation');
console.log('- Problème avec les images');
console.log('');

// Exécuter la vérification
checkProductExists();
