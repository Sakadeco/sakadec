import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CalendarCheck, Lightbulb } from "lucide-react";

export default function Co() {
  const services = [
    {
      icon: ClipboardList,
      title: "Coordination A à Z",
      description: "Gestion complète de l'événement, de la planification initiale à la coordination du jour J",
      features: ["Recherche de prestataires", "Gestion du budget", "Planning détaillé", "Suivi qualité"]
    },
    {
      icon: CalendarCheck,
      title: "Gestion Jour J",
      description: "Présence sur place pour coordonner tous les prestataires et assurer le bon déroulement",
      features: ["Coordination équipes", "Gestion des imprévus", "Respect du timing", "Assistance complète"]
    },
    {
      icon: Lightbulb,
      title: "Création de Concept",
      description: "Développement de thèmes originaux et scénographies personnalisées pour votre événement",
      features: ["Thèmes sur-mesure", "Scénographie unique", "Ambiances personnalisées", "Innovation créative"]
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Consultation",
      description: "Écoute de vos besoins"
    },
    {
      number: 2,
      title: "Conception",
      description: "Création du concept"
    },
    {
      number: 3,
      title: "Planification",
      description: "Organisation détaillée"
    },
    {
      number: 4,
      title: "Réalisation",
      description: "Jour J parfait"
    }
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-skd-co/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-skd-co rounded-full mb-6">
              <Users className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">SKD & Co</h1>
            <p className="text-xl text-gray-600 mb-2">Organisation d'événements</p>
            <p className="text-lg font-playfair text-skd-co italic">« On s'occupe de tout, vous profitez de l'instant »</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="text-center border-2 border-skd-co/20 hover:border-skd-co/50 transition-colors shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 bg-skd-co rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="text-white text-2xl" />
                    </div>
                    <CardTitle className="font-playfair text-gray-800">{service.title}</CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-500 space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>• {feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">Notre Processus</h3>
          <div className="flex flex-wrap justify-center items-center space-x-0 lg:space-x-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center mb-8 lg:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-skd-co text-white rounded-full flex items-center justify-center font-bold mb-3 text-lg">
                    {step.number}
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 text-center max-w-24">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block mx-4">
                    <svg className="w-8 h-6 text-skd-co" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Pourquoi Nous Choisir ?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-skd-co">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">🎯 Expertise Reconnue</h4>
                <p className="text-gray-600">
                  Plus de 7 ans d'expérience dans l'organisation d'événements avec des références 
                  clients satisfaites et des partenaires de confiance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-skd-co">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">💡 Créativité Sur-Mesure</h4>
                <p className="text-gray-600">
                  Chaque événement est unique. Nous créons des concepts originaux qui reflètent 
                  votre personnalité et vos valeurs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-skd-co">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">🤝 Accompagnement Total</h4>
                <p className="text-gray-600">
                  De la conception à la réalisation, nous vous accompagnons à chaque étape 
                  pour que votre événement soit parfait.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-skd-co">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">📍 Proximité Bordelaise</h4>
                <p className="text-gray-600">
                  Basés à Bordeaux, nous connaissons parfaitement la région et ses meilleurs 
                  prestataires pour vous offrir un service d'excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Types of Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">
            Types d'Événements Organisés
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-2 border-skd-co/20 hover:border-skd-co/50 transition-colors">
              <div className="w-16 h-16 bg-skd-co/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💒</span>
              </div>
              <h4 className="font-playfair font-semibold text-gray-800 mb-3">Mariages</h4>
              <p className="text-gray-600">Cérémonie civile, religieuse, laïque, réception, cocktail</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-skd-co/20 hover:border-skd-co/50 transition-colors">
              <div className="w-16 h-16 bg-skd-co/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h4 className="font-playfair font-semibold text-gray-800 mb-3">Événements Corporate</h4>
              <p className="text-gray-600">Séminaires, lancements produit, team building, galas</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-skd-co/20 hover:border-skd-co/50 transition-colors">
              <div className="w-16 h-16 bg-skd-co/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h4 className="font-playfair font-semibold text-gray-800 mb-3">Événements Privés</h4>
              <p className="text-gray-600">Anniversaires, baptêmes, communions, fêtes familiales</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-skd-co/10 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
              Organisons Votre Événement Ensemble
            </h3>
            <p className="text-gray-600">
              Confiez-nous votre projet et concentrez-vous sur l'essentiel : profiter de votre événement
            </p>
          </div>
          <ContactForm serviceType="co" />
        </div>
      </section>
    </Layout>
  );
}
