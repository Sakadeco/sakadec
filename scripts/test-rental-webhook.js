const https = require('https');

console.log('🔍 Test de la configuration du webhook de location...\n');

// Vérifier les variables d'environnement
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'ADMIN_EMAIL'
];

console.log('📋 Vérification des variables d\'environnement:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`  ✅ ${envVar}: Configuré`);
  } else {
    console.log(`  ❌ ${envVar}: Manquant`);
  }
});

console.log('\n🔧 Configuration recommandée pour Stripe:');
console.log('1. Allez sur https://dashboard.stripe.com/webhooks');
console.log('2. Créez un nouveau webhook avec l\'URL: https://sakadeco.fr/api/rental/webhook');
console.log('3. Sélectionnez l\'événement: checkout.session.completed');
console.log('4. Copiez le secret du webhook dans STRIPE_WEBHOOK_SECRET sur Render');

console.log('\n📧 Test de l\'envoi d\'email de location...');

// Test d'envoi d'email de location
const testRentalEmail = async () => {
  try {
    const response = await fetch('https://sakadeco.fr/api/rental/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: true
      })
    });

    if (response.ok) {
      console.log('✅ Test email de location réussi');
    } else {
      console.log('❌ Test email de location échoué:', response.status);
    }
  } catch (error) {
    console.log('❌ Erreur test email de location:', error.message);
  }
};

// Créer une route de test pour l'email de location
console.log('\n💡 Pour tester l\'email de location, ajoutez cette route temporaire:');
console.log(`
// Route de test pour l'email de location (à ajouter temporairement)
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const testRental = {
      _id: 'test-rental-id',
      orderNumber: 'TEST-RENT-001',
      customerEmail: 'test@example.com',
      items: [{
        product: { name: 'Produit test' },
        quantity: 1,
        dailyPrice: 50,
        rentalStartDate: new Date(),
        rentalEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        rentalDays: 7,
        totalPrice: 350
      }],
      subtotal: 350,
      tax: 70,
      deposit: 105,
      total: 525,
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'France',
        phone: '0123456789'
      }
    };

    const emailService = (await import('../services/emailService')).default;
    const result = await emailService.sendRentalInvoiceWithPDF(testRental);
    
    res.json({ success: result, message: 'Test email envoyé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
`);

console.log('\n🎯 Actions recommandées:');
console.log('1. Vérifiez que le webhook de location est configuré sur Stripe');
console.log('2. Vérifiez que STRIPE_WEBHOOK_SECRET est correct sur Render');
console.log('3. Testez une location réelle pour voir les logs');
console.log('4. Vérifiez les logs Render pour les erreurs d\'email');
