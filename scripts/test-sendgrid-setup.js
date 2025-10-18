// Script de test pour la configuration SendGrid
import sgMail from '@sendgrid/mail';

console.log('🧪 Test de configuration SendGrid...\n');

// Vérifier les variables d'environnement
console.log('📧 Variables d\'environnement SendGrid:');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ DÉFINI' : '❌ MANQUANT');
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL || 'NON DÉFINI');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NON DÉFINI');
console.log('');

async function testSendGridConfiguration() {
  try {
    // Vérifier si l'API key est configurée
    if (!process.env.SENDGRID_API_KEY) {
      console.log('❌ SENDGRID_API_KEY non configurée');
      console.log('');
      console.log('🔧 Configuration requise :');
      console.log('1. Créez un compte sur https://sendgrid.com');
      console.log('2. Générez une API Key');
      console.log('3. Ajoutez SENDGRID_API_KEY sur Render');
      console.log('4. Ajoutez SENDER_EMAIL (ex: noreply@sakadeco.fr)');
      console.log('5. Ajoutez ADMIN_EMAIL (ex: admin@sakadeco.fr)');
      return false;
    }

    // Configurer SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid configuré avec l\'API Key');
    
    // Test d'envoi simple
    console.log('📤 Test d\'envoi d\'email...');
    
    const testEmail = {
      to: process.env.ADMIN_EMAIL || 'test@sakadeco.fr',
      from: {
        email: process.env.SENDER_EMAIL || 'noreply@sakadeco.fr',
        name: 'SAKADECO Test'
      },
      subject: '🧪 Test SendGrid - Configuration SAKADECO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 32px;">✅ Test SendGrid Réussi !</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Configuration SAKADECO opérationnelle</p>
          </div>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #10b981; margin-top: 0;">📋 Détails du test</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <p><strong>Service:</strong> SendGrid Email Service</p>
            <p><strong>Status:</strong> Configuration validée ✅</p>
            <p><strong>API Key:</strong> Configurée</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h4 style="color: #d97706; margin-top: 0;">🎉 Félicitations !</h4>
            <p>Votre configuration SendGrid fonctionne parfaitement. Les emails et factures PDF seront maintenant envoyés automatiquement.</p>
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
    
    const result = await sgMail.send(testEmail);
    console.log('✅ Email de test envoyé avec succès !');
    console.log('Message ID:', result[0].headers['x-message-id']);
    console.log('Destinataire:', testEmail.to);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors du test SendGrid:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Solution : Vérifiez votre API Key SendGrid');
      console.log('   - Allez sur https://app.sendgrid.com/settings/api_keys');
      console.log('   - Vérifiez que l\'API Key est correcte');
      console.log('   - Vérifiez que l\'API Key a les permissions d\'envoi');
    } else if (error.message.includes('Forbidden')) {
      console.log('\n💡 Solution : Vérifiez les permissions de votre API Key');
      console.log('   - L\'API Key doit avoir la permission "Mail Send"');
      console.log('   - Vérifiez dans les paramètres SendGrid');
    } else if (error.message.includes('Bad Request')) {
      console.log('\n💡 Solution : Vérifiez l\'adresse email expéditeur');
      console.log('   - L\'email expéditeur doit être vérifié sur SendGrid');
      console.log('   - Allez dans Settings > Sender Authentication');
    }
    
    return false;
  }
}

// Instructions de configuration
console.log('📋 Instructions de configuration SendGrid :');
console.log('');
console.log('1️⃣ Créer un compte SendGrid :');
console.log('   → Allez sur https://sendgrid.com');
console.log('   → Créez un compte gratuit (100 emails/jour)');
console.log('   → Vérifiez votre email');
console.log('');
console.log('2️⃣ Générer une API Key :');
console.log('   → Allez dans Settings > API Keys');
console.log('   → Créez une nouvelle API Key');
console.log('   → Donnez-lui un nom (ex: "SAKADECO")');
console.log('   → Sélectionnez "Full Access" ou au minimum "Mail Send"');
console.log('   → Copiez l\'API Key générée');
console.log('');
console.log('3️⃣ Configurer sur Render :');
console.log('   → Allez dans votre service sur Render');
console.log('   → Environment > Add Environment Variable');
console.log('   → Ajoutez : SENDGRID_API_KEY = votre-api-key');
console.log('   → Ajoutez : SENDER_EMAIL = noreply@sakadeco.fr');
console.log('   → Ajoutez : ADMIN_EMAIL = admin@sakadeco.fr');
console.log('   → Redéployez le service');
console.log('');
console.log('4️⃣ Vérifier l\'expéditeur (optionnel) :');
console.log('   → Dans SendGrid : Settings > Sender Authentication');
console.log('   → Ajoutez votre domaine ou une adresse email');
console.log('   → Cela améliore la délivrabilité');
console.log('');

// Exécuter le test
testSendGridConfiguration().then(success => {
  if (success) {
    console.log('\n🎉 Configuration SendGrid réussie !');
    console.log('📧 Vérifiez votre boîte email pour le message de test.');
    console.log('\n✅ Votre système d\'emailing est maintenant opérationnel !');
  } else {
    console.log('\n💥 Configuration SendGrid échouée.');
    console.log('🔧 Suivez les instructions ci-dessus pour configurer SendGrid.');
  }
});
