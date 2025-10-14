import { Router, Request, Response } from 'express';
import Order from '../models/Order';
import emailService from '../services/emailService';
import puppeteer from 'puppeteer';

const router = Router();

// Générer et envoyer une facture par email
router.post('/:orderId/send', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Préparer les données pour l'email
    const invoiceData = {
      orderNumber: order.orderNumber || order._id.toString(),
      user: {
        email: order.user?.email || 'client@example.com',
        firstName: order.shippingAddress?.firstName,
        lastName: order.shippingAddress?.lastName
      },
      items: order.items.map(item => ({
        product: {
          name: item.product?.name || 'Produit',
          price: item.price
        },
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations,
        customMessage: item.customMessage
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      createdAt: order.createdAt.toISOString()
    };

    // Envoyer l'email de facture
    const emailSent = await emailService.sendInvoiceEmail(invoiceData);

    if (emailSent) {
      res.json({ 
        message: 'Facture envoyée par email avec succès',
        orderNumber: invoiceData.orderNumber
      });
    } else {
      res.status(500).json({ 
        message: 'Erreur lors de l\'envoi de la facture',
        error: 'Service email non configuré'
      });
    }
  } catch (error) {
    console.error('❌ Erreur envoi facture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'envoi de la facture',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Renvoyer une facture par email
router.post('/:orderId/resend', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Préparer les données pour l'email
    const invoiceData = {
      orderNumber: order.orderNumber || order._id.toString(),
      user: {
        email: order.user?.email || 'client@example.com',
        firstName: order.shippingAddress?.firstName,
        lastName: order.shippingAddress?.lastName
      },
      items: order.items.map(item => ({
        product: {
          name: item.product?.name || 'Produit',
          price: item.price
        },
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations,
        customMessage: item.customMessage
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      createdAt: order.createdAt.toISOString()
    };

    // Envoyer l'email de facture
    const emailSent = await emailService.sendInvoiceEmail(invoiceData);

    if (emailSent) {
      res.json({ 
        message: 'Facture renvoyée par email avec succès',
        orderNumber: invoiceData.orderNumber
      });
    } else {
      res.status(500).json({ 
        message: 'Erreur lors de l\'envoi de la facture',
        error: 'Service email non configuré'
      });
    }
  } catch (error) {
    console.error('❌ Erreur renvoi facture:', error);
    res.status(500).json({ 
      message: 'Erreur lors du renvoi de la facture',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Générer un PDF de facture
router.get('/:orderId/pdf', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Générer le HTML de la facture
    const invoiceData = {
      orderNumber: order.orderNumber || order._id.toString(),
      user: {
        email: order.user?.email || 'client@example.com',
        firstName: order.shippingAddress?.firstName,
        lastName: order.shippingAddress?.lastName
      },
      items: order.items.map(item => ({
        product: {
          name: item.product?.name || 'Produit',
          price: item.price
        },
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      createdAt: order.createdAt.toISOString()
    };

    // Vérifier si Puppeteer est disponible
    if (!puppeteer) {
      return res.status(500).json({ 
        message: 'Génération PDF non disponible',
        error: 'Puppeteer non installé'
      });
    }

    // Lancer le navigateur
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Générer le HTML de la facture
    const htmlContent = emailService.generateInvoiceHTML(invoiceData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Générer le PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();

    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${invoiceData.orderNumber}.pdf"`);
    res.send(pdf);

  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la génération du PDF',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Obtenir les détails d'une facture
router.get('/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    res.json({ 
      order: {
        _id: order._id,
        orderNumber: order.orderNumber || order._id.toString(),
        user: order.user,
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
    console.error('❌ Erreur récupération facture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la facture',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Route de test pour les emails
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Test d\'envoi d\'email...');
    
    const testInvoiceData = {
      orderNumber: 'TEST-001',
      user: {
        email: process.env.EMAIL_USER || 'test@example.com',
        firstName: 'Test',
        lastName: 'Client'
      },
      items: [
        {
          product: {
            name: 'Produit de test',
            price: 50
          },
          quantity: 1,
          price: 50
        }
      ],
      subtotal: 50,
      tax: 10,
      shipping: 0,
      total: 60,
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Client',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'France'
      },
      billingAddress: {
        firstName: 'Test',
        lastName: 'Client',
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'France'
      },
      createdAt: new Date().toISOString()
    };

    const result = await emailService.sendOrderConfirmationEmail(testInvoiceData);
    
    res.json({ 
      success: result, 
      message: result ? 'Email de test envoyé avec succès' : 'Échec de l\'envoi de l\'email de test',
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? 'Configuré' : 'Manquant',
        adminEmail: process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du test d\'email',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

export default router;
