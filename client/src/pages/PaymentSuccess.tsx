import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [, setLocation] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Récupérer les détails de la commande
      fetchOrderDetails(sessionId);
    } else {
      setLoading(false);
    }

    // Vider le panier
    localStorage.removeItem('cart');
  }, []);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/payment/orders/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      } else {
        console.error('Erreur lors de la récupération des détails de commande:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de commande:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-skd-shop border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement réussi !
          </h1>
          <p className="text-lg text-gray-600">
            Votre commande a été confirmée et sera traitée dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Détails de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Détails de la commande</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderDetails ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Numéro de commande:</span>
                      <span className="font-medium">{orderDetails._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total payé:</span>
                      <span className="font-bold text-lg">{orderDetails.total?.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className="text-green-600 font-medium">Payé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {orderDetails.isRental ? 'Location' : 'Achat'}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">
                    Les détails de votre commande seront disponibles dans votre espace client.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Prochaines étapes */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines étapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Confirmation par email</h4>
                      <p className="text-sm text-gray-600">
                        Vous recevrez un email de confirmation avec tous les détails de votre commande.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Préparation</h4>
                      <p className="text-sm text-gray-600">
                        Notre équipe prépare votre commande avec soin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Livraison</h4>
                      <p className="text-sm text-gray-600">
                        Vous recevrez un email avec le numéro de suivi dès l'expédition.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => orderDetails ? setLocation(`/invoice/${orderDetails._id}`) : setLocation('/orders')}
              className="bg-green-600 hover:bg-green-700"
            >
              📄 Voir ma facture
            </Button>
            <Button
              onClick={() => setLocation('/orders')}
              className="bg-skd-shop hover:bg-skd-shop/90"
            >
              <Package className="w-4 h-4 mr-2" />
              Voir mes commandes
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/shop')}
            >
              Continuer mes achats
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Des questions ? Notre équipe est là pour vous aider.
            </p>
            <Button
              variant="ghost"
              onClick={() => setLocation('/contact')}
            >
              Contactez-nous
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentSuccess;
