import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Star
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  isPublished: boolean;
  createdAt: string;
}

export default function AdminRealisations() {
  const [, setLocation] = useLocation();
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchRealisations();
  }, [searchTerm, categoryFilter]);

  const fetchRealisations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/realisations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération réalisations");
      }

      const data = await response.json();
      let filtered = data;

      // Filtrage côté client
      if (searchTerm) {
        filtered = filtered.filter((r: Realisation) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (categoryFilter && categoryFilter !== "all") {
        filtered = filtered.filter((r: Realisation) => r.category === categoryFilter);
      }

      setRealisations(filtered);
    } catch (error) {
      console.error("Erreur récupération réalisations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/realisations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur suppression");
      }

      fetchRealisations();
    } catch (error) {
      console.error("Erreur suppression réalisation:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Mariage": "bg-pink-100 text-pink-800",
      "Anniversaire": "bg-blue-100 text-blue-800",
      "Baby Shower": "bg-purple-100 text-purple-800",
      "Événement Corporate": "bg-gray-100 text-gray-800",
      "Autre": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setLocation("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Réalisations</h1>
              <p className="text-gray-600 mt-1">Gérez toutes vos réalisations</p>
            </div>
          </div>
          <Button 
            onClick={() => setLocation("/admin/realisations/add")} 
            className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une réalisation
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par titre ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Mariage">Mariage</SelectItem>
                  <SelectItem value="Anniversaire">Anniversaire</SelectItem>
                  <SelectItem value="Baby Shower">Baby Shower</SelectItem>
                  <SelectItem value="Événement Corporate">Événement Corporate</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Realisations Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : realisations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune réalisation trouvée</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realisations.map((realisation) => (
              <Card key={realisation._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {realisation.images && realisation.images.length > 0 ? (
                      <img
                        src={realisation.images[0]}
                        alt={realisation.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <Badge className={`absolute top-2 left-2 ${getCategoryColor(realisation.category)}`}>
                      {realisation.category}
                    </Badge>
                    {!realisation.isPublished && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Non publiée
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{realisation.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(realisation.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{realisation.location}</span>
                    </div>
                    {realisation.guests && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{realisation.guests}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < realisation.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{realisation.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/admin/realisations/${realisation._id}/edit`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(realisation._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

