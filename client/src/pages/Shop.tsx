import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Layout from '../components/Layout';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  mainImageUrl: string;
  stockQuantity: number;
  isForSale: boolean;
  isCustomizable: boolean;
  customizationOptions?: Record<string, string[]>;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Filtrer seulement les produits disponibles à la vente
        const saleProducts = data.filter((product: Product) => product.isForSale);
        setProducts(saleProducts);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les produits
  const getFilteredProducts = () => {
    let filtered = products;

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Chargement des produits...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Boutique</h1>
        <p className="text-sm sm:text-base text-gray-600">Découvrez nos produits disponibles à la vente</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {getFilteredProducts().map((product) => (
          <Card key={product._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative">
                <ImageWithFallback
                  src={product.mainImageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {product.isCustomizable && (
                  <Badge className="absolute top-2 right-2 bg-blue-500">
                    Personnalisable
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 whitespace-pre-line">
                {product.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-green-600">
                    {(product.price * 1.20).toFixed(2)}€ TTC
                  </span>
                  <p className="text-xs text-gray-500">{product.price.toFixed(2)}€ HT</p>
                </div>
                <Badge variant={product.stockQuantity > 0 ? "default" : "destructive"} className="w-fit">
                  {product.stockQuantity > 0 ? 'En stock' : 'Rupture'}
                </Badge>
              </div>
              <Link to={`/product/${product._id.toString()}`}>
                <Button className="w-full text-sm sm:text-base" disabled={product.stockQuantity === 0}>
                  Voir le produit
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {getFilteredProducts().length === 0 && !loading && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Shop;
