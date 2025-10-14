const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

console.log('🧪 Test d\'upload Cloudinary direct');
console.log('==================================');

// Vérifier la configuration
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET &&
                              process.env.CLOUDINARY_CLOUD_NAME !== 'votre_cloud_name' &&
                              process.env.CLOUDINARY_API_KEY !== 'votre_api_key' &&
                              process.env.CLOUDINARY_API_SECRET !== 'votre_api_secret_cloudinary';

if (!isCloudinaryConfigured) {
  console.log('❌ Cloudinary non configuré !');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'CONFIGURÉE' : 'MANQUANTE');
  process.exit(1);
}

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary configuré');

// Créer une image SVG de test
const testImage = `
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="200" fill="#4CAF50"/>
  <text x="150" y="100" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Test Cloudinary</text>
  <text x="150" y="130" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${new Date().toLocaleString()}</text>
</svg>
`;

async function testUpload() {
  try {
    console.log('🔄 Upload de l\'image de test...');
    
    const result = await cloudinary.uploader.upload(
      `data:image/svg+xml;base64,${Buffer.from(testImage).toString('base64')}`,
      {
        folder: 'sakadeco/test',
        public_id: `test-${Date.now()}`,
        overwrite: true
      }
    );
    
    console.log('✅ Upload réussi !');
    console.log('📸 URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);
    console.log('📏 Taille:', result.bytes, 'bytes');
    
    // Tester l'accès à l'image
    console.log('\n🔗 Test d\'accès à l\'image...');
    const response = await fetch(result.secure_url);
    if (response.ok) {
      console.log('✅ Image accessible !');
    } else {
      console.log('❌ Image non accessible');
    }
    
  } catch (error) {
    console.error('❌ Erreur upload:', error.message);
    if (error.http_code === 401) {
      console.log('🔑 Erreur d\'authentification - Vérifiez vos clés API');
    }
  }
}

testUpload();
