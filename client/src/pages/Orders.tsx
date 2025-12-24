import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    mainImageUrl: string;
    price: number;
  };
  quantity: number;
  price: number;
  isRental: boolean;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentalDays?: number;
  customizations?: Record<string, any>;
  customMessage?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  createdAt: string;
  updatedAt: string;
  isRental: boolean;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Pour l'instant, on utilise un userId fictif
      // En production, cela viendrait de l'authentification
      const userId = 'user123';
      const response = await fetch(`/api/payment/orders/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Erreur lors de la récupération des commandes');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CreditCard className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPurchasedOrders = () => orders.filter(order => !order.isRental);
  const getRentedOrders = () => orders.filter(order => order.isRental);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-skd-shop border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-skd-shop/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune commande trouvée
              </h2>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore passé de commande.
              </p>
              <Button onClick={() => setLocation("/shop")}>
                Découvrir nos produits
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="all">
                  Toutes ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="purchased">
                  Achetés ({getPurchasedOrders().length})
                </TabsTrigger>
                <TabsTrigger value="rented">
                  Loués ({getRentedOrders().length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </TabsContent>

              <TabsContent value="purchased" className="space-y-6">
                {getPurchasedOrders().map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </TabsContent>

              <TabsContent value="rented" className="space-y-6">
                {getRentedOrders().map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CreditCard className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <Badge className={getStatusColor(order.status)}>
                {order.status === 'pending' && 'En attente'}
                {order.status === 'paid' && 'Payé'}
                {order.status === 'shipped' && 'Expédié'}
                {order.status === 'delivered' && 'Livré'}
                {order.status === 'cancelled' && 'Annulé'}
                {order.status === 'refunded' && 'Remboursé'}
              </Badge>
            </div>
            <Badge variant="outline">
              {order.isRental ? 'Location' : 'Achat'}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
            <p className="font-semibold text-lg">
              {order.total.toFixed(2)}€
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Articles */}
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={item.product.mainImageUrl}
                                          alt={item.product?.name || 'Produit supprimé'}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                                          <h4 className="font-medium">{item.product?.name || 'Produit supprimé'}</h4>
                  <p className="text-sm text-gray-600">
                    Quantité: {item.quantity} × {
                      item.isRental && item.dailyPrice 
                        ? `${item.dailyPrice.toFixed(2)}€ HT`
                        : `${item.price.toFixed(2)}€ HT`
                    } = {
                      item.isRental && item.dailyPrice
                        ? `${(item.dailyPrice * item.quantity).toFixed(2)}€ HT`
                        : `${(item.price * item.quantity).toFixed(2)}€ HT`
                    }
                  </p>
                  {item.isRental && item.rentalDays && (
                    <p className="text-sm text-gray-600">
                      Location: {item.rentalDays} jour(s)
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(item.price * item.quantity).toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Détails supplémentaires */}
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="w-full"
          >
            {expanded ? 'Masquer les détails' : 'Voir les détails'}
          </Button>

          {expanded && (
            <div className="space-y-4 pt-4 border-t">
              {/* Résumé financier */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Sous-total:</p>
                  <p className="font-medium">{order.subtotal.toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-gray-600">TVA:</p>
                  <p className="font-medium">{order.tax.toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-gray-600">Livraison:</p>
                  <p className="font-medium">{order.shipping.toFixed(2)}€</p>
                </div>
                <div>
                  <p className="text-gray-600">Total:</p>
                  <p className="font-medium">{order.total.toFixed(2)}€</p>
                </div>
              </div>

              {/* Adresse de livraison */}
              {order.shippingAddress && (
                <div>
                  <h5 className="font-medium mb-2">Adresse de livraison:</h5>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.zipCode} {order.shippingAddress.city}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Commande créée:</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Dernière mise à jour:</p>
                  <p className="font-medium">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
