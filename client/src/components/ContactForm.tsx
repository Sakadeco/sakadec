import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContactFormProps {
  serviceType: "events" | "home" | "co";
}

interface QuoteData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  eventDate: Date | undefined;
  budget: string;
  description: string;
}

const budgetOptions = [
  { value: "moins-500", label: "Moins de 500€" },
  { value: "500-1500", label: "500€ et 1500€" },
  { value: "1500-3000", label: "1500€ et 3000€" },
  { value: "3000-5000", label: "3000€ et 5000€" },
  { value: "plus-5000", label: "Plus de 5000€" },
];

export default function ContactForm({ serviceType }: ContactFormProps) {
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceType: serviceType,
    eventDate: undefined,
    budget: "",
    description: "",
  });

  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      const quoteData = {
        ...quote,
        eventDate: quote.eventDate?.toISOString(),
      };
      return await apiRequest("POST", "/api/quotes", quoteData);
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée",
        description: "Nous avons bien reçu votre demande. Nous vous recontactons dans les plus brefs délais.",
      });
      // Reset form
      setQuote({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        serviceType: serviceType,
        eventDate: undefined,
        budget: "",
        description: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer votre demande",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof QuoteData, value: any) => {
    setQuote(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return quote.customerName && 
           quote.customerEmail && 
           quote.description;
  };

  const getServiceLabel = () => {
    switch (serviceType) {
      case "events":
        return "Décoration d'événements";
      case "home":
        return "Décoration intérieure & Home organizing";
      case "co":
        return "Organisation d'événements";
      default:
        return "Service";
    }
  };

  const getPlaceholderText = () => {
    switch (serviceType) {
      case "events":
        return "Décrivez votre événement : type de célébration, nombre d'invités, style souhaité, couleurs préférées, éléments spécifiques...";
      case "home":
        return "Décrivez votre projet : pièces à organiser/décorer, problématiques actuelles, style souhaité, budget disponible...";
      case "co":
        return "Décrivez votre événement : type, date souhaitée, nombre d'invités, lieu, besoins spécifiques, niveau d'accompagnement souhaité...";
      default:
        return "Décrivez votre projet...";
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid()) {
            createQuoteMutation.mutate();
          }
        }} className="space-y-6">
          
          {/* Service Type Display */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">Demande de devis</h3>
            <p className="text-sm text-gray-600">{getServiceLabel()}</p>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={quote.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={quote.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={quote.customerPhone}
              onChange={(e) => handleInputChange("customerPhone", e.target.value)}
              placeholder="06 XX XX XX XX"
            />
          </div>

          {/* Event Date (for events and co services) */}
          {(serviceType === "events" || serviceType === "co") && (
            <div className="space-y-2">
              <Label>Date prévue de l'événement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {quote.eventDate ? (
                      format(quote.eventDate, "PPP", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={quote.eventDate}
                    onSelect={(date) => handleInputChange("eventDate", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget envisagé</Label>
            <Select value={quote.budget} onValueChange={(value) => handleInputChange("budget", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre budget" />
              </SelectTrigger>
              <SelectContent>
                {budgetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 italic">
              (Notre minimum de commande est de 600 € pour la décoration. Nos prestations décoration mariage commencent à partir de 2 500 €.)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description de votre projet *</Label>
            <Textarea
              id="description"
              value={quote.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={getPlaceholderText()}
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Plus vous nous donnez de détails, plus notre devis sera précis !
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid() || createQuoteMutation.isPending}
            className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white py-3 text-lg font-semibold shadow-lg"
          >
            {createQuoteMutation.isPending ? "Envoi en cours..." : "Envoyer ma demande"}
          </Button>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>Vous préférez nous appeler ? <strong className="whitespace-nowrap">06 88 00 39 28</strong></p>
            <p>Zone d'intervention : Île-de-France & Bordeaux Métropole (déplacements dans toute la France et à l'international)</p>
            <p>Nous vous recontactons sous 24h ouvrées</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
