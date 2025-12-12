import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, Type, Image as ImageIcon, Plus, X } from 'lucide-react';

interface CustomizationZone {
  id: string;
  type: 'text' | 'image';
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  label: string;
  required: boolean;
  maxLength?: number;
}

interface ProductWithCustomizationProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    mainImageUrl: string;
    additionalImages: string[];
    isCustomizable: boolean;
    customizationZones?: CustomizationZone[];
  };
}

export default function ProductWithCustomization({ product }: ProductWithCustomizationProps) {
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);

  // Zones de personnalisation par défaut si non définies
  const customizationZones = product.customizationZones || [
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
  ];

  const handleCustomizationChange = (zoneId: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [zoneId]: value
    }));
  };

  const getZonePosition = (position: string) => {
    const positions = {
      'top-left': 'absolute top-4 left-4',
      'top-center': 'absolute top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'absolute top-4 right-4',
      'center-left': 'absolute top-1/2 left-4 transform -translate-y-1/2',
      'center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'center-right': 'absolute top-1/2 right-4 transform -translate-y-1/2',
      'bottom-left': 'absolute bottom-4 left-4',
      'bottom-center': 'absolute bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'absolute bottom-4 right-4'
    };
    return positions[position as keyof typeof positions] || positions.center;
  };

  const renderCustomizationZone = (zone: CustomizationZone) => {
    const hasValue = customizations[zone.id];

    return (
      <div
        key={zone.id}
        className={`${getZonePosition(zone.position)} bg-blue-500 bg-opacity-30 border-2 border-blue-600 rounded-lg p-3 min-w-[120px] max-w-[180px] transition-all duration-200 hover:bg-opacity-50 hover:scale-105 cursor-pointer shadow-lg`}
        onClick={() => {
          setSelectedZone(zone.id);
          setShowCustomizationPanel(true);
        }}
      >
        <div className="text-center">
          {zone.type === 'text' ? (
            <Type className="w-5 h-5 mx-auto mb-2 text-blue-700" />
          ) : (
            <ImageIcon className="w-5 h-5 mx-auto mb-2 text-blue-700" />
          )}
          <div className="text-xs font-bold text-blue-900">
            {hasValue ? (
              <span className="truncate block bg-white bg-opacity-80 px-2 py-1 rounded">
                {customizations[zone.id]}
              </span>
            ) : (
              <span className="block bg-white bg-opacity-80 px-2 py-1 rounded">
                {zone.label}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const hasCustomizations = Object.values(customizations).some(value => value.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Produit avec zones de personnalisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {product.name}
            {product.isCustomizable && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                ✨ Personnalisable
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image du produit avec zones de personnalisation */}
            <div className="relative">
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={product.mainImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Zones de personnalisation */}
                {product.isCustomizable && customizationZones.map(renderCustomizationZone)}
                
                {/* Overlay pour indiquer les zones cliquables */}
                {product.isCustomizable && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <div className="text-white text-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <p className="text-sm font-medium">Cliquez sur les zones bleues pour personnaliser</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Instructions */}
              {product.isCustomizable && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Instructions de personnalisation</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Cliquez sur les zones bleues pour ajouter du contenu</li>
                    <li>• Vous pouvez ajouter du texte ou des images</li>
                    <li>• Les personnalisations seront appliquées à votre produit</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Informations du produit */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{product.description}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-green-600">
                    {product.price.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Résumé des personnalisations */}
              {hasCustomizations && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Personnalisations ajoutées</h4>
                  <div className="space-y-2">
                    {Object.entries(customizations).map(([zoneId, value]) => {
                      if (!value.trim()) return null;
                      const zone = customizationZones.find(z => z.id === zoneId);
                      return (
                        <div key={zoneId} className="flex items-center space-x-2">
                          {zone?.type === 'text' ? (
                            <Type className="w-4 h-4 text-green-600" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-sm text-green-800">
                            <strong>{zone?.label}:</strong> {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bouton d'action */}
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Ajouter au panier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de personnalisation */}
      {showCustomizationPanel && selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Personnalisation
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCustomizationPanel(false);
                    setSelectedZone(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const zone = customizationZones.find(z => z.id === selectedZone);
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
                          setShowCustomizationPanel(false);
                          setSelectedZone(null);
                        }}
                        className="flex-1"
                      >
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCustomizationPanel(false);
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
    </div>
  );
}
