import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  ArrowLeft,
  EyeOff,
  Eye as EyeIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  isActive?: boolean;
  stockQuantity: number;
  dailyRentalPrice?: number;
  createdAt: string;
}

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
             const params = new URLSearchParams({
         page: currentPage.toString(),
         limit: "10",
         ...(searchTerm && { search: searchTerm }),
         ...(categoryFilter && categoryFilter !== "all" && { category: categoryFilter })
       });

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération produits");
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erreur récupération produits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${productId}/toggle-active`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du changement de statut");
      }

      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error("Erreur changement statut produit:", error);
      alert("Erreur lors du changement de statut du produit");
    }
  };

  const handleDelete = async (productId: string) => {
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

      // Refresh products list
      fetchProducts();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
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
                onClick={() => setLocation("/admin/dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestion des Produits
              </h1>
            </div>
            <Button
              onClick={() => setLocation("/admin/products/add")}
              className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtres et Recherche</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                                 <SelectContent>
                   <SelectItem value="all">Toutes les catégories</SelectItem>
                   <SelectItem value="shop">Boutique</SelectItem>
                   <SelectItem value="events">Événements</SelectItem>
                   <SelectItem value="rent">Location</SelectItem>
                   <SelectItem value="crea">Création</SelectItem>
                   <SelectItem value="home">Maison</SelectItem>
                   <SelectItem value="co">Co</SelectItem>
                 </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {products.length} produit(s) trouvé(s)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                                 <img
                   src={product.mainImageUrl}
                   alt={product.name}
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='16'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                   }}
                 />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex space-x-1">
                    {product.isActive === false && (
                      <Badge variant="destructive" className="text-xs">
                        Masqué
                      </Badge>
                    )}
                    {product.isCustomizable && (
                      <Badge variant="secondary" className="text-xs">
                        Personnalisable
                      </Badge>
                    )}
                    {product.isRentable && (
                      <Badge variant="outline" className="text-xs">
                        Location
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="default">
                    {getCategoryLabel(product.category)}
                  </Badge>
                  <span className="text-lg font-bold text-gold">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Stock: {product.stockQuantity}</span>
                  <span>
                    {product.dailyRentalPrice && `Location: ${formatPrice(product.dailyRentalPrice * 1.20)} TTC`}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/products/${product._id}`)}
                    className="flex-1"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/products/${product._id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(product._id, product.isActive !== false)}
                    className={product.isActive !== false ? "text-blue-600 hover:text-blue-700" : "text-gray-600 hover:text-gray-700"}
                    title={product.isActive !== false ? "Masquer le produit" : "Afficher le produit"}
                  >
                    {product.isActive !== false ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || (categoryFilter && categoryFilter !== "all")
                ? "Aucun produit ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de produits. Commencez par en ajouter un !"
              }
            </p>
            <Button
              onClick={() => setLocation("/admin/products/add")}
              className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre premier produit
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
