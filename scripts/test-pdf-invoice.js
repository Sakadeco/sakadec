import { InvoiceService } from '../server/services/invoiceService.js';

// Test de génération de facture de vente
async function testSaleInvoice() {
  console.log('🧾 Test génération facture de vente...');
  
  const mockOrder = {
    _id: 'TEST_ORDER_123',
    customerEmail: 'test@sakadeco.fr',
    customerName: 'Jean Dupont',
    shippingAddress: {
      firstName: 'Jean',
      lastName: 'Dupont',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    items: [
      {
        product: {
          name: 'Table de salon moderne',
          description: 'Table en bois massif avec finition ébène'
        },
        quantity: 1,
        price: 299.99
      },
      {
        product: {
          name: 'Chaise design',
          description: 'Chaise ergonomique en cuir'
        },
        quantity: 2,
        price: 149.99
      }
    ],
    subtotal: 599.97,
    tax: 119.99,
    shipping: 0,
    total: 719.96,
    createdAt: new Date()
  };

  try {
    const pdfBuffer = await InvoiceService.generateInvoiceForOrder(mockOrder);
    console.log('✅ Facture de vente générée:', pdfBuffer.length, 'bytes');
    return pdfBuffer;
  } catch (error) {
    console.error('❌ Erreur génération facture de vente:', error);
    return null;
  }
}

// Test de génération de facture de location
async function testRentalInvoice() {
  console.log('🏠 Test génération facture de location...');
  
  const mockRental = {
    _id: 'TEST_RENTAL_456',
    customerEmail: 'client@sakadeco.fr',
    customerName: 'Marie Martin',
    shippingAddress: {
      firstName: 'Marie',
      lastName: 'Martin',
      address: '456 Avenue des Champs',
      city: 'Lyon',
      postalCode: '69001',
      country: 'France'
    },
    items: [
      {
        product: {
          name: 'Décoration de mariage',
          description: 'Ensemble complet pour décoration de mariage'
        },
        quantity: 1,
        dailyPrice: 89.99,
        totalPrice: 269.97,
        rentalStartDate: '2024-02-14',
        rentalEndDate: '2024-02-17',
        rentalDays: 3
      }
    ],
    subtotal: 269.97,
    tax: 53.99,
    deposit: 80.99,
    total: 404.95,
    createdAt: new Date()
  };

  try {
    const pdfBuffer = await InvoiceService.generateInvoiceForRental(mockRental);
    console.log('✅ Facture de location générée:', pdfBuffer.length, 'bytes');
    return pdfBuffer;
  } catch (error) {
    console.error('❌ Erreur génération facture de location:', error);
    return null;
  }
}

// Test principal
async function runTests() {
  console.log('🚀 Démarrage des tests de génération de factures PDF...\n');
  
  try {
    // Test facture de vente
    const saleInvoice = await testSaleInvoice();
    console.log('');
    
    // Test facture de location
    const rentalInvoice = await testRentalInvoice();
    console.log('');
    
    if (saleInvoice && rentalInvoice) {
      console.log('🎉 Tous les tests sont passés avec succès !');
      console.log('📄 Factures PDF générées et prêtes à être envoyées par email.');
    } else {
      console.log('❌ Certains tests ont échoué.');
    }
    
  } catch (error) {
    console.error('💥 Erreur lors des tests:', error);
  }
}

// Exécuter les tests
runTests();
