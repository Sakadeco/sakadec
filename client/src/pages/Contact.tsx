import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageSquare } from "lucide-react";
import Logo from "@/components/Logo";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gold/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Logo width={180} height={120} className="drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">Contactez-nous</h1>
            <p className="text-xl text-gray-600 mb-2">Prêts à donner vie à vos projets ?</p>
            <p className="text-lg font-playfair text-gold italic">« Transformons vos idées en réalité »</p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">Informations de contact</h2>
                <div className="space-y-6">
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mt-1">
                      <Phone className="text-gold w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
                      <p className="text-gray-600">06 88 00 39 28</p>
                      <p className="text-sm text-gray-500">Lundi - Samedi, 9h - 19h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mt-1">
                      <Mail className="text-gold w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600">sakadeco.contact@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mt-1">
                      <MapPin className="text-gold w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Zone d'intervention</h3>
                      <p className="text-gray-600">Île-de-France & Bordeaux Métropole</p>
                      <p className="text-sm text-gray-500">Je me déplace dans toute la France — et à l'international — pour accompagner vos projets d'exception.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mt-1">
                      <Clock className="text-gold w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Horaires</h3>
                      <p className="text-gray-600">Sur rendez-vous uniquement</p>
                      <p className="text-sm text-gray-500">N'ayant pas de magasin physique pour l'instant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-4">Suivez-nous</h3>
                <div className="flex space-x-4">
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
              <CardHeader>
                <CardTitle className="text-2xl font-playfair">Demande de devis gratuit</CardTitle>
                <p className="text-gray-600">Décrivez-nous votre projet et recevez une estimation personnalisée</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service souhaité</Label>
                    <select 
                      id="service" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
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
                    <Input id="eventDate" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget approximatif</Label>
                    <select 
                      id="budget" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Sélectionnez votre budget</option>
                      <option value="moins-500">Moins de 500€ (hors décoration salle de réception)</option>
                      <option value="500-1500">500€ et 1500€ (hors décoration salle de réception)</option>
                      <option value="1500-3000">1500€ et 3000€ (hors mariage)</option>
                      <option value="3000-5000">3000€ et 5000€</option>
                      <option value="plus-5000">Plus de 5000€</option>
                    </select>
                    <p className="text-xs text-gray-600 italic">
                      (Budget Minimum 1500€ pour décor salle de réception, 3000€ décor mariage)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Décrivez votre projet *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Parlez-nous de votre événement, de vos attentes, de vos idées..." 
                      className="min-h-[120px]"
                      required 
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-white py-3 text-lg">
                    Envoyer ma demande
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
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📌</span>
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-3">Résultats garantis</h3>
              <p className="text-gray-600">Votre événement, votre style, notre savoir-faire : nous mettons tout en œuvre pour offrir un rendu impeccable et à la hauteur de vos attentes.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🪄</span>
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-3">Créations uniques et personnalisées</h3>
              <p className="text-gray-600">Chaque projet est conçu comme une véritable œuvre sur mesure, mêlant tendances, harmonie et sophistication pour refléter votre univers.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-3">Une expertise 360°</h3>
              <p className="text-gray-600">Décoration, personnalisation, location, home déco : notre maîtrise de chaque détail vous assure une prestation complète, cohérente et sans stress.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}