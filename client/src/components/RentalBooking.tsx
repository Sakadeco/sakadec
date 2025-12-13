import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, RotateCcw } from "lucide-react";
import { format, addDays, isFriday, isSunday } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface RentalBookingProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
  };
  onClose: () => void;
}

interface BookingData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  quantity: number;
  notes: string;
}

export default function RentalBooking({ product, onClose }: RentalBookingProps) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: undefined,
    endDate: undefined,
    quantity: 1,
    notes: "",
  });

  // Check availability query
  const { data: availability, isLoading: checkingAvailability } = useQuery({
    queryKey: ["/api/rentals/availability", product.id, booking.startDate, booking.endDate],
    enabled: !!(booking.startDate && booking.endDate),
    queryFn: async () => {
      if (!booking.startDate || !booking.endDate) return null;
      
      const response = await fetch(
        `/api/rentals/availability/${product.id}?startDate=${booking.startDate.toISOString()}&endDate=${booking.endDate.toISOString()}`
      );
      return response.json();
    },
  });

  // Create rental mutation
  const createRentalMutation = useMutation({
    mutationFn: async () => {
      if (!booking.startDate || !booking.endDate) {
        throw new Error("Dates de location requises");
      }

      // Calculate rental period in days
      const days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const total = days * parseFloat(product.price) * booking.quantity;

      // Create order
      const orderData = {
        customerEmail: booking.customerEmail,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        total: total.toString(),
        orderType: "rental",
        eventDate: booking.startDate.toISOString(),
        notes: booking.notes,
        items: [
          {
            productId: product.id,
            quantity: booking.quantity,
            unitPrice: product.price,
            rentalStartDate: booking.startDate.toISOString(),
            rentalEndDate: booking.endDate.toISOString(),
          }
        ]
      };

      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Réservation confirmée",
        description: "Votre demande de location a été enregistrée. Nous vous contactons rapidement.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la réservation",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof BookingData, value: any) => {
    setBooking(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (type: "start" | "end", date: Date | undefined) => {
    if (type === "start") {
      setBooking(prev => ({
        ...prev,
        startDate: date,
        // Automatically set end date to Sunday if start date is Friday
        endDate: date && isFriday(date) ? addDays(date, 2) : prev.endDate,
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        endDate: date,
      }));
    }
  };

  const calculateTotal = () => {
    // Le prix ne dépend pas du nombre de jours, seulement de la quantité
    return parseFloat(product.price) * booking.quantity;
  };

  const isFormValid = () => {
    return booking.customerName && 
           booking.customerEmail && 
           booking.startDate && 
           booking.endDate && 
           availability?.available;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-skd-rent">
            Réserver {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 p-4 bg-skd-rent/10 rounded-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-bold text-skd-rent">{product.price}€/jour</p>
            </div>
          </div>

          {/* Rental Schedule Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Créneaux de retrait/retour
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-700">Retrait</div>
                <div className="text-blue-600">Vendredi 17h30-19h30</div>
              </div>
              <div>
                <div className="font-medium text-blue-700">Retour</div>
                <div className="text-blue-600">Dimanche 15h30-17h30</div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={booking.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={booking.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={booking.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                placeholder="06 XX XX XX XX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={booking.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de retrait (Vendredi) *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {booking.startDate ? (
                      format(booking.startDate, "PPP", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={booking.startDate}
                    onSelect={(date) => handleDateSelect("start", date)}
                    disabled={(date) => !isFriday(date) || date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de retour (Dimanche) *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {booking.endDate ? (
                      format(booking.endDate, "PPP", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={booking.endDate}
                    onSelect={(date) => handleDateSelect("end", date)}
                    disabled={(date) => !isSunday(date) || date <= (booking.startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Availability Check */}
          {booking.startDate && booking.endDate && (
            <div className={`p-4 rounded-lg ${availability?.available ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              {checkingAvailability ? (
                <div className="flex items-center">
                  <div className="animate-spin w-4 h-4 border-2 border-skd-rent border-t-transparent rounded-full mr-2" />
                  Vérification de la disponibilité...
                </div>
              ) : availability?.available ? (
                <div className="text-green-700 font-medium">✅ Disponible pour cette période</div>
              ) : (
                <div className="text-red-700 font-medium">❌ Non disponible pour cette période</div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Input
              id="notes"
              value={booking.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Informations complémentaires..."
            />
          </div>

          {/* Total Price */}
          {booking.startDate && booking.endDate && (
            <div className="bg-skd-rent/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Prix total</p>
                  <p className="text-sm text-gray-600">
                    {Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} jours × {booking.quantity} × {product.price}€
                  </p>
                </div>
                <div className="text-2xl font-bold text-skd-rent">
                  {calculateTotal()}€
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={() => createRentalMutation.mutate()}
              disabled={!isFormValid() || createRentalMutation.isPending}
              className="flex-1 bg-skd-rent text-white hover:bg-skd-rent/90"
            >
              {createRentalMutation.isPending ? "Réservation..." : "Confirmer la réservation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
