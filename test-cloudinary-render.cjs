const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

console.log('🔧 Test de configuration Cloudinary pour Render...');
console.log('📡 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('🔑 API Key:', process.env.CLOUDINARY_API_KEY);
console.log('🔐 API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurée' : '❌ Manquante');

// Vérifier si toutes les variables sont présentes
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.log('❌ Configuration Cloudinary incomplète !');
  console.log('📝 Assurez-vous que ces variables sont dans votre fichier .env sur Render :');
  console.log('   CLOUDINARY_CLOUD_NAME=dh8x3myg4');
  console.log('   CLOUDINARY_API_KEY=275281968286752');
  console.log('   CLOUDINARY_API_SECRET=votre_api_secret');
  process.exit(1);
}

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  try {
    console.log('🔄 Test de connexion Cloudinary...');
    
    // Test de connexion
    const result = await cloudinary.api.ping();
    console.log('✅ Connexion Cloudinary réussie:', result);
    
    // Test d'upload d'une image simple (SVG)
    console.log('🔄 Test d\'upload d\'image...');
    const svgImage = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#4CAF50"/>
        <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">Test Render</text>
      </svg>
    `;
    
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/svg+xml;base64,${Buffer.from(svgImage).toString('base64')}`,
      {
        folder: 'sakadeco/test',
        public_id: 'test-render-' + Date.now()
      }
    );
    
    console.log('✅ Upload réussi !');
    console.log('📸 URL de l\'image:', uploadResult.secure_url);
    console.log('🆔 Public ID:', uploadResult.public_id);
    
    // Nettoyer l'image de test
    console.log('🧹 Nettoyage de l\'image de test...');
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('✅ Image de test supprimée');
    
    console.log('🎉 Tous les tests Cloudinary sont réussis !');
    console.log('📋 Configuration recommandée pour Render :');
    console.log('   - Vérifiez que les variables d\'environnement sont configurées');
    console.log('   - Redéployez l\'application après configuration');
    console.log('   - Surveillez les logs pour voir les messages Cloudinary');
    
  } catch (error) {
    console.error('❌ Erreur lors du test Cloudinary:', error.message);
    if (error.http_code === 401) {
      console.log('🔑 Erreur d\'authentification - Vérifiez vos clés API');
    }
  }
}

testCloudinary();
