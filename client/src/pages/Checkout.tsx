import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, CreditCard, Phone, Mail } from "lucide-react";

export default function CheckoutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-10 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-2 bg-yellow-100 text-yellow-800 border-yellow-300 text-xs sm:text-sm">
              <AlertCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Fonctionnalité en développement
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
              Commande et Paiement
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Le système de paiement en ligne sera bientôt disponible
            </p>
          </div>

          {/* Information Card */}
          <Card className="mb-6 sm:mb-8 border-0 shadow-lg">
            <CardHeader className="text-center pb-4 sm:pb-6 p-4 sm:p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-playfair">Paiement temporairement indisponible</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-blue-800 dark:text-blue-200 mb-2 sm:mb-3">
                  📋 Pour finaliser votre commande dès maintenant :
                </h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  <li>• Contactez-nous directement par téléphone ou email</li>
                  <li>• Envoyez-nous les détails de votre commande</li>
                  <li>• Nous vous proposerons plusieurs moyens de paiement</li>
                  <li>• Possibilité de paiement en plusieurs fois</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Contact par téléphone */}
                <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                      Appelez-nous
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                      Parlons de votre projet directement
                    </p>
                    <p className="text-green-600 dark:text-green-400 font-bold text-lg">
                      06 88 00 39 28
                    </p>
                  </div>
                </div>

                {/* Contact par email */}
                <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      Formulaire de contact
                    </h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm mb-2">
                      Envoyez-nous votre demande détaillée
                    </p>
                    <Button asChild size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Link to="/contact">Contacter</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Advantages */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  ✨ Avantages de commander par contact direct :
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="space-y-2">
                    <p>• <strong>Conseil personnalisé</strong> pour votre projet</p>
                    <p>• <strong>Devis sur mesure</strong> selon vos besoins</p>
                    <p>• <strong>Paiement flexible</strong> (échelonné possible)</p>
                  </div>
                  <div className="space-y-2">
                    <p>• <strong>Livraison optimisée</strong> selon votre zone</p>
                    <p>• <strong>Service après-vente</strong> personnalisé</p>
                    <p>• <strong>Garantie satisfaction</strong> à 100%</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/shop">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour au catalogue
                  </Link>
                </Button>
                <Button asChild className="flex-1 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white">
                  <Link to="/contact">
                    <Phone className="mr-2 h-4 w-4" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">🚀 Fonctionnalités à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Paiement en ligne sécurisé
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Carte bancaire, PayPal, virement instantané
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Suivi de commande en temps réel
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Notifications SMS/Email à chaque étape
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Espace client personnalisé
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Historique, favoris, recommandations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
