// Script de test pour la configuration Nodemailer
import nodemailer from 'nodemailer';

console.log('🧪 Test de configuration Nodemailer...\n');

// Vérifier les variables d'environnement
console.log('📧 Variables d\'environnement Nodemailer:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || '❌ MANQUANT');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '❌ MANQUANT');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ MANQUANT');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ DÉFINI' : '❌ MANQUANT');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ MANQUANT');
console.log('');

async function testNodemailerConfiguration() {
  try {
    // Vérifier si toutes les variables sont configurées
    const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Variables manquantes:', missingVars.join(', '));
      console.log('');
      console.log('🔧 Configuration requise sur Render :');
      console.log('EMAIL_HOST=smtp.gmail.com');
      console.log('EMAIL_PORT=587');
      console.log('EMAIL_USER=votre-email@gmail.com');
      console.log('EMAIL_PASS=votre-app-password');
      console.log('ADMIN_EMAIL=admin@sakadeco.fr');
      return false;
    }

    console.log('✅ Toutes les variables sont configurées');
    console.log('');

    // Créer le transporter
    console.log('🔧 Test de création du transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Vérifier la connexion
    console.log('🔍 Vérification de la connexion...');
    await transporter.verify();
    console.log('✅ Connexion réussie !');
    console.log('');

    // Test d'envoi simple
    console.log('📤 Test d\'envoi d\'email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Test Nodemailer - Configuration SAKADECO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 32px;">✅ Test Nodemailer Réussi !</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Configuration SAKADECO opérationnelle</p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3b82f6; margin-top: 0;">📋 Détails du test</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <p><strong>Service:</strong> Nodemailer Email Service</p>
            <p><strong>Status:</strong> Configuration validée ✅</p>
            <p><strong>Host:</strong> ${process.env.EMAIL_HOST}</p>
            <p><strong>Port:</strong> ${process.env.EMAIL_PORT}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #d97706; margin-top: 0;">🎉 Félicitations !</h4>
            <p>Votre configuration Nodemailer fonctionne parfaitement. Les emails et factures PDF seront maintenant envoyés automatiquement.</p>
          </div>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #64748b; margin-top: 0;">📧 Prochaines étapes</h4>
            <ol style="color: #64748b;">
              <li>Effectuez une commande test sur votre site</li>
              <li>Vérifiez que les factures PDF sont envoyées</li>
              <li>Surveillez les logs Render pour confirmer</li>
              <li>Profitez de votre système d'emailing automatisé !</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #64748b;">
            <p>SAKADECO - Système d'emailing automatisé</p>
            <p>Email: contact@sakadeco.fr | Tél: +33 1 23 45 67 89</p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Email de test envoyé avec succès !');
    console.log('Message ID:', result.messageId);
    console.log('Destinataire:', testEmail.to);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors du test Nodemailer:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Solution : Vérifiez vos identifiants email');
      console.log('   - Pour Gmail : Utilisez un App Password');
      console.log('   - Activez la 2FA sur votre compte Gmail');
      console.log('   - Vérifiez que l\'email est correct');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution : Vérifiez la configuration réseau');
      console.log('   - Vérifiez EMAIL_HOST et EMAIL_PORT');
      console.log('   - Pour Gmail : smtp.gmail.com:587');
      console.log('   - Pour Outlook : smtp-mail.outlook.com:587');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Solution : Problème d\'authentification');
      console.log('   - Vérifiez votre email et mot de passe');
      console.log('   - Pour Gmail : Utilisez un App Password');
      console.log('   - Vérifiez que l\'email est correct');
    }
    
    return false;
  }
}

// Instructions de configuration
console.log('📋 Instructions de configuration Nodemailer :');
console.log('');
console.log('1️⃣ Configurer sur Render :');
console.log('   → Allez dans votre service sur Render');
console.log('   → Environment > Add Environment Variable');
console.log('   → Ajoutez les 5 variables requises');
console.log('');
console.log('2️⃣ Pour Gmail (recommandé) :');
console.log('   → Activez la 2FA sur votre compte Gmail');
console.log('   → Générez un App Password');
console.log('   → Utilisez l\'App Password dans EMAIL_PASS');
console.log('');
console.log('3️⃣ Variables requises :');
console.log('   EMAIL_HOST=smtp.gmail.com');
console.log('   EMAIL_PORT=587');
console.log('   EMAIL_USER=votre-email@gmail.com');
console.log('   EMAIL_PASS=votre-app-password');
console.log('   ADMIN_EMAIL=admin@sakadeco.fr');
console.log('');

// Exécuter le test
testNodemailerConfiguration().then(success => {
  if (success) {
    console.log('\n🎉 Configuration Nodemailer réussie !');
    console.log('📧 Vérifiez votre boîte email pour le message de test.');
    console.log('\n✅ Votre système d\'emailing est maintenant opérationnel !');
  } else {
    console.log('\n💥 Configuration Nodemailer échouée.');
    console.log('🔧 Suivez les instructions ci-dessus pour configurer Nodemailer.');
  }
});
