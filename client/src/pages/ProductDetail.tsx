import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  Palette,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import ProductCustomization from "@/components/ProductCustomization";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  mainImageUrl: string;
  additionalImages: string[];
  isCustomizable: boolean;
  isForSale: boolean;
  isForRent: boolean;
  stockQuantity: number;
  dailyRentalPrice?: number;
  customizationOptions?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface CustomizationSelection {
  [key: string]: any;
}

export default function ProductDetail() {
  const [location, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<CustomizationSelection>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showRentalWarning, setShowRentalWarning] = useState(false);

  // Extract product ID from URL
  const productId = location.split('/')[2]; // /product/{id}

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!productId,
  });

  const [priceAdjustment, setPriceAdjustment] = useState(0);

  const handleCustomizationChange = (newCustomizations: CustomizationSelection, adjustment: number = 0) => {
    setCustomizations(newCustomizations);
    setPriceAdjustment(adjustment);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Récupérer le panier existant pour vérifier
    const existingCart = localStorage.getItem('cart');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];

    // Vérifier s'il y a des produits de location dans le panier
    const hasRentalItems = cartItems.some((item: any) => item.isRental === true);
    
    if (hasRentalItems) {
      // Afficher le popup d'avertissement
      setShowRentalWarning(true);
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Calculer le prix total : prix de base + ajustement des valeurs sélectionnées
      const basePrice = product.price;
      const adjustedPrice = basePrice + priceAdjustment;
      let totalPrice = adjustedPrice;

      // Préparer l'article pour le panier
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: adjustedPrice, // Prix avec ajustement
        quantity: quantity,
        image: product.mainImageUrl,
        isRental: false,
        customizations: customizations,
        customizationPrice: priceAdjustment, // Ajustement du prix
        totalPrice: totalPrice
      };

      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = cartItems.findIndex((item: any) => 
        item.productId === product._id && !item.isRental
      );

      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].customizations = customizations;
        cartItems[existingItemIndex].customizationPrice = 0; // Pas de prix supplémentaire
        cartItems[existingItemIndex].totalPrice = totalPrice;
      } else {
        // Ajouter le nouvel article
        cartItems.push(cartItem);
      }

      // Sauvegarder le panier
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Notifier le CartIcon que le panier a été mis à jour
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const allImages = product ? [product.mainImageUrl, ...product.additionalImages] : [];
  const currentImage = allImages[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const totalPrice = product?.price || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-skd-shop border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Produit non trouvé</p>
          <Button onClick={() => setLocation("/shop")} className="mt-4">
            Retour à la boutique
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Popup d'avertissement pour produits de location dans le panier */}
      <AlertDialog open={showRentalWarning} onOpenChange={setShowRentalWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Panier incompatible</AlertDialogTitle>
            <AlertDialogDescription>
              Vous ne pouvez pas ajouter un produit de vente à votre panier car vous avez déjà des produits de location.
              <br /><br />
              Veuillez d'abord terminer votre commande de location avant d'ajouter des produits de vente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowRentalWarning(false);
              setLocation('/cart');
            }}>
              Voir mon panier
            </AlertDialogAction>
            <AlertDialogAction onClick={() => setShowRentalWarning(false)}>
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-skd-shop/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/shop")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la boutique
          </Button>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 relative">
                <ImageWithFallback 
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
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

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                        index === selectedImageIndex 
                          ? 'border-skd-shop' 
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
              
              {product.isCustomizable && (
                <Alert>
                  <Palette className="h-4 w-4" />
                  <AlertDescription>
                    Ce produit est personnalisable ! Choisissez vos options ci-dessous.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  {product.subcategory}
                </Badge>
                <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-3xl font-bold text-skd-shop">
                      {(totalPrice * 1.20).toFixed(2)}€ TTC
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{totalPrice.toFixed(2)}€ HT</p>
                    {quantity > 1 && (
                      <span className="text-sm text-gray-500 ml-2 block mt-1">
                        ({(totalPrice / quantity).toFixed(2)}€ HT l'unité)
                      </span>
                    )}
                  </div>
                  {product.isRentable && product.dailyRentalPrice && (
                    <span className="text-sm text-gray-500">
                      ou {(product.dailyRentalPrice * 1.20).toFixed(2)}€ TTC
                    </span>
                  )}
                </div>
                {priceAdjustment !== 0 && (
                  <p className={`text-sm mt-2 ${priceAdjustment > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                    {priceAdjustment > 0 ? '+' : ''}{priceAdjustment.toFixed(2)}€ {priceAdjustment > 0 ? 'supplémentaire' : 'de réduction'} pour cette option
                  </p>
                )}
              </div>

              {/* Stock Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>
                  {product.stockQuantity > 0 
                    ? `${product.stockQuantity} en stock` 
                    : 'Rupture de stock'
                  }
                </span>
              </div>

              {/* Customization Options */}
              {product.isCustomizable && product.customizationOptions && (
                <ProductCustomization
                  productName={product.name}
                  productImage={product.mainImageUrl}
                  customizationOptions={product.customizationOptions}
                  onCustomizationChange={handleCustomizationChange}
                  initialCustomizations={customizations}
                  basePrice={product.price}
                />
              )}

              {/* Quantity and Add to Cart */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Quantité:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={quantity >= product.stockQuantity}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Price Display */}
                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {(totalPrice * quantity).toFixed(2)}€ HT
                      </span>
                      {quantity > 1 && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({totalPrice.toFixed(2)}€ HT l'unité)
                        </span>
                      )}
                      <p className="text-xs text-gray-500 mt-1">TVA non incluse</p>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                      size="lg"
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Ajout en cours...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Ajouter au panier
                        </>
                      )}
                    </Button>

                    {product.stockQuantity === 0 && (
                      <p className="text-sm text-red-600 text-center">
                        Ce produit n'est plus disponible
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
