import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Calendar, Package, Download, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RentalData {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      mainImageUrl: string;
    };
    quantity: number;
    dailyPrice: number;
    rentalStartDate: string;
    rentalEndDate: string;
    rentalDays: number;
    totalPrice: number;
  }>;
  subtotal: number;
  tax: number;
  deposit: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const RentalSuccess: React.FC = () => {
  const [, setLocation] = useLocation();
  const [rentalData, setRentalData] = useState<RentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      fetchRentalData(sessionId);
    } else {
      setError('Session ID manquant');
      setLoading(false);
    }
  }, []);

  const fetchRentalData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/rental/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setRentalData(data);
      } else {
        setError('Erreur lors de la récupération des données de location');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la récupération des données de location');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = () => {
    if (rentalData) {
      window.open(`/rental/invoice/${rentalData._id}`, '_blank');
    }
  };

  const handleDownloadInvoice = async () => {
    if (rentalData) {
      try {
        const response = await fetch(`/api/rental/invoice/${rentalData._id}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `facture-location-${rentalData.orderNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          alert('Erreur lors du téléchargement de la facture');
        }
      } catch (error) {
        console.error('Erreur téléchargement:', error);
        alert('Erreur lors du téléchargement de la facture');
      }
    }
  };

  const clearRentalCart = () => {
    // Le panier de location a été fusionné avec le panier principal
    // Pas besoin de vider un panier séparé
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement de votre location...</div>
        </div>
      </div>
    );
  }

  if (error || !rentalData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error || 'Données de location non trouvées'}</div>
          <Button onClick={() => setLocation('/rent')}>
            Retour à la location
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Location confirmée !
          </h1>
          <p className="text-gray-600">
            Votre location a été confirmée et vous recevrez bientôt un email de confirmation.
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Numéro de commande: {rentalData.orderNumber}
            </Badge>
          </div>
        </div>

        {/* Détails de la location */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Détails de votre location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rentalData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.product.mainImageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity} | {item.dailyPrice.toFixed(2)}€/jour
                    </p>
                    <p className="text-sm text-gray-600">
                      Du {format(new Date(item.rentalStartDate), 'dd/MM/yyyy', { locale: fr })} 
                      au {format(new Date(item.rentalEndDate), 'dd/MM/yyyy', { locale: fr })}
                      ({item.rentalDays} jours)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.totalPrice.toFixed(2)}€</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Résumé financier */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Résumé financier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{rentalData.subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (20%):</span>
                <span>{rentalData.tax.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Dépôt (30%):</span>
                <span>{rentalData.deposit.toFixed(2)}€</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total payé:</span>
                  <span className="text-green-600">{rentalData.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleViewInvoice}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            Voir la facture
          </Button>
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger la facture
          </Button>
        </div>

        {/* Informations importantes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Informations importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Package className="w-4 h-4 mt-0.5 text-blue-600" />
                <div>
                  <strong>Retrait :</strong> Vendredi 17h30-19h30 (ou selon accord)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 text-green-600" />
                <div>
                  <strong>Retour :</strong> Dimanche 15h30-17h30 (ou selon accord)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-orange-600" />
                <div>
                  <strong>Dépôt :</strong> Le dépôt de 30% sera remboursé après retour en bon état
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons de navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            onClick={() => {
              clearRentalCart();
              setLocation('/rent');
            }}
            variant="outline"
            className="flex-1"
          >
            Continuer les locations
          </Button>
          <Button
            onClick={() => {
              clearRentalCart();
              setLocation('/');
            }}
            className="flex-1"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalSuccess;
