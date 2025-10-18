const https = require('https');

console.log('🔍 Diagnostic du webhook de location...\n');

// Test de la configuration
console.log('📋 Variables d\'environnement requises:');
const envVars = {
  'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY ? '✅ Configuré' : '❌ Manquant',
  'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET ? '✅ Configuré' : '❌ Manquant',
  'EMAIL_HOST': process.env.EMAIL_HOST ? '✅ Configuré' : '❌ Manquant',
  'EMAIL_USER': process.env.EMAIL_USER ? '✅ Configuré' : '❌ Manquant',
  'EMAIL_PASS': process.env.EMAIL_PASS ? '✅ Configuré' : '❌ Manquant',
  'ADMIN_EMAIL': process.env.ADMIN_EMAIL ? '✅ Configuré' : '❌ Manquant'
};

Object.entries(envVars).forEach(([key, status]) => {
  console.log(`  ${key}: ${status}`);
});

console.log('\n🔧 Configuration Stripe recommandée:');
console.log('1. Webhook URL: https://sakadeco.fr/api/payment/webhook');
console.log('2. Événements: checkout.session.completed');
console.log('3. Vérifiez que le webhook est actif sur Stripe Dashboard');

console.log('\n📧 Test de l\'envoi d\'email de location...');

// Test d'envoi d'email
const testEmail = async () => {
  try {
    const response = await fetch('https://sakadeco.fr/api/rental/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: true,
        adminEmail: process.env.ADMIN_EMAIL || 'lamawaffo11@gmail.com'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test email réussi:', result);
    } else {
      console.log('❌ Test email échoué:', response.status, await response.text());
    }
  } catch (error) {
    console.log('❌ Erreur test email:', error.message);
  }
};

// Créer une route de test temporaire
console.log('\n💡 Pour tester l\'email de location, ajoutez cette route temporaire:');
console.log(`
// Dans server/routes/rental.ts
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const testRental = {
      _id: 'test-rental-' + Date.now(),
      orderNumber: 'TEST-RENT-' + Date.now(),
      customerEmail: 'test@example.com',
      items: [{
        product: { 
          _id: 'test-product',
          name: 'Produit test location',
          mainImageUrl: 'https://via.placeholder.com/300'
        },
        quantity: 1,
        dailyPrice: 50,
        rentalStartDate: new Date(),
        rentalEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        rentalDays: 7,
        totalPrice: 350,
        customizations: {}
      }],
      subtotal: 350,
      tax: 70,
      deposit: 105,
      total: 525,
      status: 'confirmed',
      paymentStatus: 'paid',
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'France',
        phone: '0123456789'
      },
      createdAt: new Date()
    };

    const emailService = (await import('../services/emailService')).default;
    
    // Test envoi au client
    const clientResult = await emailService.sendRentalInvoiceWithPDF(testRental);
    console.log('📧 Email client:', clientResult ? '✅' : '❌');
    
    // Test envoi à l'admin
    const adminResult = await emailService.sendAdminInvoiceNotification(testRental, true);
    console.log('📧 Email admin:', adminResult ? '✅' : '❌');
    
    res.json({ 
      success: true, 
      clientEmail: clientResult,
      adminEmail: adminResult,
      message: 'Test emails envoyés'
    });
  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({ error: error.message });
  }
});
`);

console.log('\n🎯 Actions à effectuer:');
console.log('1. Vérifiez que le webhook Stripe pointe vers /api/payment/webhook');
console.log('2. Testez une location réelle et vérifiez les logs Render');
console.log('3. Vérifiez que l\'événement checkout.session.completed est bien configuré');
console.log('4. Vérifiez que les emails ne sont pas dans les spams');

console.log('\n📊 Logs à surveiller sur Render:');
console.log('- "📧 Envoi facture de location avec PDF pour:"');
console.log('- "📧 Résultats envoi emails:"');
console.log('- "✅ Factures PDF de location envoyées automatiquement"');
console.log('- "❌ Erreur envoi factures PDF location:"');
