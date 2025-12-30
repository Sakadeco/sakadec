import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Eye, Upload, X, Type, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface CustomizationOption {
  type: 'dropdown' | 'checkbox' | 'text' | 'textarea' | 'text_image_upload';
  label: string;
  required: boolean;
  options?: string[];
  valuePrices?: Record<string, number>; // Prix pour chaque valeur (optionnel)
  placeholder?: string;
  maxLength?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  pricePerCharacter?: number;
  basePrice?: number;
  engravingType?: 'text' | 'image' | 'both'; // Nouveau champ pour les gravures
}

interface ProductCustomizationProps {
  productName: string;
  productImage: string;
  customizationOptions: Record<string, CustomizationOption>;
  onCustomizationChange: (customizations: Record<string, any>, priceAdjustment?: number) => void;
  initialCustomizations?: Record<string, any>;
  basePrice?: number; // Prix de base du produit
}

export default function ProductCustomization({
  productName,
  productImage,
  customizationOptions,
  onCustomizationChange,
  initialCustomizations = {},
  basePrice = 0
}: ProductCustomizationProps) {
  const [customizations, setCustomizations] = useState<Record<string, any>>(initialCustomizations);
  const [customText, setCustomText] = useState('');
  const [customImage, setCustomImage] = useState<string>('');
  const [customizationType, setCustomizationType] = useState<'text' | 'image'>('text');
  const [customizationPrice, setCustomizationPrice] = useState(0);

  // Calculer le nouveau prix de base si une valeur a un prix défini
  // Si une valeur a un prix, ce prix remplace le prix de base du produit
  const calculateNewBasePrice = (customizations: Record<string, any>): number => {
    // Chercher la première option avec valuePrices et une valeur sélectionnée
    for (const [key, option] of Object.entries(customizationOptions)) {
      if (option.valuePrices && customizations[key]) {
        const selectedValue = customizations[key];
        // Si c'est une valeur unique (dropdown) et qu'elle a un prix défini
        if (typeof selectedValue === 'string' && option.valuePrices[selectedValue] !== undefined) {
          // Utiliser le prix de la valeur comme nouveau prix de base
          return option.valuePrices[selectedValue];
        }
        // Si c'est un tableau (checkbox), utiliser le prix de la première valeur avec prix
        if (Array.isArray(selectedValue)) {
          for (const val of selectedValue) {
            if (option.valuePrices[val] !== undefined) {
              return option.valuePrices[val];
            }
          }
        }
      }
    }
    // Si aucune valeur avec prix n'est sélectionnée, retourner le prix de base
    return basePrice;
  };

  const handleCustomizationChange = (key: string, value: any) => {
    const newCustomizations = { ...customizations, [key]: value };
    setCustomizations(newCustomizations);
    
    // Ne pas appliquer de frais supplémentaires pour les personnalisations
    // Seulement pour les options avec valuePrices (ex: tailles, couleurs avec prix différents)
    const option = customizationOptions[key];
    if (option && option.type === 'text_image_upload') {
      // Pour les gravures/personnalisations, pas de prix supplémentaire
      setCustomizationPrice(0);
      onCustomizationChange(newCustomizations, 0);
    } else {
      // Pour les autres options (dropdown avec valuePrices), calculer le nouveau prix de base
      const newBasePrice = calculateNewBasePrice(newCustomizations);
      const priceAdjustment = newBasePrice - basePrice;
      setCustomizationPrice(priceAdjustment);
      onCustomizationChange(newCustomizations, priceAdjustment);
    }
  };

  const handleTextImageUploadChange = (key: string, type: 'text' | 'image', value: string) => {
    const option = customizationOptions[key];
    const currentCustomization = customizations[key] || {};
    
    // Pour les gravures "both", accumuler texte et image
    if (option.engravingType === 'both') {
      const newCustomization = {
        ...currentCustomization,
        type: 'both',
        [type === 'text' ? 'textValue' : 'imageValue']: value,
        price: 0 // Pas de prix supplémentaire pour les personnalisations
      };
      
      setCustomizationPrice(0);
      
      const newCustomizations = {
        ...customizations,
        [key]: newCustomization
      };
      setCustomizations(newCustomizations);
      onCustomizationChange(newCustomizations);
    } else {
      // Pour les autres types, pas de prix supplémentaire
      setCustomizationPrice(0);

      const newCustomizations = {
        ...customizations,
        [key]: {
          type,
          value,
          price: 0
        }
      };
      setCustomizations(newCustomizations);
      onCustomizationChange(newCustomizations);
    }
  };

  const removeImage = (key: string) => {
    const option = customizationOptions[key];
    const currentCustomization = customizations[key] || {};
    
    if (option.engravingType === 'both') {
      const newCustomization = {
        ...currentCustomization,
        imageValue: '',
        price: 0
      };
      
      // Recalculer le prix sans l'image (mais toujours 0)
      newCustomization.price = 0;
      
      setCustomizationPrice(0);
      setCustomImage('');
      
      const newCustomizations = {
        ...customizations,
        [key]: newCustomization
      };
      setCustomizations(newCustomizations);
      onCustomizationChange(newCustomizations);
    } else {
      // Pour les autres types
      setCustomImage('');
      setCustomizationPrice(0);
      
      const newCustomizations = {
        ...customizations,
        [key]: {
          type: 'image',
          value: '',
          price: 0
        }
      };
      setCustomizations(newCustomizations);
      onCustomizationChange(newCustomizations);
    }
  };

  const handleImageUpload = (key: string, imageUrl: string) => {
    console.log('handleImageUpload called with:', { key, imageUrl });
    setCustomImage(imageUrl);
    handleTextImageUploadChange(key, 'image', imageUrl);
  };

  const renderCustomizationField = (key: string, option: CustomizationOption) => {
    switch (option.type) {
      case 'dropdown':
        return (
          <Select
            value={customizations[key] || ''}
            onValueChange={(value) => handleCustomizationChange(key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Choisir ${(option.label || '').toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {option.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {option.options?.map((opt) => (
              <div key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${key}-${opt}`}
                  checked={customizations[key]?.includes(opt) || false}
                  onChange={(e) => {
                    const currentValues = customizations[key] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, opt]
                      : currentValues.filter((v: string) => v !== opt);
                    handleCustomizationChange(key, newValues);
                  }}
                  className="rounded"
                />
                <Label htmlFor={`${key}-${opt}`}>{opt}</Label>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <Input
            value={customizations[key] || ''}
            onChange={(e) => handleCustomizationChange(key, e.target.value)}
            placeholder={option.placeholder}
            maxLength={option.maxLength}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={customizations[key] || ''}
            onChange={(e) => handleCustomizationChange(key, e.target.value)}
            placeholder={option.placeholder}
            maxLength={option.maxLength}
            rows={3}
          />
        );

            case 'text_image_upload':
        const engravingType = option.engravingType || 'text'; // Par défaut 'text' si non défini
        
                 // Interface pour gravure texte uniquement
         if (engravingType === 'text') {
           return (
             <div className="space-y-2">
               <Label>
                 Inscription souhaitée
                 {option.required && <span className="text-red-500 ml-1">*</span>}
                 {!option.required && <span className="text-gray-500 ml-1">(optionnel)</span>}
               </Label>
               <Textarea
                 value={customText}
                 onChange={(e) => {
                   setCustomText(e.target.value);
                   handleTextImageUploadChange(key, 'text', e.target.value);
                 }}
                 placeholder={option.required ? "Entrez l'inscription souhaitée" : "Entrez l'inscription souhaitée (optionnel)"}
                 maxLength={option.maxLength}
                 rows={3}
                 required={option.required}
               />
               <div className="flex justify-between text-sm text-gray-500">
                 <span>{customText.length}/{option.maxLength || 50} caractères</span>
                 <span className="text-gray-600 font-medium">
                   Gratuit
                 </span>
               </div>
               {option.maxLength && customText.length > option.maxLength && (
                 <p className="text-sm text-orange-600">
                   Limite de caractères dépassée.
                 </p>
               )}
             </div>
           );
         }
        
                 // Interface pour gravure image uniquement
         if (engravingType === 'image') {
           return (
             <div className="space-y-2">
               <Label>
                 Image pour l'inscription
                 {option.required && <span className="text-red-500 ml-1">*</span>}
                 {!option.required && <span className="text-gray-500 ml-1">(optionnel)</span>}
               </Label>
               <ImageUpload
                 onImageUpload={(imageUrl) => {
                   if (typeof handleImageUpload === 'function') {
                     handleImageUpload(key, imageUrl);
                   } else {
                     console.error('handleImageUpload is not a function:', handleImageUpload);
                   }
                 }}
                 maxFileSize={option.maxFileSize}
                 allowedFileTypes={option.allowedFileTypes}
                 placeholder={option.required ? "Téléchargez l'image pour l'inscription" : "Téléchargez l'image pour l'inscription (optionnel)"}
               />
               <div className="flex justify-between text-sm text-gray-500">
                 <span>Gratuit</span>
                 <span className="text-gray-600 font-medium">
                   Gratuit
                 </span>
               </div>
                 {customImage && (
                   <div className="mt-2 relative">
                     <img
                       src={customImage}
                       alt="Image pour l'inscription"
                       className="w-20 h-20 object-cover rounded border"
                     />
                   <Button
                     type="button"
                     variant="destructive"
                     size="sm"
                     onClick={() => removeImage(key)}
                     className="absolute -top-2 -right-2 w-6 h-6 p-0"
                   >
                     <X className="w-3 h-3" />
                   </Button>
                 </div>
               )}
             </div>
           );
         }
        
                 // Interface pour gravure texte ET image
         if (engravingType === 'both') {
           return (
             <div className="space-y-4">
               <div>
                 <Label className="text-sm font-medium">
                   Inscription souhaitée + date de l'événement
                   {option.required && <span className="text-red-500 ml-1">*</span>}
                 </Label>
                 <Textarea
                   value={customText}
                   onChange={(e) => {
                     setCustomText(e.target.value);
                     handleTextImageUploadChange(key, 'text', e.target.value);
                   }}
                   placeholder={option.required ? "Entrez l'inscription souhaitée + date de l'événement" : "Entrez l'inscription souhaitée + date de l'événement (optionnel)"}
                   maxLength={option.maxLength}
                   rows={2}
                   required={option.required}
                 />
                                   <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{customText.length}/{option.maxLength || 50} caractères</span>
                    <span className="text-gray-600 font-medium">
                      Gratuit
                    </span>
                  </div>
               </div>

               <div>
                 <Label>
                   Image pour l'inscription
                   {!option.required && <span className="text-gray-500 ml-1">(optionnel)</span>}
                 </Label>
                 <ImageUpload
                   onImageUpload={(imageUrl) => {
                     if (typeof handleImageUpload === 'function') {
                       handleImageUpload(key, imageUrl);
                     } else {
                       console.error('handleImageUpload is not a function:', handleImageUpload);
                     }
                   }}
                   maxFileSize={option.maxFileSize}
                   allowedFileTypes={option.allowedFileTypes}
                   placeholder={option.required ? "Téléchargez l'image pour l'inscription" : "Téléchargez l'image pour l'inscription (optionnel)"}
                 />
                 <div className="flex justify-between text-sm text-gray-500 mt-1">
                   <span>Gratuit</span>
                   <span className="text-gray-600 font-medium">
                     Gratuit
                   </span>
                 </div>
                 {customImage && (
                   <div className="mt-2 relative">
                     <img
                       src={customImage}
                       alt="Image pour l'inscription"
                       className="w-20 h-20 object-cover rounded border"
                     />
                     <Button
                       type="button"
                       variant="destructive"
                       size="sm"
                       onClick={() => removeImage(key)}
                       className="absolute -top-2 -right-2 w-6 h-6 p-0"
                     >
                       <X className="w-3 h-3" />
                     </Button>
                   </div>
                 )}
               </div>
             </div>
           );
         }
        
        // Interface générique pour text_image_upload sans engravingType
        return (
          <div className="space-y-4">
            {/* Sélection du type de personnalisation */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={customizationType === 'text' ? 'default' : 'outline'}
                onClick={() => setCustomizationType('text')}
                className="flex items-center space-x-2"
              >
                <Type className="w-4 h-4" />
                <span>Texte</span>
              </Button>
              <Button
                type="button"
                variant={customizationType === 'image' ? 'default' : 'outline'}
                onClick={() => setCustomizationType('image')}
                className="flex items-center space-x-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Image</span>
              </Button>
            </div>

            {/* Interface pour le texte */}
            {customizationType === 'text' && (
              <div className="space-y-2">
                <Textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    handleTextImageUploadChange(key, 'text', e.target.value);
                  }}
                  placeholder={option.placeholder}
                  maxLength={option.maxLength}
                  rows={3}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{customText.length}/{option.maxLength || 50} caractères</span>
                  <span className="text-gray-600 font-medium">
                    Gratuit
                  </span>
                </div>
                {option.maxLength && customText.length > option.maxLength && (
                  <p className="text-sm text-orange-600">
                    Limite de caractères dépassée.
                  </p>
                )}
              </div>
            )}

            {/* Interface pour l'image */}
            {customizationType === 'image' && (
              <div className="space-y-2">
                <ImageUpload
                  onImageUpload={(imageUrl) => {
                    if (typeof handleImageUpload === 'function') {
                      handleImageUpload(key, imageUrl);
                    } else {
                      console.error('handleImageUpload is not a function:', handleImageUpload);
                    }
                  }}
                  maxFileSize={option.maxFileSize || 5}
                  allowedFileTypes={option.allowedFileTypes || ['image/jpeg', 'image/png']}
                  placeholder="Glissez-déposez votre image ou cliquez pour sélectionner"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Taille max: {option.maxFileSize || 5}MB</span>
                </div>
                {customImage && (
                  <div className="mt-2">
                    <img
                      src={customImage}
                      alt="Image personnalisée"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Options de Personnalisation</span>
            {Object.values(customizations).some(val => val && (typeof val === 'string' ? val.length > 0 : true)) && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                ✨ Personnalisé
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(() => {
            // Gérer les Map et les objets JavaScript
            let optionsEntries;
            if (customizationOptions instanceof Map) {
              optionsEntries = Array.from(customizationOptions.entries());
            } else {
              optionsEntries = Object.entries(customizationOptions || {});
            }
            
            return optionsEntries.map(([key, option]) => {
              // Pour les options text_image_upload, le label est déjà affiché dans le champ,
              // donc on ne l'affiche pas dans le label principal pour éviter la duplication
              const isTextImageUpload = option.type === 'text_image_upload';
              const engravingType = option.engravingType || 'text'; // Par défaut 'text' si non défini
              // Masquer le label principal pour tous les types text_image_upload (text, image, both)
              const shouldHideLabel = isTextImageUpload;
              
              return (
                <div key={key} className="space-y-2">
                  {/* Ne pas afficher le label principal pour text_image_upload car il est déjà dans le champ */}
                  {!shouldHideLabel && (
                    <>
                      {/* Remplacer "Gravure personnalisée" par "Inscription souhaitée" pour l'affichage client */}
                      {(() => {
                        const label = option.label || key;
                        const displayLabel = label && typeof label === 'string' && label.toLowerCase().includes('gravure') 
                          ? label.replace(/gravure personnalisée/gi, 'Inscription souhaitée')
                          : label;
                        return (
                          <Label htmlFor={key} className="text-sm font-medium">
                            {displayLabel}
                            {option.required && <span className="text-red-500 ml-1">*</span>}
                            {!option.required && <span className="text-gray-500 ml-1 text-sm font-normal">(optionnel)</span>}
                          </Label>
                        );
                      })()}
                    </>
                  )}
                  {renderCustomizationField(key, option)}
                  {option.placeholder && !shouldHideLabel && (
                    <p className="text-xs text-gray-500">{option.placeholder}</p>
                  )}
                </div>
              );
            });
          })()}

          {/* Résumé des prix de personnalisation - Supprimé car gratuit */}
        </CardContent>
      </Card>
    </div>
  );
}


