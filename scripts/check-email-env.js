// Script pour vérifier les variables d'environnement email
console.log('🔍 Vérification des variables d\'environnement email...\n');

const requiredEnvVars = [
  'EMAIL_HOST',
  'EMAIL_PORT', 
  'EMAIL_USER',
  'EMAIL_PASS',
  'ADMIN_EMAIL'
];

console.log('📧 Variables d\'environnement requises:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ DÉFINI' : '❌ MANQUANT';
  const displayValue = varName.includes('PASS') ? '***' : value || 'NON DÉFINI';
  console.log(`${varName}: ${status} (${displayValue})`);
});

console.log('\n🔧 Configuration recommandée pour Render:');
console.log('EMAIL_HOST: smtp.gmail.com (pour Gmail)');
console.log('EMAIL_PORT: 587');
console.log('EMAIL_USER: votre-email@gmail.com');
console.log('EMAIL_PASS: votre-mot-de-passe-app (Gmail App Password)');
console.log('ADMIN_EMAIL: admin@sakadeco.fr');

console.log('\n📋 Instructions pour configurer sur Render:');
console.log('1. Allez sur votre dashboard Render');
console.log('2. Sélectionnez votre service backend');
console.log('3. Allez dans "Environment"');
console.log('4. Ajoutez les variables ci-dessus');
console.log('5. Redéployez le service');

console.log('\n⚠️  Note: Pour Gmail, utilisez un "App Password" au lieu de votre mot de passe normal');
console.log('   - Activez la 2FA sur votre compte Gmail');
console.log('   - Générez un mot de passe d\'application');
console.log('   - Utilisez ce mot de passe dans EMAIL_PASS');
