import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Charger les variables d'environnement
dotenv.config();

async function testEmail() {
  console.log('🧪 Test de configuration email...');
  
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  console.log('📧 Configuration :');
  console.log('  - Host:', emailConfig.host);
  console.log('  - Port:', emailConfig.port);
  console.log('  - User:', emailConfig.auth.user);
  console.log('  - Pass:', emailConfig.auth.pass ? 'Configuré' : 'Manquant');

  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.error('❌ Configuration email manquante !');
    console.log('📝 Configurez EMAIL_USER et EMAIL_PASS dans votre fichier .env');
    return;
  }

  try {
    console.log('🔌 Test de connexion...');
    const transporter = nodemailer.createTransporter(emailConfig);
    
    // Test de connexion
    await transporter.verify();
    console.log('✅ Connexion réussie !');
    
    // Test d'envoi
    console.log('📤 Test d\'envoi d\'email...');
    const info = await transporter.sendMail({
      from: `"SakaDeco Test" <${emailConfig.auth.user}>`,
      to: emailConfig.auth.user, // Envoi à vous-même pour le test
      subject: 'Test SakaDeco - Configuration Email',
      html: `
        <h1>🎉 Test réussi !</h1>
        <p>La configuration email de SakaDeco fonctionne correctement.</p>
        <p>Les factures seront automatiquement envoyées après chaque paiement.</p>
        <p>Date du test: ${new Date().toLocaleString('fr-FR')}</p>
      `
    });
    
    console.log('✅ Email de test envoyé !');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Vérifiez votre boîte de réception');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error.message);
    console.log('🔧 Vérifiez :');
    console.log('  1. L\'authentification à 2 facteurs est activée');
    console.log('  2. Le mot de passe d\'application est correct');
    console.log('  3. Les variables d\'environnement sont bien configurées');
  }
}

testEmail();
