import { createTransport } from 'nodemailer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import pdfService from './pdfService';
import { InvoiceService } from './invoiceService';

// Logo SKD GROUP en base64 (SVG)
const SKD_LOGO_BASE64 = `data:image/svg+xml;base64,${Buffer.from(`<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="300" height="200" fill="#faf9f6"/>
  
  <!-- Balloons -->
  <!-- Left balloon (pink) -->
  <ellipse cx="60" cy="40" rx="15" ry="20" fill="#ffb6c1" stroke="#d4af37" stroke-width="1"/>
  <line x1="60" y1="60" x2="60" y2="80" stroke="#d4af37" stroke-width="1"/>
  
  <!-- Right balloon (teal) -->
  <ellipse cx="90" cy="40" rx="15" ry="20" fill="#98d8c8" stroke="#d4af37" stroke-width="1"/>
  <line x1="90" y1="60" x2="90" y2="80" stroke="#d4af37" stroke-width="1"/>
  
  <!-- Floral branch -->
  <g stroke="#d4af37" stroke-width="1" fill="none">
    <!-- Main stem -->
    <path d="M 120 80 Q 140 60 160 40"/>
    
    <!-- Flowers -->
    <g fill="#ffb6c1">
      <circle cx="150" cy="35" r="8"/>
      <circle cx="165" cy="25" r="6"/>
    </g>
    
    <!-- Leaves -->
    <g fill="#98d8c8">
      <ellipse cx="135" cy="50" rx="4" ry="8" transform="rotate(-30 135 50)"/>
      <ellipse cx="145" cy="45" rx="3" ry="6" transform="rotate(20 145 45)"/>
      <ellipse cx="155" cy="55" rx="4" ry="7" transform="rotate(-15 155 55)"/>
    </g>
  </g>
  
  <!-- SKD text -->
  <text x="150" y="120" font-family="cursive, serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#d4af37">SKD</text>
  
  <!-- GROUP text -->
  <text x="150" y="145" font-family="Arial, sans-serif" font-size="16" font-weight="normal" text-anchor="middle" fill="#98d8c8">GROUP</text>
</svg>`).toString('base64')}`;

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface InvoiceData {
  orderNumber: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
    customizations?: any;
    customMessage?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

class EmailService {
  private transporter: any = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Configuration pour Gmail (vous pouvez changer pour un autre service)
    const emailConfig: EmailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    };

    console.log('📧 Configuration email:');
    console.log('  - Host:', emailConfig.host);
    console.log('  - Port:', emailConfig.port);
    console.log('  - User:', emailConfig.auth.user);
    console.log('  - Pass:', emailConfig.auth.pass ? 'Configuré' : 'Manquant');

    // Vérifier si les variables d'environnement sont configurées
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      console.warn('⚠️  Configuration email manquante - les emails ne seront pas envoyés');
      return;
    }

    try {
      this.transporter = createTransport(emailConfig);
      
      // Configuration de l'avatar de l'expéditeur
      this.setupSenderAvatar();
      
      console.log('✅ Service email initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation service email:', error);
    }
  }

  private async setupSenderAvatar() {
    try {
      // Configuration de l'avatar pour Gmail
      if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
        console.log('📧 Configuration avatar expéditeur pour Gmail...');
        
        // Note: L'avatar Gmail est généralement configuré via le profil Google
        // Mais nous pouvons essayer de configurer via les en-têtes
        console.log('💡 Pour un avatar personnalisé, configurez votre photo de profil Gmail');
        console.log('💡 Ou utilisez un service comme Gravatar avec votre email');
      }
    } catch (error) {
      console.error('❌ Erreur configuration avatar:', error);
    }
  }

  private generateInvoiceHTML(invoice: InvoiceData): string {
    const itemsHTML = invoice.items.map(item => {
      let customizationHTML = '';
      if (item.customizations && Object.keys(item.customizations).length > 0) {
        customizationHTML = `
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            <strong>Personnalisations:</strong>
            <ul style="margin: 4px 0; padding-left: 16px;">
              ${Object.entries(item.customizations).map(([key, value]) => `
                <li><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>
              `).join('')}
            </ul>
          </div>
        `;
      }
      
      let messageHTML = '';
      if (item.customMessage) {
        messageHTML = `
          <div style="margin-top: 4px; font-size: 12px; color: #6b7280;">
            <strong>Message:</strong> ${item.customMessage}
          </div>
        `;
      }

      return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: left;">
            <div style="font-weight: 500; color: #1f2937;">${item.product.name}</div>
            ${customizationHTML}
            ${messageHTML}
          </td>
          <td style="padding: 12px; text-align: center; color: #6b7280;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right; color: #6b7280;">${item.price.toFixed(2)}€</td>
          <td style="padding: 12px; text-align: right; font-weight: 500; color: #1f2937;">
            ${(item.price * item.quantity).toFixed(2)}€
          </td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture SakaDeco - ${invoice.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 30px; }
          .invoice-details { margin-bottom: 30px; }
          .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .address { flex: 1; margin: 0 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background-color: #f9fafb; padding: 12px; text-align: left; font-weight: bold; }
          .totals { text-align: right; margin-bottom: 30px; }
          .total-row { border-top: 2px solid #e5e7eb; padding-top: 10px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #059669; margin-bottom: 10px;">SakaDeco</h1>
            <p style="color: #6b7280; margin: 0;">Décoration et aménagement</p>
          </div>

          <div class="company-info">
            <p style="margin: 5px 0; color: #6b7280;">123 Rue de la Décoration</p>
            <p style="margin: 5px 0; color: #6b7280;">75001 Paris, France</p>
            <p style="margin: 5px 0; color: #6b7280;">contact@sakadeco.com</p>
          </div>

          <div class="invoice-details">
            <h2 style="color: #1f2937; margin-bottom: 20px;">FACTURE</h2>
            <p style="margin: 5px 0; color: #6b7280;"><strong>N° ${invoice.orderNumber}</strong></p>
            <p style="margin: 5px 0; color: #6b7280;">
              Date: ${format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>

          <div class="addresses">
            <div class="address">
              <h3 style="color: #1f2937; margin-bottom: 10px;">Adresse de facturation</h3>
              <p style="margin: 5px 0; color: #6b7280;">
                ${invoice.billingAddress.firstName} ${invoice.billingAddress.lastName}
              </p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.billingAddress.address}</p>
              <p style="margin: 5px 0; color: #6b7280;">
                ${invoice.billingAddress.postalCode} ${invoice.billingAddress.city}
              </p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.billingAddress.country}</p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.user.email}</p>
            </div>
            <div class="address">
              <h3 style="color: #1f2937; margin-bottom: 10px;">Adresse de livraison</h3>
              <p style="margin: 5px 0; color: #6b7280;">
                ${invoice.shippingAddress.firstName} ${invoice.shippingAddress.lastName}
              </p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.shippingAddress.address}</p>
              <p style="margin: 5px 0; color: #6b7280;">
                ${invoice.shippingAddress.postalCode} ${invoice.shippingAddress.city}
              </p>
              <p style="margin: 5px 0; color: #6b7280;">${invoice.shippingAddress.country}</p>
            </div>
          </div>

          <h3 style="color: #1f2937; margin-bottom: 15px;">Détails de la commande</h3>
          <table>
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left;">Produit</th>
                <th style="padding: 12px; text-align: center;">Quantité</th>
                <th style="padding: 12px; text-align: right;">Prix unitaire</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="totals">
            <p style="margin: 5px 0;"><span style="color: #6b7280;">Sous-total:</span> 
              <span style="font-weight: 500; margin-left: 20px;">${invoice.subtotal.toFixed(2)}€</span>
            </p>
            <p style="margin: 5px 0;"><span style="color: #6b7280;">TVA (20%):</span> 
              <span style="font-weight: 500; margin-left: 20px;">${invoice.tax.toFixed(2)}€</span>
            </p>
            <p style="margin: 5px 0;"><span style="color: #6b7280;">Livraison:</span> 
              <span style="font-weight: 500; margin-left: 20px;">${invoice.shipping.toFixed(2)}€</span>
            </p>
            <div class="total-row">
              <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #1f2937;">
                <span>Total:</span> 
                <span style="margin-left: 20px;">${invoice.total.toFixed(2)}€</span>
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin-bottom: 10px; color: #6b7280;">Merci pour votre confiance !</p>
            <p style="margin: 5px 0; font-size: 14px; color: #6b7280;">
              Pour toute question, contactez-nous à contact@sakadeco.com
            </p>
            <p style="margin: 5px 0; font-size: 12px; color: #9ca3af;">
              Facture générée le ${format(new Date(invoice.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendInvoiceEmail(invoice: InvoiceData): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - email non envoyé');
      return false;
    }

    try {
      console.log('📧 Envoi email facture à:', invoice.user.email);
      console.log('📧 Données de facture:', JSON.stringify(invoice, null, 2));
      
      // Générer le PDF de la facture
      console.log('📄 Génération du PDF de la facture...');
      const pdfBuffer = await pdfService.generateInvoicePDF(invoice);
      console.log('📄 PDF généré, taille:', pdfBuffer.length, 'bytes');
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: invoice.customerEmail,
        subject: `Facture SakaDeco - Commande ${invoice.orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Facture ${invoice.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { color: #059669; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SakaDeco Group</div>
                <h1>Votre facture</h1>
              </div>
              
              <p>Bonjour ${invoice.user.firstName || 'Client'},</p>
              
              <p>Veuillez trouver ci-joint votre facture pour la commande <strong>${invoice.orderNumber}</strong>.</p>
              
              <div class="order-details">
                <h3>Résumé de la commande</h3>
                <p><strong>Numéro de commande:</strong> ${invoice.orderNumber}</p>
                <p><strong>Date:</strong> ${format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                <p><strong>Total:</strong> ${invoice.total.toFixed(2)}€</p>
              </div>
              
              <p>La facture PDF est jointe à cet email pour votre référence.</p>
              
              <p>Cordialement,<br>L'équipe SakaDeco</p>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: `facture-${invoice.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ],
        headers: {
          'X-Entity-Ref-ID': 'skd-group-logo'
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de facture avec PDF envoyé:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email facture:', error);
      return false;
    }
  }

  async sendOrderConfirmationEmail(invoice: InvoiceData): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - email non envoyé');
      return false;
    }

    try {
      console.log('📧 Envoi email confirmation à:', invoice.customerEmail);
      
      let pdfBuffer: Buffer | null = null;
      let hasPDF = false;
      
      // Essayer de générer le PDF
      try {
        console.log('📄 Génération du PDF de la facture pour confirmation...');
        pdfBuffer = await pdfService.generateInvoicePDF(invoice);
        console.log('📄 PDF généré pour confirmation, taille:', pdfBuffer.length, 'bytes');
        hasPDF = true;
      } catch (pdfError) {
        console.warn('⚠️  Impossible de générer le PDF, envoi email sans PDF:', pdfError.message);
        hasPDF = false;
      }
      
      const mailOptions: any = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: invoice.customerEmail,
        subject: `Confirmation de commande - ${invoice.orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation de commande</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .success { color: #059669; font-size: 24px; margin-bottom: 10px; }
              .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .warning { background-color: #fef3cd; border: 1px solid #fecaca; padding: 10px; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="success">✅</div>
                <h1 style="color: #059669;">Commande confirmée !</h1>
              </div>
              
              <p>Bonjour ${invoice.user.firstName || 'Client'},</p>
              
              <p>Nous vous remercions pour votre commande. Votre paiement a été traité avec succès.</p>
              
              <div class="order-details">
                <h3>Détails de la commande</h3>
                <p><strong>Numéro de commande:</strong> ${invoice.orderNumber}</p>
                <p><strong>Date:</strong> ${format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                <p><strong>Total:</strong> ${invoice.total.toFixed(2)}€</p>
              </div>
              
              ${hasPDF ? 
                '<p><strong>Votre facture PDF est jointe à cet email.</strong></p>' :
                '<div class="warning"><p><strong>Note:</strong> La facture PDF sera disponible en ligne. Veuillez consulter le lien ci-dessous.</p></div>'
              }
              
              <p>Vous pouvez consulter votre facture en ligne :</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/invoice/${invoice.orderNumber}" 
                 class="button">Voir ma facture en ligne</a>
              
              <p>Nous vous tiendrons informé du statut de votre commande.</p>
              
              <p>Cordialement,<br>L'équipe SakaDeco</p>
            </div>
          </body>
          </html>
        `
      };

      // Ajouter le PDF en pièce jointe seulement s'il a été généré avec succès
      if (hasPDF && pdfBuffer) {
        mailOptions.attachments = [
          {
            filename: `facture-${invoice.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ];
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de confirmation ${hasPDF ? 'avec PDF' : 'sans PDF'} envoyé:`, info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email confirmation:', error);
      return false;
    }
  }

  async sendAdminNotificationEmail(invoice: InvoiceData): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - notification admin non envoyée');
      return false;
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      console.log('📧 Envoi notification admin à:', adminEmail);
      
      let pdfBuffer: Buffer | null = null;
      let hasPDF = false;
      
      // Essayer de générer le PDF pour l'admin
      try {
        console.log('📄 Génération du PDF de la facture pour l\'admin...');
        pdfBuffer = await pdfService.generateInvoicePDF(invoice);
        console.log('📄 PDF généré pour admin, taille:', pdfBuffer.length, 'bytes');
        hasPDF = true;
      } catch (pdfError) {
        console.warn('⚠️  Impossible de générer le PDF pour admin, envoi email sans PDF:', pdfError.message);
        hasPDF = false;
      }
      
      const mailOptions: any = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: adminEmail, // L'admin reçoit la notification sur son email
        subject: `🆕 Nouvelle commande reçue - ${invoice.orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle commande</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .notification { color: #3b82f6; font-size: 24px; margin-bottom: 10px; }
              .order-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .items-list { margin: 10px 0; }
              .item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
              .customization { background-color: #e0f2fe; padding: 10px; border-radius: 6px; margin: 8px 0; }
              .custom-image { max-width: 200px; max-height: 200px; border-radius: 8px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="notification">🆕</div>
                <h1 style="color: #3b82f6;">Nouvelle commande reçue !</h1>
              </div>
              
              <p>Bonjour Admin,</p>
              
              <p>Une nouvelle commande vient d'être effectuée sur SakaDeco.</p>
              
              <div class="order-details">
                <h3>Détails de la commande</h3>
                <p><strong>Numéro de commande:</strong> ${invoice.orderNumber}</p>
                <p><strong>Date:</strong> ${format(new Date(invoice.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Client:</strong> ${invoice.user.firstName || ''} ${invoice.user.lastName || ''} (${invoice.user.email})</p>
                <p><strong>Total:</strong> ${invoice.total.toFixed(2)}€</p>
                
                <h4>Produits commandés:</h4>
                <div class="items-list">
                  ${invoice.items.map(item => {
                    let customizationHTML = '';
                    let customImageHTML = '';
                    
                    if (item.customizations && Object.keys(item.customizations).length > 0) {
                      customizationHTML = `
                        <div class="customization">
                          <strong>Personnalisations:</strong>
                          <ul style="margin: 5px 0; padding-left: 20px;">
                            ${Object.entries(item.customizations).map(([key, value]) => {
                              if (typeof value === 'object' && value.type === 'text' && value.value) {
                                return `<li><strong>${key.replace(/_/g, ' ')} (texte):</strong> ${value.value}</li>`;
                              } else if (typeof value === 'object' && value.type === 'image' && value.value) {
                                customImageHTML = `<img src="${value.value}" alt="Image personnalisée" class="custom-image" />`;
                                return `<li><strong>${key.replace(/_/g, ' ')} (image):</strong> Image téléchargée</li>`;
                              } else if (typeof value === 'string') {
                                return `<li><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`;
                              }
                              return '';
                            }).join('')}
                          </ul>
                          ${customImageHTML}
                        </div>
                      `;
                    }
                    
                    return `
                      <div class="item">
                        <strong>${item.product.name}</strong> - Quantité: ${item.quantity} - Prix: ${item.price.toFixed(2)}€
                        ${customizationHTML}
                        ${item.customMessage ? `<br><strong>Message:</strong> ${item.customMessage}` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
                
                <h4>Adresse de livraison:</h4>
                <p>${invoice.shippingAddress.firstName} ${invoice.shippingAddress.lastName}</p>
                <p>${invoice.shippingAddress.address}</p>
                <p>${invoice.shippingAddress.postalCode} ${invoice.shippingAddress.city}</p>
                <p>${invoice.shippingAddress.country}</p>
              </div>
              
              <p>Vous pouvez gérer cette commande en cliquant sur le bouton ci-dessous :</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin/orders" 
                 class="button">Gérer les commandes</a>
              
              ${hasPDF ? 
                '<p>La facture PDF est jointe à cet email pour votre référence.</p>' :
                '<p><strong>Note:</strong> La facture PDF sera disponible via le lien ci-dessus.</p>'
              }
              
              <p>Cordialement,<br>Système SakaDeco</p>
            </div>
          </body>
          </html>
        `
      };

      // Ajouter le PDF en pièce jointe seulement s'il a été généré avec succès
      if (hasPDF && pdfBuffer) {
        mailOptions.attachments = [
          {
            filename: `facture-admin-${invoice.orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ];
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Notification admin ${hasPDF ? 'avec PDF' : 'sans PDF'} envoyée:`, info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi notification admin:', error);
      return false;
    }
  }

  async sendRentalConfirmationEmail(rental: any): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - email location non envoyé');
      return false;
    }

    try {
      console.log('📧 Envoi email confirmation location à:', rental.user.email);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: rental.user.email,
        subject: `Confirmation de location - ${rental.orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation de location</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .success { color: #059669; font-size: 24px; margin-bottom: 10px; }
              .rental-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="success">✅</div>
                <h1 style="color: #059669;">Location confirmée !</h1>
              </div>
              
              <p>Bonjour ${rental.user.firstName || 'Client'},</p>
              
              <p>Nous vous remercions pour votre location. Votre paiement a été traité avec succès.</p>
              
              <div class="rental-details">
                <h3>Détails de la location</h3>
                <p><strong>Numéro de location:</strong> ${rental.orderNumber}</p>
                <p><strong>Date:</strong> ${format(new Date(rental.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                <p><strong>Total:</strong> ${rental.total.toFixed(2)}€</p>
                <p><strong>Dépôt:</strong> ${rental.deposit.toFixed(2)}€</p>
              </div>
              
              <p>Votre location sera préparée et livrée selon les dates convenues.</p>
              
              <p>Cordialement,<br>L'équipe SakaDeco</p>
            </div>
          </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de confirmation location envoyé:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email confirmation location:', error);
      return false;
    }
  }

  async sendRentalAdminNotificationEmail(rental: any): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - notification admin location non envoyée');
      return false;
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      console.log('📧 Envoi notification admin location à:', adminEmail);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: adminEmail,
        subject: `🏠 Nouvelle location reçue - ${rental.orderNumber}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle location</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .notification { color: #3b82f6; font-size: 24px; margin-bottom: 10px; }
              .rental-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .items-list { margin: 10px 0; }
              .item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="notification">🏠</div>
                <h1 style="color: #3b82f6;">Nouvelle location reçue !</h1>
              </div>
              
              <p>Bonjour Admin,</p>
              
              <p>Une nouvelle location vient d'être effectuée sur SakaDeco.</p>
              
              <div class="rental-details">
                <h3>Détails de la location</h3>
                <p><strong>Numéro de location:</strong> ${rental.orderNumber}</p>
                <p><strong>Date:</strong> ${format(new Date(rental.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Client:</strong> ${rental.user.firstName || ''} ${rental.user.lastName || ''} (${rental.user.email})</p>
                <p><strong>Total:</strong> ${rental.total.toFixed(2)}€</p>
                <p><strong>Dépôt:</strong> ${rental.deposit.toFixed(2)}€</p>
                
                <h4>Produits loués:</h4>
                <div class="items-list">
                  ${rental.items.map(item => `
                    <div class="item">
                      <strong>${item.product.name}</strong> - Quantité: ${item.quantity} - ${item.rentalDays} jours
                      <br>Du ${format(new Date(item.rentalStartDate), 'dd/MM/yyyy', { locale: fr })} au ${format(new Date(item.rentalEndDate), 'dd/MM/yyyy', { locale: fr })}
                      <br>Prix: ${item.totalPrice.toFixed(2)}€
                    </div>
                  `).join('')}
                </div>
                
                <h4>Adresse de livraison:</h4>
                <p>${rental.shippingAddress.firstName} ${rental.shippingAddress.lastName}</p>
                <p>${rental.shippingAddress.address}</p>
                <p>${rental.shippingAddress.postalCode} ${rental.shippingAddress.city}</p>
                <p>${rental.shippingAddress.country}</p>
              </div>
              
              <p>Vous pouvez gérer cette location en cliquant sur le bouton ci-dessous :</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin/rentals" 
                 class="button">Gérer les locations</a>
              
              <p>Cordialement,<br>Système SakaDeco</p>
            </div>
          </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Notification admin location envoyée:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi notification admin location:', error);
      return false;
    }
  }

  async sendQuoteConfirmationEmail(quote: any): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - confirmation devis non envoyée');
      return false;
    }

    try {
      console.log('📧 Envoi confirmation devis à:', quote.customerEmail);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: quote.customerEmail,
        subject: `📋 Demande de devis reçue - ${quote.service}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Demande de devis reçue</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .confirmation { color: #10b981; font-size: 24px; margin-bottom: 10px; }
              .quote-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .service-badge { display: inline-block; background-color: #3b82f6; color: white; 
                              padding: 4px 12px; border-radius: 20px; font-size: 14px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="confirmation">📋</div>
                <h1 style="color: #10b981;">Demande de devis reçue !</h1>
              </div>
              
              <p>Bonjour ${quote.customerName},</p>
              
              <p>Nous avons bien reçu votre demande de devis et nous vous en remercions.</p>
              
              <div class="quote-details">
                <div class="service-badge">${quote.service}</div>
                <h3>Récapitulatif de votre demande</h3>
                <p><strong>Nom:</strong> ${quote.customerName}</p>
                <p><strong>Email:</strong> ${quote.customerEmail}</p>
                ${quote.customerPhone ? `<p><strong>Téléphone:</strong> ${quote.customerPhone}</p>` : ''}
                ${quote.eventDate ? `<p><strong>Date d'événement:</strong> ${format(new Date(quote.eventDate), 'dd MMMM yyyy', { locale: fr })}</p>` : ''}
                ${quote.budget ? `<p><strong>Budget:</strong> ${quote.budget}</p>` : ''}
                <p><strong>Description:</strong></p>
                <p style="background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                  ${quote.description}
                </p>
              </div>
              
              <p><strong>Prochaines étapes :</strong></p>
              <ul>
                <li>Notre équipe va analyser votre demande</li>
                <li>Nous vous recontactons sous 24h ouvrées</li>
                <li>Nous vous proposerons un devis personnalisé</li>
              </ul>
              
              <p>En attendant, n'hésitez pas à nous contacter au <strong>06 88 00 39 28</strong> si vous avez des questions.</p>
              
              <p>Cordialement,<br>L'équipe SakaDeco</p>
            </div>
          </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Confirmation devis envoyée:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi confirmation devis:', error);
      return false;
    }
  }

  async sendQuoteAdminNotificationEmail(quote: any): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - notification admin devis non envoyée');
      return false;
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      console.log('📧 Envoi notification admin devis à:', adminEmail);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: adminEmail,
        subject: `📋 Nouvelle demande de devis - ${quote.service}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle demande de devis</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .notification { color: #3b82f6; font-size: 24px; margin-bottom: 10px; }
              .quote-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .service-badge { display: inline-block; background-color: #3b82f6; color: white; 
                              padding: 4px 12px; border-radius: 20px; font-size: 14px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="notification">📋</div>
                <h1 style="color: #3b82f6;">Nouvelle demande de devis !</h1>
              </div>
              
              <p>Bonjour Admin,</p>
              
              <p>Une nouvelle demande de devis vient d'être reçue sur SakaDeco.</p>
              
              <div class="quote-details">
                <div class="service-badge">${quote.service}</div>
                <h3>Détails de la demande</h3>
                <p><strong>Date:</strong> ${format(new Date(quote.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Client:</strong> ${quote.customerName}</p>
                <p><strong>Email:</strong> ${quote.customerEmail}</p>
                ${quote.customerPhone ? `<p><strong>Téléphone:</strong> ${quote.customerPhone}</p>` : ''}
                ${quote.eventDate ? `<p><strong>Date d'événement:</strong> ${format(new Date(quote.eventDate), 'dd MMMM yyyy', { locale: fr })}</p>` : ''}
                ${quote.budget ? `<p><strong>Budget:</strong> ${quote.budget}</p>` : ''}
                <p><strong>Description:</strong></p>
                <p style="background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                  ${quote.description}
                </p>
              </div>
              
              <p>Vous pouvez gérer cette demande en cliquant sur le bouton ci-dessous :</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin/quotes" 
                 class="button">Gérer les devis</a>
              
              <p>Cordialement,<br>Système SakaDeco</p>
            </div>
          </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Notification admin devis envoyée:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi notification admin devis:', error);
      return false;
    }
  }

  // Envoyer facture de vente avec PDF
  async sendSaleInvoiceWithPDF(order: any): Promise<boolean> {
    console.log('📧 Tentative d\'envoi facture de vente avec PDF...');
    console.log('📧 Transporter disponible:', !!this.transporter);
    console.log('📧 Email client:', order.customerEmail);
    
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - facture de vente non envoyée');
      console.warn('⚠️  Vérifiez les variables d\'environnement EMAIL_* sur Render');
      return false;
    }

    try {
      console.log('📧 Génération et envoi facture de vente avec PDF...');
      
      // Générer la facture PDF
      const invoicePDF = await InvoiceService.generateInvoiceForOrder(order);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: order.customerEmail,
        subject: `🧾 Facture de votre commande - ${order._id}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Facture de commande</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-icon { color: #10b981; font-size: 24px; margin-bottom: 10px; }
              .order-details { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="invoice-icon">🧾</div>
                <h1 style="color: #10b981;">Facture de votre commande</h1>
              </div>
              
              <p>Bonjour,</p>
              
              <p>Votre commande a été confirmée ! Vous trouverez votre facture en pièce jointe.</p>
              
              <div class="order-details">
                <h3>Détails de la commande</h3>
                <p><strong>Numéro de commande:</strong> ${order._id}</p>
                <p><strong>Date:</strong> ${format(new Date(order.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
                <p><strong>Articles:</strong> ${order.items.length} produit(s)</p>
              </div>
              
              <p>Merci pour votre confiance !</p>
              
              <p>L'équipe SakaDeco</p>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: `Facture_${order._id}.pdf`,
            content: invoicePDF,
            contentType: 'application/pdf'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Facture de vente envoyée avec PDF');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi facture de vente:', error);
      return false;
    }
  }

  // Envoyer facture de location avec PDF
  async sendRentalInvoiceWithPDF(rental: any): Promise<boolean> {
    console.log('📧 Tentative d\'envoi facture de location avec PDF...');
    console.log('📧 Transporter disponible:', !!this.transporter);
    console.log('📧 Email client:', rental.customerEmail);
    
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - facture de location non envoyée');
      console.warn('⚠️  Vérifiez les variables d\'environnement EMAIL_* sur Render');
      return false;
    }

    try {
      console.log('📧 Génération et envoi facture de location avec PDF...');
      
      // Générer la facture PDF
      const invoicePDF = await InvoiceService.generateInvoiceForRental(rental);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: rental.customerEmail,
        subject: `🏠 Facture de votre location - ${rental._id}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Facture de location</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-icon { color: #f59e0b; font-size: 24px; margin-bottom: 10px; }
              .rental-details { background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #f59e0b; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="invoice-icon">🏠</div>
                <h1 style="color: #f59e0b;">Facture de votre location</h1>
              </div>
              
              <p>Bonjour,</p>
              
              <p>Votre location a été confirmée ! Vous trouverez votre facture en pièce jointe.</p>
              
              <div class="rental-details">
                <h3>Détails de la location</h3>
                <p><strong>Numéro de location:</strong> ${rental._id}</p>
                <p><strong>Date:</strong> ${format(new Date(rental.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Total:</strong> ${rental.total.toFixed(2)}€</p>
                <p><strong>Dépôt de garantie:</strong> ${rental.deposit.toFixed(2)}€</p>
                <p><strong>Articles:</strong> ${rental.items.length} produit(s)</p>
              </div>
              
              <p>Merci pour votre confiance !</p>
              
              <p>L'équipe SakaDeco</p>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: `Facture_Location_${rental._id}.pdf`,
            content: invoicePDF,
            contentType: 'application/pdf'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Facture de location envoyée avec PDF');
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi facture de location:', error);
      return false;
    }
  }

  // Envoyer notification admin avec facture PDF
  async sendAdminInvoiceNotification(order: any, isRental: boolean = false): Promise<boolean> {
    console.log('📧 Tentative d\'envoi notification admin avec PDF...');
    console.log('📧 Transporter disponible:', !!this.transporter);
    console.log('📧 Type:', isRental ? 'location' : 'commande');
    
    if (!this.transporter) {
      console.warn('⚠️  Service email non configuré - notification admin facture non envoyée');
      console.warn('⚠️  Vérifiez les variables d\'environnement EMAIL_* sur Render');
      return false;
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      console.log('📧 Envoi notification admin facture à:', adminEmail);
      
      // Générer la facture PDF
      const invoicePDF = isRental 
        ? await InvoiceService.generateInvoiceForRental(order)
        : await InvoiceService.generateInvoiceForOrder(order);
      
      const mailOptions = {
        from: {
          name: "SakaDeco Group",
          address: process.env.EMAIL_USER || ''
        },
        to: adminEmail,
        subject: `📋 Nouvelle ${isRental ? 'location' : 'commande'} - ${order._id}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouvelle ${isRental ? 'location' : 'commande'}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .notification { color: #3b82f6; font-size: 24px; margin-bottom: 10px; }
              .order-details { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="notification">📋</div>
                <h1 style="color: #3b82f6;">Nouvelle ${isRental ? 'location' : 'commande'} !</h1>
              </div>
              
              <p>Bonjour Admin,</p>
              
              <p>Une nouvelle ${isRental ? 'location' : 'commande'} vient d'être confirmée.</p>
              
              <div class="order-details">
                <h3>Détails de la ${isRental ? 'location' : 'commande'}</h3>
                <p><strong>Numéro:</strong> ${order._id}</p>
                <p><strong>Client:</strong> ${order.customerEmail}</p>
                <p><strong>Date:</strong> ${format(new Date(order.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
                <p><strong>Articles:</strong> ${order.items.length} produit(s)</p>
              </div>
              
              <p>La facture est jointe à cet email.</p>
            </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: `Facture_${isRental ? 'Location' : 'Commande'}_${order._id}.pdf`,
            content: invoicePDF,
            contentType: 'application/pdf'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Notification admin ${isRental ? 'location' : 'commande'} envoyée avec PDF`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur envoi notification admin ${isRental ? 'location' : 'commande'}:`, error);
      return false;
    }
  }
}

export default new EmailService();
