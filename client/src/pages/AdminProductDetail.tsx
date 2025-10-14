import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  Tag,
  Settings,
  Eye,
  ShoppingCart,
  Clock
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  mainImageUrl: string;
  additionalImages: string[];
  isCustomizable: boolean;
  isRentable: boolean;
  stockQuantity: number;
  dailyRentalPrice?: number;
  customizationOptions?: {
    [key: string]: {
      type: 'dropdown' | 'checkbox' | 'text' | 'textarea';
      label: string;
      required: boolean;
      options?: string[];
      placeholder?: string;
      maxLength?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductDetail() {
  const [location, setLocation] = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract product ID from URL
  const productId = location.split('/').pop();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération produit");
      }

      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      setError("Erreur lors du chargement du produit");
      console.error("Erreur récupération produit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur suppression produit");
      }

      setLocation("/admin/products");
    } catch (error) {
      console.error("Erreur suppression produit:", error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      shop: "Boutique",
      events: "Événements",
      rent: "Location",
      crea: "Création",
      home: "Maison",
      co: "Co"
    };
    return categories[category as keyof typeof categories] || category;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Produit non trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            {error || "Le produit que vous recherchez n'existe pas."}
          </p>
          <Button
            onClick={() => setLocation("/admin/products")}
            className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin/products")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Détails du Produit
              </h1>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setLocation(`/admin/products/${productId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                                 <img
                   src={product.mainImageUrl}
                   alt={product.name}
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Ctext x='300' y='300' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='24'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                   }}
                 />
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <div className="flex space-x-2">
                    {product.isCustomizable && (
                      <Badge variant="secondary">
                        <Settings className="h-3 w-3 mr-1" />
                        Personnalisable
                      </Badge>
                    )}
                    {product.isRentable && (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Location
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gold">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="default">
                    <Tag className="h-3 w-3 mr-1" />
                    {getCategoryLabel(product.category)}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Sous-catégorie</h4>
                    <p className="text-gray-600">{product.subcategory}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Stock</h4>
                    <p className="text-gray-600">{product.stockQuantity} unités</p>
                  </div>
                </div>

                {product.dailyRentalPrice && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Prix de location</h4>
                    <p className="text-gray-600">{formatPrice(product.dailyRentalPrice)} par jour</p>
                  </div>
                )}
              </CardContent>
            </Card>

                         {/* Customization Options */}
             {product.isCustomizable && product.customizationOptions && Object.keys(product.customizationOptions).length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Settings className="h-5 w-5" />
                     <span>Options de Personnalisation</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {Object.entries(product.customizationOptions).map(([key, option]) => (
                       <div key={key} className="p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center justify-between mb-2">
                           <h5 className="font-medium text-gray-900">{option.label}</h5>
                           <Badge variant="outline" className="text-xs">
                             {option.type}
                           </Badge>
                         </div>
                         {option.type === 'dropdown' || option.type === 'checkbox' ? (
                           <div className="flex flex-wrap gap-2">
                             {option.options?.map((value, index) => (
                               <Badge key={index} variant="secondary" className="text-xs">
                                 {value}
                               </Badge>
                             ))}
                           </div>
                         ) : (
                           <div className="text-sm text-gray-600">
                             {option.placeholder && <p>Placeholder: {option.placeholder}</p>}
                             {option.maxLength && <p>Longueur max: {option.maxLength} caractères</p>}
                           </div>
                         )}
                         {option.required && (
                           <Badge variant="destructive" className="text-xs mt-2">
                             Obligatoire
                           </Badge>
                         )}
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}

            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Statut du Produit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                                     <div className="flex justify-between items-center">
                     <span className="text-gray-600">Statut</span>
                     <Badge variant="default">
                       Actif
                     </Badge>
                   </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Créé le</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Modifié le</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(product.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
