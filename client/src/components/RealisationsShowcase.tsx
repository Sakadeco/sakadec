import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface Realisation {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  guests?: number;
  description: string;
  images: string[];
  highlights: string[];
  rating: number;
}

export default function RealisationsShowcase() {
  const { data: realisations = [], isLoading } = useQuery<Realisation[]>({
    queryKey: ["/api/realisations"],
    queryFn: async () => {
      const response = await fetch("/api/realisations");
      if (!response.ok) {
        throw new Error("Failed to fetch realisations");
      }
      return response.json();
    },
  });

  // Récupérer les 3 dernières réalisations (triées par date décroissante)
  const latestRealisations = realisations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (latestRealisations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune réalisation disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {latestRealisations.map((realisation) => (
        <Card
          key={realisation._id}
          className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl overflow-hidden"
        >
          <div className="aspect-video overflow-hidden relative">
            <img
              src={realisation.images && realisation.images.length > 0 ? realisation.images[0] : "/api/placeholder/400/300"}
              alt={realisation.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-gold text-white">{realisation.category}</Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-gold transition-colors line-clamp-2">
              {realisation.title}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(realisation.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{realisation.location}</span>
              </div>
              {realisation.guests && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{realisation.guests} invités</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {realisation.description}
            </p>
            <Link to={`/realisations/${realisation._id}`}>
              <span className="text-gold hover:text-yellow-600 font-semibold text-sm transition-colors cursor-pointer">
                Voir les détails →
              </span>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

