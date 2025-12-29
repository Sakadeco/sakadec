import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Palette, Handshake, Star, Home, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-2xl font-playfair font-bold metallic-gold">SakaDeco Group</h1>
              <span className="ml-3 text-sm text-gray-600 font-light">L'élégance au service de vos moments</span>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#accueil" className="text-gray-700 hover:text-gold transition-colors">Accueil</a>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-skd-shop hover:scale-125 transition-transform" title="SKD Shop"></div>
                <div className="w-3 h-3 rounded-full bg-skd-crea hover:scale-125 transition-transform" title="SKD Créa"></div>
                <div className="w-3 h-3 rounded-full bg-skd-rent hover:scale-125 transition-transform" title="SKD Rent"></div>
                <div className="w-3 h-3 rounded-full bg-skd-events hover:scale-125 transition-transform" title="SKD Events"></div>
                <div className="w-3 h-3 rounded-full bg-skd-home hover:scale-125 transition-transform" title="SKD Home"></div>
                <div className="w-3 h-3 rounded-full bg-skd-co hover:scale-125 transition-transform" title="SKD & Co"></div>
              </div>
              <Button asChild className="bg-gold text-white hover:bg-gold/90">
                <a href="/api/login">Se connecter</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-white to-gold/5"></div>
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Elegant wedding decoration setup" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6">
            <span className="metallic-gold">SakaDeco</span>
            <span className="text-gray-800"> Group</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
            L'élégance au service de vos moments et de vos espaces
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            « Votre Événement, Votre Idée, Notre Création »
          </p>
          
          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-skd-shop/20 flex items-center justify-center group-hover:bg-skd-shop/40 transition-colors">
                <ShoppingBag className="text-skd-shop text-2xl" />
              </div>
              <h3 className="font-playfair font-semibold text-gray-800">Shop</h3>
              <p className="text-sm text-gray-600">Ballons & Fleurs</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-skd-crea/20 flex items-center justify-center group-hover:bg-skd-crea/40 transition-colors">
                <Palette className="text-skd-crea text-2xl" />
              </div>
              <h3 className="font-playfair font-semibold text-gray-800">Créa</h3>
              <p className="text-sm text-gray-600">Personnalisation</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-skd-rent/20 flex items-center justify-center group-hover:bg-skd-rent/40 transition-colors">
                <Handshake className="text-skd-rent text-2xl" />
              </div>
              <h3 className="font-playfair font-semibold text-gray-800">Rent</h3>
              <p className="text-sm text-gray-600">Location</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-skd-events/20 flex items-center justify-center group-hover:bg-skd-events/40 transition-colors">
                <Star className="text-skd-events text-2xl" />
              </div>
              <h3 className="font-playfair font-semibold text-gray-800">Events</h3>
              <p className="text-sm text-gray-600">Décoration</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-skd-home/20 flex items-center justify-center group-hover:bg-skd-home/40 transition-colors">
                <Home className="text-skd-home text-2xl" />
              </div>
              <h3 className="font-playfair font-semibold text-gray-800">Home</h3>
              <p className="text-sm text-gray-600">Intérieur</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-skd-co/20 flex items-center justify-center group-hover:bg-skd-co/40 transition-colors">
                <Users className="text-skd-co text-2xl" />
              </div>
              <h3 className="font-playfair font-semibold text-gray-800">& Co</h3>
              <p className="text-sm text-gray-600">Organisation</p>
            </div>
          </div>

          <Button asChild size="lg" className="bg-gold text-white hover:bg-gold/90 px-8 py-4 text-lg">
            <a href="/api/login">Découvrir nos services</a>
          </Button>
        </div>
      </section>

      {/* About Section */}
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
                  <div className="text-3xl font-playfair font-bold text-gold mb-2">2017</div>
                  <div className="text-sm text-gray-600">Lancement de l'activité</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-playfair font-bold text-gold mb-2">2024</div>
                  <div className="text-sm text-gray-600">Création SKD Group</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gold">📍</span>
                  <span className="text-gray-600">Bordeaux Métropole</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gold">📞</span>
                  <span className="text-gray-600 whitespace-nowrap">06 88 00 39 28</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-playfair font-bold metallic-gold mb-4">SakaDeco Group</h3>
            <p className="text-gray-300 mb-8">L'élégance au service de vos moments et de vos espaces</p>
            <Button asChild className="bg-gold text-white hover:bg-gold/90">
              <a href="/api/login">Commencer maintenant</a>
            </Button>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2024 SakaDeco Group. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
