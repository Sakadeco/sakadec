import React from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement annulé
          </h1>
          <p className="text-lg text-gray-600">
            Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Que s'est-il passé ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Le processus de paiement a été interrompu. Cela peut arriver pour plusieurs raisons :
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Vous avez fermé la fenêtre de paiement</li>
                <li>Il y a eu un problème technique temporaire</li>
                <li>Vous avez annulé le paiement</li>
                <li>Votre carte a été refusée</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">
                  Pas de souci !
                </h4>
                <p className="text-blue-800 text-sm">
                  Votre panier est toujours disponible. Vous pouvez réessayer le paiement à tout moment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/shop')}
              className="bg-skd-shop hover:bg-skd-shop/90"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Retourner au panier
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/shop')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuer mes achats
            </Button>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Besoin d'aide ? Notre équipe est là pour vous accompagner.
            </p>
            <Button
              variant="ghost"
              onClick={() => setLocation('/contact')}
            >
              Contactez-nous
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentCancel;
