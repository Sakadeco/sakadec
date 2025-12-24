import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, Cake, Baby } from "lucide-react";
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

export default function Events() {

  const galleryImages = [
    { url: DSC6144, alt: "Réalisation SakaDeco Events" },
    { url: DSC6145, alt: "Réalisation SakaDeco Events" },
    { url: DSC6148, alt: "Réalisation SakaDeco Events" },
    { url: DSC6151, alt: "Réalisation SakaDeco Events" },
    { url: DSC6157, alt: "Réalisation SakaDeco Events" },
    { url: DSC6160, alt: "Réalisation SakaDeco Events" },
    { url: DSC6163, alt: "Réalisation SakaDeco Events" },
    { url: DSC6175, alt: "Réalisation SakaDeco Events" },
    { url: DSC6178, alt: "Réalisation SakaDeco Events" },
    { url: DSC6190, alt: "Réalisation SakaDeco Events" },
    { url: DSC6195, alt: "Réalisation SakaDeco Events" },
    { url: DSC6196, alt: "Réalisation SakaDeco Events" },
    { url: DSC6199, alt: "Réalisation SakaDeco Events" },
    { url: DSC6204, alt: "Réalisation SakaDeco Events" },
    { url: DSC6205, alt: "Réalisation SakaDeco Events" }
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
          {/* Nos Créations */}
          <div className="mb-16">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">Nos Créations</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Nous créons des univers visuels sur mesure, pensés à votre image, pour sublimer chaque moment important.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              De la conception à l'installation, nous imaginons des décors élégants, harmonieux et mémorables.
            </p>
            <p className="text-lg font-semibold text-skd-events mb-4">
              À partir de 600 € – Sur devis
            </p>
            <div className="bg-yellow-50 border-l-4 border-skd-events p-4 mb-8 rounded">
              <p className="text-gray-700 text-sm">
                <strong>Délai minimum de réservation :</strong> Afin de garantir une prestation soignée, harmonieuse et parfaitement orchestrée, un délai minimum de réservation est requis selon votre événement (ex : Mariage — 6 mois · Autres événements — 3 mois).
              </p>
              <p className="text-gray-700 text-sm mt-2">
                Si votre date est plus proche, nous pouvons mettre en place un traitement prioritaire. Cependant, en raison de l'organisation accélérée et des ressources mobilisées en urgence, des frais supplémentaires pourront s'appliquer.
              </p>
            </div>
          </div>

          {/* Nos Prestations */}
          <div className="mb-16">
            <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">Nos prestations incluent :</h3>
            <div className="grid md:grid-cols-2 gap-4">
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
          <div className="mb-16">
            <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">Nos événements</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-skd-events rounded-full flex items-center justify-center">
                  <Heart className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mariages</h4>
                  <p className="text-gray-600">Cérémonies et réceptions sur mesure, avec arches florales, centres de table et scénographies uniques.</p>
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
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Galerie de nos Créations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="h-64 w-full object-cover group-hover:scale-110 transform transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
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
