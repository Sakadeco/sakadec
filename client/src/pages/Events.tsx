import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, Cake, Baby } from "lucide-react";

export default function Events() {
  const services = [
    {
      icon: Heart,
      title: "Mariages",
      description: "Cérémonies et réceptions sur-mesure avec arches florales, centres de table et scénographies uniques"
    },
    {
      icon: Cake,
      title: "Anniversaires", 
      description: "Fêtes d'anniversaire mémorables avec thèmes personnalisés et décorations spectaculaires"
    },
    {
      icon: Baby,
      title: "Baby Showers",
      description: "Célébrations douces et raffinées pour accueillir bébé avec style et émotion"
    }
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Réception de mariage élégante"
    },
    {
      url: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Centres de table floraux"
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Cérémonie en extérieur avec arche"
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Décoration d'anniversaire avec ballons"
    }
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-skd-events/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-skd-events rounded-full mb-6">
              <Star className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">SKD Events</h1>
            <p className="text-xl text-gray-600 mb-2">Décoration d'événements</p>
            <p className="text-lg font-playfair text-skd-events italic">« L'art de décorer vos plus beaux jours »</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Décoration de mariage avec arche fleurie" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">Nos Spécialités</h2>
              <div className="space-y-6">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-skd-events rounded-full flex items-center justify-center">
                        <IconComponent className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Galerie de nos Créations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="group cursor-pointer">
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-48 w-full object-cover group-hover:scale-105 transform transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Notre Processus de Création
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-2 border-skd-events/20 hover:border-skd-events/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-events text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  1
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Consultation</h4>
                <p className="text-sm text-gray-600">Écoute de vos souhaits et analyse de vos besoins</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-skd-events/20 hover:border-skd-events/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-events text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  2
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Conception</h4>
                <p className="text-sm text-gray-600">Création d'un concept sur-mesure et présentation 3D</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-skd-events/20 hover:border-skd-events/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-events text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  3
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Réalisation</h4>
                <p className="text-sm text-gray-600">Installation professionnelle le jour J</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-skd-events/20 hover:border-skd-events/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-skd-events text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto text-lg">
                  4
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Démontage</h4>
                <p className="text-sm text-gray-600">Remise en état après votre événement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-skd-events/10 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
              Demander un Devis Personnalisé
            </h3>
            <p className="text-gray-600">
              Partagez-nous votre vision et nous créerons la décoration de vos rêves
            </p>
          </div>
          <ContactForm serviceType="events" />
        </div>
      </section>
    </Layout>
  );
}
