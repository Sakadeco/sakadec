import express from 'express';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Rental } from '../models/Rental.js';
import { Product } from '../models/Product.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Initialiser Stripe si configuré
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key';
const stripe = isStripeConfigured ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
}) : null;

// Créer une session de paiement pour location
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe non configuré' });
    }

    const { items, customerEmail, shippingAddress, isMixedCart, cartType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article dans la location' });
    }

    // Calculer les totaux
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} non trouvé` });
      }

      if (!product.isForRent) {
        return res.status(400).json({ message: `Le produit ${product.name} n'est pas disponible à la location` });
      }

      // Validation des dates
      const startDate = new Date(item.rentalStartDate);
      const endDate = new Date(item.rentalEndDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Dates de location invalides' });
      }
      
      if (endDate <= startDate) {
        return res.status(400).json({ message: 'La date de fin doit être postérieure à la date de début' });
      }

      const timeDiff = endDate.getTime() - startDate.getTime();
      const rentalDays = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      // Le prix ne dépend pas du nombre de jours, seulement de la quantité
      const itemTotal = (product.dailyRentalPrice || 0) * item.quantity;
      subtotal += itemTotal;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Location: ${product.name}`,
            description: `Location du ${new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} au ${new Date(item.rentalEndDate).toLocaleDateString('fr-FR')} (${rentalDays} jours)`,
            images: product.mainImageUrl && product.mainImageUrl.startsWith('http') ? [product.mainImageUrl] : []
          },
          unit_amount: Math.round((product.dailyRentalPrice || 0) * 100) // Stripe utilise les centimes
        },
        quantity: item.quantity
      });
    }

    // TVA non incluse - pas de calcul de TVA
    const tax = 0;
    const deposit = subtotal * 0.30; // Dépôt de 30%
    const total = subtotal + tax + deposit;

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://sakadeco.fr/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://sakadeco.fr/payment/cancel`,
      metadata: {
        rentalStartDate: items[0].rentalStartDate,
        rentalEndDate: items[0].rentalEndDate,
        isMixedCart: isMixedCart ? 'true' : 'false',
        cartType: cartType || 'rental'
      }
    });

    // Créer la location en base
    const rental = new Rental({
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        dailyPrice: item.dailyPrice,
        rentalStartDate: item.rentalStartDate,
        rentalEndDate: item.rentalEndDate,
        rentalDays: Math.max(1, Math.ceil((new Date(item.rentalEndDate).getTime() - new Date(item.rentalStartDate).getTime()) / (1000 * 60 * 60 * 24))),
        totalPrice: (item.dailyPrice || 0) * Math.max(1, Math.ceil((new Date(item.rentalEndDate).getTime() - new Date(item.rentalStartDate).getTime()) / (1000 * 60 * 60 * 24))) * item.quantity,
        customizations: item.customizations || {},
        customMessage: item.customMessage || ''
      })),
      customerEmail,
      shippingAddress,
      subtotal,
      tax,
      deposit,
      total,
      stripeSessionId: session.id
    });

    await rental.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur création session location:', error);
    console.error('Stack trace:', error.stack);
    console.error('Données reçues:', {
      itemsCount: req.body.items?.length
    });
    res.status(500).json({ 
      message: 'Erreur lors de la création de la session de location',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Note: Le webhook de location a été supprimé car les locations
// utilisent maintenant le webhook unifié dans /api/payment/webhook

// Route de test temporaire pour diagnostiquer l'email de location
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Test email de location...');
    
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
    console.log('📧 Test envoi email client...');
    const clientResult = await emailService.sendRentalInvoiceWithPDF(testRental);
    console.log('📧 Email client:', clientResult ? '✅' : '❌');
    
    // Test envoi à l'admin
    console.log('📧 Test envoi email admin...');
    const adminResult = await emailService.sendAdminInvoiceNotification(testRental, true);
    console.log('📧 Email admin:', adminResult ? '✅' : '❌');
    
    res.json({ 
      success: true, 
      clientEmail: clientResult,
      adminEmail: adminResult,
      message: 'Test emails envoyés',
      testRental: testRental
    });
  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les locations d'un utilisateur
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const rentals = await Rental.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error('Erreur récupération locations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des locations' });
  }
});

// Récupérer les détails d'une location
router.get('/detail/:rentalId', async (req: Request, res: Response) => {
  try {
    const { rentalId } = req.params;
    const rental = await Rental.findById(rentalId)
      .populate('items.product');
    
    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }
    
    // Convertir les Map en objets pour les produits
    const rentalObj = rental.toObject();
    if (rentalObj.items) {
      rentalObj.items = rentalObj.items.map((item: any) => {
        if (item.product && item.product.customizationOptions && item.product.customizationOptions instanceof Map) {
          item.product.customizationOptions = Object.fromEntries(item.product.customizationOptions);
        }
        return item;
      });
    }
    
    res.json({ rental: rentalObj });
  } catch (error) {
    console.error('Erreur récupération détails location:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails' });
  }
});

// Récupérer une location par session Stripe
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const rental = await Rental.findOne({ stripeSessionId: sessionId })
      .populate('items.product');
    
    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }
    
    // Convertir les Map en objets pour les produits
    const rentalObj = rental.toObject();
    if (rentalObj.items) {
      rentalObj.items = rentalObj.items.map((item: any) => {
        if (item.product && item.product.customizationOptions && item.product.customizationOptions instanceof Map) {
          item.product.customizationOptions = Object.fromEntries(item.product.customizationOptions);
        }
        return item;
      });
    }
    
    res.json(rentalObj);
  } catch (error) {
    console.error('Erreur récupération location par session:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la location' });
  }
});

// Télécharger la facture PDF de location
router.get('/invoice/:rentalId', async (req: Request, res: Response) => {
  try {
    const { rentalId } = req.params;
    const rental = await Rental.findById(rentalId)
      .populate('items.product');

    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    // Générer le PDF de la facture
    const InvoiceService = (await import('../services/invoiceService')).InvoiceService;
    const pdfBuffer = await InvoiceService.generateInvoiceForRental(rental);

    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture-location-${rental._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur génération facture location PDF:', error);
    res.status(500).json({ message: 'Erreur génération facture' });
  }
});

// Récupérer les dates réservées pour un produit
router.get('/product/:productId/booked-dates', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    // Récupérer toutes les locations confirmées pour ce produit
    const rentals = await Rental.find({
      'items.product': productId,
      status: 'confirmed'
    }).select('items.rentalStartDate items.rentalEndDate');
    
    const bookedDates: Array<{ startDate: Date; endDate: Date }> = [];
    
    rentals.forEach(rental => {
      rental.items.forEach(item => {
        if (item.product.toString() === productId) {
          bookedDates.push({
            startDate: item.rentalStartDate,
            endDate: item.rentalEndDate
          });
        }
      });
    });
    
    res.json({ dates: bookedDates });
  } catch (error) {
    console.error('Erreur récupération dates réservées:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dates réservées' });
  }
});

// Route de redirection pour le succès de location
router.get('/success', async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  if (sessionId) {
    // Rediriger vers la page frontend avec le session_id
    res.redirect(`/rental/success?session_id=${sessionId}`);
  } else {
    res.redirect('/rental/success');
  }
});

// Route de redirection pour l'annulation de location
router.get('/cancel', async (req: Request, res: Response) => {
  res.redirect('/rental/cancel');
});

export default router;
