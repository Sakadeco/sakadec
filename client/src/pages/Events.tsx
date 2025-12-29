import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, Cake, Baby } from "lucide-react";

export default function Events() {

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-skd-events/10 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-skd-events rounded-full mb-4 sm:mb-6">
              <Star className="text-white text-xl sm:text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-3 sm:mb-4">SKD Events</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">Décoration d'événements</p>
            <p className="text-sm sm:text-base md:text-lg font-playfair text-skd-events italic">« L'art de décorer vos plus beaux jours »</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Nos Créations */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-800 mb-4 sm:mb-6">Nos Créations</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
              Nous créons des univers visuels sur mesure, pensés à votre image, pour sublimer chaque moment important.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
              De la conception à l'installation, nous imaginons des décors élégants, harmonieux et mémorables.
            </p>
            <p className="text-base sm:text-lg font-semibold text-skd-events mb-3 sm:mb-4">
              À partir de 600 € – Sur devis
            </p>
            <div className="bg-yellow-50 border-l-4 border-skd-events p-3 sm:p-4 mb-6 sm:mb-8 rounded">
              <p className="text-xs sm:text-sm text-gray-700">
                <strong>Délai minimum de réservation :</strong> Afin de garantir une prestation soignée, harmonieuse et parfaitement orchestrée, un délai minimum de réservation est requis selon votre événement (ex : Mariage — 6 mois · Autres événements — 3 mois).
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mt-2">
                Si votre date est plus proche, nous pouvons mettre en place un traitement prioritaire. Cependant, en raison de l'organisation accélérée et des ressources mobilisées en urgence, des frais supplémentaires pourront s'appliquer.
              </p>
            </div>
          </div>

          {/* Nos Prestations */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-gray-800 mb-4 sm:mb-6">Nos prestations incluent :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-skd-events rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700">Moodboard personnalisé</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-skd-events rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700">Proposition d'ambiance et de thème</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-skd-events rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700">Scénographie & plan de décoration</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-skd-events rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700">Installation et désinstallation</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-skd-events rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700">Location de décoration possible via notre catalogue</p>
              </div>
            </div>
          </div>

          {/* Nos Événements */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-gray-800 mb-4 sm:mb-6">Nos événements</h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-skd-events rounded-full flex items-center justify-center">
                  <Heart className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">Mariages</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Cérémonies et réceptions sur mesure, avec arches florales, centres de table et scénographies uniques.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-skd-events rounded-full flex items-center justify-center">
                  <Cake className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Anniversaires</h4>
                  <p className="text-gray-600">Des fêtes mémorables, aux thèmes personnalisés et décorations spectaculaires.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-skd-events rounded-full flex items-center justify-center">
                  <Baby className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Baby Showers</h4>
                  <p className="text-gray-600">Des célébrations douces et raffinées pour accueillir bébé avec style et émotion.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-skd-events rounded-full flex items-center justify-center">
                  <Star className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Autres événements</h4>
                  <p className="text-gray-600">Nous accompagnons également vos événements privés et professionnels, en créant des décors adaptés à chaque occasion, dans le respect de votre univers et de vos envies.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <a
              href="https://www.instagram.com/sakadeco_events/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-playfair font-semibold text-gray-800 hover:text-skd-events transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-skd-events"
            >
              Galerie de nos Créations
            </a>
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
