import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Trash2, Calendar, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ImageWithFallback from '../components/ImageWithFallback';
import Layout from '../components/Layout';

interface RentalItem {
  productId: string;
  product: {
    _id: string;
    name: string;
    description: string;
    dailyRentalPrice: number;
    mainImageUrl: string;
  };
  quantity: number;
  dailyPrice: number;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;
  totalPrice: number;
  customizations: Record<string, string>;
  customMessage: string;
}

const RentalCart: React.FC = () => {
  const [, setLocation] = useLocation();
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRentalCart();
  }, []);

  const loadRentalCart = () => {
    const cart = JSON.parse(localStorage.getItem('rentalCart') || '[]');
    setRentalItems(cart);
  };

  const removeItem = (index: number) => {
    const updatedItems = rentalItems.filter((_, i) => i !== index);
    setRentalItems(updatedItems);
    localStorage.setItem('rentalCart', JSON.stringify(updatedItems));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...rentalItems];
    const item = updatedItems[index];
    item.quantity = newQuantity;
    item.totalPrice = item.dailyPrice * item.rentalDays * newQuantity;
    
    setRentalItems(updatedItems);
    localStorage.setItem('rentalCart', JSON.stringify(updatedItems));
  };

  const calculateSubtotal = () => {
    return rentalItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.20; // TVA 20%
  };

  const calculateDeposit = () => {
    return calculateSubtotal() * 0.30; // Dépôt 30%
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeposit();
  };

  const handleCheckout = async () => {
    if (rentalItems.length === 0) {
      alert('Votre panier de location est vide');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/rental/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: rentalItems
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        
        // Rediriger vers Stripe Checkout
        console.log('Redirection vers Stripe:', url);
        window.location.href = url;
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur checkout:', error);
      alert('Erreur lors du passage à la commande');
    } finally {
      setLoading(false);
    }
  };

  if (rentalItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Votre panier de location est vide</h2>
          <p className="text-gray-500 mb-6">Ajoutez des produits à louer pour commencer</p>
          <Button onClick={() => setLocation('/shop')}>
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panier de location</h1>
        <p className="text-gray-600">Gérez vos produits à louer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {rentalItems.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-32 h-32 flex-shrink-0">
                    <ImageWithFallback
                      src={item.product.mainImageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{item.product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Du {format(new Date(item.rentalStartDate), 'dd/MM/yyyy', { locale: fr })} 
                        au {format(new Date(item.rentalEndDate), 'dd/MM/yyyy', { locale: fr })}
                        ({item.rentalDays} jours)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Quantité:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {item.dailyPrice.toFixed(2)}€/jour × {item.rentalDays} jours × {item.quantity}
                        </div>
                        <div className="font-semibold text-lg text-orange-600">
                          {item.totalPrice.toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {/* Personnalisations */}
                    {Object.keys(item.customizations).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Personnalisations:</h4>
                        <div className="space-y-1">
                          {Object.entries(item.customizations).map(([key, value]) => (
                            <div key={key} className="text-sm text-gray-600">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message personnalisé */}
                    {item.customMessage && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Message:</h4>
                        <p className="text-sm text-gray-600 italic">"{item.customMessage}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{calculateSubtotal().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%):</span>
                  <span>{calculateTax().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Dépôt (30%):</span>
                  <span>{calculateDeposit().toFixed(2)}€</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-orange-600">{calculateTotal().toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Informations importantes:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Un dépôt de 30% est requis</li>
                  <li>• Les dates seront confirmées après paiement</li>
                  <li>• Livraison et récupération incluses</li>
                </ul>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading || rentalItems.length === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              >
                {loading ? 'Chargement...' : 'Procéder au paiement'}
              </Button>

              <Button
                variant="outline"
                onClick={() => setLocation('/shop')}
                className="w-full"
              >
                Continuer les achats
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default RentalCart;
