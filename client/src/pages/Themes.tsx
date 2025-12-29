import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Heart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Theme {
  _id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  mainImageUrl: string;
  category: string;
}

export default function Themes() {
  const [, setLocation] = useLocation();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Fetch themes
  const { data: themes = [], isLoading: themesLoading } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await fetch("/api/themes");
      if (!response.ok) {
        throw new Error("Failed to fetch themes");
      }
      return response.json();
    },
  });

  // Fetch products by theme
  const { data: themeProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["theme-products", selectedTheme],
    queryFn: async () => {
      if (!selectedTheme) return [];
      const response = await fetch(`/api/themes/${selectedTheme}/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
    enabled: !!selectedTheme,
  });

  const handleThemeClick = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
  };

  return (
    <Layout>
      {!selectedTheme ? (
        <>
          {/* Hero Section */}
          <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gold/10 via-pink-50/50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-8 sm:mb-12 md:mb-16">
                <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-gold to-yellow-500 text-white border-none text-xs sm:text-sm font-semibold">
                  Personnalisation à l'infini
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 sm:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gold via-yellow-500 to-gold bg-clip-text text-transparent">
                    Nos Thèmes
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
                  Découvrez notre collection de thèmes personnalisables pour sublimer tous vos événements. 
                  Chaque thème est conçu avec soin pour créer une ambiance unique et mémorable.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Palette className="h-5 w-5 text-gold" />
                    <span className="font-medium">Personnalisation complète</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="h-5 w-5 text-pink-500" />
                    <span className="font-medium">Créations sur mesure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Qualité premium</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Themes Grid */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              {themesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des thèmes...</p>
                </div>
              ) : themes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucun thème disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {themes.map((theme) => (
                    <Card
                      key={theme._id}
                      className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                      onClick={() => handleThemeClick(theme._id)}
                    >
                      <div className="relative aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={theme.imageUrl}
                          alt={theme.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-2">
                          {theme.title}
                        </h3>
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-gold text-gold hover:bg-gold hover:text-white"
                        >
                          Voir les produits
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Products by Theme */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <Button
                variant="ghost"
                onClick={handleBackToThemes}
                className="mb-6"
              >
                ← Retour aux thèmes
              </Button>
              
              {productsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des produits...</p>
                </div>
              ) : themeProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Aucun produit disponible pour ce thème.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8">
                    Produits - {themes.find(t => t._id === selectedTheme)?.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themeProducts.map((product) => (
                      <Card
                        key={product._id}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setLocation(`/product/${product._id}`)}
                      >
                        <div className="aspect-square bg-gray-200 overflow-hidden">
                          <img
                            src={product.mainImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                          <p className="text-lg font-bold text-gold">
                            {product.price.toFixed(2)}€ HT
                          </p>
                          <p className="text-xs text-gray-500">TVA non incluse</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}
