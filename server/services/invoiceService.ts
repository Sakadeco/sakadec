import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  customerEmail: string;
  customerName?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isRental?: boolean;
    rentalStartDate?: string;
    rentalEndDate?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  isRental: boolean;
  deposit?: number; // Pour les locations
}

export class InvoiceService {
  private static generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  }

  static async generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4',
          margin: 50,
          info: {
            Title: `Facture ${invoiceData.invoiceNumber}`,
            Author: 'SAKADECO',
            Subject: invoiceData.isRental ? 'Facture de location' : 'Facture de vente'
          }
        });

        const buffers: Buffer[] = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // En-tête de la facture
        this.addHeader(doc, invoiceData);
        
        // Informations client
        this.addCustomerInfo(doc, invoiceData);
        
        // Détails de la facture
        this.addInvoiceDetails(doc, invoiceData);
        
        // Tableau des articles
        this.addItemsTable(doc, invoiceData);
        
        // Totaux
        this.addTotals(doc, invoiceData);
        
        // Pied de page
        this.addFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private static addHeader(doc: PDFDocument, invoiceData: InvoiceData) {
    // Logo et nom de l'entreprise
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('SAKADECO', 50, 50);

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('Décoration et aménagement intérieur', 50, 80)
       .text('Email: contact@sakadeco.fr', 50, 95)
       .text('Tél: +33 1 23 45 67 89', 50, 110);

    // Numéro de facture et date
    const invoiceNumber = invoiceData.invoiceNumber;
    const invoiceDate = invoiceData.date.toLocaleDateString('fr-FR');
    
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text(invoiceData.isRental ? 'FACTURE DE LOCATION' : 'FACTURE DE VENTE', 400, 50, { align: 'right' });

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text(`N° ${invoiceNumber}`, 400, 80, { align: 'right' })
       .text(`Date: ${invoiceDate}`, 400, 95, { align: 'right' });

    // Ligne de séparation
    doc.moveTo(50, 130)
       .lineTo(550, 130)
       .stroke('#E2E8F0');
  }

  private static addCustomerInfo(doc: PDFDocument, invoiceData: InvoiceData) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('Facturé à:', 50, 160);

    const customerName = invoiceData.customerName || 
      `${invoiceData.shippingAddress.firstName} ${invoiceData.shippingAddress.lastName}`;

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text(customerName, 50, 185)
       .text(invoiceData.customerEmail, 50, 200)
       .text(invoiceData.shippingAddress.address, 50, 215)
       .text(`${invoiceData.shippingAddress.postalCode} ${invoiceData.shippingAddress.city}`, 50, 230);

    if (invoiceData.shippingAddress.country) {
      doc.text(invoiceData.shippingAddress.country, 50, 245);
    }
  }

  private static addInvoiceDetails(doc: PDFDocument, invoiceData: InvoiceData) {
    const yStart = invoiceData.shippingAddress.country ? 270 : 260;
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('Détails de la commande:', 50, yStart);

    if (invoiceData.isRental) {
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#4A5568')
         .text('Type: Location de produits', 50, yStart + 25);
    } else {
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#4A5568')
         .text('Type: Vente de produits', 50, yStart + 25);
    }
  }

  private static addItemsTable(doc: PDFDocument, invoiceData: InvoiceData) {
    const yStart = invoiceData.shippingAddress.country ? 320 : 310;
    
    // En-tête du tableau
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#FFFFFF')
       .rect(50, yStart, 500, 25)
       .fill('#4A5568');

    doc.text('Article', 60, yStart + 8);
    doc.text('Quantité', 300, yStart + 8);
    doc.text('Prix unitaire', 380, yStart + 8);
    doc.text('Total', 480, yStart + 8);

    let currentY = yStart + 25;

    // Articles
    invoiceData.items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const bgColor = isEven ? '#F7FAFC' : '#FFFFFF';
      
      doc.rect(50, currentY, 500, 30)
         .fill(bgColor);

      // Nom de l'article
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#2D3748')
         .text(item.name, 60, currentY + 8, { width: 230 });

      // Description si c'est une location
      if (item.isRental && item.rentalStartDate && item.rentalEndDate) {
        doc.fontSize(8)
           .fillColor('#4A5568')
           .text(`Du ${new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} au ${new Date(item.rentalEndDate).toLocaleDateString('fr-FR')}`, 60, currentY + 20, { width: 230 });
      }

      // Quantité
      doc.fontSize(10)
         .fillColor('#2D3748')
         .text(item.quantity.toString(), 300, currentY + 8);

      // Prix unitaire
      doc.text(`${item.unitPrice.toFixed(2)}€`, 380, currentY + 8);

      // Total
      doc.text(`${item.totalPrice.toFixed(2)}€`, 480, currentY + 8);

      currentY += 30;
    });

    // Ligne de séparation
    doc.moveTo(50, currentY)
       .lineTo(550, currentY)
       .stroke('#E2E8F0');
  }

  private static addTotals(doc: PDFDocument, invoiceData: InvoiceData) {
    const yStart = 500;
    
    // Sous-total
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('Sous-total:', 400, yStart)
       .text(`${invoiceData.subtotal.toFixed(2)}€`, 480, yStart);

    // TVA
    doc.text('TVA (20%):', 400, yStart + 20)
       .text(`${invoiceData.tax.toFixed(2)}€`, 480, yStart + 20);

    // Frais de livraison
    if (invoiceData.shipping > 0) {
      doc.text('Frais de livraison:', 400, yStart + 40)
         .text(`${invoiceData.shipping.toFixed(2)}€`, 480, yStart + 40);
    }

    // Dépôt pour les locations
    if (invoiceData.isRental && invoiceData.deposit) {
      doc.text('Dépôt de garantie:', 400, yStart + 60)
         .text(`${invoiceData.deposit.toFixed(2)}€`, 480, yStart + 60);
    }

    // Total
    const totalY = invoiceData.isRental && invoiceData.deposit ? yStart + 100 : yStart + 60;
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('TOTAL:', 400, totalY)
       .text(`${invoiceData.total.toFixed(2)}€`, 480, totalY);

    // Ligne de séparation
    doc.moveTo(400, totalY + 10)
       .lineTo(550, totalY + 10)
       .stroke('#2D3748');
  }

  private static addFooter(doc: PDFDocument) {
    const pageHeight = doc.page.height;
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('Merci pour votre confiance !', 50, pageHeight - 100)
       .text('SAKADECO - Décoration et aménagement intérieur', 50, pageHeight - 80)
       .text('Email: contact@sakadeco.fr | Tél: +33 1 23 45 67 89', 50, pageHeight - 60)
       .text('SIRET: 123 456 789 00012 | TVA: FR12 123456789', 50, pageHeight - 40);
  }

  static async generateInvoiceForOrder(order: any): Promise<Buffer> {
    const invoiceData: InvoiceData = {
      invoiceNumber: this.generateInvoiceNumber(),
      date: new Date(),
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => ({
        name: item.product.name,
        description: item.product.description,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        isRental: false
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      isRental: false
    };

    return this.generateInvoicePDF(invoiceData);
  }

  static async generateInvoiceForRental(rental: any): Promise<Buffer> {
    const invoiceData: InvoiceData = {
      invoiceNumber: this.generateInvoiceNumber(),
      date: new Date(),
      customerEmail: rental.customerEmail,
      customerName: rental.customerName,
      shippingAddress: rental.shippingAddress,
      items: rental.items.map((item: any) => ({
        name: item.product.name,
        description: item.product.description,
        quantity: item.quantity,
        unitPrice: item.dailyPrice,
        totalPrice: item.totalPrice,
        isRental: true,
        rentalStartDate: item.rentalStartDate,
        rentalEndDate: item.rentalEndDate
      })),
      subtotal: rental.subtotal,
      tax: rental.tax,
      shipping: 0,
      total: rental.total,
      isRental: true,
      deposit: rental.deposit
    };

    return this.generateInvoicePDF(invoiceData);
  }
}
