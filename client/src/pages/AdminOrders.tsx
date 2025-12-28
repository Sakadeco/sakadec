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
  Package, 
  CreditCard, 
  User, 
  Calendar,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import Layout from '@/components/Layout';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    dailyRentalPrice?: number;
    mainImageUrl: string;
  };
  quantity: number;
  price: number;
  dailyPrice?: number;
  isRental: boolean;
  customizations?: any;
  customText?: string;
  customImage?: string;
  customImageFile?: {
    originalName: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
  customizationPrice?: number;
}

interface Order {
  _id: string;
  user?: {
    _id: string;
    email: string;
    name: string;
  };
  items: OrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
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
  isRental: boolean;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminOrders: React.FC = () => {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLocation('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Erreur récupération commandes:', error);
      alert('Erreur lors de la récupération des commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
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

      // Mettre à jour la liste des commandes
      await fetchOrders();
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
      case 'paid': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              order.items.some(item => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter;

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

  const renderOrderDetails = (order: Order) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Informations client</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Nom:</strong> {order.user?.name || 'Client non connecté'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            <p><strong>Téléphone:</strong> {order.shippingAddress?.phone || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Adresse de livraison</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Produits commandés</h4>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-4">
                <img
                  src={item.product.mainImageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                  <p className="text-sm text-gray-600">
                    Quantité: {item.quantity} | Prix: {item.price.toFixed(2)}€
                  </p>
                  
                  {/* Affichage des personnalisations */}
                  {item.customizations && Object.keys(item.customizations).length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <h6 className="font-medium text-blue-900 mb-2">Personnalisations:</h6>
                      <div className="space-y-2">
                        {Object.entries(item.customizations).map(([key, value]) => {
                          if (typeof value === 'object' && value.type === 'both') {
                            return (
                              <div key={key} className="text-sm space-y-2">
                                <strong>{key.replace(/_/g, ' ')} (gravure texte + image):</strong>
                                {value.textValue && (
                                  <div className="ml-4">
                                    <strong>Texte:</strong> {value.textValue}
                                  </div>
                                )}
                                {value.imageValue && (
                                  <div className="ml-4">
                                    <strong>Image:</strong>
                                    <div className="mt-2">
                                      <img
                                        src={value.imageValue}
                                        alt="Image personnalisée"
                                        className="w-32 h-32 object-cover rounded border"
                                      />
                                      <div className="flex space-x-2 mt-1">
                                        <a
                                          href={value.imageValue}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 text-xs"
                                        >
                                          Voir en grand
                                        </a>
                                        <a
                                          href={value.imageValue}
                                          download
                                          className="text-green-600 hover:text-green-800 text-xs"
                                        >
                                          Télécharger
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } else if (typeof value === 'object' && value.type === 'text' && value.value) {
                            return (
                              <div key={key} className="text-sm">
                                <strong>{key.replace(/_/g, ' ')} (texte):</strong> {value.value}
                              </div>
                            );
                          } else if (typeof value === 'object' && value.type === 'image' && value.value) {
                            return (
                              <div key={key} className="text-sm">
                                <strong>{key.replace(/_/g, ' ')} (image):</strong>
                                <div className="mt-2">
                                  <img
                                    src={value.value}
                                    alt="Image personnalisée"
                                    className="w-32 h-32 object-cover rounded border"
                                  />
                                  <div className="flex space-x-2 mt-1">
                                    <a
                                      href={value.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Voir en grand
                                    </a>
                                    <a
                                      href={value.value}
                                      download
                                      className="text-green-600 hover:text-green-800 text-xs"
                                    >
                                      Télécharger
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          } else if (typeof value === 'string') {
                            return (
                              <div key={key} className="text-sm">
                                <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                      {item.customizationPrice && item.customizationPrice > 0 && (
                        <div className="mt-2 text-sm text-blue-700">
                          <strong>Prix de personnalisation:</strong> +{item.customizationPrice.toFixed(2)}€
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Sous-total</p>
          <p className="text-lg font-semibold">{order.subtotal.toFixed(2)}€</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Livraison</p>
          <p className="text-lg font-semibold">{order.shipping.toFixed(2)}€</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-semibold text-green-700">{order.total.toFixed(2)}€</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
              <p className="text-gray-600 mt-2">Gérez toutes les commandes de vos clients</p>
            </div>
            <Button onClick={fetchOrders} className="flex items-center space-x-2">
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
                      placeholder="Rechercher par ID, nom, email..."
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
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="shipped">Expédié</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                      <SelectItem value="refunded">Remboursé</SelectItem>
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

              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Commandes ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
                  <p className="text-gray-600">Aucune commande ne correspond à vos critères de recherche.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Commande #{order._id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
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
                          <Badge className={getStatusColor(order.status)}>
                            {order.status === 'pending' && 'En attente'}
                            {order.status === 'paid' && 'Payé'}
                            {order.status === 'shipped' && 'Expédié'}
                            {order.status === 'delivered' && 'Livré'}
                            {order.status === 'cancelled' && 'Annulé'}
                            {order.status === 'refunded' && 'Remboursé'}
                          </Badge>
                          
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus === 'pending' && 'Paiement en attente'}
                            {order.paymentStatus === 'paid' && 'Paiement effectué'}
                            {order.paymentStatus === 'failed' && 'Paiement échoué'}
                            {order.paymentStatus === 'refunded' && 'Paiement remboursé'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Client</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                            <p>{order.shippingAddress.phone}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Articles</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                <p>{item.product?.name || 'Produit supprimé'} x{item.quantity}</p>
                                <p className="text-xs text-gray-500">
                                  {item.isRental ? 'Location' : 'Achat'} - {
                                    item.isRental && item.dailyPrice 
                                      ? `${item.dailyPrice.toFixed(2)}€ HT (${(item.dailyPrice * 1.20).toFixed(2)}€ TTC)`
                                      : `${item.price.toFixed(2)}€ HT (${(item.price * 1.20).toFixed(2)}€ TTC)`
                                  }
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Total</h4>
                          <div className="text-sm text-gray-600">
                            <p>Sous-total: {order.subtotal.toFixed(2)}€</p>
                            <p>TVA: {order.tax.toFixed(2)}€</p>
                            <p>Livraison: {order.shipping.toFixed(2)}€</p>
                            <p className="font-semibold text-gray-900">
                              Total: {order.total.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order._id, value)}
                            disabled={updatingStatus === order._id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="paid">Payé</SelectItem>
                              <SelectItem value="shipped">Expédié</SelectItem>
                              <SelectItem value="delivered">Livré</SelectItem>
                              <SelectItem value="cancelled">Annulé</SelectItem>
                              <SelectItem value="refunded">Remboursé</SelectItem>
                            </SelectContent>
                          </Select>

                          {updatingStatus === order._id && (
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Détails de la commande #{selectedOrder._id.slice(-8)}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Fermer
                  </Button>
                </div>

                {renderOrderDetails(selectedOrder)}

              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrders;
