import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Star, Heart, Camera, Instagram } from "lucide-react";
import { Link } from "wouter";
import Logo from "@/components/Logo";

export default function Realisations() {
  const realisations = [
    {
      id: 1,
      title: "Mariage Élégant - Château de Bordeaux",
      category: "Mariage",
      date: "15 Juin 2024",
      location: "Bordeaux, France",
      guests: 120,
      description: "Un mariage romantique dans un château historique avec une décoration florale sophistiquée. Arches de roses blanches et rouges, centres de table personnalisés et éclairage d'ambiance.",
      images: [
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: ["Arches florales", "Centres de table personnalisés", "Éclairage d'ambiance", "Coordination complète"],
      rating: 5
    },
    {
      id: 2,
      title: "Anniversaire 50 ans - Villa Moderne",
      category: "Anniversaire",
      date: "22 Mai 2024",
      location: "Arcachon, France",
      guests: 80,
      description: "Célébration d'un demi-siècle avec une décoration moderne et élégante. Thème doré et blanc, installations lumineuses, et mobilier de location personnalisé.",
      images: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: ["Thème doré et blanc", "Installations lumineuses", "Mobilier personnalisé", "Coordination événementielle"],
      rating: 5
    },
    {
      id: 3,
      title: "Baby Shower - Espace Privé",
      category: "Baby Shower",
      date: "8 Avril 2024",
      location: "Bordeaux Centre, France",
      guests: 45,
      description: "Un baby shower tendre et raffiné avec une décoration pastel et des installations douces. Ballons personnalisés, centre de table floraux et animations pour les invités.",
      images: [
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: ["Décoration pastel", "Ballons personnalisés", "Centres de table floraux", "Animations douces"],
      rating: 5
    },
    {
      id: 4,
      title: "Événement Corporate - Centre de Congrès",
      category: "Événement Corporate",
      date: "12 Mars 2024",
      location: "Bordeaux Métropole, France",
      guests: 200,
      description: "Événement d'entreprise avec une décoration moderne et professionnelle. Stands personnalisés, éclairage LED, et mobilier de location haut de gamme.",
      images: [
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: ["Stands personnalisés", "Éclairage LED", "Mobilier haut de gamme", "Coordination professionnelle"],
      rating: 5
    }
  ];

  const categories = ["Tous", "Mariage", "Anniversaire", "Baby Shower", "Événement Corporate"];

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
              <Badge key={category} variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {realisations.map((realisation) => (
              <Card key={realisation.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                      <span>{realisation.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{realisation.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{realisation.guests} invités</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {realisation.description}
                  </p>
                  
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
              @sakadeco_group
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {realisations.flatMap(r => r.images.slice(1)).slice(0, 8).map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={image}
                  alt={`Réalisation ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
