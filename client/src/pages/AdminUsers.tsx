import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Eye, 
  Filter,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ShoppingCart
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isActive: boolean;
  role: 'user' | 'admin';
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
             const params = new URLSearchParams({
         page: currentPage.toString(),
         limit: "10",
         ...(searchTerm && { search: searchTerm }),
         ...(roleFilter && roleFilter !== "all" && { role: roleFilter })
       });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération utilisateurs");
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      user: "Utilisateur",
      admin: "Administrateur"
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      user: "bg-blue-100 text-blue-800",
      admin: "bg-purple-100 text-purple-800"
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
      month: "short",
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
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
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h1>
            </div>
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
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                                 <SelectContent>
                   <SelectItem value="all">Tous les rôles</SelectItem>
                   <SelectItem value="user">Utilisateurs</SelectItem>
                   <SelectItem value="admin">Administrateurs</SelectItem>
                 </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {users.length} utilisateur(s) trouvé(s)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p>{user.address.street}</p>
                        <p>{user.address.city}, {user.address.postalCode}</p>
                        <p>{user.address.country}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Commandes</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{user.orderCount}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Total dépensé</div>
                    <p className="text-lg font-bold text-gold">{formatPrice(user.totalSpent)}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inscrit le:</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                  {user.lastOrderDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dernière commande:</span>
                      <span>{formatDate(user.lastOrderDate)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/users/${user._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le profil
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

        {users.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600 mb-4">
                             {searchTerm || (roleFilter && roleFilter !== "all")
                 ? "Aucun utilisateur ne correspond à vos critères de recherche."
                 : "Vous n'avez pas encore d'utilisateurs."
               }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
