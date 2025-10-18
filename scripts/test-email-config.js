// Script de test pour vérifier la configuration email
import nodemailer from 'nodemailer';

console.log('🔍 Vérification de la configuration email...\n');

// Vérifier les variables d'environnement
console.log('📧 Variables d\'environnement email:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'NON DÉFINI');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'NON DÉFINI');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NON DÉFINI');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***DÉFINI***' : 'NON DÉFINI');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NON DÉFINI');
console.log('');

// Tester la création du transporter
async function testEmailConnection() {
  try {
    console.log('🔧 Test de connexion email...');
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Vérifier la connexion
    await transporter.verify();
    console.log('✅ Connexion email réussie !');
    
    // Test d'envoi simple
    console.log('📤 Test d\'envoi d\'email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'Test SAKADECO - Configuration Email',
      html: `
        <h2>Test de configuration email</h2>
        <p>Si vous recevez cet email, la configuration fonctionne correctement.</p>
        <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Email de test envoyé !');
    console.log('Message ID:', result.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur configuration email:', error.message);
    console.error('Détails:', error);
    return false;
  }
}

// Exécuter le test
testEmailConnection().then(success => {
  if (success) {
    console.log('\n🎉 Configuration email fonctionnelle !');
  } else {
    console.log('\n💥 Problème de configuration email détecté !');
    console.log('\n🔧 Solutions possibles:');
    console.log('1. Vérifiez vos variables d\'environnement');
    console.log('2. Vérifiez vos identifiants email');
    console.log('3. Vérifiez que le service email est configuré sur Render');
  }
});
