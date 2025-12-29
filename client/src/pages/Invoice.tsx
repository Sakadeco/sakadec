import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Layout from '../components/Layout';

interface InvoiceItem {
  product: {
    _id: string;
    name: string;
    price: number;
    mainImageUrl: string;
  };
  quantity: number;
  price: number;
  customizations?: Record<string, any>;
  customMessage?: string;
  dailyPrice?: number;
  isRental?: boolean;
}

interface Invoice {
  _id: string;
  orderNumber: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
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
  paymentMethod: string;
  stripeSessionId: string;
  createdAt: string;
  updatedAt: string;
}

const Invoice: React.FC = () => {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!orderId) {
          setError('ID de commande manquant');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/payment/orders/detail/${orderId}`);
        if (!response.ok) {
          throw new Error('Facture non trouvée');
        }
        const data = await response.json();
        
        if (!data || !data.order) {
          throw new Error('Données de facture invalides');
        }
        
        setInvoice(data.order);
      } catch (err) {
        console.error('Erreur lors du chargement de la facture:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/invoice/${orderId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${invoice?.orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch(`/api/invoice/${orderId}/resend`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Facture renvoyée par email avec succès !');
      } else {
        alert('Erreur lors de l\'envoi de la facture');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi de la facture');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la facture...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !invoice) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Facture non trouvée</h1>
            <p className="text-gray-600 mb-4">{error || 'Cette facture n\'existe pas ou vous n\'y avez pas accès.'}</p>
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      {/* Header avec boutons d'action */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8 print:hidden">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Facture #{invoice.orderNumber}</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleResendEmail}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Renvoyer par email
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                📄 Télécharger PDF
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                🖨️ Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de la facture */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* En-tête de la facture */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">SakaDeco</h1>
                <p className="text-xs sm:text-sm text-gray-600">Décoration et aménagement</p>
                <p className="text-xs sm:text-sm text-gray-600">123 Rue de la Décoration</p>
                <p className="text-xs sm:text-sm text-gray-600">75001 Paris, France</p>
                <p className="text-xs sm:text-sm text-gray-600">sakadeco.contact@gmail.com</p>
              </div>
              <div className="text-left sm:text-right">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">FACTURE</h2>
                <p className="text-xs sm:text-sm text-gray-600">N° {invoice.orderNumber}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Date: {format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Statut: <span className="font-semibold text-green-600">{invoice.status}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Paiement: <span className="font-semibold text-green-600">{invoice.paymentStatus}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Adresse de facturation</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {invoice.billingAddress.firstName} {invoice.billingAddress.lastName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{invoice.billingAddress.address}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {invoice.billingAddress.postalCode} {invoice.billingAddress.city}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{invoice.billingAddress.country}</p>
                {invoice.user?.email && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">{invoice.user.email}</p>
                )}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Adresse de livraison</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {invoice.shippingAddress.firstName} {invoice.shippingAddress.lastName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{invoice.shippingAddress.address}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {invoice.shippingAddress.postalCode} {invoice.shippingAddress.city}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{invoice.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Détails des produits */}
          <div className="p-4 sm:p-6 md:p-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">Détails de la commande</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800">Produit</th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800">Quantité</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800">Prix unitaire</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center">
                          <img
                            src={item.product.mainImageUrl}
                            alt={item.product?.name || 'Produit supprimé'}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg mr-2 sm:mr-4"
                          />
                          <div>
                            <p className="font-medium text-gray-800 text-xs sm:text-sm">{item.product?.name || 'Produit supprimé'}</p>
                            <p className="text-xs text-gray-600">Ref: {item.product?._id || 'N/A'}</p>
                            {/* Personnalisations */}
                            {item.customizations && (() => {
                              // Convertir Map en objet si nécessaire
                              const customizationsObj = item.customizations instanceof Map 
                                ? Object.fromEntries(item.customizations)
                                : item.customizations;
                              
                              const keys = Object.keys(customizationsObj || {});
                              
                              if (keys.length === 0) return null;
                              
                              return (
                                <div className="mt-2">
                                  <p className="text-xs font-semibold text-gray-700">Personnalisations:</p>
                                  <ul className="text-xs text-gray-600">
                                    {keys.map((key) => {
                                      const value = customizationsObj[key];
                                      // Gérer les valeurs complexes (objets)
                                      let displayValue = value;
                                      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                                        if (value.textValue) {
                                          displayValue = value.textValue;
                                        } else if (value.imageValue) {
                                          displayValue = 'Image personnalisée';
                                        } else if (value.value) {
                                          displayValue = value.value;
                                        } else {
                                          displayValue = JSON.stringify(value);
                                        }
                                      }
                                      return (
                                        <li key={key}>
                                          <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {String(displayValue)}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              );
                            })()}
                            {/* Message personnalisé */}
                            {item.customMessage && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-gray-700">Message:</p>
                                <p className="text-xs text-gray-600 italic">"{item.customMessage}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 text-gray-600">{item.quantity}</td>
                      <td className="text-right py-4 px-4 text-gray-600">{item.price.toFixed(2)}€</td>
                      <td className="text-right py-4 px-4 font-medium text-gray-800">
                        {(item.price * item.quantity).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Résumé des coûts */}
          <div className="p-8 bg-gray-50">
            <div className="max-w-md ml-auto">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{invoice.subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%):</span>
                  <span className="font-medium">{invoice.tax.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison:</span>
                  <span className="font-medium">{invoice.shipping.toFixed(2)}€</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-gray-800">{invoice.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="p-8 border-t border-gray-200">
            <div className="text-center text-gray-600">
              <p className="mb-2">Merci pour votre confiance !</p>
              <p className="text-sm">
                Pour toute question, contactez-nous à sakadeco.contact@gmail.com
              </p>
              <p className="text-sm mt-2">
                Facture générée le {format(new Date(invoice.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Invoice;
