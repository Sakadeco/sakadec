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
  promoCode?: string;
  promoDiscount?: number;
  subtotalAfterDiscount?: number;
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
    // Logo de l'entreprise (à la place du texte "Sakadeco")
    try {
      // Chemin vers le logo (depuis le dossier client/assets/Logos)
      const logoPath = path.join(process.cwd(), 'client', 'src', 'assets', 'Logos', 'sdk_group.png');
      
      if (fs.existsSync(logoPath)) {
        // Afficher le logo décalé vers le haut (47 au lieu de 50)
        doc.image(logoPath, 50, 47, { 
          width: 100,
          height: 35,
          fit: [100, 35]
        });
      } else {
        // Fallback si le logo n'est pas trouvé
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#2D3748')
           .text('Sakadeco', 50, 47);
      }
    } catch (error) {
      console.error('Erreur chargement logo:', error);
      // Fallback si erreur
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fillColor('#2D3748')
         .text('Sakadeco', 50, 47);
    }

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('L\'élégance au service de vos moments', 50, 88)
       .text('Email: sakadeco.contact@gmail.com | Tél: +33 6 88 00 39 28', 50, 103);

    // Numéro de facture et date
    const invoiceNumber = invoiceData.invoiceNumber;
    const invoiceDate = invoiceData.date.toLocaleDateString('fr-FR');
    
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text(invoiceData.isRental ? 'FACTURE DE LOCATION' : 'FACTURE DE VENTE', 400, 50, { align: 'right' });

    // Espacement supplémentaire pour éviter le chevauchement
    // Réduire la taille de la police pour le numéro de facture si trop long
    const invoiceNumberText = `N° ${invoiceNumber}`;
    const maxInvoiceNumberWidth = 150; // Largeur maximale disponible
    
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568');
    
    // Vérifier si le numéro de facture est trop long
    const invoiceNumberWidth = doc.widthOfString(invoiceNumberText);
    if (invoiceNumberWidth > maxInvoiceNumberWidth) {
      // Réduire la taille de la police pour que ça tienne sur une ligne
      doc.fontSize(9);
    }
    
    doc.text(invoiceNumberText, 400, 90, { align: 'right', width: maxInvoiceNumberWidth });
    
    // Remettre la taille normale pour la date
    doc.fontSize(12)
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
    doc.rect(50, yStart, 500, 30)
       .fill('#D4AF37'); // Couleur dorée
    
    // Textes en blanc et en gras
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#FFFFFF')
       .text('Désignation', 60, yStart + 8)
       .text('Qté', 220, yStart + 8)
       .text('Prix unitaire HT', 260, yStart + 8)
       .text('Prix HT', 360, yStart + 8)
       .text('TVA 20%', 420, yStart + 8)
       .text('Prix TTC', 480, yStart + 8);

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
        doc.rect(50, currentY, 500, 30)
           .fill('#D4AF37'); // Couleur dorée
        
        // Textes en blanc et en gras
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#FFFFFF')
           .text('Désignation', 60, currentY + 8)
           .text('Qté', 220, currentY + 8)
           .text('Prix unitaire HT', 260, currentY + 8)
           .text('Prix HT', 360, currentY + 8)
           .text('TVA 20%', 420, currentY + 8)
           .text('Prix TTC', 480, currentY + 8);
        currentY += 30;
      }

      const isEven = index % 2 === 0;
      const bgColor = isEven ? '#F7FAFC' : '#FFFFFF';
      
      // Calculer la hauteur de la ligne en fonction de la description
      let baseRowHeight = 30;
      let descriptionLines = 0;
      
      if (item.description && item.description.trim()) {
        descriptionLines = item.description.split('\n').filter(line => line.trim()).length;
      }
      
      if (item.isRental && item.rentalStartDate && item.rentalEndDate) {
        descriptionLines += 1; // Ligne pour la période de location
      }
      
      const rowHeight = Math.max(30, baseRowHeight + (descriptionLines * 12));
      
      doc.rect(50, currentY, 500, rowHeight)
         .fill(bgColor);

      // Nom du produit
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#2D3748')
         .text(item.name, 60, currentY + 8, { width: 150 });

      // Description avec personnalisations
      let descriptionY = currentY + 22;
      
      if (item.description && item.description.trim()) {
        doc.fontSize(8)
           .font('Helvetica')
           .fillColor('#4A5568');
        
        const descriptionLinesArray = item.description.split('\n');
        descriptionLinesArray.forEach((line: string) => {
          if (line.trim()) {
            // Vérifier si on doit créer une nouvelle page
            if (descriptionY > doc.page.height - 100) {
              doc.addPage();
              descriptionY = 50;
              // Réimprimer l'en-tête du tableau
              doc.rect(50, descriptionY, 500, 30)
                 .fill('#D4AF37');
              doc.fontSize(10)
                 .font('Helvetica-Bold')
                 .fillColor('#FFFFFF')
                 .text('Désignation', 60, descriptionY + 8)
                 .text('Qté', 220, descriptionY + 8)
                 .text('Prix unitaire HT', 260, descriptionY + 8)
                 .text('Prix HT', 360, descriptionY + 8)
                 .text('TVA 20%', 420, descriptionY + 8)
                 .text('Prix TTC', 480, descriptionY + 8);
              descriptionY += 30;
            }
            
            doc.text(line.trim(), 60, descriptionY, { width: 150 });
            descriptionY += 12;
          }
        });
      }
      
      // Description si c'est une location (période de location)
      if (item.isRental && item.rentalStartDate && item.rentalEndDate) {
        const startDate = new Date(item.rentalStartDate).toLocaleDateString('fr-FR');
        const endDate = new Date(item.rentalEndDate).toLocaleDateString('fr-FR');
        
        // Vérifier si on doit créer une nouvelle page
        if (descriptionY > doc.page.height - 100) {
          doc.addPage();
          descriptionY = 50;
          // Réimprimer l'en-tête du tableau
          doc.rect(50, descriptionY, 500, 30)
             .fill('#D4AF37');
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .fillColor('#FFFFFF')
             .text('Désignation', 60, descriptionY + 8)
             .text('Qté', 220, descriptionY + 8)
             .text('Prix unitaire HT', 260, descriptionY + 8)
             .text('Prix HT', 360, descriptionY + 8)
             .text('TVA 20%', 420, descriptionY + 8)
             .text('Prix TTC', 480, descriptionY + 8);
          descriptionY += 30;
        }
        
        doc.fontSize(8)
           .font('Helvetica')
           .fillColor('#4A5568')
           .text(`Période: Du ${startDate} au ${endDate}`, 60, descriptionY, { width: 150 });
        descriptionY += 12;
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
    // Utiliser subtotalAfterDiscount si disponible (après code promo), sinon subtotal
    const subtotalHT = invoiceData.subtotalAfterDiscount !== undefined ? invoiceData.subtotalAfterDiscount : invoiceData.subtotal;
    const promoDiscount = invoiceData.promoDiscount || 0;
    
    // Calculer la TVA à 20% sur le subtotal après réduction
    const tvaAmount = subtotalHT * 0.20;
    const subtotalTTC = subtotalHT + tvaAmount;
    
    const pageHeight = doc.page.height;
    // Marge de 2-3 cm (environ 75-110px) entre le tableau et les totaux
    const marginBetweenTableAndTotals = 80; // ~2.8 cm
    let yStart = doc.y + marginBetweenTableAndTotals;
    
    // Vérifier si on a assez d'espace pour les totaux (au moins 200px pour tous les éléments)
    const totalsHeight = 200; // Hauteur approximative pour tous les totaux
    if (yStart > pageHeight - totalsHeight) {
      doc.addPage();
      yStart = 50;
    }
    
    let currentY = yStart;
    
    // Positions fixes pour l'alignement : descriptions alignées avec "Prix unitaire HT" du tableau, prix à droite
    const labelX = 260; // Position X pour les descriptions (labels) - aligné avec "Prix unitaire HT" du tableau
    const priceX = 470; // Position X de départ pour les prix - grand espacement (210px entre label et prix)
    const priceWidth = 75; // Largeur suffisante pour éviter les retours à la ligne même pour les grands montants
    
    // Toujours afficher Total HT en premier
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#4A5568')
       .text('Total HT:', labelX, currentY);
    doc.text(`${invoiceData.subtotal.toFixed(2)}€`, priceX, currentY, { width: priceWidth, align: 'right' });
    currentY += 20;
    
    // Remise (si code promo)
    if (promoDiscount > 0 && invoiceData.promoCode) {
      doc.text(`Remise (${invoiceData.promoCode}):`, labelX, currentY);
      doc.text(`-${promoDiscount.toFixed(2)}€`, priceX, currentY, { width: priceWidth, align: 'right' });
      currentY += 20;
      
      // Total HT après remise
      doc.font('Helvetica-Bold')
         .text('Total HT après remise:', labelX, currentY);
      doc.text(`${subtotalHT.toFixed(2)}€`, priceX, currentY, { width: priceWidth, align: 'right' });
      currentY += 20;
    }

    // TVA 20%
    doc.font('Helvetica')
       .fillColor('#4A5568')
       .text('TVA (20%):', labelX, currentY);
    doc.text(`${tvaAmount.toFixed(2)}€`, priceX, currentY, { width: priceWidth, align: 'right' });
    currentY += 20;

    // Frais de livraison
    if (invoiceData.shipping > 0) {
      doc.text('Frais de livraison:', labelX, currentY);
      doc.text(`${invoiceData.shipping.toFixed(2)}€`, priceX, currentY, { width: priceWidth, align: 'right' });
      currentY += 20;
    }

    // Total TTC
    const totalTTC = subtotalTTC + (invoiceData.shipping || 0);
    
    // Vérifier qu'on a assez d'espace pour le total TTC avant de l'afficher
    let finalY = currentY;
    if (finalY > pageHeight - 50) {
      doc.addPage();
      finalY = 50;
    }
    
    // Réduire la taille de la police pour éviter que le total passe sur 2 lignes
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#2D3748')
       .text('TOTAL TTC:', labelX, finalY);
    doc.text(`${totalTTC.toFixed(2)}€`, priceX, finalY, { width: priceWidth, align: 'right' });
    
    // Mettre à jour la position Y du document pour le footer
    doc.y = finalY + 30;
  }

  private static addFooter(doc: PDFDocument) {
    const pageHeight = doc.page.height;
    const currentY = doc.y;
    
    // Calculer la hauteur nécessaire pour le footer (environ 100px)
    const footerHeight = 100;
    
    // Marge de 2-3 cm (environ 75-110px) entre les totaux et les mentions légales
    const marginBetweenTotalsAndFooter = 80; // ~2.8 cm
    let yPos = currentY + marginBetweenTotalsAndFooter;
    
    // Vérifier si on a assez d'espace pour le footer
    // Si on n'a pas assez d'espace, créer une nouvelle page
    if (yPos + footerHeight > pageHeight - 50) {
      doc.addPage();
      yPos = 50;
    }
    
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
    // Utiliser orderNumber de la commande au lieu de générer un nouveau numéro
    const invoiceNumber = order.orderNumber || order._id.toString();
    
    const invoiceData: InvoiceData = {
      invoiceNumber: invoiceNumber,
      date: new Date(),
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => {
        // Construire la désignation avec le nom du produit et les personnalisations
        let designation = item.product?.name || 'Produit';
        
        // Ajouter les personnalisations à la désignation (pas la description du produit)
        if (item.customizations) {
          // Convertir Map en objet si nécessaire
          const customizationsObj = item.customizations instanceof Map 
            ? Object.fromEntries(item.customizations)
            : item.customizations;
          
          if (customizationsObj && Object.keys(customizationsObj).length > 0) {
            designation += '\n\nPersonnalisations:';
            Object.entries(customizationsObj).forEach(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                // Gérer les différents types de personnalisations
                if (value.type === 'both') {
                  if (value.textValue) {
                    designation += `\n- ${key.replace(/_/g, ' ')} (texte): ${value.textValue}`;
                  }
                  if (value.imageValue) {
                    designation += `\n- ${key.replace(/_/g, ' ')} (image): Image personnalisée`;
                  }
                } else if (value.type === 'text' && value.value) {
                  designation += `\n- ${key.replace(/_/g, ' ')} (texte): ${value.value}`;
                } else if (value.type === 'image' && value.value) {
                  designation += `\n- ${key.replace(/_/g, ' ')} (image): Image personnalisée`;
                }
              } else if (typeof value === 'string') {
                designation += `\n- ${key.replace(/_/g, ' ')}: ${value}`;
              }
            });
          }
        }
        
        return {
          name: item.product?.name || 'Produit',
          description: designation, // Utiliser la désignation construite au lieu de la description
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          isRental: false
        };
      }),
      subtotal: order.subtotal,
      promoCode: order.promoCode || undefined,
      promoDiscount: order.promoDiscount || 0,
      subtotalAfterDiscount: order.subtotalAfterDiscount !== undefined ? order.subtotalAfterDiscount : order.subtotal,
      tax: (order.subtotalAfterDiscount !== undefined ? order.subtotalAfterDiscount : order.subtotal) * 0.20, // TVA à 20% sur le subtotal après réduction
      shipping: order.shipping,
      total: order.total, // Utiliser le total de la commande
      isRental: false
    };

    return this.generateInvoicePDF(invoiceData);
  }

  static async generateInvoiceForRental(rental: any): Promise<Buffer> {
    // Utiliser orderNumber de la location au lieu de générer un nouveau numéro
    const invoiceNumber = rental.orderNumber || rental.rentalNumber || rental._id.toString();
    
    const invoiceData: InvoiceData = {
      invoiceNumber: invoiceNumber,
      date: new Date(),
      customerEmail: rental.customerEmail,
      customerName: rental.customerName,
      shippingAddress: rental.shippingAddress,
      items: rental.items.map((item: any) => {
        // Construire la désignation avec le nom du produit et les personnalisations
        let designation = item.product?.name || 'Produit';
        
        // Ajouter les personnalisations à la désignation (pas la description du produit)
        if (item.customizations) {
          // Convertir Map en objet si nécessaire
          const customizationsObj = item.customizations instanceof Map 
            ? Object.fromEntries(item.customizations)
            : item.customizations;
          
          if (customizationsObj && Object.keys(customizationsObj).length > 0) {
            designation += '\n\nPersonnalisations:';
            Object.entries(customizationsObj).forEach(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                // Gérer les différents types de personnalisations
                if (value.type === 'both') {
                  if (value.textValue) {
                    designation += `\n- ${key.replace(/_/g, ' ')} (texte): ${value.textValue}`;
                  }
                  if (value.imageValue) {
                    designation += `\n- ${key.replace(/_/g, ' ')} (image): Image personnalisée`;
                  }
                } else if (value.type === 'text' && value.value) {
                  designation += `\n- ${key.replace(/_/g, ' ')} (texte): ${value.value}`;
                } else if (value.type === 'image' && value.value) {
                  designation += `\n- ${key.replace(/_/g, ' ')} (image): Image personnalisée`;
                }
              } else if (typeof value === 'string') {
                designation += `\n- ${key.replace(/_/g, ' ')}: ${value}`;
              }
            });
          }
        }
        
        return {
          name: item.product?.name || 'Produit',
          description: designation, // Utiliser la désignation construite au lieu de la description
          quantity: item.quantity,
          unitPrice: item.dailyPrice,
          totalPrice: item.totalPrice,
          isRental: true,
          rentalStartDate: item.rentalStartDate,
          rentalEndDate: item.rentalEndDate
        };
      }),
      subtotal: rental.subtotal,
      promoCode: rental.promoCode || undefined,
      promoDiscount: rental.promoDiscount || 0,
      subtotalAfterDiscount: rental.subtotalAfterDiscount !== undefined ? rental.subtotalAfterDiscount : rental.subtotal,
      tax: (rental.subtotalAfterDiscount !== undefined ? rental.subtotalAfterDiscount : rental.subtotal) * 0.20, // TVA à 20% sur le subtotal après réduction
      shipping: rental.shipping || 0,
      total: rental.total || ((rental.subtotalAfterDiscount !== undefined ? rental.subtotalAfterDiscount : rental.subtotal) * 1.20 + (rental.shipping || 0)), // TTC
      isRental: true,
      deposit: 0 // Acompte supprimé
    };

    return this.generateInvoicePDF(invoiceData);
  }
}
