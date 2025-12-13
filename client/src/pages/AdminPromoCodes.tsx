import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Percent
} from "lucide-react";

interface PromoCode {
  _id: string;
  code: string;
  discountPercentage: number;
  applyToAllProducts: boolean;
  applicableProducts: Array<{ _id: string; name: string }>;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  description?: string;
  createdAt: string;
}

export default function AdminPromoCodes() {
  const [, setLocation] = useLocation();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/promo-codes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération codes promo");
      }

      const data = await response.json();
      setPromoCodes(data);
    } catch (error) {
      console.error("Erreur récupération codes promo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur suppression");
      }

      fetchPromoCodes();
    } catch (error) {
      console.error("Erreur suppression code promo:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const filteredCodes = promoCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isCurrentlyValid = (code: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(code.validFrom);
    const validUntil = new Date(code.validUntil);
    return now >= validFrom && now <= validUntil && code.isActive;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setLocation("/admin/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Codes Promo</h1>
              <p className="text-gray-600 mt-1">Créez et gérez vos codes promotionnels</p>
            </div>
          </div>
          <Button onClick={() => setLocation("/admin/promo-codes/add")} className="bg-gold hover:bg-gold/90">
            <Plus className="w-4 h-4 mr-2" />
            Créer un code promo
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par code ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Promo Codes List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucun code promo trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCodes.map((code) => (
              <Card key={code._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">{code.code}</h3>
                        <Badge className={`${isCurrentlyValid(code) ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {isCurrentlyValid(code) ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valide
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Invalide
                            </>
                          )}
                        </Badge>
                        {!code.isActive && (
                          <Badge variant="destructive">Inactif</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gold">
                          <Percent className="w-5 h-5" />
                          {code.discountPercentage}% de réduction
                        </div>
                        <Badge variant={code.applyToAllProducts ? "default" : "secondary"}>
                          {code.applyToAllProducts ? "Tous les produits" : `${code.applicableProducts.length} produit(s)`}
                        </Badge>
                      </div>

                      {code.description && (
                        <p className="text-gray-600 mb-3">{code.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Du</div>
                            <div>{new Date(code.validFrom).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Au</div>
                            <div>{new Date(code.validUntil).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Utilisations</div>
                          <div>
                            {code.usageCount}
                            {code.usageLimit && ` / ${code.usageLimit}`}
                          </div>
                        </div>
                        {!code.applyToAllProducts && code.applicableProducts.length > 0 && (
                          <div>
                            <div className="font-medium">Produits</div>
                            <div className="text-xs text-gray-500">
                              {code.applicableProducts.slice(0, 3).map(p => p.name).join(", ")}
                              {code.applicableProducts.length > 3 && ` +${code.applicableProducts.length - 3}`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/promo-codes/${code._id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(code._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

