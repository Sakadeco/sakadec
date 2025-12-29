import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageSquare } from "lucide-react";
import Logo from "@/components/Logo";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    eventDate: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      const quoteData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone || undefined,
        serviceType: formData.service || undefined,
        service: formData.service || undefined,
        description: formData.message,
        eventDate: formData.eventDate || undefined,
        budget: formData.budget || undefined,
      };
      return await apiRequest("POST", "/api/quotes", quoteData);
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée",
        description: "Nous avons bien reçu votre demande. Nous vous recontactons dans les plus brefs délais.",
      });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        eventDate: "",
        budget: "",
        message: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer votre demande",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuoteMutation.mutateAsync();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gold/10 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Logo width={180} height={120} className="drop-shadow-lg w-32 sm:w-40 md:w-48 h-auto" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-3 sm:mb-4">Contactez-nous</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">Prêts à donner vie à vos projets ?</p>
            <p className="text-sm sm:text-base md:text-lg font-playfair text-gold italic">« Transformons vos idées en réalité »</p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            
            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-4 sm:mb-6">Informations de contact</h2>
                <div className="space-y-4 sm:space-y-6">
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                      <Phone className="text-gold w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">Téléphone</h3>
                      <p className="text-gray-600 text-sm md:text-base whitespace-nowrap">06 88 00 39 28</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Lundi - Samedi, 9h - 19h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                      <Mail className="text-gold w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">Email</h3>
                      <p className="text-gray-600 text-sm md:text-base break-all">sakadeco.contact@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                      <MapPin className="text-gold w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">Zone d'intervention</h3>
                      <p className="text-gray-600 text-sm md:text-base mb-1">Île-de-France & Bordeaux Métropole</p>
                      <p className="text-xs md:text-sm text-gray-500">Je me déplace dans toute la France — et à l'international — pour accompagner vos projets d'exception.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                      <Clock className="text-gold w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">Horaires</h3>
                      <p className="text-gray-600 text-sm md:text-base mb-1">Sur rendez-vous uniquement</p>
                      <p className="text-xs md:text-sm text-gray-500">N'ayant pas de magasin physique pour l'instant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg sm:text-xl font-playfair font-semibold text-gray-800 mb-3 sm:mb-4">Suivez-nous</h3>
                <div className="flex space-x-3 sm:space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-gold hover:bg-gold hover:text-white"
                    asChild
                  >
                    <a href="https://www.facebook.com/SakadecoEvents/" target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-gold hover:bg-gold hover:text-white"
                    asChild
                  >
                    <a href="https://www.instagram.com/sakadeco_events/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-gold hover:bg-gold hover:text-white"
                    asChild
                  >
                    <a href="https://wa.me/33688003928" target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="w-5 h-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-2 border-gold/20">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl font-playfair">Demande de devis gratuit</CardTitle>
                <p className="text-sm sm:text-base text-gray-600">Décrivez-nous votre projet et recevez une estimation personnalisée</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input 
                        id="firstName" 
                        required 
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input 
                        id="lastName" 
                        required 
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service souhaité</Label>
                    <select 
                      id="service" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      <option value="">Sélectionnez un service</option>
                      <option value="shop">SKD Shop - Vente de produits</option>
                      <option value="crea">SKD Créa - Personnalisation</option>
                      <option value="rent">SKD Rent - Location de matériel</option>
                      <option value="events">SKD Events - Décoration d'événements</option>
                      <option value="home">SKD Home - Décoration intérieure</option>
                      <option value="co">SKD & Co - Organisation d'événements</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date de l'événement</Label>
                    <Input 
                      id="eventDate" 
                      type="date" 
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget approximatif</Label>
                    <select 
                      id="budget" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="">Sélectionnez votre budget</option>
                      <option value="moins-500">Moins de 500€</option>
                      <option value="500-1500">500€ et 1500€</option>
                      <option value="1500-3000">1500€ et 3000€</option>
                      <option value="3000-5000">3000€ et 5000€</option>
                      <option value="plus-5000">Plus de 5000€</option>
                    </select>
                    <p className="text-xs text-gray-600 italic">
                      (Notre minimum de commande est de 600 € pour la décoration. Nos prestations décoration mariage commencent à partir de 2 500 €.)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Décrivez votre projet *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Parlez-nous de votre événement, de vos attentes, de vos idées..." 
                      className="min-h-[120px]"
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                    disabled={isSubmitting || createQuoteMutation.isPending}
                  >
                    {isSubmitting || createQuoteMutation.isPending ? "Envoi en cours..." : "Envoyer ma demande"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir SakaDeco Group */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Pourquoi choisir SakaDeco Group ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Votre satisfaction est notre priorité, du premier échange à la dernière installation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-3">Résultats garantis</h3>
              <p className="text-gray-600">Votre événement, votre style, notre savoir-faire : nous mettons tout en œuvre pour offrir un rendu impeccable et à la hauteur de vos attentes.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-3">Créations uniques et personnalisées</h3>
              <p className="text-gray-600">Chaque projet est conçu comme une véritable œuvre sur mesure, mêlant tendances, harmonie et sophistication pour refléter votre univers.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-3">Une expertise 360°</h3>
              <p className="text-gray-600">Décoration, personnalisation, location, home déco : notre maîtrise de chaque détail vous assure une prestation complète, cohérente et sans stress.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}