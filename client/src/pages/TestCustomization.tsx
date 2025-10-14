import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Type, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TestCustomization() {
  const [, setLocation] = useLocation();
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [showPanel, setShowPanel] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const handleCustomizationChange = (zoneId: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [zoneId]: value
    }));
  };

  const testProduct = {
    id: 'test-product',
    name: "Trophée de test",
    description: "Un trophée simple pour tester l'interface de personnalisation.",
    price: 49.99,
    mainImageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    isCustomizable: true,
    customizationZones: [
      {
        id: 'text_zone',
        type: 'text',
        position: 'center',
        label: 'Votre nom',
        required: true,
        maxLength: 20
      },
      {
        id: 'image_zone',
        type: 'image',
        position: 'top-right',
        label: 'Votre logo',
        required: false
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
            <h1 className="text-2xl font-bold text-gray-900">Test - Interface de Personnalisation</h1>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">🧪 Test de l'interface</h2>
          <p className="text-sm text-gray-700">
            Cliquez sur les zones colorées sur l'image pour tester la personnalisation.
          </p>
        </div>

        {/* Produit de test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {testProduct.name}
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                ✨ Personnalisable
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image avec zones de personnalisation */}
              <div className="relative">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={testProduct.mainImageUrl}
                    alt={testProduct.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Zone de texte - Centre */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 bg-opacity-80 border-2 border-red-600 rounded-lg p-3 min-w-[140px] max-w-[200px] transition-all duration-200 hover:bg-opacity-90 hover:scale-105 cursor-pointer shadow-lg"
                    onClick={() => {
                      setSelectedZone('text_zone');
                      setShowPanel(true);
                    }}
                  >
                    <div className="text-center">
                      <Type className="w-6 h-6 mx-auto mb-2 text-white" />
                      <div className="text-sm font-bold text-white">
                        {customizations['text_zone'] ? (
                          <span className="bg-white bg-opacity-90 text-red-800 px-2 py-1 rounded block">
                            {customizations['text_zone']}
                          </span>
                        ) : (
                          <span className="bg-white bg-opacity-90 text-red-800 px-2 py-1 rounded">
                            Cliquez pour écrire
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Zone d'image - Haut droite */}
                  <div
                    className="absolute top-4 right-4 bg-green-500 bg-opacity-80 border-2 border-green-600 rounded-lg p-3 min-w-[120px] max-w-[160px] transition-all duration-200 hover:bg-opacity-90 hover:scale-105 cursor-pointer shadow-lg"
                    onClick={() => {
                      setSelectedZone('image_zone');
                      setShowPanel(true);
                    }}
                  >
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-2 text-white" />
                      <div className="text-sm font-bold text-white">
                        {customizations['image_zone'] ? (
                          <span className="bg-white bg-opacity-90 text-green-800 px-2 py-1 rounded block">
                            ✓ Image ajoutée
                          </span>
                        ) : (
                          <span className="bg-white bg-opacity-90 text-green-800 px-2 py-1 rounded">
                            Cliquez pour uploader
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Zones de personnalisation :</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Zone rouge</span> : Ajouter du texte</li>
                    <li>• <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Zone verte</span> : Uploader une image</li>
                  </ul>
                </div>
              </div>

              {/* Informations du produit */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testProduct.name}</h3>
                  <p className="text-gray-600 mt-2">{testProduct.description}</p>
                </div>
                
                <div className="text-2xl font-bold text-gray-900">
                  {testProduct.price.toFixed(2)} €
                </div>

                {/* Résumé des personnalisations */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Vos personnalisations :</h4>
                  {testProduct.customizationZones.map(zone => {
                    const value = customizations[zone.id];
                    if (!value) return null;
                    
                    return (
                      <div key={zone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{zone.label}:</span>
                        <span className="text-sm text-gray-600 truncate max-w-[150px]">
                          {zone.type === 'text' ? value : '✓ Image ajoutée'}
                        </span>
                      </div>
                    );
                  })}
                  
                  {!Object.values(customizations).some(v => v.trim() !== '') && (
                    <p className="text-sm text-gray-500 italic">
                      Aucune personnalisation ajoutée
                    </p>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="space-y-2">
                  <Button className="w-full">
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de personnalisation */}
        {showPanel && selectedZone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Personnaliser
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPanel(false);
                      setSelectedZone(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const zone = testProduct.customizationZones.find(z => z.id === selectedZone);
                  if (!zone) return null;

                  return (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          {zone.label}
                          {zone.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        
                        {zone.type === 'text' ? (
                          <Input
                            value={customizations[zone.id] || ''}
                            onChange={(e) => handleCustomizationChange(zone.id, e.target.value)}
                            placeholder="Entrez votre texte..."
                            maxLength={zone.maxLength}
                            className="mt-2"
                            autoFocus
                          />
                        ) : (
                          <div className="mt-2 space-y-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Cliquez pour sélectionner une image</p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      handleCustomizationChange(zone.id, e.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload" className="cursor-pointer">
                                <Button variant="outline" size="sm" className="mt-2">
                                  <Plus className="w-4 h-4 mr-1" />
                                  Choisir une image
                                </Button>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setShowPanel(false);
                            setSelectedZone(null);
                          }}
                          className="flex-1"
                        >
                          Valider
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPanel(false);
                            setSelectedZone(null);
                          }}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Informations de debug */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Zone rouge (centre) : Texte - max 20 caractères</li>
            <li>• Zone verte (haut droite) : Image - optionnel</li>
            <li>• Panel modal avec overlay sombre</li>
            <li>• Validation/Annulation avec boutons</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
