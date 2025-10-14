const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

console.log('🔧 Diagnostic Cloudinary Render - SakaDeco');
console.log('==========================================');

// Vérifier les variables d'environnement
console.log('\n📋 Variables d\'environnement Cloudinary :');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MANQUANTE');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || '❌ MANQUANTE');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurée' : '❌ MANQUANTE');

// Vérifier si les valeurs ne sont pas des placeholders
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET &&
                              process.env.CLOUDINARY_CLOUD_NAME !== 'votre_cloud_name' &&
                              process.env.CLOUDINARY_API_KEY !== 'votre_api_key' &&
                              process.env.CLOUDINARY_API_SECRET !== 'votre_api_secret_cloudinary';

console.log('\n🔍 Configuration valide :', isCloudinaryConfigured ? '✅ OUI' : '❌ NON');

if (!isCloudinaryConfigured) {
  console.log('\n❌ Problèmes détectés :');
  if (!process.env.CLOUDINARY_CLOUD_NAME) console.log('  - CLOUDINARY_CLOUD_NAME manquante');
  if (!process.env.CLOUDINARY_API_KEY) console.log('  - CLOUDINARY_API_KEY manquante');
  if (!process.env.CLOUDINARY_API_SECRET) console.log('  - CLOUDINARY_API_SECRET manquante');
  if (process.env.CLOUDINARY_CLOUD_NAME === 'votre_cloud_name') console.log('  - CLOUDINARY_CLOUD_NAME contient une valeur placeholder');
  if (process.env.CLOUDINARY_API_KEY === 'votre_api_key') console.log('  - CLOUDINARY_API_KEY contient une valeur placeholder');
  if (process.env.CLOUDINARY_API_SECRET === 'votre_api_secret_cloudinary') console.log('  - CLOUDINARY_API_SECRET contient une valeur placeholder');
  
  console.log('\n📝 Instructions pour Render :');
  console.log('1. Allez sur Render Dashboard > votre service > Environment');
  console.log('2. Ajoutez ces variables avec vos vraies valeurs :');
  console.log('   CLOUDINARY_CLOUD_NAME=dh8x3myg4');
  console.log('   CLOUDINARY_API_KEY=275281968286752');
  console.log('   CLOUDINARY_API_SECRET=votre_vraie_api_secret');
  console.log('3. Cliquez sur "Save Changes"');
  console.log('4. Redéployez l\'application');
} else {
  console.log('\n✅ Configuration Cloudinary valide !');
  console.log('📸 Les images seront uploadées vers Cloudinary');
}

console.log('\n🔗 URL Cloudinary attendue :');
console.log('https://res.cloudinary.com/dh8x3myg4/image/upload/...');
