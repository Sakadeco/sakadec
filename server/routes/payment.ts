import { Router, Request, Response } from 'express';
import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import { Rental } from '../models/Rental.js';
import emailService from '../services/emailService';
import { Product } from '../models/Product';

const router = Router();

// Vérifier si Stripe est configuré
const isStripeConfigured = process.env.STRIPE_SECRET_KEY && 
                          process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key' &&
                          process.env.STRIPE_SECRET_KEY.length > 0;

// Initialiser Stripe seulement si configuré
let stripe: Stripe | null = null;
if (isStripeConfigured) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia'
    });
    console.log('✅ Stripe initialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Stripe:', error);
    stripe = null;
  }
} else {
  console.log('⚠️  Stripe non configuré - les paiements ne fonctionneront pas');
}

// Créer une session de paiement Stripe
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    // Vérifier si Stripe est configuré
    if (!stripe) {
      return res.status(503).json({ 
        message: 'Service de paiement temporairement indisponible. Veuillez réessayer plus tard.' 
      });
    }

    const { items, shippingAddress, billingAddress, isRental, isMixedCart, cartType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article dans le panier' });
    }

    // Calculer le total
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} non trouvé` });
      }

      let price = product.price;
      let description = product.name;

      if (isRental && product.isRentable && product.dailyRentalPrice) {
        price = product.dailyRentalPrice * item.rentalDays;
        description = `${product.name} (Location - ${item.rentalDays} jour(s))`;
      }

      // Calculer le prix de base du produit
      let itemTotal = price * item.quantity;
      
      // Ajouter les prix de personnalisation
      if (item.customizations) {
        Object.values(item.customizations).forEach((customization: any) => {
          if (typeof customization === 'object' && customization.price) {
            itemTotal += customization.price * item.quantity;
          }
        });
      }
      
      subtotal += itemTotal;

      // Préparer l'image pour Stripe - Stripe nécessite des URLs HTTPS valides
      let imageUrl = null;
      if (product.mainImageUrl) {
        if (product.mainImageUrl.startsWith('http')) {
          imageUrl = product.mainImageUrl;
        } else if (product.mainImageUrl.startsWith('/uploads/')) {
          // Pour le développement local, on peut utiliser une image par défaut
          // ou une image HTTPS publique
          imageUrl = 'https://via.placeholder.com/300x300/cccccc/666666?text=Produit';
        }
      }

      // Calculer le prix unitaire total (produit + personnalisations)
      let unitPrice = price;
      let customizationDescription = '';
      
      if (item.customizations) {
        Object.entries(item.customizations).forEach(([key, customization]: [string, any]) => {
          if (typeof customization === 'object' && customization.price) {
            unitPrice += customization.price;
            if (customizationDescription) customizationDescription += ', ';
            customizationDescription += `${key}: ${customization.type || 'personnalisation'}`;
          }
        });
      }
      
      // Créer la description avec les personnalisations
      let finalDescription = description;
      if (customizationDescription) {
        finalDescription += ` (${customizationDescription})`;
      }
      
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: finalDescription,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      });
    }

    // Calculer la TVA (20% sur le sous-total HT)
    const tax = Math.round(subtotal * 0.20 * 100) / 100; // Arrondir à 2 décimales
    const shipping = 0; // Frais de livraison gratuits pour l'instant
    const total = Math.round((subtotal + tax + shipping) * 100) / 100; // Arrondir le total
    
    console.log('💰 Calcul des prix:', {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    });

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment/cancel`,
      metadata: {
        isRental: isRental ? 'true' : 'false',
        itemsCount: items.length.toString(),
        isMixedCart: isMixedCart ? 'true' : 'false',
        cartType: cartType || 'sale',
      },
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'CA'],
      },
      customer_email: req.body.customerEmail,
      // Désactiver le calcul automatique de TVA de Stripe
      automatic_tax: {
        enabled: false
      },
      // Spécifier que les prix incluent déjà la TVA
      tax_id_collection: {
        enabled: false
      }
    });

    // Créer la commande en base de données
    const order = new Order({
      user: req.body.userId || null,
      customerEmail: req.body.customerEmail,
      items: items.map((item: any) => {
        // Calculer le prix total de l'article (produit + personnalisations)
        let itemPrice = item.price;
        if (item.customizations) {
          Object.values(item.customizations).forEach((customization: any) => {
            if (typeof customization === 'object' && customization.price) {
              itemPrice += customization.price;
            }
          });
        }
        
        return {
          product: item.productId,
          quantity: item.quantity,
          price: itemPrice, // Prix total incluant les personnalisations
          isRental: isRental,
          rentalStartDate: item.rentalStartDate,
          rentalEndDate: item.rentalEndDate,
          rentalDays: item.rentalDays,
          customizations: item.customizations,
          customMessage: item.customMessage,
        };
      }),
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'stripe',
      stripeSessionId: session.id,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      billingAddress,
      isRental,
    });

    await order.save();

    res.json({
      sessionId: session.id,
      url: session.url,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la session de paiement' });
  }
});

// Webhook Stripe pour confirmer les paiements
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret!);
  } catch (err) {
    console.error('Erreur webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Vérifier si c'est une commande (achat) ou une location
        const order = await Order.findOne({ stripeSessionId: session.id });
        const rental = await Rental.findOne({ stripeSessionId: session.id });
        
        if (order) {
          // Traitement d'un achat
          order.status = 'paid';
          order.paymentStatus = 'paid';
          order.stripePaymentIntentId = session.payment_intent as string;
          await order.save();
          
          console.log(`Commande ${order._id} marquée comme payée`);
          
          // Envoyer automatiquement la facture par email avec PDF
          try {
            console.log('📧 Envoi facture de vente avec PDF pour la commande:', order._id);
            
            // Envoyer facture au client avec PDF
            const clientResult = await emailService.sendSaleInvoiceWithPDF(order);
            
            // Envoyer notification admin avec facture PDF
            const adminResult = await emailService.sendAdminInvoiceNotification(order, false);
            
            console.log('📧 Résultats envoi emails:');
            console.log('  - Facture client (avec PDF):', clientResult ? '✅' : '❌');
            console.log('  - Notification admin (avec PDF):', adminResult ? '✅' : '❌');
            
            console.log(`✅ Factures PDF envoyées automatiquement pour la commande ${order._id}`);
          } catch (emailError) {
            console.error('❌ Erreur envoi factures PDF:', emailError);
          }
        } else if (rental) {
          // Traitement d'une location
          rental.status = 'confirmed';
          rental.paymentStatus = 'paid';
          rental.stripePaymentIntentId = session.payment_intent as string;
          await rental.save();
          
          console.log(`Location ${rental._id} confirmée`);
          
          // Envoyer automatiquement la facture de location avec PDF
          try {
            console.log('📧 Envoi facture de location avec PDF pour:', rental._id);
            
            // Envoyer facture au client avec PDF
            const clientResult = await emailService.sendRentalInvoiceWithPDF(rental);
            
            // Envoyer notification admin avec facture PDF
            const adminResult = await emailService.sendAdminInvoiceNotification(rental, true);
            
            console.log('📧 Résultats envoi emails:');
            console.log('  - Facture client (avec PDF):', clientResult ? '✅' : '❌');
            console.log('  - Notification admin (avec PDF):', adminResult ? '✅' : '❌');
            
            console.log(`✅ Factures PDF de location envoyées automatiquement pour ${rental._id}`);
          } catch (emailError) {
            console.error('❌ Erreur envoi factures PDF location:', emailError);
          }
        } else {
          console.log(`⚠️ Session ${session.id} non trouvée dans les commandes ni les locations`);
        }
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Marquer la commande comme échouée
        const failedOrder = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
        if (failedOrder) {
          failedOrder.paymentStatus = 'failed';
          await failedOrder.save();
          
          console.log(`Paiement échoué pour la commande ${failedOrder._id}`);
        }
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    res.status(500).json({ message: 'Erreur traitement webhook' });
  }
});

// Récupérer les commandes d'un utilisateur
router.get('/orders/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une commande spécifique
router.get('/orders/detail/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une commande par session Stripe
router.get('/orders/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur récupération commande par session:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Télécharger la facture PDF
router.get('/invoice/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Générer le PDF de la facture
    const InvoiceService = (await import('../services/invoiceService')).InvoiceService;
    const pdfBuffer = await InvoiceService.generateInvoiceForOrder(order);

    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${order._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur génération facture PDF:', error);
    res.status(500).json({ message: 'Erreur génération facture' });
  }
});

export default router;
