import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { CalendarIcon, Plus, Minus, Calendar as CalendarIcon2, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ImageWithFallback from '../components/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Product {
  _id: string;
  name: string;
  description: string;
  dailyRentalPrice: number;
  category: string;
  mainImageUrl: string;
  additionalImages?: string[];
  isForRent: boolean;
  isCustomizable: boolean;
  customizationOptions?: Record<string, string[]>;
  stockQuantity?: number;
}

interface RentalDate {
  startDate: Date;
  endDate: Date;
}

const RentalDetail: React.FC = () => {
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rentalStartDate, setRentalStartDate] = useState<Date | undefined>();
  const [rentalEndDate, setRentalEndDate] = useState<Date | undefined>();
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [customMessage, setCustomMessage] = useState('');
  const [bookedDates, setBookedDates] = useState<RentalDate[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSaleWarning, setShowSaleWarning] = useState(false);

  // Récupérer l'ID du produit depuis l'URL
  const productId = window.location.pathname.split('/rental/')[1];

  useEffect(() => {
    if (productId && productId !== '[object Object]') {
      fetchProduct();
      fetchBookedDates();
    } else {
      console.error('ID de produit invalide:', productId);
      setLocation('/shop');
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Produit non trouvé');
        setLocation('/shop');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(`/api/rental/product/${productId}/booked-dates`);
      if (response.ok) {
        const data = await response.json();
        setBookedDates(data.dates || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des dates réservées:', error);
    }
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booking => 
      date >= booking.startDate && date <= booking.endDate
    );
  };

  const calculateRentalDays = () => {
    if (!rentalStartDate || !rentalEndDate) return 0;
    // Normaliser les dates (enlever les heures pour comparer uniquement les dates)
    const start = new Date(rentalStartDate);
    const end = new Date(rentalEndDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    // Calculer le nombre de jours inclus (date de début et date de fin incluses)
    const timeDiff = end.getTime() - start.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 car on inclut le jour de début
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    // Le prix ne dépend pas du nombre de jours, seulement de la quantité
    return product.dailyRentalPrice * quantity;
  };

  const handleAddToCart = () => {
    if (!product || !rentalStartDate || !rentalEndDate) {
      alert('Veuillez sélectionner les dates de location');
      return;
    }

    // Vérifier le stock
    if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
      alert('Ce produit est en rupture de stock et ne peut pas être ajouté au panier.');
      return;
    }

    // Récupérer le panier existant pour vérifier
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Vérifier s'il y a des produits de vente dans le panier
    const hasSaleItems = existingCart.some((item: any) => item.isRental === false);
    
    if (hasSaleItems) {
      // Afficher le popup d'avertissement
      setShowSaleWarning(true);
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.dailyRentalPrice,
      quantity,
      image: product.mainImageUrl,
      isRental: true,
      customizations,
      customMessage,
      rentalStartDate: rentalStartDate.toISOString(),
      rentalEndDate: rentalEndDate.toISOString(),
      rentalDays: calculateRentalDays(),
      dailyPrice: product.dailyRentalPrice,
      totalPrice: calculateTotalPrice()
    };

    // Ajouter au panier principal (localStorage)
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Déclencher l'événement de mise à jour du panier
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    // Notification
    alert('Produit ajouté au panier !');
    setLocation('/cart');
  };

  const handleCustomizationChange = (option: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [option]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement du produit...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Produit non trouvé</h2>
          <Button onClick={() => setLocation('/shop')}>
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  if (!product.isForRent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Ce produit n'est pas disponible à la location</h2>
          <Button onClick={() => setLocation('/shop')}>
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  // Combiner l'image principale et les images supplémentaires
  const allImages = product ? [product.mainImageUrl, ...(product.additionalImages || [])] : [];
  const currentImage = allImages[selectedImageIndex] || product?.mainImageUrl || '';

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      {/* Popup d'avertissement pour produits de vente dans le panier */}
      <AlertDialog open={showSaleWarning} onOpenChange={setShowSaleWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Panier incompatible</AlertDialogTitle>
            <AlertDialogDescription>
              Vous ne pouvez pas ajouter un produit de location à votre panier car vous avez déjà des produits de vente.
              <br /><br />
              Veuillez d'abord terminer votre commande de vente avant d'ajouter des produits de location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowSaleWarning(false);
              setLocation('/cart');
            }}>
              Voir mon panier
            </AlertDialogAction>
            <AlertDialogAction onClick={() => setShowSaleWarning(false)}>
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images du produit avec galerie */}
        <div className="space-y-4">
          {/* Image principale */}
          <Card>
            <CardHeader className="p-0">
              <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 relative">
                <ImageWithFallback
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Galerie de miniatures */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    index === selectedImageIndex 
                      ? 'border-orange-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={150}
                    height={150}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails et configuration */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{product.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-orange-500">Location</Badge>
              {product.isCustomizable && (
                <Badge className="bg-blue-500">Personnalisable</Badge>
              )}
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {(product.dailyRentalPrice * 1.20).toFixed(2)}€ TTC
            </div>
            <p className="text-xs text-gray-500 mb-4">{product.dailyRentalPrice.toFixed(2)}€ HT</p>
            
            {/* Stock Info */}
            {product.stockQuantity !== undefined && (
              <div className="flex items-center space-x-2 text-sm mb-4">
                <Package className="w-4 h-4" />
                <span className={product.stockQuantity > 0 ? 'text-gray-600' : 'text-red-600 font-semibold'}>
                  {product.stockQuantity > 0 
                    ? `${product.stockQuantity} en stock` 
                    : 'Rupture de stock'
                  }
                </span>
              </div>
            )}
          </div>

          {/* Sélection des dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon2 className="w-5 h-5" />
                Sélectionner les dates de location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de début</Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rentalStartDate ? (
                          format(rentalStartDate, 'PPP', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={rentalStartDate}
                        onSelect={(date) => {
                          setRentalStartDate(date);
                          if (date && rentalEndDate && date > rentalEndDate) {
                            setRentalEndDate(undefined);
                          }
                        }}
                        disabled={(date) => 
                          date < new Date() || isDateBooked(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={!rentalStartDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rentalEndDate ? (
                          format(rentalEndDate, 'PPP', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={rentalEndDate}
                        onSelect={setRentalEndDate}
                        disabled={(date) => 
                          date < new Date() || 
                          (rentalStartDate && date < rentalStartDate) ||
                          isDateBooked(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {rentalStartDate && rentalEndDate && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800">
                    <strong>Durée de location :</strong> {calculateRentalDays()} jours
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quantité */}
          <Card>
            <CardHeader>
              <CardTitle>Quantité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stockQuantity !== undefined ? product.stockQuantity : undefined}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const maxQty = product.stockQuantity !== undefined ? product.stockQuantity : 9999;
                    const newQuantity = Math.max(1, Math.min(value, maxQty));
                    setQuantity(newQuantity);
                  }}
                  className="w-16 text-center font-semibold text-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Options de personnalisation */}
          {product.isCustomizable && product.customizationOptions && (
            <Card>
              <CardHeader>
                <CardTitle>Options de personnalisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  // Gérer les Map et les objets JavaScript
                  let optionsEntries;
                  if (product.customizationOptions instanceof Map) {
                    optionsEntries = Array.from(product.customizationOptions.entries());
                  } else {
                    optionsEntries = Object.entries(product.customizationOptions || {});
                  }
                  
                  return optionsEntries.map(([key, option]) => (
                    <div key={key}>
                      <Label>{option.label || key}</Label>
                      {option.type === 'dropdown' && option.options ? (
                        <Select
                          value={customizations[key] || ''}
                          onValueChange={(value) => handleCustomizationChange(key, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Choisir ${option.label || key.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {option.options.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : option.type === 'text' ? (
                        <input
                          type="text"
                          value={customizations[key] || ''}
                          onChange={(e) => handleCustomizationChange(key, e.target.value)}
                          placeholder={option.placeholder || `Entrez ${option.label || key.toLowerCase()}`}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      ) : option.type === 'textarea' ? (
                        <textarea
                          value={customizations[key] || ''}
                          onChange={(e) => handleCustomizationChange(key, e.target.value)}
                          placeholder={option.placeholder || `Entrez ${option.label || key.toLowerCase()}`}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows={3}
                        />
                      ) : (
                        <div className="text-gray-500">
                          Type de personnalisation non supporté: {option.type}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>
          )}

          {/* Message personnalisé */}
          <Card>
            <CardHeader>
              <CardTitle>Message personnalisé (optionnel)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ajoutez un message personnalisé..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Résumé et prix */}
          {rentalStartDate && rentalEndDate && (
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Prix par jour :</span>
                  <span>{product.dailyRentalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée :</span>
                  <span>{calculateRentalDays()} jours</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantité :</span>
                  <span>{quantity}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total :</span>
                    <span className="text-orange-600">{calculateTotalPrice().toFixed(2)}€ HT</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">TVA non incluse</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton d'action */}
          <Button
            onClick={handleAddToCart}
            disabled={!rentalStartDate || !rentalEndDate || (product.stockQuantity !== undefined && product.stockQuantity <= 0)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter au panier
          </Button>
          
          {product.stockQuantity !== undefined && product.stockQuantity === 0 && (
            <p className="text-sm text-red-600 text-center mt-2">
              Ce produit est en rupture de stock et ne peut pas être ajouté au panier.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RentalDetail;
