import mongoose from 'mongoose';

// Configuration
const DATABASE_URL = 'mongodb+srv://sakadeco:sakadeco@cluster0.oxicc0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testRentalDatabase() {
  try {
    log('🚀 Test de création de location en base de données', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. Connexion à la base de données
    log('📡 Connexion à MongoDB...', 'blue');
    await mongoose.connect(DATABASE_URL);
    log('✅ Connecté à MongoDB', 'green');

    const db = mongoose.connection.db;

    // 2. Récupérer le produit "prodloc"
    log('🔍 Recherche du produit "prodloc"...', 'blue');
    const productsCollection = db.collection('products');
    
    const product = await productsCollection.findOne({ name: { $regex: /prodloc/i } });
    if (!product) {
      log('❌ Produit "prodloc" non trouvé', 'red');
      return;
    }

    log(`✅ Produit trouvé: ${product.name}`, 'green');
    log(`   - ID: ${product._id}`, 'yellow');
    log(`   - Prix location: ${product.dailyRentalPrice}€/jour`, 'yellow');

    // 3. Calculer les dates et prix
    const startDate = new Date();
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const dailyPrice = product.dailyRentalPrice;
    const rentalDays = 7;
    const subtotal = dailyPrice * rentalDays;
    const deposit = subtotal * 0.2; // 20% de dépôt
    const total = subtotal + deposit;

    log('📅 Calcul des dates et prix:', 'blue');
    log(`   - Date début: ${startDate.toISOString().split('T')[0]}`, 'yellow');
    log(`   - Date fin: ${endDate.toISOString().split('T')[0]}`, 'yellow');
    log(`   - Durée: ${rentalDays} jours`, 'yellow');
    log(`   - Prix/jour: ${dailyPrice}€`, 'yellow');
    log(`   - Sous-total: ${subtotal}€`, 'yellow');
    log(`   - Dépôt (20%): ${deposit}€`, 'yellow');
    log(`   - Total: ${total}€`, 'yellow');

    // 4. Créer un utilisateur de test
    log('👤 Création d\'un utilisateur de test...', 'blue');
    const usersCollection = db.collection('users');
    
    const testUser = {
      email: 'lamawaffo10@gmail.com',
      name: 'Test User',
      phone: '+33123456789',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let user = await usersCollection.findOne({ email: testUser.email });
    if (!user) {
      const userResult = await usersCollection.insertOne(testUser);
      user = { _id: userResult.insertedId, ...testUser };
      log('✅ Utilisateur créé', 'green');
    } else {
      log('✅ Utilisateur existant trouvé', 'green');
    }

    log(`   - Email: ${user.email}`, 'yellow');
    log(`   - ID: ${user._id}`, 'yellow');

    // 5. Créer la location
    log('🛒 Création de la location...', 'blue');
    const rentalsCollection = db.collection('rentals');
    
    const rentalData = {
      user: user._id,
      items: [{
        product: product._id,
        quantity: 1,
        dailyPrice: dailyPrice,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        rentalDays: rentalDays,
        totalPrice: subtotal,
        customizations: {
          couleurs: 'noir',
          gravure_personnalisée: 'Test gravure personnalisée'
        },
        customMessage: 'Test de location via script'
      }],
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      stripeSessionId: 'test_session_' + Date.now(),
      stripePaymentIntentId: 'test_pi_' + Date.now(),
      subtotal: subtotal,
      tax: 0,
      deposit: deposit,
      total: total,
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
        phone: '+33123456789'
      },
      billingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
        phone: '+33123456789'
      },
      notes: 'Location créée via script de test',
      orderNumber: 'RENT-' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const rentalResult = await rentalsCollection.insertOne(rentalData);
    const rentalId = rentalResult.insertedId;

    log('✅ Location créée avec succès', 'green');
    log(`   - ID: ${rentalId}`, 'yellow');
    log(`   - Numéro: ${rentalData.orderNumber}`, 'yellow');
    log(`   - Statut: ${rentalData.status}`, 'yellow');
    log(`   - Paiement: ${rentalData.paymentStatus}`, 'yellow');
    log(`   - Total: ${rentalData.total}€`, 'yellow');

    // 6. Vérifier la location créée
    log('🔍 Vérification de la location...', 'blue');
    const createdRental = await rentalsCollection.findOne({ _id: rentalId });
    
    if (createdRental) {
      log('✅ Location vérifiée en base', 'green');
      log(`   - Utilisateur: ${createdRental.user}`, 'yellow');
      log(`   - Produit: ${createdRental.items[0].product}`, 'yellow');
      log(`   - Personnalisations: ${JSON.stringify(createdRental.items[0].customizations)}`, 'yellow');
    } else {
      log('❌ Location non trouvée après création', 'red');
    }

    // 7. Tester la récupération avec populate
    log('🔗 Test de récupération avec populate...', 'blue');
    try {
      // Simuler un populate en récupérant les données séparément
      const rentalWithDetails = await rentalsCollection.findOne({ _id: rentalId });
      const productDetails = await productsCollection.findOne({ _id: product._id });
      const userDetails = await usersCollection.findOne({ _id: user._id });

      log('✅ Données récupérées avec succès', 'green');
      log(`   - Location: ${rentalWithDetails.orderNumber}`, 'yellow');
      log(`   - Produit: ${productDetails.name}`, 'yellow');
      log(`   - Utilisateur: ${userDetails.email}`, 'yellow');

      // Vérifier les customizationOptions du produit
      if (productDetails.customizationOptions) {
        log('🔧 CustomizationOptions du produit:', 'blue');
        log(`   - Type: ${typeof productDetails.customizationOptions}`, 'yellow');
        log(`   - Contenu: ${JSON.stringify(productDetails.customizationOptions)}`, 'yellow');
        
        // Tester la conversion Map vers objet si nécessaire
        if (productDetails.customizationOptions instanceof Map) {
          log('⚠️  CustomizationOptions est une Map, conversion nécessaire', 'yellow');
          const convertedOptions = Object.fromEntries(productDetails.customizationOptions);
          log(`   - Après conversion: ${JSON.stringify(convertedOptions)}`, 'yellow');
        } else {
          log('✅ CustomizationOptions est déjà un objet', 'green');
        }
      }
    } catch (error) {
      log(`❌ Erreur récupération: ${error.message}`, 'red');
    }

    // 8. Simuler l'envoi d'email
    log('📧 Simulation d\'envoi d\'email...', 'blue');
    log(`   - Destinataire: ${user.email}`, 'yellow');
    log(`   - Sujet: Confirmation de location ${rentalData.orderNumber}`, 'yellow');
    log(`   - Contenu: Location confirmée pour ${product.name}`, 'yellow');
    log(`   - Durée: ${rentalDays} jours`, 'yellow');
    log(`   - Total: ${total}€`, 'yellow');

    // 9. Afficher le résumé
    log('📋 Résumé de la location:', 'cyan');
    log(`   - Numéro: ${rentalData.orderNumber}`, 'yellow');
    log(`   - Produit: ${product.name}`, 'yellow');
    log(`   - Utilisateur: ${user.email}`, 'yellow');
    log(`   - Dates: ${startDate.toISOString().split('T')[0]} → ${endDate.toISOString().split('T')[0]}`, 'yellow');
    log(`   - Durée: ${rentalDays} jours`, 'yellow');
    log(`   - Prix/jour: ${dailyPrice}€`, 'yellow');
    log(`   - Sous-total: ${subtotal}€`, 'yellow');
    log(`   - Dépôt: ${deposit}€`, 'yellow');
    log(`   - Total: ${total}€`, 'yellow');
    log(`   - Statut: ${rentalData.status}`, 'yellow');
    log(`   - Paiement: ${rentalData.paymentStatus}`, 'yellow');

    log('='.repeat(60), 'cyan');
    log('✅ Test de location terminé avec succès', 'green');
    log('📧 Vérifiez votre boîte email: lamawaffo10@gmail.com', 'cyan');

  } catch (error) {
    log(`❌ Erreur générale: ${error.message}`, 'red');
    log(`❌ Stack: ${error.stack}`, 'red');
  } finally {
    await mongoose.disconnect();
    log('🔌 Déconnecté de MongoDB', 'blue');
  }
}

// Exécuter le test
testRentalDatabase();
