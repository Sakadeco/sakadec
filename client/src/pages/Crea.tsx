import Layout from "@/components/Layout";
import ProductCustomizer from "@/components/ProductCustomizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function Crea() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-skd-crea/10 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-skd-crea rounded-full mb-6">
              <Palette className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-4">SKD Créa</h1>
            <p className="text-xl text-gray-600 mb-2">Personnalisation & papeterie</p>
            <p className="text-lg font-playfair text-skd-crea italic">« Du sur-mesure pour vos plus belles attentions »</p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">
              SKD CREA – Création & personnalisation sur mesure
            </h2>
            <div className="space-y-4 text-gray-700 text-left">
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

      {/* Product Customizer */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-6">Configurateur de Produit</h2>
              <ProductCustomizer />
            </div>
            
            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Cadeaux personnalisés et papeterie élégante" 
                className="rounded-xl shadow-lg w-full"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-4">
                  <span className="text-2xl mb-2 block">☕</span>
                  <div className="font-medium text-gray-800">Mugs & Objets</div>
                </Card>
                <Card className="text-center p-4">
                  <span className="text-2xl mb-2 block">✉️</span>
                  <div className="font-medium text-gray-800">Papeterie</div>
                </Card>
                <Card className="text-center p-4">
                  <span className="text-2xl mb-2 block">🎂</span>
                  <div className="font-medium text-gray-800">Gourmandises</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="font-medium text-gray-800">Boîtes Cadeau</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment passer commande */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">Comment passer commande ?</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-l-4 border-skd-crea">
              <CardHeader>
                <CardTitle className="font-playfair text-gray-800">Processus de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                  <li>Parcourez la boutique et ajoutez vos produits au panier</li>
                  <li>Choisissez votre thème (existant ou sur mesure : couleurs, personnage, univers…)</li>
                  <li>Vérifiez vos informations de personnalisation</li>
                  <li>Validez votre commande et le paiement</li>
                </ol>
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

          <div className="grid md:grid-cols-2 gap-8">
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
                    <span>Colissimo : 2 jours ouvrés (France métropolitaine)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-skd-crea mr-2">•</span>
                    <span>Mondial Relay : 3 à 4 jours ouvrés (France métropolitaine)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-8 text-center">Nos Créations Personnalisées</h3>
          <div className="grid md:grid-cols-3 gap-6">
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
    </Layout>
  );
}
