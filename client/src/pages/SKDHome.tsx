import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, PaintbrushVertical, Package, Users } from "lucide-react";

export default function SKDHome() {
  const services = [
    {
      icon: PaintbrushVertical,
      title: "Relooking Intérieur",
      description: "Conseils déco, aménagements fonctionnels et esthétiques pour sublimer vos espaces",
      price: "Tarif horaire : 60€ /heure hors frais de déplacement. Minimum 2 heures (à domicile ou en Visio) avec compte rendu en fin de session"
    },
    {
      icon: Package,
      title: "Home Organizing",
      description: "Rangement optimisé, tri et désencombrement pour retrouver sérénité chez vous",
      price: "Au choix à partir de 60 €/h ou forfait (par pièce, selon la taille) : par exemple 4€ par m² pour un projet d'aménagement d'une pièce (avec plan, conseils, organisation) hors frais de déplacement."
    },
    {
      icon: Users,
      title: "Projet 3D : plan + décoration",
      description: "Pour la création d'un book déco (plans 2D/3D, moodboard, liste shopping, visuels)",
      price: "80 € un projet standard 3D par pièce selon la surface, 120 € un projet complexe par pièce."
    }
  ];

  const beforeAfterImages = [
    {
      id: "1",
      title: "Salon - Transformation complète",
      category: "Relooking Intérieur",
      before: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Salon avant transformation",
        description: "Espace encombré avec mobilier disparate et manque d'harmonie"
      },
      after: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Salon après transformation",
        description: "Espace harmonieux avec décoration cohérente et fonctionnelle"
      }
    },
    {
      id: "2",
      title: "Chambre - Organisation optimisée",
      category: "Home Organizing",
      before: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Chambre avant organisation",
        description: "Chambre encombrée avec vêtements et objets éparpillés"
      },
      after: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Chambre après organisation",
        description: "Chambre organisée avec rangement fonctionnel et espace dégagé"
      }
    },
    {
      id: "3",
      title: "Cuisine - Aménagement fonctionnel",
      category: "Relooking Intérieur",
      before: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Cuisine avant aménagement",
        description: "Cuisine peu pratique avec espace de travail limité"
      },
      after: {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Cuisine après aménagement",
        description: "Cuisine fonctionnelle avec plan de travail optimisé et rangement intelligent"
      }
    }
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-skd-home/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-skd-home rounded-full mb-6">
              <Home className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">SKD Home</h1>
            <p className="text-xl text-gray-600 mb-2">Décoration intérieure & Home organizing</p>
            <p className="text-lg font-playfair text-skd-home italic">« Des espaces qui vous ressemblent »</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">Transformez votre Intérieur</h2>
              <div className="space-y-6">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={index} className="border-l-4 border-skd-home">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-3">
                          <IconComponent className="text-skd-home text-xl" />
                          <h3 className="font-semibold text-gray-800">{service.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{service.description}</p>
                        <p className="text-sm text-gray-700 font-medium">{service.price}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Intérieur moderne et organisé avec décoration élégante" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-semibold text-gray-800 mb-4">
              Nos Réalisations
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les transformations réalisées par notre équipe
            </p>
          </div>
          <BeforeAfterGallery images={beforeAfterImages} />
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Notre Méthode d'Intervention
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-home text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  1
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Diagnostic</h4>
                <p className="text-sm text-gray-600">Analyse de vos espaces, de vos besoins et de vos objectifs.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-home text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  2
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Plan d'action</h4>
                <p className="text-sm text-gray-600">Proposition de solutions personnalisées et adaptées à votre budget.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-home text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  3
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Transformation</h4>
                <p className="text-sm text-gray-600">Mise en œuvre du projet, avec votre participation ou en toute autonomie.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-home text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  4
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Suivi</h4>
                <p className="text-sm text-gray-600">Accompagnement et conseils pour maintenir l'organisation dans le temps.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Les Bénéfices du Home Organizing
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <div className="w-16 h-16 bg-skd-home/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <h4 className="font-playfair font-semibold text-gray-800 mb-3">Sérénité</h4>
              <p className="text-gray-600">Un environnement ordonné pour un esprit apaisé et plus de bien-être au quotidien</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <div className="w-16 h-16 bg-skd-home/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h4 className="font-playfair font-semibold text-gray-800 mb-3">Gain de Temps</h4>
              <p className="text-gray-600">Retrouvez facilement vos affaires et optimisez votre organisation personnelle</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-skd-home/20 hover:border-skd-home/50 transition-colors">
              <div className="w-16 h-16 bg-skd-home/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-playfair font-semibold text-gray-800 mb-3">Harmonie</h4>
              <p className="text-gray-600">Des espaces qui reflètent votre personnalité et favorisent votre épanouissement</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-skd-home/10 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
              Demander une Consultation à Domicile
            </h3>
            <p className="text-gray-600">
              Parlons de vos projets d'aménagement et d'organisation
            </p>
          </div>
          <ContactForm serviceType="home" />
        </div>
      </section>
    </Layout>
  );
}
