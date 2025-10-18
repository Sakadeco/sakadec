// Script de test simple pour SendGrid
console.log('🧪 Test simple de configuration SendGrid...\n');

// Vérifier les variables d'environnement
console.log('📧 Vérification des variables d\'environnement :');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ DÉFINI' : '❌ MANQUANT');
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL || '❌ NON DÉFINI');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ NON DÉFINI');
console.log('');

if (!process.env.SENDGRID_API_KEY) {
  console.log('❌ SENDGRID_API_KEY non configurée');
  console.log('');
  console.log('🔧 Configuration requise :');
  console.log('1. Créez un compte sur https://sendgrid.com');
  console.log('2. Générez une API Key dans Settings > API Keys');
  console.log('3. Ajoutez SENDGRID_API_KEY sur Render');
  console.log('4. Ajoutez SENDER_EMAIL et ADMIN_EMAIL sur Render');
  console.log('5. Redéployez le service');
  process.exit(1);
}

if (!process.env.SENDER_EMAIL || !process.env.ADMIN_EMAIL) {
  console.log('❌ Variables d\'email manquantes');
  console.log('');
  console.log('🔧 Ajoutez sur Render :');
  console.log('SENDER_EMAIL=noreply@sakadeco.fr');
  console.log('ADMIN_EMAIL=admin@sakadeco.fr');
  process.exit(1);
}

console.log('✅ Toutes les variables sont configurées !');
console.log('');
console.log('📋 Prochaines étapes :');
console.log('1. Redéployez votre service sur Render');
console.log('2. Effectuez une commande test sur votre site');
console.log('3. Vérifiez les logs Render pour :');
console.log('   - "✅ SendGrid configuré"');
console.log('   - "📧 Utilisation de SendGrid..."');
console.log('4. Vérifiez votre boîte email pour les factures PDF');
console.log('');
console.log('🎉 Configuration SendGrid prête !');
