// Script de test local pour vérifier l'envoi d'emails
import nodemailer from 'nodemailer';

console.log('🧪 Test local d\'envoi d\'email...\n');

// Configuration de test (à adapter selon vos besoins)
const testConfig = {
  // Gmail (recommandé)
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'votre-email@gmail.com', // Remplacez par votre email
    pass: 'votre-app-password' // Remplacez par votre App Password
  }
};

// Alternative : Outlook
const outlookConfig = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'votre-email@outlook.com',
    pass: 'votre-mot-de-passe'
  }
};

async function testEmailSending() {
  try {
    console.log('📧 Configuration de test:');
    console.log('Host:', testConfig.host);
    console.log('Port:', testConfig.port);
    console.log('User:', testConfig.auth.user);
    console.log('');

    // Créer le transporter
    const transporter = nodemailer.createTransport(testConfig);
    
    // Vérifier la connexion
    console.log('🔍 Vérification de la connexion...');
    await transporter.verify();
    console.log('✅ Connexion réussie !');
    
    // Envoyer un email de test
    console.log('📤 Envoi d\'email de test...');
    const testEmail = {
      from: `"SAKADECO Test" <${testConfig.auth.user}>`,
      to: testConfig.auth.user, // Envoi à soi-même pour le test
      subject: '🧪 Test SAKADECO - Configuration Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">✅ Test de configuration email réussi !</h2>
          <p>Si vous recevez cet email, votre configuration fonctionne correctement.</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Détails du test</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <p><strong>Service:</strong> SAKADECO Email Service</p>
            <p><strong>Status:</strong> Configuration validée ✅</p>
          </div>
          
          <p>Vous pouvez maintenant configurer ces paramètres sur Render.</p>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4>🔧 Prochaines étapes :</h4>
            <ol>
              <li>Copiez ces paramètres dans Render</li>
              <li>Ajoutez les variables d'environnement</li>
              <li>Redéployez votre service</li>
              <li>Testez une commande réelle</li>
            </ol>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Email de test envoyé !');
    console.log('Message ID:', result.messageId);
    console.log('Destinataire:', testEmail.to);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test email:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Solution : Vérifiez vos identifiants email');
      console.log('   - Pour Gmail : Utilisez un App Password');
      console.log('   - Activez la 2FA sur votre compte Gmail');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution : Vérifiez la configuration réseau');
      console.log('   - Vérifiez votre connexion internet');
      console.log('   - Vérifiez le host et le port');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Solution : Problème d\'authentification');
      console.log('   - Vérifiez votre email et mot de passe');
      console.log('   - Pour Gmail : Utilisez un App Password');
    }
    
    return false;
  }
}

// Instructions d'utilisation
console.log('📋 Instructions d\'utilisation :');
console.log('1. Modifiez les paramètres dans ce script');
console.log('2. Pour Gmail : Utilisez un App Password');
console.log('3. Exécutez : node scripts/test-email-local.js');
console.log('4. Vérifiez votre boîte email');
console.log('');

// Exécuter le test
testEmailSending().then(success => {
  if (success) {
    console.log('\n🎉 Test réussi ! Votre configuration email fonctionne.');
    console.log('📧 Vérifiez votre boîte email pour le message de test.');
    console.log('\n🔧 Vous pouvez maintenant configurer ces paramètres sur Render.');
  } else {
    console.log('\n💥 Test échoué. Vérifiez la configuration et réessayez.');
  }
});
