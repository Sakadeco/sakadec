import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

class PDFService {
  private browser: puppeteer.Browser | null = null;

  private async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser) {
      try {
        console.log('📄 Lancement du navigateur Puppeteer...');
        
        // Configuration pour Render et autres plateformes cloud
        const launchOptions: any = {
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ]
        };

        // Configuration spécifique pour Render
        if (process.env.RENDER) {
          console.log('📄 Configuration Render détectée');
          launchOptions.executablePath = '/opt/render/.cache/puppeteer/chrome/linux-139.0.7258.138/chrome-linux64/chrome';
          launchOptions.args.push('--disable-background-timer-throttling');
          launchOptions.args.push('--disable-backgrounding-occluded-windows');
          launchOptions.args.push('--disable-renderer-backgrounding');
        }

        // Configuration pour d'autres plateformes cloud
        if (process.env.NODE_ENV === 'production') {
          console.log('📄 Configuration production détectée');
          launchOptions.args.push('--disable-extensions');
          launchOptions.args.push('--disable-plugins');
          launchOptions.args.push('--disable-images');
        }

        this.browser = await puppeteer.launch(launchOptions);
        console.log('📄 Navigateur Puppeteer lancé avec succès');
      } catch (error) {
        console.error('❌ Erreur lancement navigateur Puppeteer:', error);
        
        // Fallback: essayer avec une configuration plus simple
        try {
          console.log('📄 Tentative de fallback avec configuration simplifiée...');
          this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
          console.log('📄 Navigateur Puppeteer lancé avec fallback');
        } catch (fallbackError) {
          console.error('❌ Erreur fallback Puppeteer:', fallbackError);
          throw fallbackError;
        }
      }
    }
    return this.browser;
  }

  async generateInvoicePDF(invoice: InvoiceData): Promise<Buffer> {
    try {
      console.log('📄 Début génération PDF pour facture:', invoice.orderNumber);
      const browser = await this.getBrowser();
      const page = await browser.newPage();
      
      const html = this.generateInvoiceHTML(invoice);
      console.log('📄 HTML généré, longueur:', html.length);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      console.log('📄 Contenu HTML défini sur la page');
      
      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true
      });
      
      console.log('📄 PDF généré avec succès, taille:', pdf.length, 'bytes');
      await page.close();
      return pdf;
    } catch (error) {
      console.error('❌ Erreur génération PDF:', error);
      throw error;
    }
  }

  private generateInvoiceHTML(invoice: InvoiceData): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture ${invoice.orderNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #059669;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
          }
          .invoice-title {
            font-size: 28px;
            color: #333;
            margin-bottom: 5px;
          }
          .invoice-number {
            font-size: 16px;
            color: #666;
          }
          .company-info {
            text-align: left;
            margin-bottom: 30px;
          }
          .client-info {
            margin-bottom: 30px;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-section h3 {
            color: #059669;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .items-table .quantity {
            text-align: center;
          }
          .items-table .price {
            text-align: right;
          }
          .totals {
            margin-left: auto;
            width: 300px;
          }
          .totals table {
            width: 100%;
            border-collapse: collapse;
          }
          .totals td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          .totals .total-row {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #059669;
            border-bottom: 2px solid #059669;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .customizations {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SakaDeco Group</div>
          <div class="invoice-title">FACTURE</div>
          <div class="invoice-number">N° ${invoice.orderNumber}</div>
        </div>

        <div class="company-info">
          <strong>SakaDeco Group</strong><br>
          123 Rue de la Décoration<br>
          75001 Paris, France<br>
          Tél: +33 1 23 45 67 89<br>
          Email: contact@sakadeco.com
        </div>

        <div class="client-info">
          <div class="info-section">
            <h3>Client</h3>
            <strong>${invoice.user.firstName || ''} ${invoice.user.lastName || ''}</strong><br>
            ${invoice.user.email}
          </div>

          <div class="info-section">
            <h3>Adresse de livraison</h3>
            ${invoice.shippingAddress.firstName} ${invoice.shippingAddress.lastName}<br>
            ${invoice.shippingAddress.address}<br>
            ${invoice.shippingAddress.postalCode} ${invoice.shippingAddress.city}<br>
            ${invoice.shippingAddress.country}
          </div>

          <div class="info-section">
            <h3>Adresse de facturation</h3>
            ${invoice.billingAddress.firstName} ${invoice.billingAddress.lastName}<br>
            ${invoice.billingAddress.address}<br>
            ${invoice.billingAddress.postalCode} ${invoice.billingAddress.city}<br>
            ${invoice.billingAddress.country}
          </div>
        </div>

        <div class="info-section">
          <h3>Détails de la commande</h3>
          <p><strong>Date de commande:</strong> ${format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
          <p><strong>Date de facture:</strong> ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th class="quantity">Quantité</th>
              <th class="price">Prix unitaire</th>
              <th class="price">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>
                  ${item.product.name}
                  ${this.renderCustomizations(item)}
                  ${item.customMessage ? `<br><em>Message: ${item.customMessage}</em>` : ''}
                </td>
                <td class="quantity">${item.quantity}</td>
                <td class="price">${(item.price / item.quantity).toFixed(2)}€</td>
                <td class="price">${item.price.toFixed(2)}€</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Sous-total HT</td>
              <td class="price">${invoice.subtotal.toFixed(2)}€</td>
            </tr>
            <tr>
              <td>TVA (20%)</td>
              <td class="price">${invoice.tax.toFixed(2)}€</td>
            </tr>
            <tr>
              <td>Livraison</td>
              <td class="price">${invoice.shipping.toFixed(2)}€</td>
            </tr>
            <tr class="total-row">
              <td>Total TTC</td>
              <td class="price">${invoice.total.toFixed(2)}€</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Merci pour votre confiance !</p>
          <p>SakaDeco Group - Votre partenaire décoration</p>
          <p>Cette facture est générée automatiquement</p>
        </div>
      </body>
      </html>
    `;
  }

  private renderCustomizations(item: any): string {
    if (!item.customizations) return '';
    
    const customizations = [];
    Object.entries(item.customizations).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value !== null) {
        if (value.type === 'both') {
          if (value.textValue) customizations.push(`${key} (texte): ${value.textValue}`);
          if (value.imageValue) customizations.push(`${key} (image): ✓ Image fournie`);
        } else if (value.type === 'text' && value.value) {
          customizations.push(`${key} (texte): ${value.value}`);
        } else if (value.type === 'image' && value.value) {
          customizations.push(`${key} (image): ✓ Image fournie`);
        } else if (value.value) {
          customizations.push(`${key}: ${value.value}`);
        }
      } else if (typeof value === 'string') {
        customizations.push(`${key}: ${value}`);
      }
    });
    
    if (customizations.length === 0) return '';
    
    return `<div class="customizations">${customizations.join('<br>')}</div>`;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default new PDFService();
