import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GalleryItem } from "@shared/schema";
import { Instagram, Heart, Eye } from "lucide-react";

interface GalleryShowcaseProps {
  category?: string;
  limit?: number;
  showHeader?: boolean;
}

export function GalleryShowcase({ category, limit = 6, showHeader = true }: GalleryShowcaseProps) {
  const { data: galleryItems, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery", category],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  let filteredItems = galleryItems?.filter(item => item.isPublished) || [];
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  const displayItems = filteredItems
    .sort((a, b) => (b.orderIndex || 0) - (a.orderIndex || 0))
    .slice(0, limit);

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Instagram className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucune réalisation pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="h-8 w-8 text-pink-500" />
            <h3 className="text-3xl font-playfair font-bold text-gray-800 dark:text-gray-100">
              Nos Réalisations
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Découvrez nos créations et laissez-vous inspirer
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <span>Suivez-nous</span>
            <Badge variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none">
              @sakadeco_group
            </Badge>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-gold/20">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.imageUrl || "/api/placeholder/400/400"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-white">
                    <Heart className="h-5 w-5 fill-white" />
                    <span className="text-sm font-semibold">24k</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-semibold">1.2k</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-gold transition-colors">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCategoryColor(item.category)}`}
                >
                  {getCategoryLabel(item.category)}
                </Badge>
                {item.tags && Array.isArray(item.tags) && (
                  <div className="flex gap-1">
                    {(item.tags as string[]).slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showHeader && (
        <div className="text-center">
          <a
            href="https://instagram.com/sakadeco_group"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <Instagram className="h-5 w-5" />
            Voir plus sur Instagram
          </a>
        </div>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors = {
    events: "border-skd-events text-skd-events bg-skd-events/10",
    home: "border-skd-home text-skd-home bg-skd-home/10",
    shop: "border-skd-shop text-skd-shop bg-skd-shop/10",
    rent: "border-skd-rent text-skd-rent bg-skd-rent/10",
    crea: "border-skd-crea text-skd-crea bg-skd-crea/10",
    co: "border-skd-co text-skd-co bg-skd-co/10",
  };
  return colors[category as keyof typeof colors] || "border-gray-300 text-gray-600";
}

function getCategoryLabel(category: string): string {
  const labels = {
    events: "SKD Events",
    home: "SKD Home",
    shop: "SKD Shop",
    rent: "SKD Rent",
    crea: "SKD Créa",
    co: "SKD Co",
  };
  return labels[category as keyof typeof labels] || category;
}