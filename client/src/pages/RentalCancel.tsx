import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const RentalCancel: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Location annulée
          </h1>
          <p className="text-gray-600">
            Votre location a été annulée. Aucun montant n'a été débité de votre compte.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Que s'est-il passé ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                Vous avez annulé le processus de paiement avant sa finalisation. 
                Votre panier de location est toujours disponible et vous pouvez 
                réessayer quand vous le souhaitez.
              </p>
              <p>
                Si vous rencontrez des difficultés, n'hésitez pas à nous contacter 
                pour obtenir de l'aide.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setLocation('/rental-cart')}
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Retour au panier de location
          </Button>
          <Button
            onClick={() => setLocation('/rent')}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuer les locations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalCancel;
