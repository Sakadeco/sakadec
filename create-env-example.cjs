const fs = require('fs');

const envContent = `DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
NODE_ENV=development
PORT=5000
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_stripe
SESSION_SECRET=votre_session_secret_tres_long_et_complexe
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret`;

fs.writeFileSync('.env', envContent, 'utf8');
console.log('✅ Fichier .env créé avec les variables d\'exemple !');
console.log('📝 Remplacez les valeurs par vos vraies clés :');
console.log('   - STRIPE_PUBLIC_KEY');
console.log('   - STRIPE_SECRET_KEY');
console.log('   - STRIPE_WEBHOOK_SECRET');
console.log('   - CLOUDINARY_CLOUD_NAME');
console.log('   - CLOUDINARY_API_KEY');
console.log('   - CLOUDINARY_API_SECRET');
