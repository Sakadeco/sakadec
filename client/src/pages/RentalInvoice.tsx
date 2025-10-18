import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, ArrowLeft } from 'lucide-react';

interface RentalItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    dailyRentalPrice: number;
    mainImageUrl: string;
  };
  quantity: number;
  dailyPrice: number;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;
  totalPrice: number;
  customizations?: any;
}

interface Rental {
  _id: string;
  orderNumber: string;
  items: RentalItem[];
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  deposit: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  createdAt: string;
}

const RentalInvoice: React.FC = () => {
  const { rentalId } = useParams();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await fetch(`/api/rental/detail/${rentalId}`);
        if (!response.ok) {
          throw new Error('Location non trouvée');
        }
        const data = await response.json();
        setRental(data.rental);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (rentalId) {
      fetchRental();
    }
  }, [rentalId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/rental/invoice/${rentalId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-location-${rental?.orderNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la facture...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !rental) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Facture non trouvée</h1>
            <p className="text-gray-600 mb-6">{error || 'Cette facture n\'existe pas'}</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Header avec boutons d'action */}
        <div className="max-w-4xl mx-auto px-4 mb-8 print:hidden">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Facture de Location #{rental.orderNumber}</h1>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Télécharger PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🖨️ Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la facture */}
        <div className="max-w-4xl mx-auto px-4">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">SakaDeco</h2>
                  <p className="text-gray-600">Décoration et aménagement</p>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">FACTURE DE LOCATION</h3>
                  <p className="text-gray-600">N° {rental.orderNumber}</p>
                  <p className="text-gray-600">
                    Date: {new Date(rental.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Informations client</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {rental.shippingAddress?.firstName || 'N/A'} {rental.shippingAddress?.lastName || 'N/A'}</p>
                    <p><strong>Adresse:</strong> {rental.shippingAddress?.address || 'N/A'}</p>
                    <p><strong>Ville:</strong> {rental.shippingAddress?.postalCode || 'N/A'} {rental.shippingAddress?.city || 'N/A'}</p>
                    <p><strong>Pays:</strong> {rental.shippingAddress?.country || 'N/A'}</p>
                    <p><strong>Téléphone:</strong> {rental.shippingAddress?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Informations location</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Statut:</strong> <span className="text-green-600 font-medium">{rental.status}</span></p>
                    <p><strong>Paiement:</strong> <span className="text-green-600 font-medium">{rental.paymentStatus}</span></p>
                    <p><strong>Date de création:</strong> {new Date(rental.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* Articles loués */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Articles loués</h4>
                <div className="space-y-4">
                  {rental.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                          <p className="text-sm text-gray-600">
                            Période: {new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} - {new Date(item.rentalEndDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Durée: {item.rentalDays} jour(s)
                          </p>
                          <p className="text-sm text-gray-600">
                            Prix journalier: {item.dailyPrice.toFixed(2)}€
                          </p>
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Personnalisations:</p>
                              <ul className="text-sm text-gray-600 ml-4">
                                {Object.entries(item.customizations).map(([key, value]) => (
                                  <li key={key}>
                                    {key.replace(/_/g, ' ')}: {typeof value === 'object' ? value.value || 'N/A' : value}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {item.quantity} × {item.dailyPrice.toFixed(2)}€ × {item.rentalDays} jour(s)
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {item.totalPrice.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé financier */}
              <div className="border-t pt-6">
                <div className="max-w-md ml-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{rental.subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (20%):</span>
                      <span>{rental.tax.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dépôt (30%):</span>
                      <span>{rental.deposit.toFixed(2)}€</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">{rental.total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RentalInvoice;
