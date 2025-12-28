import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const pathParts = location.split('/').filter(Boolean);
  const productId = pathParts[pathParts.length - 1]; // Dernier segment de l'URL

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId || productId === 'undefined' || productId === '[object Object]') {
        throw new Error('ID de produit invalide');
      }
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!productId && productId !== 'undefined' && productId !== '[object Object]',
  });

  const [priceAdjustment, setPriceAdjustment] = useState(0);
  const [currentBasePrice, setCurrentBasePrice] = useState(0);

  // Mettre à jour currentBasePrice quand le produit change
  useEffect(() => {
    if (product && product.price) {
      setCurrentBasePrice(product.price);
    }
  }, [product]);

  const handleCustomizationChange = (newCustomizations: CustomizationSelection, adjustment: number = 0) => {
    setCustomizations(newCustomizations);
    setPriceAdjustment(adjustment);
    // Mettre à jour le prix de base si un ajustement est appliqué
    if (product) {
      const newBasePrice = product.price + adjustment;
      setCurrentBasePrice(newBasePrice);
    }
  };

  const validateRequiredCustomizations = (): boolean => {
    if (!product || !product.customizationOptions) return true;

    // Convertir Map en objet si nécessaire
    const options = product.customizationOptions instanceof Map
      ? Object.fromEntries(product.customizationOptions)
      : product.customizationOptions;

    // Vérifier chaque option obligatoire
    for (const [key, option] of Object.entries(options)) {
      if (option.required) {
        const customization = customizations[key];
        
        // Si l'option n'existe pas dans customizations, elle n'est pas remplie
        if (!customization) {
          alert(`Le champ "${option.label || key}" est obligatoire. Veuillez le remplir avant d'ajouter le produit au panier.`);
          return false;
        }

        // Pour les options de type text_image_upload
        if (option.type === 'text_image_upload') {
          const engravingType = option.engravingType || 'both';
          
          if (engravingType === 'text' || engravingType === 'both') {
            // Vérifier si le texte est rempli
            // Pour engravingType === 'text', la structure est { type: 'text', value: '...' }
            // Pour engravingType === 'both', la structure est { type: 'both', textValue: '...' }
            let textValue = null;
            if (customization && typeof customization === 'object') {
              textValue = customization.textValue || customization.value || (customization.type === 'text' ? customization.value : null);
            } else if (typeof customization === 'string') {
              textValue = customization;
            }
            
            if (!textValue || (typeof textValue === 'string' && textValue.trim() === '')) {
              const fieldName = engravingType === 'both' ? 'Inscription souhaitée + date de l\'événement' : 'Inscription souhaitée';
              alert(`Le champ "${option.label || fieldName}" est obligatoire. Veuillez remplir le texte avant d'ajouter le produit au panier.`);
              return false;
            }
          }
          
          // Pour engravingType === 'image', l'image est obligatoire si required est true
          // Pour engravingType === 'both', même si required est true, l'image reste optionnelle (seul le texte est obligatoire)
          if (engravingType === 'image') {
            // Vérifier si l'image est remplie (obligatoire uniquement si engravingType est 'image')
            let imageValue = null;
            if (customization && typeof customization === 'object') {
              imageValue = customization.imageValue || customization.image || (customization.type === 'image' ? customization.value : null);
            }
            
            if (!imageValue || (typeof imageValue === 'string' && imageValue.trim() === '')) {
              alert(`Le champ "${option.label || 'Image pour l\'inscription'}" est obligatoire. Veuillez télécharger une image avant d'ajouter le produit au panier.`);
              return false;
            }
          }
          // Pour 'both', on ne vérifie que le texte (déjà fait ci-dessus), l'image reste optionnelle
        } else {
          // Pour les autres types (dropdown, checkbox, text, textarea)
          if (!customization || (typeof customization === 'string' && customization.trim() === '')) {
            alert(`Le champ "${option.label || key}" est obligatoire. Veuillez le remplir avant d'ajouter le produit au panier.`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Vérifier les champs obligatoires de personnalisation
    if (!validateRequiredCustomizations()) {
      return;
    }

    // Vérifier le stock
    if (product.stockQuantity <= 0) {
      alert('Ce produit est en rupture de stock et ne peut pas être ajouté au panier.');
      return;
    }

    // Vérifier que la quantité demandée est disponible
    // Calculer la quantité totale en stock en comptant TOUS les articles de ce produit dans le panier
    // (peu importe les personnalisations, car ils partagent le même stock)
    const existingCart = localStorage.getItem('cart');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    const itemsWithSameProduct = cartItems.filter((item: any) => item.productId === product._id && !item.isRental);
    const totalQuantityInCart = itemsWithSameProduct.reduce((sum: number, item: any) => sum + item.quantity, 0);
    
    if (totalQuantityInCart + quantity > product.stockQuantity) {
      alert(`Stock insuffisant. Il ne reste plus assez d'unités en stock. Vous avez déjà ${totalQuantityInCart} unité(s) de ce produit dans votre panier.`);
      return;
    }

    // Vérifier s'il y a des produits de location dans le panier
    const hasRentalItems = cartItems.some((item: any) => item.isRental === true);
    
    if (hasRentalItems) {
      // Afficher le popup d'avertissement
      setShowRentalWarning(true);
      return;
    }

    setIsAddingToCart(true);
    
    try {
      // Utiliser le prix de base actuel (qui peut avoir été modifié par une valeur sélectionnée)
      const finalPrice = currentBasePrice;

      // Préparer l'article pour le panier
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: finalPrice, // Prix avec valeur sélectionnée (si applicable)
        quantity: quantity,
        image: product.mainImageUrl,
        isRental: false,
        customizations: customizations,
        customizationPrice: 0, // Pas de frais supplémentaires pour les personnalisations
        totalPrice: finalPrice
      };

      // Fonction pour comparer deux objets de personnalisation
      const areCustomizationsEqual = (custom1: any, custom2: any): boolean => {
        if (!custom1 && !custom2) return true;
        if (!custom1 || !custom2) return false;
        
        const keys1 = Object.keys(custom1 || {});
        const keys2 = Object.keys(custom2 || {});
        
        if (keys1.length !== keys2.length) return false;
        
        for (const key of keys1) {
          const val1 = custom1[key];
          const val2 = custom2[key];
          
          // Comparer les valeurs (gérer les objets et les valeurs simples)
          if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
            // Comparer les objets de personnalisation
            // Si c'est un objet avec textValue/imageValue (type 'both')
            if (val1.hasOwnProperty('textValue') || val2.hasOwnProperty('textValue') || 
                val1.hasOwnProperty('imageValue') || val2.hasOwnProperty('imageValue')) {
              if (val1.textValue !== val2.textValue || val1.imageValue !== val2.imageValue) {
                return false;
              }
            }
            // Si c'est un objet avec value et type (type 'text' ou 'image')
            else if (val1.hasOwnProperty('value') || val2.hasOwnProperty('value')) {
              if (val1.value !== val2.value || val1.type !== val2.type) {
                return false;
              }
            }
            // Sinon comparer directement les objets (cas générique)
            else {
              const objKeys1 = Object.keys(val1);
              const objKeys2 = Object.keys(val2);
              if (objKeys1.length !== objKeys2.length) return false;
              for (const objKey of objKeys1) {
                if (val1[objKey] !== val2[objKey]) return false;
              }
            }
          } else if (val1 !== val2) {
            return false;
          }
        }
        
        return true;
      };

      // Vérifier si le produit avec les mêmes personnalisations est déjà dans le panier
      const existingItemIndex = cartItems.findIndex((item: any) => {
        if (item.productId !== product._id || item.isRental !== false) {
          return false;
        }
        // Vérifier si les personnalisations sont identiques
        return areCustomizationsEqual(item.customizations, customizations);
      });

      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si le produit avec les mêmes personnalisations existe
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].customizationPrice = 0;
        cartItems[existingItemIndex].price = finalPrice;
        cartItems[existingItemIndex].totalPrice = finalPrice;
      } else {
        // Ajouter le nouvel article (produit différent ou personnalisations différentes)
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

  // Utiliser le prix de base actuel (qui peut avoir été modifié par une valeur sélectionnée)
  const totalPrice = currentBasePrice;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-skd-shop border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error('Erreur chargement produit:', error);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur lors du chargement du produit</h2>
            <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : 'Erreur inconnue'}</p>
            <Button onClick={() => setLocation('/shop')}>
              Retour à la boutique
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
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
              </div>

              {/* Stock Info */}
              {product.isForSale && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>
                    {product.stockQuantity > 0 
                      ? 'En stock' 
                      : 'Rupture de stock'
                    }
                  </span>
                </div>
              )}

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
                        <Input
                          type="number"
                          min="1"
                          max={product.stockQuantity}
                          value={quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            const newQuantity = Math.max(1, Math.min(value, product.stockQuantity));
                            setQuantity(newQuantity);
                          }}
                          className="w-16 text-center font-medium"
                        />
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
                      disabled={isAddingToCart || product.stockQuantity === 0}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
