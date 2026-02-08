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

    const { items, shippingAddress, billingAddress, isRental, isMixedCart, cartType, promoCode, promoDiscount, deliveryMethod, shipping } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Aucun article dans le panier' });
    }

    // Calculer le total
    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    
    // Récupérer le montant de réduction du code promo
    const discountAmount = promoDiscount ? parseFloat(promoDiscount) : 0;

    // Première passe : calculer le subtotal sans réduction et vérifier le stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} non trouvé` });
      }

      // Vérifier le stock pour les produits de vente (pas pour les locations)
      if (!isRental && product.isForSale) {
        if (product.stockQuantity < item.quantity) {
          return res.status(400).json({ 
            message: `Stock insuffisant pour ${product.name}. Stock disponible : ${product.stockQuantity}, quantité demandée : ${item.quantity}` 
          });
        }
        if (product.stockQuantity <= 0) {
          return res.status(400).json({ 
            message: `Le produit ${product.name} est en rupture de stock` 
          });
        }
      }

      // Utiliser le prix du panier (qui inclut déjà les ajustements de valuePrices) si disponible
      // Sinon utiliser le prix du produit
      let price = item.price !== undefined ? item.price : product.price;

      if (isRental && product.isRentable && product.dailyRentalPrice) {
        // Le prix ne dépend pas du nombre de jours, seulement de la quantité
        // Pour les locations, utiliser le prix du panier si disponible
        price = item.price !== undefined ? item.price : product.dailyRentalPrice;
      }

      // Calculer le prix de base du produit (avec ajustements de valuePrices si présents)
      let itemTotal = price * item.quantity;
      subtotal += itemTotal;
    }
    
    // Calculer le ratio de réduction si code promo présent
    const discountRatio = (promoCode && discountAmount > 0 && subtotal > 0) 
      ? discountAmount / subtotal 
      : 0;
    
    console.log('🎟️ Code promo appliqué:', {
      promoCode: promoCode || 'Aucun',
      discountAmount: discountAmount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      discountRatio: discountRatio.toFixed(4)
    });

    // Deuxième passe : créer les line items avec réduction appliquée
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        continue; // Déjà vérifié dans la première passe
      }

      // Utiliser le prix du panier (qui inclut déjà les ajustements de valuePrices) si disponible
      // Sinon utiliser le prix du produit
      let price = item.price !== undefined ? item.price : product.price;
      let description = product.name;

      if (isRental && product.isRentable && product.dailyRentalPrice) {
        // Le prix ne dépend pas du nombre de jours, seulement de la quantité
        // Pour les locations, utiliser le prix du panier si disponible
        price = item.price !== undefined ? item.price : product.dailyRentalPrice;
        description = `${product.name} (Location - ${item.rentalDays || 1} jour(s))`;
      }

      // Log pour vérifier l'utilisation du prix ajusté
      if (item.price !== undefined && item.price !== product.price) {
        console.log(`💰 Prix ajusté pour ${product.name}: ${product.price.toFixed(2)}€ → ${item.price.toFixed(2)}€ (ajustement: ${(item.price - product.price).toFixed(2)}€)`);
      }

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

      // Calculer le prix unitaire total (produit seulement, personnalisations gratuites)
      let unitPrice = price;
      let customizationDescription = '';
      
      if (item.customizations) {
        Object.entries(item.customizations).forEach(([key, customization]: [string, any]) => {
          if (typeof customization === 'object') {
            // Les personnalisations sont gratuites, pas de prix supplémentaire
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
      
      // Calculer le prix unitaire avec réduction si code promo appliqué
      let finalUnitPrice = unitPrice;
      if (discountRatio > 0) {
        // Appliquer la réduction proportionnellement à chaque article
        finalUnitPrice = unitPrice * (1 - discountRatio);
        console.log(`  📦 ${product.name}: ${unitPrice.toFixed(2)}€ → ${finalUnitPrice.toFixed(2)}€ (réduction: ${(discountRatio * 100).toFixed(2)}%)`);
      }
      
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: finalDescription,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(finalUnitPrice * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      });
    }

    // La réduction du code promo est déjà appliquée dans les prix unitaires des line items
    // Calculer le subtotal après réduction à partir des line items
    const subtotalAfterDiscount = lineItems.reduce((sum, item) => {
      const itemTotal = (item.price_data?.unit_amount || 0) * (item.quantity || 0);
      return sum + itemTotal;
    }, 0) / 100; // Convertir de centimes en euros
    
    // TVA à 20% calculée sur le subtotal APRÈS réduction
    const tax = subtotalAfterDiscount * 0.20;
    // Utiliser les frais de livraison fournis par le client, ou 0 par défaut
    const shippingCost = shipping ? parseFloat(shipping.toString()) : 0;
    
    // Calculer le total avec le subtotal après réduction
    const total = Math.round((subtotalAfterDiscount + tax + shippingCost) * 100) / 100;
    
    console.log('💰 Calcul des prix:', {
      subtotal: subtotal.toFixed(2),
      promoCode: promoCode || 'Aucun',
      discountAmount: discountAmount.toFixed(2),
      subtotalAfterDiscount: subtotalAfterDiscount.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shippingCost.toFixed(2),
      total: total.toFixed(2)
    });

    // Ajouter la TVA comme un line item séparé dans Stripe
    const finalLineItems = [...lineItems];
    if (tax > 0) {
      finalLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'TVA (20%)',
            description: 'Taxe sur la valeur ajoutée',
          },
          unit_amount: Math.round(tax * 100), // Stripe utilise les centimes
        },
        quantity: 1,
      });
    }

    // Ajouter les frais de livraison comme un line item séparé dans Stripe
    if (shippingCost > 0) {
      // Déterminer le nom du mode de livraison
      let shippingName = 'Frais de livraison';
      if (deliveryMethod === 'colissimo') {
        shippingName = 'Livraison Colissimo';
      } else if (deliveryMethod === 'chrono-classic') {
        shippingName = 'Livraison Chrono Classic';
      } else if (deliveryMethod === 'retrait') {
        shippingName = 'Retrait en magasin';
      }

      finalLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: shippingName,
            description: 'Frais de livraison et expédition',
          },
          unit_amount: Math.round(shippingCost * 100), // Stripe utilise les centimes
        },
        quantity: 1,
      });
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: finalLineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment/cancel`,
      metadata: {
        isRental: isRental ? 'true' : 'false',
        itemsCount: items.length.toString(),
        isMixedCart: isMixedCart ? 'true' : 'false',
        cartType: cartType || 'sale',
        promoCode: promoCode || '',
        promoDiscount: discountAmount.toFixed(2),
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
        // Les personnalisations sont gratuites, pas de prix supplémentaire
        let itemPrice = item.price;
        
        return {
          product: item.productId,
          quantity: item.quantity,
          price: itemPrice, // Prix du produit uniquement (personnalisations gratuites)
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
      promoCode: promoCode || null,
      promoDiscount: discountAmount,
      subtotalAfterDiscount,
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
        let order = await Order.findOne({ stripeSessionId: session.id });
        let rental = await Rental.findOne({ stripeSessionId: session.id });
        
        if (order) {
          // Traitement d'un achat
          order.status = 'paid';
          order.paymentStatus = 'paid';
          order.stripePaymentIntentId = session.payment_intent as string;
          await order.save();
          
          // Incrémenter le compteur de ventes et décrémenter le stock pour chaque produit
          const { Product } = await import('../models/Product');
          for (const item of order.items) {
            // Décrémenter le stock uniquement pour les produits de vente (pas les locations)
            if (!order.isRental) {
              await Product.findByIdAndUpdate(item.product, { 
                $inc: { 
                  salesCount: item.quantity,
                  stockQuantity: -item.quantity // Décrémenter le stock
                } 
              });
            } else {
              // Pour les locations, incrémenter seulement le compteur de ventes
              await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
            }
          }
          
          console.log(`Commande ${order._id} marquée comme payée`);
          
          // Peupler les produits avant d'envoyer la facture
          try {
            const populatedOrder = await Order.findById(order._id).populate('items.product');
            if (populatedOrder) {
              order = populatedOrder;
              console.log('✅ Commande peuplée avec succès pour la génération de la facture');
            } else {
              console.warn('⚠️  Impossible de peupler la commande, utilisation de la commande originale');
            }
          } catch (populateError) {
            console.error('❌ Erreur lors du populate de la commande:', populateError);
            console.warn('⚠️  Continuation avec la commande non peuplée (les noms de produits pourraient être manquants)');
          }
          
          // Envoyer automatiquement la facture par email avec PDF
          try {
            console.log('📧 Envoi facture de vente avec PDF pour la commande:', order._id);
            console.log('📧 Email client:', order.customerEmail);
            
            // Envoyer facture au client avec PDF
            const clientResult = await emailService.sendSaleInvoiceWithPDF(order);
            
            // Envoyer notification admin avec facture PDF
            const adminResult = await emailService.sendAdminInvoiceNotification(order, false);
            
            console.log('📧 Résultats envoi emails:');
            console.log('  - Facture client (avec PDF):', clientResult ? '✅' : '❌');
            console.log('  - Notification admin (avec PDF):', adminResult ? '✅' : '❌');
            
            if (!clientResult) {
              console.error('❌ ÉCHEC envoi facture client - vérifiez la configuration email');
            }
            
            console.log(`✅ Factures PDF envoyées automatiquement pour la commande ${order._id}`);
          } catch (emailError) {
            console.error('❌ Erreur envoi factures PDF:', emailError);
            console.error('❌ Stack trace:', emailError instanceof Error ? emailError.stack : 'N/A');
          }
        } else if (rental) {
          // Traitement d'une location
          rental.status = 'confirmed';
          rental.paymentStatus = 'paid';
          rental.stripePaymentIntentId = session.payment_intent as string;
          await rental.save();
          
          console.log(`Location ${rental._id} confirmée`);
          
          // Peupler les produits avant d'envoyer la facture
          let rentalToUse = rental;
          try {
            const { Rental } = await import('../models/Rental');
            const populatedRental = await Rental.findById(rental._id).populate('items.product');
            if (populatedRental) {
              rentalToUse = populatedRental;
              console.log('✅ Location peuplée avec succès pour la génération de la facture');
            } else {
              console.warn('⚠️  Impossible de peupler la location, utilisation de la location originale');
            }
          } catch (populateError) {
            console.error('❌ Erreur lors du populate de la location:', populateError);
            console.warn('⚠️  Continuation avec la location non peuplée (les noms de produits pourraient être manquants)');
          }
          
          // Envoyer automatiquement la facture de location avec PDF
          try {
            console.log('📧 Envoi facture de location avec PDF pour:', rentalToUse._id);
            console.log('📧 Email client:', rentalToUse.customerEmail);
            
            // Envoyer facture au client avec PDF
            const clientResult = await emailService.sendRentalInvoiceWithPDF(rentalToUse);
            
            // Envoyer notification admin avec facture PDF
            const adminResult = await emailService.sendAdminInvoiceNotification(rentalToUse, true);
            
            console.log('📧 Résultats envoi emails:');
            console.log('  - Facture client (avec PDF):', clientResult ? '✅' : '❌');
            console.log('  - Notification admin (avec PDF):', adminResult ? '✅' : '❌');
            
            if (!clientResult) {
              console.error('❌ ÉCHEC envoi facture client - vérifiez la configuration email');
            }
            
            console.log(`✅ Factures PDF de location envoyées automatiquement pour ${rentalToUse._id}`);
          } catch (emailError) {
            console.error('❌ Erreur envoi factures PDF location:', emailError);
            console.error('❌ Stack trace:', emailError instanceof Error ? emailError.stack : 'N/A');
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

    res.json({ 
      order: {
        _id: order._id,
        orderNumber: order.orderNumber || order._id.toString(),
        user: order.user || {
          email: order.customerEmail || '',
          firstName: order.shippingAddress?.firstName || '',
          lastName: order.shippingAddress?.lastName || ''
        },
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        paymentMethod: order.paymentMethod,
        stripeSessionId: order.stripeSessionId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
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
