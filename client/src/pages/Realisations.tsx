import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Star, Heart, Camera, Instagram } from "lucide-react";
import { Link } from "wouter";
import Logo from "@/components/Logo";
import DSC6144 from "@/assets/images/DSC_6144-HDR.JPG";
import DSC6145 from "@/assets/images/DSC_6145-HDR.JPG";
import DSC6148 from "@/assets/images/DSC_6148-HDR.JPG";
import DSC6151 from "@/assets/images/DSC_6151-HDR.JPG";
import DSC6157 from "@/assets/images/DSC_6157-HDR.JPG";
import DSC6160 from "@/assets/images/DSC_6160-HDR.JPG";
import DSC6163 from "@/assets/images/DSC_6163-HDR.JPG";
import DSC6175 from "@/assets/images/DSC_6175-HDR.JPG";
import DSC6178 from "@/assets/images/DSC_6178-HDR.JPG";
import DSC6190 from "@/assets/images/DSC_6190-HDR.JPG";
import DSC6195 from "@/assets/images/DSC_6195-HDR.JPG";
import DSC6196 from "@/assets/images/DSC_6196-HDR.JPG";
import DSC6199 from "@/assets/images/DSC_6199-HDR.JPG";
import DSC6204 from "@/assets/images/DSC_6204-HDR.JPG";
import DSC6205 from "@/assets/images/DSC_6205-HDR.JPG";

interface Realisation {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  guests?: number;
  description: string;
  images: string[];
  highlights: string[];
  rating: number;
}

export default function Realisations() {
  // Toutes les images disponibles (fallback si pas d'images)
  const allImages = [
    DSC6144, DSC6145, DSC6148, DSC6151, DSC6157,
    DSC6160, DSC6163, DSC6175, DSC6178, DSC6190,
    DSC6195, DSC6196, DSC6199, DSC6204, DSC6205
  ];

  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  useEffect(() => {
    fetchRealisations();
  }, []);

  const fetchRealisations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/realisations");
      if (response.ok) {
        const data = await response.json();
        setRealisations(data);
      }
    } catch (error) {
      console.error("Erreur récupération réalisations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["Tous", "Mariage", "Anniversaire", "Baby Shower", "Événement Corporate"];
  
  const filteredRealisations = selectedCategory === "Tous"
    ? realisations
    : realisations.filter(r => r.category === selectedCategory);
  
  const displayRealisations = filteredRealisations;

  return (
    <Layout>
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gold via-yellow-500 to-orange-500 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Logo width={200} height={133} className="drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-6">
            Nos Réalisations
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Découvrez nos créations les plus marquantes et laissez-vous inspirer par notre expertise en décoration d'événements
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category 
                    ? "bg-white text-gold" 
                    : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des réalisations...</p>
            </div>
          ) : displayRealisations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune réalisation disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {displayRealisations.map((realisation) => (
              <Card key={realisation._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={realisation.images[0]}
                    alt={realisation.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gold text-white border-none">
                      {realisation.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    {Array.from({ length: realisation.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-playfair font-bold text-gray-800 mb-4">
                    {realisation.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(realisation.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{realisation.location}</span>
                    </div>
                    {realisation.guests && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{realisation.guests} invités</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {realisation.description}
                  </p>
                  
                  {realisation.highlights && realisation.highlights.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Points forts :</h4>
                      <div className="flex flex-wrap gap-2">
                        {realisation.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-gold text-gold hover:bg-gold hover:text-white">
                      <Camera className="mr-2 h-4 w-4" />
                      Voir plus de photos
                    </Button>
                    <Button className="flex-1 bg-gold hover:bg-yellow-600">
                      <Heart className="mr-2 h-4 w-4" />
                      Demander un devis
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gold to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold text-white mb-6">
            Prêt à créer votre événement de rêve ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-gold hover:bg-gray-100">
              <Link to="/contact">
                Demander un devis
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gold">
              <Link to="/home">
                Découvrir nos services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram className="h-8 w-8 text-pink-500" />
              <h2 className="text-3xl font-playfair font-bold text-gray-800">
                Suivez nos créations en temps réel
              </h2>
            </div>
            <p className="text-gray-600">
              Découvrez nos dernières réalisations sur Instagram
            </p>
            <Badge variant="outline" className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none">
              @sakadeco_events
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(realisations.length > 0 
              ? realisations.flatMap(r => r.images).slice(0, 8)
              : allImages.slice(0, 8)
            ).map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <img
                  src={image}
                  alt={`Réalisation SakaDeco ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
