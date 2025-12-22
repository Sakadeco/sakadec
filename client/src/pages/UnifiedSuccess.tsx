import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Calendar, Package, Download, Mail, ShoppingCart, Home } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderData {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      mainImageUrl: string;
    };
    quantity: number;
    price: number;
    totalPrice: number;
    customizations?: any;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerEmail: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

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
    customizations?: any;
  }>;
  subtotal: number;
  tax: number;
  deposit: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerEmail: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

const UnifiedSuccess: React.FC = () => {
  const [, setLocation] = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [rentalData, setRentalData] = useState<RentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMixedCart, setIsMixedCart] = useState(false);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      fetchData(sessionId);
    } else {
      setError('Session ID manquant');
      setLoading(false);
    }
  }, []);

  const fetchData = async (sessionId: string) => {
    try {
      setLoading(true);
      let orderResult = null;
      let rentalResult = null;
      
      // Vérifier si c'est un panier mixte
      const mixedCartData = localStorage.getItem('mixedCartData');
      let isMixedCart = false;
      
      if (mixedCartData) {
        const mixedData = JSON.parse(mixedCartData);
        isMixedCart = mixedData.isMixedCart;
        console.log('🛒 Panier mixte détecté:', mixedData);
      }
      
      if (isMixedCart) {
        // Pour un panier mixte, utiliser les données stockées
        const mixedData = JSON.parse(mixedCartData);
        
        // Récupérer les données de vente (session actuelle)
        try {
          const orderResponse = await fetch(`/api/payment/orders/session/${sessionId}`);
          if (orderResponse.ok) {
            orderResult = await orderResponse.json();
            setOrderData(orderResult);
            console.log('✅ Données de vente récupérées (panier mixte):', orderResult);
          }
        } catch (orderError) {
          console.log('ℹ️ Erreur récupération données vente:', orderError);
        }

        // Créer des données de location simulées à partir des items stockés
        if (mixedData.rentalItems && mixedData.rentalItems) {
          const rentalSimulated = {
            _id: 'temp-rental-' + Date.now(),
            orderNumber: 'RENT-TEMP-' + Date.now(),
            items: mixedData.rentalItems.map((item: any) => ({
              product: {
                _id: item.productId,
                name: item.productName || 'Produit de location',
                mainImageUrl: item.productImage || ''
              },
              quantity: item.quantity,
              dailyPrice: item.dailyPrice,
              rentalStartDate: item.rentalStartDate,
              rentalEndDate: item.rentalEndDate,
              rentalDays: item.rentalDays || 1,
              totalPrice: item.totalPrice,
              customizations: item.customizations || {}
            })),
            subtotal: mixedData.rentalItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0),
            tax: 0,
            deposit: 0,
            total: mixedData.rentalItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0),
            status: 'confirmed',
            paymentStatus: 'paid',
            customerEmail: mixedData.customerEmail,
            shippingAddress: mixedData.shippingAddress,
            createdAt: new Date().toISOString()
          };
          
          setRentalData(rentalSimulated);
          console.log('✅ Données de location simulées (panier mixte):', rentalSimulated);
        }
        
        // Nettoyer les données du panier mixte
        localStorage.removeItem('mixedCartData');
        
      } else {
        // Panier simple : essayer de récupérer les données avec le session_id actuel
        try {
          const orderResponse = await fetch(`/api/payment/orders/session/${sessionId}`);
          if (orderResponse.ok) {
            orderResult = await orderResponse.json();
            setOrderData(orderResult);
            console.log('✅ Données de vente récupérées:', orderResult);
          }
        } catch (orderError) {
          console.log('ℹ️ Pas de données de vente pour cette session');
        }

        try {
          const rentalResponse = await fetch(`/api/rental/session/${sessionId}`);
          if (rentalResponse.ok) {
            rentalResult = await rentalResponse.json();
            setRentalData(rentalResult);
            console.log('✅ Données de location récupérées:', rentalResult);
          }
        } catch (rentalError) {
          console.log('ℹ️ Pas de données de location pour cette session');
        }
      }

      // Déterminer si c'est un panier mixte
      setIsMixedCart(!!orderResult && !!rentalResult);

      // Vider le panier après confirmation de la commande
      if (orderResult || rentalResult) {
        localStorage.removeItem('cart');
        localStorage.removeItem('rentalCart');
        localStorage.removeItem('mixedCartData');
        // Notifier que le panier a été mis à jour
        window.dispatchEvent(new Event('cartUpdated'));
        console.log('🛒 Panier vidé après achat réussi');
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSaleInvoice = () => {
    if (orderData) {
      window.open(`/invoice/${orderData._id}`, '_blank');
    }
  };

  const handleDownloadSaleInvoice = async () => {
    if (orderData) {
      try {
        const response = await fetch(`/api/payment/invoice/${orderData._id}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `facture-vente-${orderData.orderNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          alert('Erreur lors du téléchargement de la facture de vente');
        }
      } catch (error) {
        console.error('Erreur téléchargement facture vente:', error);
        alert('Erreur lors du téléchargement de la facture de vente');
      }
    }
  };

  const handleViewRentalInvoice = () => {
    if (rentalData) {
      window.open(`/rental/invoice/${rentalData._id}`, '_blank');
    }
  };

  const handleDownloadRentalInvoice = async () => {
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
          alert('Erreur lors du téléchargement de la facture de location');
        }
      } catch (error) {
        console.error('Erreur téléchargement facture location:', error);
        alert('Erreur lors du téléchargement de la facture de location');
      }
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('rentalCart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de votre commande...</p>
        </div>
      </div>
    );
  }

  if (error || (!orderData && !rentalData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Aucune donnée trouvée'}</p>
          <Button onClick={() => setLocation('/')}>
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = (orderData?.total || 0) + (rentalData?.total || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isMixedCart ? 'Commandes confirmées !' : (orderData ? 'Commande confirmée !' : 'Location confirmée !')}
          </h1>
          <p className="text-gray-600">
            {isMixedCart 
              ? 'Vos commandes de vente et de location ont été traitées avec succès'
              : (orderData ? 'Votre commande a été traitée avec succès' : 'Votre location a été confirmée avec succès')
            }
          </p>
        </div>

        {/* Résumé financier unifié */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Résumé financier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">🛒 Commande de vente</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="ml-2 font-medium">{orderData.subtotal.toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-gray-600">TVA:</span>
                      <span className="ml-2 font-medium">{orderData.tax.toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Livraison:</span>
                      <span className="ml-2 font-medium">{orderData.shipping.toFixed(2)}€</span>
                    </div>
                    <div className="font-bold text-blue-900">
                      <span>Total vente:</span>
                      <span className="ml-2">{orderData.total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              )}

              {rentalData && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">🏠 Location</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="ml-2 font-medium">{rentalData.subtotal.toFixed(2)}€</span>
                    </div>
                    <div>
                      <span className="text-gray-600">TVA:</span>
                      <span className="ml-2 font-medium">{rentalData.tax.toFixed(2)}€</span>
                    </div>
                    <div>
                    </div>
                    <div className="font-bold text-orange-900">
                      <span>Total location:</span>
                      <span className="ml-2">{rentalData.total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              )}

              {isMixedCart && (
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h3 className="font-bold text-green-900 mb-2">💰 Total général</h3>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-green-900">{totalAmount.toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {orderData && (
            <>
              <Button 
                onClick={handleViewSaleInvoice}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Voir la facture de vente
              </Button>
              <Button 
                onClick={handleDownloadSaleInvoice}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger la facture de vente
              </Button>
            </>
          )}

          {rentalData && (
            <>
              <Button 
                onClick={handleViewRentalInvoice}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Voir la facture de location
              </Button>
              <Button 
                onClick={handleDownloadRentalInvoice}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger la facture de location
              </Button>
            </>
          )}
        </div>

        {/* Informations de contact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {orderData?.customerEmail || rentalData?.customerEmail}</p>
              <p><strong>Nom:</strong> {orderData?.shippingAddress?.firstName || rentalData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName || rentalData?.shippingAddress?.lastName}</p>
              <p><strong>Adresse:</strong> {orderData?.shippingAddress?.address || rentalData?.shippingAddress?.address}</p>
              <p><strong>Ville:</strong> {orderData?.shippingAddress?.postalCode || rentalData?.shippingAddress?.postalCode} {orderData?.shippingAddress?.city || rentalData?.shippingAddress?.city}</p>
              <p><strong>Pays:</strong> {orderData?.shippingAddress?.country || rentalData?.shippingAddress?.country}</p>
              <p><strong>Téléphone:</strong> {orderData?.shippingAddress?.phone || rentalData?.shippingAddress?.phone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions finales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => {
              clearCart();
              setLocation('/');
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          <Button 
            onClick={() => {
              clearCart();
              setLocation('/shop');
            }}
            variant="outline"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Continuer mes achats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSuccess;
