const fs = require('fs');
const path = require('path');

// Créer le dossier uploads/products s'il n'existe pas
const uploadDir = 'uploads/products/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Créer une image de test simple (1x1 pixel PNG en base64)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const testImageBuffer = Buffer.from(testImageBase64, 'base64');

// Liste des images manquantes basée sur les erreurs 404
const missingImages = [
  'product-1755228340679-716430211.png',
  'product-1755228340679-396102011.jpeg'
];

console.log('🖼️  Création des images manquantes...');

missingImages.forEach((filename) => {
  const filePath = path.join(uploadDir, filename);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, testImageBuffer);
    console.log(`✅ Créé: ${filename}`);
  } else {
    console.log(`⚠️  Existe déjà: ${filename}`);
  }
});

console.log('🎉 Images manquantes créées avec succès !');
