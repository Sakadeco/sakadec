import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import ProductWithCustomization from '@/components/ProductWithCustomization';

export default function ProductCustomizationDemo() {
  const [, setLocation] = useLocation();

  // Produit de démonstration avec zones de personnalisation
  const demoProduct = {
    id: 'demo-trophy',
    name: "Trophée personnalisable",
    description: "Trophée élégant en métal avec possibilité de gravure personnalisée. Parfait pour les récompenses d'entreprise, événements sportifs ou reconnaissances spéciales.",
    price: 89.99,
    mainImageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop"
    ],
    isCustomizable: true,
    customizationZones: [
      {
        id: 'main_text',
        type: 'text',
        position: 'center',
        label: 'Votre nom ou message',
        required: true,
        maxLength: 30
      },
      {
        id: 'main_image',
        type: 'image',
        position: 'top-right',
        label: 'Votre logo ou image',
        required: false
      }
    ]
  };

  const demoProduct2 = {
    id: 'demo-plaque',
    name: "Plaque commémorative",
    description: "Plaque commémorative en bois noble avec gravure personnalisée. Idéale pour les événements, inaugurations ou souvenirs spéciaux.",
    price: 149.99,
    mainImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    ],
    isCustomizable: true,
    customizationZones: [
      {
        id: 'main_text',
        type: 'text',
        position: 'center',
        label: 'Texte commémoratif',
        required: true,
        maxLength: 50
      }
    ]
  };

  const demoProduct3 = {
    id: 'demo-bracelet',
    name: "Bracelet personnalisé",
    description: "Bracelet en argent sterling avec gravure personnalisée. Parfait cadeau pour les anniversaires, mariages ou occasions spéciales.",
    price: 79.99,
    mainImageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop"
    ],
    isCustomizable: true,
    customizationZones: [
      {
        id: 'main_text',
        type: 'text',
        position: 'center',
        label: 'Nom ou message',
        required: true,
        maxLength: 20
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Démonstration - Personnalisation Interactive</h1>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p>Cliquez sur les zones colorées sur l'image du produit</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p>Entrez votre texte ou uploadez votre image</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p>Prévisualisez le résultat en 3D</p>
            </div>
          </div>
        </div>

        {/* Produits de démonstration */}
        <div className="space-y-12">
          {/* Trophée */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">🏆 Trophée personnalisable</h2>
            <ProductWithCustomization product={demoProduct} />
          </div>

          {/* Plaque */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">📜 Plaque commémorative</h2>
            <ProductWithCustomization product={demoProduct2} />
          </div>

          {/* Bracelet */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">💍 Bracelet personnalisé</h2>
            <ProductWithCustomization product={demoProduct3} />
          </div>
        </div>

        {/* Informations techniques */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Fonctionnalités techniques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pour l'administrateur :</h4>
              <ul className="space-y-1">
                <li>• Configuration simple : type (texte/image) et position</li>
                <li>• Zones de personnalisation automatiquement générées</li>
                <li>• Interface intuitive pour définir les options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pour le client :</h4>
              <ul className="space-y-1">
                <li>• Zones cliquables directement sur l'image</li>
                <li>• Interface intuitive pour ajouter texte/image</li>
                <li>• Prévisualisation 3D en temps réel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
