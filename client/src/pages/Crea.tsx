import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function Crea() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-skd-crea/10 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-skd-crea rounded-full mb-4 sm:mb-6">
              <Palette className="text-white text-xl sm:text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-3 sm:mb-4">SKD Créa</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">Personnalisation & papeterie</p>
            <p className="text-sm sm:text-base md:text-lg font-playfair text-skd-crea italic">« Du sur-mesure pour vos plus belles attentions »</p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-2">
            <h2 className="text-xl sm:text-2xl font-playfair font-semibold text-gray-800 mb-4 sm:mb-6">
              SKD CREA – Création & personnalisation sur mesure
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700 text-left">
              <p>
                Tous nos produits sont entièrement personnalisables, quel que soit le thème.
              </p>
              <p>
                Chez SKD CREA, nous concevons des créations décoratives pensées pour vous simplifier l'organisation de votre événement, tout en garantissant un rendu élégant et cohérent.
              </p>
              <p>
                Fini les recherches interminables : votre thème est décliné sur l'ensemble des produits que vous choisissez, pour une décoration harmonieuse et unique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comment passer commande */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-gray-800 mb-6 sm:mb-8 text-center">Comment passer commande ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Processus de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-700 list-decimal list-inside mb-6">
                  <li>Parcourez la boutique et ajoutez vos produits au panier</li>
                  <li>Choisissez votre thème (existant ou sur mesure : couleurs, personnage, univers…)</li>
                  <li>Vérifiez vos informations de personnalisation</li>
                  <li>Validez votre commande et le paiement</li>
                </ol>
                <div className="mt-4">
                  <Button asChild className="w-full bg-skd-crea hover:bg-skd-crea/90 text-white">
                    <Link to="/shop">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Découvrez notre boutique
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Délais et livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Les commandes sont traitées par date d'événement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Délai de fabrication et d'expédition : 15 à 25 jours ouvrés (sauf indication contraire), selon votre commande</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Un email de suivi vous est envoyé dès l'expédition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Réception en moyenne 3 jours avant votre événement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Notre engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Fabrication fait main</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Personnalisation à l'infini</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Expédition dans toute l'Europe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Commandes susceptibles d'être mises en avant sur notre site et réseaux sociaux</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Livraison (indicative)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Colissimo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Chronopost</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Remise en main propre</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-gray-800 mb-6 sm:mb-8 text-center">Nos Créations Personnalisées</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Cadeaux Personnalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Mugs, sacs, boîtes avec vos messages et designs uniques</p>
                <div className="flex justify-end items-center">
                  <span className="text-skd-crea font-medium">Personnalisable</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Papeterie d'Événement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Menus, étiquettes, invitations pour vos occasions spéciales</p>
                <div className="flex justify-end items-center">
                  <span className="text-skd-crea font-medium">Sur mesure</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Objets Gourmands</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Sablés, bonbons, chocolats avec messages personnalisés</p>
                <div className="flex justify-end items-center">
                  <span className="text-skd-crea font-medium">Fait main</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bouton Boutique */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Button asChild size="lg" className="bg-skd-crea hover:bg-skd-crea/90 text-white text-sm sm:text-base px-6 sm:px-10">
            <Link to="/shop">
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Voir la boutique
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
