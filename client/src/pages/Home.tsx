import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Palette, Handshake, Star, Home, Users, Phone, MapPin, ArrowRight } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import { ReviewsSection } from "@/components/ReviewsSection";
import { GalleryShowcase } from "@/components/GalleryShowcase";
import { Features } from "@/components/Features";
import Logo from "@/components/Logo";
import type { Product } from "@shared/schema";

export default function HomePage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const services = [
    {
      name: "SKD Shop",
      description: "Ballons, fleurs & accessoires",
      icon: ShoppingBag,
      color: "skd-shop",
      path: "/shop",
      tagline: "Offrez la touche qui fait sourire"
    },
    {
      name: "SKD Créa", 
      description: "Personnalisation & papeterie",
      icon: Palette,
      color: "skd-crea",
      path: "/crea",
      tagline: "Du sur-mesure pour vos plus belles attentions"
    },
    {
      name: "SKD Rent",
      description: "Location de matériel festif", 
      icon: Handshake,
      color: "skd-rent",
      path: "/rent",
      tagline: "Louez l'élégance. Célébrez sans limites"
    },
    {
      name: "SKD Events",
      description: "Décoration d'événements",
      icon: Star,
      color: "skd-events", 
      path: "/events",
      tagline: "L'art de décorer vos plus beaux jours"
    },
    {
      name: "SKD Home",
      description: "Décoration intérieure & Home organizing",
      icon: Home,
      color: "skd-home",
      path: "/home", 
      tagline: "Des espaces qui vous ressemblent"
    },
    {
      name: "SKD & Co",
      description: "Organisation d'événements",
      icon: Users,
      color: "skd-co",
      path: "/co",
      tagline: "On s'occupe de tout, vous profitez de l'instant"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-white to-pink-50"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>

        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Logo width={200} height={133} className="drop-shadow-lg" />
            </div>
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-gold to-yellow-500 text-white border-none text-sm font-semibold rounded-full">
              ✨ Personnalisation à l'infini ✨
            </Badge>
          </div>
          <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gold via-yellow-500 to-gold bg-clip-text text-transparent">SakaDeco</span>
            <span className="text-gray-800 dark:text-gray-100"> Group</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-6 font-light">
            L'élégance au service de vos moments
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            6 pôles d'expertise pour sublimer tous vos événements. 
            De la personnalisation artisanale à l'organisation complète, 
            nous transformons vos idées en réalité.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white px-10 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Découvrir nos produits
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-gold text-gold hover:bg-gold hover:text-white px-10 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/contact">
                Demander un devis
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold">Fabrication fait main</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Expédition Europe</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <Palette className="h-5 w-5 text-purple-500" />
              <span className="font-semibold">Thèmes personnalisés</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">Nos Services</h2>
            <p className="text-xl text-gray-600">Six pôles d'expertise pour tous vos besoins</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Link key={service.name} href={service.path} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-gold/30 cursor-pointer h-full">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${service.color}/20 flex items-center justify-center group-hover:bg-${service.color}/40 transition-colors`}>
                        <IconComponent className={`text-${service.color} text-2xl`} />
                      </div>
                      <CardTitle className="font-playfair text-xl">{service.name}</CardTitle>
                      <p className="text-gray-600">{service.description}</p>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-sm italic text-${service.color} text-center mb-4`}>
                        « {service.tagline} »
                      </p>
                      <div className={`w-full bg-${service.color} hover:bg-${service.color}/90 text-white text-center py-2 px-4 rounded-md transition-colors`}>
                        Découvrir
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* À propos de Pajusly */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Portrait professionnel de Pajusly, fondatrice" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div>
              <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-6">
                À propos de <span className="metallic-gold">Pajusly</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Je me présente, je suis Pajusly ! J'habite à Bordeaux et je suis l'heureuse maman de deux enfants. 
                Depuis toujours, ma véritable passion, c'est la décoration.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Forte de plusieurs années d'expérience dans la décoration événementielle, j'ai choisi, en 2024, 
                de structurer mes activités sous une identité unique, à la fois créative et professionnelle.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-playfair font-bold text-gold mb-2">8+</div>
                  <div className="text-sm text-gray-600">Années d'expérience</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-playfair font-bold text-gold mb-2">6</div>
                  <div className="text-sm text-gray-600">Pôles d'expertise</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gold">📍</span>
                  <span className="text-gray-600">Bordeaux Métropole</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gold">📞</span>
                  <span className="text-gray-600">06 88 00 39 28</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Gallery Showcase */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-4">
              Nos Dernières Créations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Découvrez notre portfolio de réalisations exceptionnelles
            </p>
          </div>
          <GalleryShowcase limit={8} showFilters={true} />
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
              <Link to="/shop">
                <ArrowRight className="mr-2 h-5 w-5" />
                Voir toutes nos créations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <ReviewsSection />

      {/* Featured Products */}
      {!isLoading && products && products.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-4">Nos Produits Vedettes</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Une sélection de nos créations les plus appréciées</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product: Product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl">
                  <div className="aspect-square overflow-hidden rounded-t-lg relative">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isCustomizable && (
                      <Badge className="absolute top-3 left-3 bg-gold text-white px-2 py-1 text-xs">
                        ✨ Personnalisable
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gold">{product.price}€</span>
                      <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white">
                <Link to="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Découvrir tous nos produits
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <Newsletter />

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-gold/10 via-pink-50/50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-6">
              Prêts à concrétiser votre projet ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Que ce soit pour un événement exceptionnel, une décoration personnalisée ou une organisation complète, 
              nous sommes là pour transformer vos rêves en réalité.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white h-8 w-8" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Appelez-nous</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Parlons de votre projet</p>
              <p className="text-gold font-bold text-lg">06 88 00 39 28</p>
            </Card>
            
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white h-8 w-8" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Zone d'intervention</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Nous intervenons dans</p>
              <p className="text-purple-500 font-bold">Île-de-France & Bordeaux Métropole</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Déplacements dans toute la France et à l'international</p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white h-8 w-8" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Devis gratuit</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Estimation personnalisée</p>
              <p className="text-green-500 font-bold">100% gratuit</p>
            </Card>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white px-12 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/contact">
                Demander un devis gratuit
              </Link>
            </Button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Réponse sous 24h • Engagement sans obligation
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
