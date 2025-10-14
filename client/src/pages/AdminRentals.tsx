import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  Home, 
  CreditCard, 
  User, 
  Calendar,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import Layout from '@/components/Layout';

interface RentalItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    dailyRentalPrice: number;
    mainImageUrl: string;
  };
  quantity: number;
  dailyPrice: number;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;
  totalPrice: number;
  customizations?: any;
}

interface Rental {
  _id: string;
  user?: {
    _id: string;
    email: string;
    name: string;
  };
  items: RentalItem[];
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  subtotal: number;
  tax: number;
  deposit: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  orderNumber: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminRentals: React.FC = () => {
  const [, setLocation] = useLocation();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLocation('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/rentals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des locations');
      }

      const data = await response.json();
      setRentals(data.rentals);
    } catch (error) {
      console.error('Erreur récupération locations:', error);
      alert('Erreur lors de la récupération des locations');
    } finally {
      setLoading(false);
    }
  };

  const updateRentalStatus = async (rentalId: string, status: string, paymentStatus?: string) => {
    try {
      setUpdatingStatus(rentalId);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/rentals/${rentalId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, paymentStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      await fetchRentals();
      alert('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = 
      rental.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.items.some(item => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || rental.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Locations</h1>
              <p className="text-gray-600 mt-2">Gérez toutes les locations de vos clients</p>
            </div>
            <Button onClick={fetchRentals} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtres</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Recherche</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Rechercher par numéro, nom, produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentStatus">Statut Paiement</Label>
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les paiements</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="failed">Échoué</SelectItem>
                      <SelectItem value="refunded">Remboursé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPaymentStatusFilter('all');
                    }}
                    className="w-full"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rentals List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Locations ({filteredRentals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRentals.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune location trouvée</h3>
                  <p className="text-gray-600">Aucune location ne correspond à vos critères de recherche.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRentals.map((rental) => (
                    <div key={rental._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Location #{rental.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(rental.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(rental.status)}>
                            {rental.status === 'pending' && 'En attente'}
                            {rental.status === 'confirmed' && 'Confirmée'}
                            {rental.status === 'active' && 'Active'}
                            {rental.status === 'completed' && 'Terminée'}
                            {rental.status === 'cancelled' && 'Annulée'}
                          </Badge>
                          
                          <Badge className={getPaymentStatusColor(rental.paymentStatus)}>
                            {rental.paymentStatus === 'pending' && 'Paiement en attente'}
                            {rental.paymentStatus === 'paid' && 'Paiement effectué'}
                            {rental.paymentStatus === 'failed' && 'Paiement échoué'}
                            {rental.paymentStatus === 'refunded' && 'Paiement remboursé'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                          <div className="text-sm text-gray-600">
                            <p>{rental.shippingAddress.firstName} {rental.shippingAddress.lastName}</p>
                            <p>{rental.shippingAddress.address}</p>
                            <p>{rental.shippingAddress.postalCode} {rental.shippingAddress.city}</p>
                            <p>{rental.shippingAddress.phone}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Produits loués</h4>
                          <div className="space-y-1">
                            {rental.items.map((item, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                <p>{item.product?.name || 'Produit supprimé'} x{item.quantity}</p>
                                <p className="text-xs text-gray-500">
                                  {item.rentalDays} jours - {item.totalPrice.toFixed(2)}€
                                </p>
                                <p className="text-xs text-gray-500">
                                  Du {new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} au {new Date(item.rentalEndDate).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Total</h4>
                          <div className="text-sm text-gray-600">
                            <p>Sous-total: {rental.subtotal.toFixed(2)}€</p>
                            <p>TVA: {rental.tax.toFixed(2)}€</p>
                            <p>Dépôt: {rental.deposit.toFixed(2)}€</p>
                            <p className="font-semibold text-gray-900">
                              Total: {rental.total.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRental(rental)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Select
                            value={rental.status}
                            onValueChange={(value) => updateRentalStatus(rental._id, value)}
                            disabled={updatingStatus === rental._id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmée</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Terminée</SelectItem>
                              <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                          </Select>

                          {updatingStatus === rental._id && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rental Details Modal */}
        {selectedRental && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Détails de la location #{selectedRental.orderNumber}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRental(null)}
                  >
                    Fermer
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Informations client</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom:</strong> {selectedRental.shippingAddress.firstName} {selectedRental.shippingAddress.lastName}</p>
                      <p><strong>Adresse:</strong> {selectedRental.shippingAddress.address}</p>
                      <p><strong>Ville:</strong> {selectedRental.shippingAddress.postalCode} {selectedRental.shippingAddress.city}</p>
                      <p><strong>Pays:</strong> {selectedRental.shippingAddress.country}</p>
                      <p><strong>Téléphone:</strong> {selectedRental.shippingAddress.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Informations location</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Statut:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedRental.status)}`}>
                          {selectedRental.status}
                        </Badge>
                      </p>
                      <p><strong>Paiement:</strong> 
                        <Badge className={`ml-2 ${getPaymentStatusColor(selectedRental.paymentStatus)}`}>
                          {selectedRental.paymentStatus}
                        </Badge>
                      </p>
                      <p><strong>Méthode:</strong> {selectedRental.paymentMethod}</p>
                      <p><strong>Date:</strong> {new Date(selectedRental.createdAt).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Produits loués</h3>
                  <div className="space-y-3">
                    {selectedRental.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <img
                          src={item.product.mainImageUrl}
                          alt={item.product?.name || 'Produit supprimé'}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAxNkMyMy4xNjM0IDE2IDE2IDIzLjE2MzQgMTYgMzJDMTYgNDAuODM2NiAyMy4xNjM0IDQ4IDMyIDQ4QzQwLjgzNjYgNDggNDggNDAuODM2NiA0OCAzMkM0OCAyMy4xNjM0IDQwLjgzNjYgMTYgMzIgMTZaIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyNS4zNzI2IDIwIDIwIDI1LjM3MjYgMjAgMzJDMjAgMzguNjI3NCAyNS4zNzI2IDQ0IDMyIDQ0QzM4LjYyNzQgNDQgNDQgMzguNjI3NCA0NCAzMkM0NCAyNS4zNzI2IDM4LjYyNzQgMjAgMzIgMjBaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product?.name || 'Produit supprimé'}</h4>
                          <p className="text-sm text-gray-600">
                            Quantité: {item.quantity} | Prix/jour: {item.dailyPrice.toFixed(2)}€
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.rentalDays} jours - Du {new Date(item.rentalStartDate).toLocaleDateString('fr-FR')} au {new Date(item.rentalEndDate).toLocaleDateString('fr-FR')}
                          </p>
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <span key={key} className="mr-2">{key}: {value as string}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {item.totalPrice.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{selectedRental.subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA:</span>
                      <span>{selectedRental.tax.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dépôt:</span>
                      <span>{selectedRental.deposit.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{selectedRental.total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminRentals;
