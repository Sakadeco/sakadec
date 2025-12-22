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
       .text('Sakadeco', 50, 50);

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('L\'élégance au service de vos moments', 50, 80)
       .text('Email: sakadeco.contact@gmail.com | Tél: +33 6 88 00 39 28', 50, 95);

    // Numéro de facture et date
    const invoiceNumber = invoiceData.invoiceNumber;
    const invoiceDate = invoiceData.date.toLocaleDateString('fr-FR');
    
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text(invoiceData.isRental ? 'FACTURE DE LOCATION' : 'FACTURE DE VENTE', 400, 50, { align: 'right' });

    // Espacement supplémentaire pour éviter le chevauchement
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text(`N° ${invoiceNumber}`, 400, 90, { align: 'right' })
       .text(`Date: ${invoiceDate}`, 400, 105, { align: 'right' });

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
    
    // En-tête du tableau (couleur dorée pour correspondre au thème)
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#FFFFFF')
       .rect(50, yStart, 500, 30)
       .fill('#D4AF37'); // Couleur dorée

    doc.text('Désignation', 60, yStart + 8);
    doc.text('Qté', 220, yStart + 8);
    doc.text('Prix unitaire HT', 260, yStart + 8);
    doc.text('Prix HT', 360, yStart + 8);
    doc.text('TVA 20%', 420, yStart + 8);
    doc.text('Prix TTC', 480, yStart + 8);

    let currentY = yStart + 30;
    let pageBreakNeeded = false;

    // Articles
    invoiceData.items.forEach((item, index) => {
      const pageHeight = doc.page.height;
      // Vérifier si on doit créer une nouvelle page (laisser au moins 100px pour le contenu)
      if (currentY > pageHeight - 100) {
        doc.addPage();
        currentY = 50;
        // Réimprimer l'en-tête du tableau (couleur dorée)
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#FFFFFF')
           .rect(50, currentY, 500, 30)
           .fill('#D4AF37'); // Couleur dorée
        doc.text('Désignation', 60, currentY + 8);
        doc.text('Qté', 220, currentY + 8);
        doc.text('Prix unitaire HT', 260, currentY + 8);
        doc.text('Prix HT', 360, currentY + 8);
        doc.text('TVA 20%', 420, currentY + 8);
        doc.text('Prix TTC', 480, currentY + 8);
        currentY += 30;
      }

      const isEven = index % 2 === 0;
      const bgColor = isEven ? '#F7FAFC' : '#FFFFFF';
      
      const rowHeight = item.isRental && item.rentalStartDate && item.rentalEndDate ? 40 : 30;
      
      doc.rect(50, currentY, 500, rowHeight)
         .fill(bgColor);

      // Nom du produit
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#2D3748')
         .text(item.name, 60, currentY + 8, { width: 150 });

      // Description si c'est une location
      if (item.isRental && item.rentalStartDate && item.rentalEndDate) {
        const startDate = new Date(item.rentalStartDate).toLocaleDateString('fr-FR');
        const endDate = new Date(item.rentalEndDate).toLocaleDateString('fr-FR');
        doc.fontSize(8)
           .font('Helvetica')
           .fillColor('#4A5568')
           .text(`Période: Du ${startDate} au ${endDate}`, 60, currentY + 22, { width: 150 });
      }

      // Quantité
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#2D3748')
         .text(item.quantity.toString(), 220, currentY + 8);

      // Prix unitaire HT
      const unitPriceHT = item.unitPrice;
      doc.text(`${unitPriceHT.toFixed(2)}€`, 260, currentY + 8);

      // Prix HT total
      const totalHT = item.totalPrice;
      doc.text(`${totalHT.toFixed(2)}€`, 360, currentY + 8);

      // TVA 20%
      const tvaAmount = totalHT * 0.20;
      doc.text(`${tvaAmount.toFixed(2)}€`, 420, currentY + 8);

      // Prix TTC
      const totalTTC = totalHT + tvaAmount;
      doc.text(`${totalTTC.toFixed(2)}€`, 480, currentY + 8);

      currentY += rowHeight;
    });

    // Ligne de séparation
    doc.moveTo(50, currentY)
       .lineTo(550, currentY)
       .stroke('#E2E8F0');
  }

  private static addTotals(doc: PDFDocument, invoiceData: InvoiceData) {
    // Calculer la TVA à 20%
    const subtotalHT = invoiceData.subtotal;
    const tvaAmount = subtotalHT * 0.20;
    const subtotalTTC = subtotalHT + tvaAmount;
    
    const pageHeight = doc.page.height;
    let yStart = doc.y + 40; // Plus d'espacement après le tableau (40px au lieu de 20px)
    
    // Vérifier si on a assez d'espace pour les totaux (au moins 150px)
    if (yStart > pageHeight - 150) {
      doc.addPage();
      yStart = 50;
    }
    
    // Total HT
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('Total HT:', 400, yStart)
       .text(`${subtotalHT.toFixed(2)}€`, 480, yStart);

    // TVA 20%
    doc.text('TVA (20%):', 400, yStart + 20)
       .text(`${tvaAmount.toFixed(2)}€`, 480, yStart + 20);

    // Frais de livraison
    if (invoiceData.shipping > 0) {
      doc.text('Frais de livraison:', 400, yStart + 40)
         .text(`${invoiceData.shipping.toFixed(2)}€`, 480, yStart + 40);
    }

    // Total TTC (acompte supprimé)
    const totalTTC = subtotalTTC + (invoiceData.shipping || 0);
    const totalY = invoiceData.shipping > 0 ? yStart + 80 : yStart + 60;
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('TOTAL TTC:', 400, totalY)
       .text(`${totalTTC.toFixed(2)}€`, 480, totalY);
  }

  private static addFooter(doc: PDFDocument) {
    const pageHeight = doc.page.height;
    const currentY = doc.y;
    
    // Vérifier si on a assez d'espace pour le footer (au moins 200px)
    if (currentY > pageHeight - 200) {
      doc.addPage();
    }
    
    const yPos = doc.y;
    
    // Mentions légales uniquement (suppression des infos en double)
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('MENTIONS LÉGALES', 50, yPos);
    
    doc.fontSize(7)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('Éditeur du site', 50, yPos + 12, { width: 500 })
       .text('Youlou Pajusly – Entreprise Individuelle', 50, yPos + 22, { width: 500 })
       .text('Nom commercial : SAKADECO (SKD GROUP)', 50, yPos + 32, { width: 500 })
       .text('Autres Noms commerciaux : SKD Shop, SKD Events, SKD Rent, SKD Créa, SKD Home, SKD & Co', 50, yPos + 42, { width: 500 })
       .text('SIRET : 829 611 888 00035 | TVA intracommunautaire : FR73 829611888', 50, yPos + 52, { width: 500 })
       .text('Siège social : Rue pasteur 33200 Bordeaux', 50, yPos + 62, { width: 500 })
       .text('Contact : Email : sakadeco.contact@gmail.com', 50, yPos + 72, { width: 500 })
       .text('Toute location, prestation de service, vaut acceptation des conditions générales.', 50, yPos + 82, { width: 500 });
  }

  static async generateInvoiceForOrder(order: any): Promise<Buffer> {
    const invoiceData: InvoiceData = {
      invoiceNumber: this.generateInvoiceNumber(),
      date: new Date(),
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => {
        let description = item.product.description || '';
        
        // Ajouter les personnalisations à la description
        if (item.customizations && Object.keys(item.customizations).length > 0) {
          description += '\n\nPersonnalisations:';
          Object.entries(item.customizations).forEach(([key, value]) => {
            if (typeof value === 'object' && value.type === 'text' && value.value) {
              description += `\n- ${key.replace(/_/g, ' ')} (texte): ${value.value}`;
            } else if (typeof value === 'object' && value.type === 'image' && value.value) {
              description += `\n- ${key.replace(/_/g, ' ')} (image): Image personnalisée`;
            } else if (typeof value === 'string') {
              description += `\n- ${key.replace(/_/g, ' ')}: ${value}`;
            }
          });
        }
        
        return {
          name: item.product.name,
          description: description,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          isRental: false
        };
      }),
      subtotal: order.subtotal,
      tax: order.subtotal * 0.20, // TVA à 20%
      shipping: order.shipping,
      total: order.subtotal * 1.20 + order.shipping, // TTC
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
      items: rental.items.map((item: any) => {
        let description = item.product.description || '';
        
        // Ajouter les personnalisations à la description
        if (item.customizations && Object.keys(item.customizations).length > 0) {
          description += '\n\nPersonnalisations:';
          Object.entries(item.customizations).forEach(([key, value]) => {
            if (typeof value === 'object' && value.type === 'text' && value.value) {
              description += `\n- ${key.replace(/_/g, ' ')} (texte): ${value.value}`;
            } else if (typeof value === 'object' && value.type === 'image' && value.value) {
              description += `\n- ${key.replace(/_/g, ' ')} (image): Image personnalisée`;
            } else if (typeof value === 'string') {
              description += `\n- ${key.replace(/_/g, ' ')}: ${value}`;
            }
          });
        }
        
        return {
          name: item.product.name,
          description: description,
          quantity: item.quantity,
          unitPrice: item.dailyPrice,
          totalPrice: item.totalPrice,
          isRental: true,
          rentalStartDate: item.rentalStartDate,
          rentalEndDate: item.rentalEndDate
        };
      }),
      subtotal: rental.subtotal,
      tax: rental.subtotal * 0.20, // TVA à 20%
      shipping: 0,
      total: rental.subtotal * 1.20, // TTC
      isRental: true,
      deposit: 0 // Acompte supprimé
    };

    return this.generateInvoicePDF(invoiceData);
  }
}
