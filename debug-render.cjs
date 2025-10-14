const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

console.log('🔧 Diagnostic Render - SakaDeco');
console.log('================================');

// Vérifier les variables d'environnement
console.log('\n📋 Variables d\'environnement :');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurée' : '❌ Manquante');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Configurée' : '❌ Manquante');

// Vérifier Stripe
console.log('\n💳 Configuration Stripe :');
console.log('STRIPE_PUBLIC_KEY:', process.env.STRIPE_PUBLIC_KEY ? '✅ Configurée' : '❌ Manquante');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Configurée' : '❌ Manquante');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configurée' : '❌ Manquante');

// Vérifier Cloudinary
console.log('\n☁️  Configuration Cloudinary :');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurée' : '❌ Manquante');

// Test de connexion Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  console.log('\n🔄 Test de connexion Cloudinary...');
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  cloudinary.api.ping()
    .then(result => {
      console.log('✅ Cloudinary connecté:', result);
    })
    .catch(error => {
      console.log('❌ Erreur Cloudinary:', error.message);
    });
} else {
  console.log('\n⚠️  Cloudinary non configuré');
}

// Vérifier les dépendances
console.log('\n📦 Dépendances :');
try {
  const cloudinaryPkg = require('cloudinary/package.json');
  console.log('✅ cloudinary installé, version:', cloudinaryPkg.version);
} catch (error) {
  console.log('❌ cloudinary non installé');
}

// Vérifier les permissions de fichiers
console.log('\n📁 Permissions de fichiers :');
const fs = require('fs');
const path = require('path');

const uploadDir = 'uploads/products/';
try {
  if (fs.existsSync(uploadDir)) {
    console.log('✅ Dossier uploads existe');
    try {
      fs.accessSync(uploadDir, fs.constants.R_OK | fs.constants.W_OK);
      console.log('✅ Permissions read/write OK');
    } catch (err) {
      console.log('❌ Pas de permissions read/write');
    }
  } else {
    console.log('❌ Dossier uploads n\'existe pas');
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✅ Dossier uploads créé');
    } catch (err) {
      console.log('❌ Impossible de créer le dossier uploads:', err.message);
    }
  }
} catch (error) {
  console.log('❌ Erreur vérification dossier:', error.message);
}

console.log('\n🎯 Recommandations :');
console.log('1. Vérifiez que toutes les variables d\'environnement sont configurées sur Render');
console.log('2. Assurez-vous que cloudinary est dans les dépendances');
console.log('3. Vérifiez les logs Render pour les erreurs exactes');
console.log('4. Testez la création de produit sans image d\'abord');
