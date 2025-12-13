import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Phone, Heart, Target } from "lucide-react";
import Logo from "@/components/Logo";
import DSC6216 from "@/assets/images/DSC_6216.JPG";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Créativité",
      description: "Chaque projet est unique, chaque détail a du sens."
    },
    {
      icon: Heart,
      title: "Fiabilité", 
      description: "Nous respectons vos délais, vos attentes et vos émotions."
    },
    {
      icon: Target,
      title: "Exigence",
      description: "La qualité, dans le rendu comme dans le service."
    }
  ];

  const timeline = [
    {
      year: "2017",
      event: "Lancement de l'activité en décoration événementielle"
    },
    {
      year: "2024", 
      event: "Création de l'entité SKD Group"
    },
    {
      year: "2025",
      event: "Développement de pôles spécialisés pour une offre 360°"
    }
  ];

  const expertise = [
    "Création de papeterie et cadeaux personnalisés",
    "Scénographie événementielle", 
    "Création visuelle personnalisée",
    "Design floral et ballons",
    "Logistique et coordination d'événements",
    "Home staging & home organizing"
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gold/10 to-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Logo width={180} height={120} className="drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 mb-4">
            À propos de <span className="metallic-gold">Pajusly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">Fondatrice de SakaDeco Group</p>
          <div className="flex items-center justify-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="text-gold w-5 h-5" />
              <span>Bordeaux</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="text-gold w-5 h-5" />
              <span>06 88 00 39 28</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gold w-5 h-5" />
              <span>Depuis 2017</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Pajusly */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={DSC6216} 
                alt="Portrait professionnel de Pajusly, fondatrice" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">Mon histoire</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Je me présente, je suis Pajusly ! J'habite à Bordeaux et je suis l'heureuse maman de deux enfants, 
                  de véritables petits bouts en train !
                </p>
                <p>
                  Côté professionnel, j'ai principalement occupé des postes de conseillère et de gestionnaire clientèle 
                  au sein de grandes entreprises. Mais depuis toujours, ma véritable passion, c'est la décoration.
                </p>
                <p>
                  Aussi loin que je m'en souvienne, j'ai toujours pris plaisir à organiser ou à participer à la mise en place 
                  de surprises, de fêtes ou de rassemblements familiaux.
                </p>
                <p>
                  C'est ainsi qu'est né SakaDeco Events, une aventure née de l'envie de rassembler mes compétences 
                  professionnelles, ma créativité et mon amour pour l'organisation au sein d'une seule et même entreprise : 
                  la décoration événementielle.
                </p>
                <p>
                  Aujourd'hui, je suis fière d'évoluer dans cet univers qui me passionne. Je me suis également formée et 
                  certifiée dans le design floral, la personnalisation d'objets, la décoration de ballons et l'événementiel, 
                  afin de proposer des prestations encore plus abouties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Dates clés</h2>
            <p className="text-xl text-gray-600">L'évolution de SakaDeco Group</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {timeline.map((item) => (
              <Card key={item.year} className="text-center border-2 border-gold/20">
                <CardHeader>
                  <div className="text-4xl font-playfair font-bold text-gold mb-2">{item.year}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{item.event}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            <Card className="border-2 border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-gold">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Offrir à chaque client une expérience sur-mesure, qu'il s'agisse d'un événement, 
                  d'un intérieur ou d'un besoin de personnalisation, avec élégance, efficacité et sens du détail.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-gold">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Devenir une référence dans les services de décoration, d'organisation et de 
                  personnalisation haut de gamme dans la région bordelaise et au-delà.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-gold">Ambition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Offrir une solution globale autour de la décoration, de l'organisation d'événements 
                  et du bien-être chez soi, structurée sous une identité créative et professionnelle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Nos valeurs</h2>
            <p className="text-xl text-gray-600">Ce qui guide notre approche</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-gold w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-2">Simplicité</h3>
              <p className="text-gray-600">Rendre les choses belles sans les compliquer.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl">👂</span>
              </div>
              <h3 className="text-xl font-playfair font-semibold text-gray-800 mb-2">Écoute</h3>
              <p className="text-gray-600">Vous êtes au cœur du projet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Domaines d'expertise</h2>
            <p className="text-xl text-gray-600">Mes compétences au service de vos projets</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertise.map((skill) => (
              <Badge key={skill} variant="outline" className="text-center p-4 border-gold text-gray-700 hover:bg-gold/10">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">SKD Group aujourd'hui</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              SKD Group est une entreprise spécialisée dans la création et vente d'accessoires décoratifs, 
              la personnalisation d'objets, la décoration d'événements, la location de matériel festif, 
              l'organisation complète d'événements et la décoration intérieure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-gold/20">
              <CardHeader>
                <CardTitle className="text-xl font-playfair text-gold">Zone d'intervention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  <strong>Île-de-France & Bordeaux Métropole</strong> - Nos zones principales
                </p>
                <p className="text-gray-600">
                  Je me déplace dans toute la France — et à l'international — pour accompagner vos projets d'exception.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gold/20">
              <CardHeader>
                <CardTitle className="text-xl font-playfair text-gold">Organisation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  N'ayant pas de magasin physique pour l'instant, les rendez-vous se font sur rendez-vous uniquement.
                </p>
                <p className="text-gray-600">
                  Les commandes sont traitées par ordre de date d'événement pour garantir la meilleure 
                  organisation possible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}