import sgMail from '@sendgrid/mail';
import { InvoiceService } from './invoiceService';

// Configuration SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configuré');
} else {
  console.warn('⚠️  SENDGRID_API_KEY non configuré');
}

export class SendGridEmailService {
  private static senderEmail = process.env.SENDER_EMAIL || 'noreply@sakadeco.fr';
  private static adminEmail = process.env.ADMIN_EMAIL || 'admin@sakadeco.fr';

  // Vérifier si SendGrid est configuré
  static isConfigured(): boolean {
    return !!process.env.SENDGRID_API_KEY;
  }

  // Envoyer facture de vente avec PDF
  static async sendSaleInvoiceWithPDF(order: any): Promise<boolean> {
    console.log('📧 SendGrid - Envoi facture de vente avec PDF...');
    
    if (!this.isConfigured()) {
      console.warn('⚠️  SendGrid non configuré - facture non envoyée');
      return false;
    }

    try {
      // Générer la facture PDF
      const invoicePDF = await InvoiceService.generateInvoiceForOrder(order);
      
      const msg = {
        to: order.customerEmail,
        from: {
          email: this.senderEmail,
          name: 'SAKADECO'
        },
        subject: `🧾 Facture de votre commande - ${order._id}`,
        html: this.generateSaleInvoiceHTML(order),
        attachments: [{
          content: invoicePDF.toString('base64'),
          filename: `Facture_${order._id}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      };

      await sgMail.send(msg);
      console.log('✅ Facture de vente envoyée via SendGrid');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi facture SendGrid:', error);
      return false;
    }
  }

  // Envoyer facture de location avec PDF
  static async sendRentalInvoiceWithPDF(rental: any): Promise<boolean> {
    console.log('📧 SendGrid - Envoi facture de location avec PDF...');
    
    if (!this.isConfigured()) {
      console.warn('⚠️  SendGrid non configuré - facture non envoyée');
      return false;
    }

    try {
      // Générer la facture PDF
      const invoicePDF = await InvoiceService.generateInvoiceForRental(rental);
      
      const msg = {
        to: rental.customerEmail,
        from: {
          email: this.senderEmail,
          name: 'SAKADECO'
        },
        subject: `🏠 Facture de votre location - ${rental._id}`,
        html: this.generateRentalInvoiceHTML(rental),
        attachments: [{
          content: invoicePDF.toString('base64'),
          filename: `Facture_Location_${rental._id}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      };

      await sgMail.send(msg);
      console.log('✅ Facture de location envoyée via SendGrid');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi facture location SendGrid:', error);
      return false;
    }
  }

  // Envoyer notification admin avec facture PDF
  static async sendAdminInvoiceNotification(order: any, isRental: boolean = false): Promise<boolean> {
    console.log('📧 SendGrid - Envoi notification admin avec PDF...');
    
    if (!this.isConfigured()) {
      console.warn('⚠️  SendGrid non configuré - notification non envoyée');
      return false;
    }

    try {
      // Générer la facture PDF
      const invoicePDF = isRental 
        ? await InvoiceService.generateInvoiceForRental(order)
        : await InvoiceService.generateInvoiceForOrder(order);
      
      const msg = {
        to: this.adminEmail,
        from: {
          email: this.senderEmail,
          name: 'SAKADECO'
        },
        subject: `📋 Nouvelle ${isRental ? 'location' : 'commande'} - ${order._id}`,
        html: this.generateAdminNotificationHTML(order, isRental),
        attachments: [{
          content: invoicePDF.toString('base64'),
          filename: `Facture_${isRental ? 'Location' : 'Commande'}_${order._id}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      };

      await sgMail.send(msg);
      console.log(`✅ Notification admin ${isRental ? 'location' : 'commande'} envoyée via SendGrid`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur envoi notification admin SendGrid:`, error);
      return false;
    }
  }

  // Template HTML pour facture de vente
  private static generateSaleInvoiceHTML(order: any): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture de commande</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .invoice-icon { font-size: 48px; margin-bottom: 10px; }
          .order-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="invoice-icon">🧾</div>
            <h1>Facture de votre commande</h1>
            <p>Merci pour votre confiance !</p>
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            
            <p>Votre commande a été confirmée ! Vous trouverez votre facture en pièce jointe.</p>
            
            <div class="order-details">
              <h3>Détails de la commande</h3>
              <p><strong>Numéro de commande:</strong> ${order._id}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
              <p><strong>Articles:</strong> ${order.items.length} produit(s)</p>
            </div>
            
            <p>Merci pour votre confiance !</p>
            <p>L'équipe SAKADECO</p>
          </div>
          
          <div class="footer">
            <p>SAKADECO - Décoration et aménagement intérieur</p>
            <p>Email: contact@sakadeco.fr | Tél: +33 1 23 45 67 89</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template HTML pour facture de location
  private static generateRentalInvoiceHTML(rental: any): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture de location</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .invoice-icon { font-size: 48px; margin-bottom: 10px; }
          .rental-details { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="invoice-icon">🏠</div>
            <h1>Facture de votre location</h1>
            <p>Merci pour votre confiance !</p>
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            
            <p>Votre location a été confirmée ! Vous trouverez votre facture en pièce jointe.</p>
            
            <div class="rental-details">
              <h3>Détails de la location</h3>
              <p><strong>Numéro de location:</strong> ${rental._id}</p>
              <p><strong>Date:</strong> ${new Date(rental.createdAt).toLocaleDateString('fr-FR')}</p>
              <p><strong>Total:</strong> ${rental.total.toFixed(2)}€</p>
              <p><strong>Dépôt de garantie:</strong> ${rental.deposit.toFixed(2)}€</p>
              <p><strong>Articles:</strong> ${rental.items.length} produit(s)</p>
            </div>
            
            <p>Merci pour votre confiance !</p>
            <p>L'équipe SAKADECO</p>
          </div>
          
          <div class="footer">
            <p>SAKADECO - Décoration et aménagement intérieur</p>
            <p>Email: contact@sakadeco.fr | Tél: +33 1 23 45 67 89</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Template HTML pour notification admin
  private static generateAdminNotificationHTML(order: any, isRental: boolean): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle ${isRental ? 'location' : 'commande'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .notification-icon { font-size: 48px; margin-bottom: 10px; }
          .order-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="notification-icon">📋</div>
            <h1>Nouvelle ${isRental ? 'location' : 'commande'} !</h1>
            <p>Notification automatique</p>
          </div>
          
          <div class="content">
            <p>Bonjour Admin,</p>
            
            <p>Une nouvelle ${isRental ? 'location' : 'commande'} vient d'être confirmée.</p>
            
            <div class="order-details">
              <h3>Détails de la ${isRental ? 'location' : 'commande'}</h3>
              <p><strong>Numéro:</strong> ${order._id}</p>
              <p><strong>Client:</strong> ${order.customerEmail}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
              <p><strong>Articles:</strong> ${order.items.length} produit(s)</p>
            </div>
            
            <p>La facture est jointe à cet email.</p>
          </div>
          
          <div class="footer">
            <p>SAKADECO - Système de notification automatique</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
