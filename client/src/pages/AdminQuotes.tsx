import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Edit
} from 'lucide-react';

interface Quote {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  service: string;
  description: string;
  eventDate?: string;
  budget?: string;
  status: string;
  estimatedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminQuotes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    estimatedPrice: ''
  });

  // Fetch quotes
  const { data: quotes = [], isLoading, error } = useQuery<Quote[]>({
    queryKey: ['quotes'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/quotes');
      return response;
    }
  });

  // Update quote mutation
  const updateQuoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest('PATCH', `/api/quotes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast({
        title: "Devis mis à jour",
        description: "Le devis a été mis à jour avec succès.",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le devis",
        variant: "destructive",
      });
    }
  });

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailDialogOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setEditForm({
      status: quote.status,
      estimatedPrice: quote.estimatedPrice?.toString() || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateQuote = () => {
    if (!selectedQuote) return;

    const updateData: any = {
      status: editForm.status
    };

    if (editForm.estimatedPrice) {
      updateData.estimatedPrice = parseFloat(editForm.estimatedPrice);
    }

    updateQuoteMutation.mutate({
      id: selectedQuote._id,
      data: updateData
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case 'events':
        return 'Décoration d\'événements';
      case 'home':
        return 'Décoration intérieure & Home organizing';
      case 'co':
        return 'Organisation d\'événements';
      default:
        return service;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement des devis...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Erreur lors du chargement des devis</div>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Devis</h1>
        <p className="text-gray-600">Gérez les demandes de devis reçues</p>
      </div>

      <div className="grid gap-6">
        {quotes.map((quote) => (
          <Card key={quote._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{quote.customerName}</CardTitle>
                  <p className="text-sm text-gray-600">{getServiceLabel(quote.service)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(quote.status)}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(quote)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuote(quote)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{quote.customerEmail}</span>
                </div>
                {quote.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{quote.customerPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(quote.createdAt), 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
                {quote.estimatedPrice && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>{quote.estimatedPrice}€</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Description:</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {quote.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du devis</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informations client</h4>
                  <p><strong>Nom:</strong> {selectedQuote.customerName}</p>
                  <p><strong>Email:</strong> {selectedQuote.customerEmail}</p>
                  {selectedQuote.customerPhone && (
                    <p><strong>Téléphone:</strong> {selectedQuote.customerPhone}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Détails du service</h4>
                  <p><strong>Service:</strong> {getServiceLabel(selectedQuote.service)}</p>
                  <p><strong>Statut:</strong> {selectedQuote.status}</p>
                  <p><strong>Date de création:</strong> {format(new Date(selectedQuote.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
                  {selectedQuote.eventDate && (
                    <p><strong>Date d'événement:</strong> {format(new Date(selectedQuote.eventDate), 'dd MMMM yyyy', { locale: fr })}</p>
                  )}
                  {selectedQuote.budget && (
                    <p><strong>Budget:</strong> {selectedQuote.budget}</p>
                  )}
                  {selectedQuote.estimatedPrice && (
                    <p><strong>Prix estimé:</strong> {selectedQuote.estimatedPrice}€</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description du projet</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedQuote.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le devis</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prix estimé (€)</label>
                <Input
                  type="number"
                  value={editForm.estimatedPrice}
                  onChange={(e) => setEditForm(prev => ({ ...prev, estimatedPrice: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleUpdateQuote}
                  disabled={updateQuoteMutation.isPending}
                >
                  {updateQuoteMutation.isPending ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
