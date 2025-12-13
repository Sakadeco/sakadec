import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51RwMYOR0o3iJkkS6m6QdutPepHoHevnGVfr771nNV25WXrE74hpb2vvPKpEiL7EHTQYtJ2rX71rbGxnXaLnheUjP00dz8vDKzm');

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isRental: boolean;
  customizations?: any;
  customMessage?: string;
  // Propriétés spécifiques à la location
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
  dailyPrice?: number;
  totalPrice?: number;
}

const CartPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });
  const [deliveryMethod, setDeliveryMethod] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeError, setPromoCodeError] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<{ code: string; discountPercentage: number } | null>(null);
  const [isValidatingPromoCode, setIsValidatingPromoCode] = useState(false);
  
  // Vérifier si le panier contient des produits personnalisés
  const hasCustomizedProducts = cartItems.some(item => 
    item.customizations && Object.keys(item.customizations).length > 0
  );

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeItem = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const subtotal = cartItems.reduce((total, item) => {
    let itemTotal;
    
    // Calcul différent pour les locations
    if (item.isRental && item.totalPrice) {
      itemTotal = item.totalPrice;
    } else {
      itemTotal = item.price * item.quantity;
      
      // Les personnalisations sont maintenant gratuites, pas de prix supplémentaire
    }
    
    return total + itemTotal;
  }, 0);
  
  // TVA non incluse - pas de calcul de TVA
  const tax = 0;
  
  // Calculer les frais de livraison selon le mode choisi
  const getShippingCost = (): number => {
    if (!hasCustomizedProducts) return 0; // Pas de frais pour les produits non personnalisés
    
    switch (deliveryMethod) {
      case 'colissimo':
        return 9.59;
      case 'point-relais':
        return 5.69;
      case 'chronopost':
        return 10.40;
      case 'chrono-classic':
        return 16.90;
      case 'retrait':
        return 0;
      case 'international':
        return 0; // Sur devis
      default:
        return 0;
    }
  };
  
  const shipping = getShippingCost();
  
  // Calculer la réduction du code promo
  const promoDiscount = appliedPromoCode 
    ? Math.round(subtotal * (appliedPromoCode.discountPercentage / 100) * 100) / 100
    : 0;
  
  const total = Math.round((subtotal - promoDiscount + tax + shipping) * 100) / 100; // Arrondir le total
  
  // Fonction pour valider et appliquer le code promo
  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeError('Veuillez entrer un code promo');
      return;
    }

    setIsValidatingPromoCode(true);
    setPromoCodeError('');

    try {
      // Valider le code promo pour chaque produit du panier (ou le premier si panier mixte)
      const firstProductId = cartItems[0]?.productId;
      
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode.toUpperCase().trim(),
          productId: firstProductId
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setPromoCodeError(data.message || 'Code promo invalide');
        setAppliedPromoCode(null);
        return;
      }

      // Si le code ne s'applique pas à tous les produits, vérifier chaque produit du panier
      if (!data.applyToAllProducts) {
        // Vérifier que tous les produits du panier sont éligibles
        const allProductsEligible = await Promise.all(
          cartItems.map(async (item) => {
            const checkResponse = await fetch('/api/promo-codes/validate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: promoCode.toUpperCase().trim(),
                productId: item.productId
              }),
            });
            const checkData = await checkResponse.json();
            return checkResponse.ok && checkData.valid;
          })
        );
        
        if (!allProductsEligible.every(eligible => eligible)) {
          setPromoCodeError('Ce code promo ne s\'applique pas à tous les produits de votre panier');
          setAppliedPromoCode(null);
          return;
        }
      }

      setAppliedPromoCode({
        code: data.code,
        discountPercentage: data.discountPercentage
      });
      setPromoCodeError('');
    } catch (error) {
      console.error('Erreur validation code promo:', error);
      setPromoCodeError('Erreur lors de la validation du code promo');
      setAppliedPromoCode(null);
    } finally {
      setIsValidatingPromoCode(false);
    }
  };

  // Log pour vérification
  console.log('🛒 Calcul panier client:', {
    subtotal: subtotal.toFixed(2),
    promoDiscount: promoDiscount.toFixed(2),
    tax: tax.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2)
  });

  // Fonction pour traiter les paniers mixtes
  const processMixedCart = async (saleItems: any[], rentalItems: any[], email: string, address: any) => {
    try {
      console.log('🛒 Traitement panier mixte:', {
        ventes: saleItems.length,
        locations: rentalItems.length
      });

      let saleData = null;
      let rentalData = null;

      // Créer session de vente
      if (saleItems.length > 0) {
        console.log('💳 Création session de vente...');
        const saleResponse = await fetch('/api/payment/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            items: saleItems, 
            customerEmail: email, 
            shippingAddress: address, 
            billingAddress: address, 
            isRental: false,
            isMixedCart: true,
            cartType: 'sale',
            promoCode: appliedPromoCode?.code || null,
            promoDiscount: promoDiscount || 0
          }),
        });

        if (!saleResponse.ok) {
          const errorData = await saleResponse.json();
          throw new Error(`Erreur session vente: ${errorData.message}`);
        }

        saleData = await saleResponse.json();
        console.log('✅ Session vente créée:', saleData.sessionId);
      }

      // Créer session de location
      if (rentalItems.length > 0) {
        console.log('🏠 Création session de location...');
        const rentalResponse = await fetch('/api/rental/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            items: rentalItems, 
            customerEmail: email, 
            shippingAddress: address, 
            billingAddress: address, 
            isRental: true,
            isMixedCart: true,
            cartType: 'rental'
          }),
        });

        if (!rentalResponse.ok) {
          const errorData = await rentalResponse.json();
          throw new Error(`Erreur session location: ${errorData.message}`);
        }

        rentalData = await rentalResponse.json();
        console.log('✅ Session location créée:', rentalData.sessionId);
      }

      // Rediriger vers les sessions Stripe
      if (saleData && rentalData) {
        // Panier mixte : stocker les informations et rediriger vers la vente d'abord
        console.log('🔄 Panier mixte détecté, stockage des informations...');
        localStorage.setItem('mixedCartData', JSON.stringify({
          saleSessionId: saleData.sessionId,
          rentalSessionId: rentalData.sessionId,
          saleItems: saleItems,
          rentalItems: rentalItems,
          customerEmail: email,
          shippingAddress: address,
          isMixedCart: true
        }));
        console.log('🔄 Redirection vers la session de vente...');
        window.location.href = saleData.url;
      } else if (saleData) {
        // Seulement la vente
        console.log('🔄 Redirection vers la session de vente...');
        window.location.href = saleData.url;
      } else if (rentalData) {
        // Seulement la location
        console.log('🔄 Redirection vers la session de location...');
        window.location.href = rentalData.url;
      }
      
    } catch (error) {
      console.error('Erreur panier mixte:', error);
      alert(`Erreur lors du traitement des commandes: ${error.message}`);
    }
  };

  const handleCheckout = async () => {
    if (!customerEmail) {
      alert('Veuillez entrer votre email');
      return;
    }

    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      alert('Veuillez remplir toutes les informations de livraison');
      return;
    }
    
    if (hasCustomizedProducts && !deliveryMethod) {
      alert('Veuillez sélectionner un mode de livraison');
      return;
    }
    
    if (!acceptedTerms) {
      alert('Veuillez accepter les Conditions Générales pour valider la commande');
      return;
    }

    setIsLoading(true);

    try {
      // Séparer les produits de vente et de location
      const saleItems = cartItems.filter(item => !item.isRental);
      const rentalItems = cartItems.filter(item => item.isRental);

      console.log('Analyse du panier:', {
        totalItems: cartItems.length,
        saleItems: saleItems.length,
        rentalItems: rentalItems.length
      });

      // Gérer les paniers mixtes - créer des sessions séparées
      if (saleItems.length > 0 && rentalItems.length > 0) {
        console.log('Panier mixte détecté - traitement séparé des commandes');
        await processMixedCart(saleItems, rentalItems, customerEmail, shippingAddress);
        return;
      }

      // Déterminer l'endpoint et les données pour panier simple
      const hasRentals = rentalItems.length > 0;
      const endpoint = hasRentals ? '/api/rental/create-checkout-session' : '/api/payment/create-checkout-session';
      const itemsToProcess = hasRentals ? rentalItems : saleItems;

      console.log('Envoi des données de paiement:', {
        items: itemsToProcess,
        customerEmail,
        shippingAddress,
        billingAddress: shippingAddress,
        hasRentals,
        endpoint
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: itemsToProcess, 
          customerEmail, 
          shippingAddress, 
          billingAddress: shippingAddress, 
          isRental: hasRentals,
          promoCode: appliedPromoCode?.code || null,
          promoDiscount: promoDiscount || 0
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }

      const { url } = await response.json();
      console.log('Redirection vers Stripe:', url);
      
      // Rediriger vers Stripe
      window.location.href = url;
    } catch (error) {
      console.error('Erreur checkout:', error);
      alert(`Erreur lors du processus de paiement: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
              <p className="text-gray-600 mb-8">Découvrez nos produits et commencez vos achats !</p>
              <Button 
                onClick={() => setLocation('/shop')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Continuer les achats
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/shop')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continuer les achats</span>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Votre Panier</h1>
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              Vider le panier
            </Button>
          </div>

          {/* Alerte pour panier mixte */}
          {cartItems.some(item => item.isRental) && cartItems.some(item => !item.isRental) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-blue-600">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-blue-900">Panier mixte détecté</h3>
                  <p className="text-blue-700 text-sm">
                    Votre panier contient des produits de vente et de location. 
                    Vous recevrez deux factures séparées lors du paiement.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Articles ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEMyOS4wNTQ5IDIwIDIwIDI5LjA1NDkgMjAgNDBDMjAgNTAuOTQ1MSAyOS4wNTQ5IDYwIDQwIDYwQzUwLjk0NTEgNjAgNjAgNTAuOTQ1MSA2MCA0MEM2MCAyOS4wNTQ5IDUwLjk0NTEgMjAgNDAgMjBaIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyNEMzMS4xNjM0IDI0IDI0IDMxLjE2MzQgMjQgNDBDMjQgNDguODM2NiAzMS4xNjM0IDU2IDQwIDU2QzQ4LjgzNjYgNTYgNTYgNDguODM2NiA1NiA0MEM1NiAzMS4xNjM0IDQ4LjgzNjYgMjQgNDAgMjRaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {item.isRental ? (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              📅 Location
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              🛒 Achat
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {(() => {
                            if (item.isRental && item.dailyPrice) {
                              // Le prix ne dépend pas du nombre de jours, seulement de la quantité
                              return `${item.dailyPrice.toFixed(2)}€ HT × ${item.quantity} = ${item.totalPrice?.toFixed(2)}€ HT`;
                            } else {
                              // Les personnalisations sont gratuites, pas de prix supplémentaire
                              return `${item.price.toFixed(2)}€ HT`;
                            }
                          })()}
                        </p>
                        {item.isRental && item.rentalStartDate && item.rentalEndDate && (
                          <p className="text-sm text-gray-500">
                            Du {new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} au {new Date(item.rentalEndDate).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            {Object.entries(item.customizations).map(([key, value]) => {
                              // Gérer les différents types de personnalisations
                              if (typeof value === 'string') {
                                return <div key={key}>{key}: {value}</div>;
                              } else if (typeof value === 'object' && value !== null) {
                                // Pour les objets de personnalisation {type, value, price} ou {type: 'both', textValue, imageValue, price}
                                const customization = value as any;
                                
                                if (customization.type === 'both') {
                                  return (
                                    <div key={key} className="space-y-1">
                                      {customization.textValue && (
                                        <div className="flex justify-between items-center">
                                          <span>{key} (texte): {customization.textValue}</span>
                                        </div>
                                      )}
                                      {customization.imageValue && (
                                        <div className="flex justify-between items-center">
                                          <span>{key} (image): Image fournie</span>
                                        </div>
                                      )}
                                      {customization.price > 0 && (
                                        <div className="text-gray-500 text-right text-xs">
                                          (Gratuit)
                                        </div>
                                      )}
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={key} className="flex justify-between items-center">
                                      <span>{key}: {customization.value}</span>
                                      {customization.price > 0 && (
                                        <span className="text-gray-500 text-xs">
                                          (Gratuit)
                                        </span>
                                      )}
                                    </div>
                                  );
                                }
                              } else if (Array.isArray(value)) {
                                return <div key={key}>{key}: {value.join(', ')}</div>;
                              }
                              return <div key={key}>{key}: {String(value)}</div>;
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!item.isRental && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {item.isRental && (
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {(() => {
                            if (item.isRental && item.totalPrice) {
                              return `${item.totalPrice.toFixed(2)}€ HT`;
                            } else {
                              // Les personnalisations sont gratuites, pas de prix supplémentaire
                              return `${(item.price * item.quantity).toFixed(2)}€ HT`;
                            }
                          })()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Order Summary */}
                             <Card>
                 <CardHeader>
                   <CardTitle>Récapitulatif</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="flex justify-between">
                     <span>Sous-total produits HT</span>
                     <span>{subtotal.toFixed(2)}€ HT</span>
                   </div>
                   
                   {appliedPromoCode && (
                     <div className="flex justify-between text-green-600">
                       <span>Code promo ({appliedPromoCode.code})</span>
                       <span>-{promoDiscount.toFixed(2)}€</span>
                     </div>
                   )}
                   
                   <div className="flex justify-between">
                     <span>Livraison</span>
                     <span>
                       {hasCustomizedProducts && deliveryMethod === 'international' 
                         ? 'Sur devis' 
                         : shipping > 0 
                           ? `${shipping.toFixed(2)}€` 
                           : 'Gratuit'}
                     </span>
                   </div>
                   <div className="border-t pt-4">
                     <div className="flex justify-between font-bold text-lg">
                       <span>Total HT</span>
                       <span>{total.toFixed(2)}€ HT</span>
                     </div>
                     <p className="text-xs text-gray-500 text-center mt-1">TVA non incluse</p>
                     {appliedPromoCode && (
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         onClick={() => {
                           setAppliedPromoCode(null);
                           setPromoCode('');
                         }}
                         className="text-xs text-red-600 hover:text-red-700 mt-2 w-full"
                       >
                         Retirer le code promo
                       </Button>
                     )}
                   </div>
                 </CardContent>
               </Card>

              {/* Code Promo */}
              {!appliedPromoCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-orange-600">Code Promo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Entrez votre code promo"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoCodeError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            validatePromoCode();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={validatePromoCode}
                        disabled={isValidatingPromoCode || !promoCode.trim()}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {isValidatingPromoCode ? 'Vérification...' : 'Appliquer'}
                      </Button>
                    </div>
                    {promoCodeError && (
                      <p className="text-sm text-red-600">{promoCodeError}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-600">Informations client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="border-2 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Votre email sera utilisé pour la confirmation de commande</p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-600">🚚 Adresse de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Livraison & Expédition - Seulement pour les produits personnalisés */}
              {hasCustomizedProducts && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-600">📦 Livraison & Expédition</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                      {/* France métropolitaine */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">France métropolitaine</Label>
                        
                        <div className="space-y-2 pl-4">
                          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="colissimo" id="colissimo" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="colissimo" className="cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">Colissimo sans signature</span>
                                    <p className="text-xs text-gray-600">Livraison 48-72h - Vers France Métropolitaine, Monaco et Andorre</p>
                                  </div>
                                  <span className="font-bold text-green-600">9,59 €</span>
                                </div>
                              </Label>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="point-relais" id="point-relais" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="point-relais" className="cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">Point Relais</span>
                                    <p className="text-xs text-gray-600">Livraison 3-5 jours</p>
                                  </div>
                                  <span className="font-bold text-green-600">5,69 €</span>
                                </div>
                              </Label>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="chronopost" id="chronopost" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="chronopost" className="cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">Chronopost</span>
                                    <p className="text-xs text-gray-600">Livraison le lendemain avant 18h (France métropolitaine)</p>
                                  </div>
                                  <span className="font-bold text-green-600">10,40 €</span>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Europe */}
                      <div className="space-y-3 mt-4">
                        <Label className="text-sm font-semibold text-gray-700">Europe (hors DOM-TOM)</Label>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 pl-4">
                          <RadioGroupItem value="chrono-classic" id="chrono-classic" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="chrono-classic" className="cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">Chrono Classic</span>
                                  <p className="text-xs text-gray-600">Livraison dans 38 pays européens - Délais : 2 à 3 jours dans les principaux centres économiques de l'UE</p>
                                </div>
                                <span className="font-bold text-green-600">16,90 €</span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* International + Outre-Mer */}
                      <div className="space-y-3 mt-4">
                        <Label className="text-sm font-semibold text-gray-700">International + Outre-Mer</Label>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 pl-4">
                          <RadioGroupItem value="international" id="international" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="international" className="cursor-pointer">
                              <div>
                                <span className="font-medium">Tarif sur devis</span>
                                <p className="text-xs text-orange-600 font-medium mt-1">Merci de me contacter avant toute commande.</p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Retrait gratuit */}
                      <div className="space-y-3 mt-4">
                        <Label className="text-sm font-semibold text-gray-700">Retrait gratuit</Label>
                        
                        <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 pl-4">
                          <RadioGroupItem value="retrait" id="retrait" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="retrait" className="cursor-pointer">
                              <div>
                                <span className="font-medium">Remise en main propre gratuite</span>
                                <p className="text-xs text-gray-600">Bordeaux Caudéran</p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Clause d'acceptation des CGV */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      J'accepte les <a href="/cgv" target="_blank" className="text-blue-600 hover:underline font-semibold">Conditions Générales</a> pour valider la commande. *
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">💳 Informations de paiement</h3>
                  <p className="text-sm text-yellow-700">
                    Après avoir cliqué sur "Payer", vous serez redirigé vers Stripe pour saisir vos informations de paiement de manière sécurisée.
                  </p>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0 || !acceptedTerms}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">💳</span>
                      Payer {total.toFixed(2)}€
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Paiement sécurisé par Stripe • Vos données sont protégées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
