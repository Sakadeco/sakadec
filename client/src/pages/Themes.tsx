import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Heart, 
  Star, 
  Crown, 
  Flower, 
  Car, 
  Plane, 
  Music, 
  Camera,
  Gift,
  Cake,
  Baby,
  GraduationCap,
  Calendar,
  MapPin
} from "lucide-react";
import { Link } from "wouter";

export default function Themes() {
  const themes = [
    {
      id: "mariage",
      name: "Mariage",
      icon: Heart,
      color: "pink",
      description: "Décoration romantique et élégante pour votre jour J",
      examples: ["Arc de ballons", "Photobooth", "Centre de table", "Guirlandes"],
      imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"
    },
    {
      id: "anniversaire",
      name: "Anniversaire",
      icon: Cake,
      color: "purple",
      description: "Célébrez chaque année avec style et originalité",
      examples: ["Ballons personnalisés", "Bannières", "Cupcakes décorés", "Accessoires photo"],
      imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop"
    },
    {
      id: "bapteme",
      name: "Baptême",
      icon: Baby,
      color: "blue",
      description: "Première célébration de votre petit ange",
      examples: ["Arche de ballons", "Décoration de chaise", "Guirlandes", "Accessoires"],
      imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&h=300&fit=crop"
    },
    {
      id: "graduation",
      name: "Graduation",
      icon: GraduationCap,
      color: "gold",
      description: "Célébrez la réussite académique avec fierté",
      examples: ["Bannières diplômées", "Ballons aux couleurs de l'école", "Photobooth", "Décoration de table"],
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d06e58bcb0e0?w=400&h=300&fit=crop"
    },
    {
      id: "voyage",
      name: "Voyage & Découverte",
      icon: Plane,
      color: "teal",
      description: "Évadez-vous vers des destinations lointaines",
      examples: ["Ballons globe terrestre", "Décoration tropicale", "Accessoires de voyage", "Photobooth"],
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop"
    },
    {
      id: "sport",
      name: "Sport & Compétition",
      icon: Star,
      color: "green",
      description: "Encouragez vos champions avec passion",
      examples: ["Ballons aux couleurs de l'équipe", "Bannières de support", "Accessoires sportifs", "Décoration de stade"],
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
      id: "luxe",
      name: "Luxe & Élégance",
      icon: Crown,
      color: "amber",
      description: "Sublimez vos événements avec raffinement",
      examples: ["Décoration dorée", "Ballons métalliques", "Accessoires premium", "Éclairage d'ambiance"],
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
    },
    {
      id: "nature",
      name: "Nature & Botanique",
      icon: Flower,
      color: "emerald",
      description: "Harmonie avec la beauté naturelle",
      examples: ["Décoration florale", "Ballons organiques", "Accessoires naturels", "Guirlandes végétales"],
      imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop"
    },
    {
      id: "musique",
      name: "Musique & Art",
      icon: Music,
      color: "indigo",
      description: "Rythmez vos événements avec créativité",
      examples: ["Ballons musicaux", "Décoration d'instruments", "Accessoires artistiques", "Photobooth musical"],
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gold/10 via-pink-50/50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-gold to-yellow-500 text-white border-none text-sm font-semibold">
              🎨 Personnalisation à l'infini
            </Badge>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gold via-yellow-500 to-gold bg-clip-text text-transparent">
                Nos Thèmes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Découvrez notre collection de thèmes personnalisables pour sublimer tous vos événements. 
              Chaque thème est conçu avec soin pour créer une ambiance unique et mémorable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Palette className="h-5 w-5 text-gold" />
                <span className="font-medium">Personnalisation complète</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="font-medium">Créations sur mesure</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Qualité premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informations importantes */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 text-center">
              Comment choisir votre thème ?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Parcourez nos thèmes</h3>
                    <p className="text-gray-600 text-sm">
                      Explorez notre collection de thèmes prédéfinis, chacun avec ses propres couleurs et éléments décoratifs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Notez votre choix</h3>
                    <p className="text-gray-600 text-sm">
                      Lors de votre commande, indiquez le nom du thème dans la case "Thème souhaité".
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Personnalisation</h3>
                    <p className="text-gray-600 text-sm">
                      Tous nos produits sont personnalisables avec tous les thèmes disponibles.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Thème sur mesure</h3>
                    <p className="text-gray-600 text-sm">
                      Si vous souhaitez un thème unique, décrivez-le en détail dans la case "Thème souhaité".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thèmes Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
              Nos Thèmes Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque thème est représenté par des produits personnalisés. 
              Cliquez sur un thème pour découvrir nos créations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              return (
                                 <Link key={theme.id} href={`/shop?theme=${theme.id}`} className="block">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-gold/30 cursor-pointer h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={theme.imageUrl}
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${theme.color}-100 flex items-center justify-center group-hover:bg-${theme.color}-200 transition-colors`}>
                        <IconComponent className={`h-8 w-8 text-${theme.color}-600`} />
                      </div>
                      <CardTitle className="font-playfair text-2xl text-gray-800 group-hover:text-gold transition-colors">
                        {theme.name}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{theme.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 mb-3">Exemples d'éléments :</h4>
                        <div className="flex flex-wrap gap-2">
                          {theme.examples.map((example, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className={`bg-${theme.color}-50 text-${theme.color}-700 border-${theme.color}-200`}
                            >
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className={`w-full mt-6 bg-${theme.color}-600 hover:bg-${theme.color}-700 text-white`}
                      >
                        Découvrir ce thème
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gold/10 via-pink-50/50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">
            Prêt à personnaliser votre événement ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choisissez votre thème préféré et laissez-nous créer une décoration unique 
            qui reflète parfaitement votre style et vos goûts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <Button asChild size="lg" className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white px-8 py-4 text-lg font-semibold rounded-full">
               <Link href="/shop">
                 <Gift className="mr-2 h-5 w-5" />
                 Découvrir nos produits
               </Link>
             </Button>
             <Button asChild variant="outline" size="lg" className="border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-4 text-lg font-semibold rounded-full">
               <Link href="/contact">
                 <Calendar className="mr-2 h-5 w-5" />
                 Demander un devis
               </Link>
             </Button>
          </div>
        </div>
      </section>

      {/* Informations supplémentaires */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-white h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Personnalisation Totale</h3>
              <p className="text-gray-600 text-sm">
                Tous nos produits s'adaptent à vos thèmes préférés
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Créations Sur Mesure</h3>
              <p className="text-gray-600 text-sm">
                Des thèmes uniques pour des événements inoubliables
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Zone d'Intervention</h3>
              <p className="text-gray-600 text-sm">
                Bordeaux Métropole et environs
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
