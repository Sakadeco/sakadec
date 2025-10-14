import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, ArrowLeft, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ProductImageUpload from "@/components/ProductImageUpload";

interface CustomizationOption {
  label: string;
  values: string[];
  type?: 'dropdown' | 'checkbox' | 'text' | 'textarea' | 'text_image_upload';
  required?: boolean;
  maxLength?: number;
  maxFileSize?: number;
  pricePerCharacter?: number;
  basePrice?: number;
}

interface EngravingOption {
  type: 'text' | 'image' | 'both';
  label: string;
  required?: boolean;
  maxLength?: number;
  maxFileSize?: number;
  pricePerCharacter?: number;
  basePrice?: number;
}

export default function AdminAddProduct() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [customizationOptions, setCustomizationOptions] = useState<Record<string, CustomizationOption>>({});
  const [engravingOptions, setEngravingOptions] = useState<Record<string, EngravingOption>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    isCustomizable: false,
    isForSale: true,
    isForRent: false,
    stockQuantity: "",
    dailyRentalPrice: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesUploaded = (imageUrls: string[]) => {
    if (imageUrls.length > 0) {
      setMainImageUrl(imageUrls[0]);
      setAdditionalImages(imageUrls.slice(1));
    }
  };

  const addCustomizationOption = () => {
    const optionKey = `option_${Date.now()}`;
    setCustomizationOptions(prev => ({
      ...prev,
      [optionKey]: {
        label: '',
        values: ['', '', ''], // 3 valeurs par défaut
        type: 'dropdown'
      }
    }));
    
    // Automatically enable customization when adding options
    if (!formData.isCustomizable) {
      handleInputChange('isCustomizable', true);
    }
  };

  const addEngravingOption = () => {
    const optionKey = `gravure_${Date.now()}`;
    setEngravingOptions(prev => ({
      ...prev,
      [optionKey]: {
        type: 'text',
        label: 'Gravure personnalisée',
        required: false,
        maxLength: 50,
        maxFileSize: 5,
        pricePerCharacter: 0.1,
        basePrice: 5
      }
    }));
    
    // Automatically enable customization when adding options
    if (!formData.isCustomizable) {
      handleInputChange('isCustomizable', true);
    }
  };

  // Transform customization options to the expected format before sending
  const transformCustomizationOptions = () => {
    const transformed: any = {};
    
    // Add regular customization options
    Object.entries(customizationOptions).forEach(([key, option]) => {
      if (option.label.trim()) {
        const optionKey = option.label.toLowerCase().replace(/\s+/g, '_');
        const validValues = option.values.filter(value => value.trim() !== '');
        if (validValues.length > 0) {
          transformed[optionKey] = {
            type: option.type || 'dropdown',
            label: option.label,
            required: option.required || false,
            options: validValues
          };
        }
      }
    });
    
    // Add engraving options
    Object.entries(engravingOptions).forEach(([key, option]) => {
      if (option.label.trim()) {
        const optionKey = option.label.toLowerCase().replace(/\s+/g, '_');
        transformed[optionKey] = {
          type: 'text_image_upload',
          label: option.label,
          required: option.required || false,
          engravingType: option.type, // 'text', 'image', or 'both'
          maxLength: option.maxLength || 50,
          maxFileSize: option.maxFileSize || 5,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          pricePerCharacter: option.pricePerCharacter || 0.1,
          basePrice: option.basePrice || 0
        };
      }
    });
    
    return transformed;
  };

  const updateCustomizationOption = (key: string, field: keyof CustomizationOption, value: any) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const updateEngravingOption = (key: string, field: keyof EngravingOption, value: any) => {
    setEngravingOptions(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const removeCustomizationOption = (key: string) => {
    setCustomizationOptions(prev => {
      const newOptions = { ...prev };
      delete newOptions[key];
      return newOptions;
    });
  };

  const removeEngravingOption = (key: string) => {
    setEngravingOptions(prev => {
      const newOptions = { ...prev };
      delete newOptions[key];
      return newOptions;
    });
  };

  const addOptionValue = (optionKey: string) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [optionKey]: {
        ...prev[optionKey],
        values: [...prev[optionKey].values, '']
      }
    }));
  };

  const removeOptionValue = (optionKey: string, valueIndex: number) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [optionKey]: {
        ...prev[optionKey],
        values: prev[optionKey].values.filter((_, index) => index !== valueIndex)
      }
    }));
  };

  const updateOptionValue = (optionKey: string, valueIndex: number, value: string) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [optionKey]: {
        ...prev[optionKey],
        values: prev[optionKey].values.map((v, index) => index === valueIndex ? value : v)
      }
    }));
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    const errors = [];
    if (!formData.name?.trim()) errors.push('Le nom est requis');
    if (!formData.description?.trim()) errors.push('La description est requise');
    if (!formData.category?.trim()) errors.push('La catégorie est requise');
    
    // Validation selon la destination
    if (formData.isForSale && (!formData.price || parseFloat(formData.price) <= 0)) {
      errors.push('Le prix de vente doit être supérieur à 0');
    }
    if (formData.isForRent && (!formData.dailyRentalPrice || parseFloat(formData.dailyRentalPrice) <= 0)) {
      errors.push('Le prix de location doit être supérieur à 0');
    }
    if (!formData.isForSale && !formData.isForRent) {
      errors.push('Le produit doit être destiné à la vente OU à la location (ou les deux)');
    }
    
    if (errors.length > 0) {
      alert('Erreurs de validation:\n' + errors.join('\n'));
      return;
    }
    
    if (uploadedFiles.length === 0) {
      alert("Veuillez uploader au moins une image principale");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Créer FormData pour envoyer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les données du formulaire
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('isCustomizable', String(Object.keys(customizationOptions).length > 0 || formData.isCustomizable));
      formDataToSend.append('isForSale', String(formData.isForSale));
      formDataToSend.append('isForRent', String(formData.isForRent));
      formDataToSend.append('stockQuantity', formData.stockQuantity);
      formDataToSend.append('dailyRentalPrice', formData.dailyRentalPrice);
      formDataToSend.append('customizationOptions', JSON.stringify(transformCustomizationOptions()));
      
      // Ajouter les fichiers
      if (uploadedFiles.length > 0) {
        formDataToSend.append('image', uploadedFiles[0]); // Image principale
      }
      
      // Ajouter les images supplémentaires
      uploadedFiles.slice(1).forEach((file, index) => {
        formDataToSend.append('additionalImages', file);
      });

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Ne pas définir Content-Type pour FormData
        },
        body: formDataToSend
      });

      // Debug log
      console.log('🔍 Debug - Sending product data:', {
        formDataIsCustomizable: formData.isCustomizable,
        hasCustomizationOptions: Object.keys(customizationOptions).length > 0,
        finalIsCustomizable: Object.keys(customizationOptions).length > 0 || formData.isCustomizable,
        customizationOptions: transformCustomizationOptions(),
        uploadedFilesCount: uploadedFiles.length
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du produit');
      }

      alert('Produit créé avec succès !');
      setLocation('/admin/products');
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin/products')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Ajouter un produit</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination du produit */}
          <Card>
            <CardHeader>
              <CardTitle>Destination du produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isForSale"
                    checked={formData.isForSale}
                    onCheckedChange={(checked) => handleInputChange('isForSale', checked)}
                  />
                  <Label htmlFor="isForSale" className="text-lg font-medium">Destiné à la vente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isForRent"
                    checked={formData.isForRent}
                    onCheckedChange={(checked) => handleInputChange('isForRent', checked)}
                  />
                  <Label htmlFor="isForRent" className="text-lg font-medium">Destiné à la location</Label>
                </div>
              </div>
              
              {!formData.isForSale && !formData.isForRent && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Le produit doit être disponible à la vente OU à la location (ou les deux)
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                {formData.isForSale && (
                  <div>
                    <Label htmlFor="price">Prix de vente (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shop">Boutique</SelectItem>
                      <SelectItem value="rent">Location</SelectItem>
                      <SelectItem value="events">Événements</SelectItem>
                      <SelectItem value="home">Maison</SelectItem>
                      <SelectItem value="co">Co</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Sous-catégorie</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Quantité en stock</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  />
                </div>
                {formData.isForRent && (
                  <div>
                    <Label htmlFor="dailyRentalPrice">Prix de location/jour (€) *</Label>
                    <Input
                      id="dailyRentalPrice"
                      type="number"
                      step="0.01"
                      value={formData.dailyRentalPrice}
                      onChange={(e) => handleInputChange('dailyRentalPrice', e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageUpload
                onImagesUploaded={handleImagesUploaded}
                onFilesSelected={setUploadedFiles}
                multiple={true}
                maxImages={10}
              />
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options du produit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isCustomizable"
                  checked={formData.isCustomizable}
                  onCheckedChange={(checked) => handleInputChange('isCustomizable', checked)}
                />
                <Label htmlFor="isCustomizable">Produit personnalisable</Label>
              </div>
              

            </CardContent>
          </Card>

          {/* Options de personnalisation complètes */}
          {formData.isCustomizable && (
            <Card>
              <CardHeader>
                <CardTitle>Options de personnalisation</CardTitle>
                <p className="text-sm text-gray-600">
                  Configurez les options que le client pourra choisir pour personnaliser ce produit
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Boutons pour ajouter des options */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomizationOption}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une option (taille, couleur, etc.)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEngravingOption}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une gravure
                  </Button>
                </div>

                {/* Liste des options de personnalisation */}
                {Object.entries(customizationOptions).map(([key, option]) => (
                  <div key={key} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Option de personnalisation</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomizationOption(key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Label de l'option */}
                      <div>
                        <Label>Nom de l'option</Label>
                        <Input
                          value={option.label}
                          onChange={(e) => updateCustomizationOption(key, 'label', e.target.value)}
                          placeholder="Ex: Taille, Couleur, Style, etc."
                        />
                      </div>

                      {/* Options pour les listes déroulantes */}
                      <div>
                        <Label>Valeurs disponibles</Label>
                        <div className="space-y-2">
                          {option.values.map((value, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={value}
                                onChange={(e) => updateOptionValue(key, index, e.target.value)}
                                placeholder={`Valeur ${index + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOptionValue(key, index)}
                                disabled={option.values.length <= 1}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOptionValue(key)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une valeur
                          </Button>
                        </div>
                      </div>

                      {/* Option obligatoire */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${key}`}
                          checked={option.required || false}
                          onCheckedChange={(checked) => updateCustomizationOption(key, 'required', checked)}
                        />
                        <Label htmlFor={`required-${key}`}>Option obligatoire</Label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Liste des options de gravure */}
                {Object.entries(engravingOptions).map(([key, option]) => (
                  <div key={key} className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-blue-900">Gravure personnalisée</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEngravingOption(key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Type de gravure */}
                      <div>
                        <Label>Type de gravure</Label>
                        <Select
                          value={option.type}
                          onValueChange={(value) => updateEngravingOption(key, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texte uniquement</SelectItem>
                            <SelectItem value="image">Image uniquement</SelectItem>
                            <SelectItem value="both">Texte et image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Options pour les champs texte */}
                      {(option.type === 'text' || option.type === 'both') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Limite de caractères</Label>
                            <Input
                              type="number"
                              value={option.maxLength || 50}
                              onChange={(e) => updateEngravingOption(key, 'maxLength', parseInt(e.target.value))}
                              placeholder="50"
                            />
                          </div>
                          <div>
                            <Label>Prix par caractère supplémentaire (€)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={option.pricePerCharacter || 0.1}
                              onChange={(e) => updateEngravingOption(key, 'pricePerCharacter', parseFloat(e.target.value))}
                              placeholder="0.10"
                            />
                          </div>
                        </div>
                      )}

                      {/* Options pour les images */}
                      {(option.type === 'image' || option.type === 'both') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Taille max fichier (MB)</Label>
                            <Input
                              type="number"
                              value={option.maxFileSize || 5}
                              onChange={(e) => updateEngravingOption(key, 'maxFileSize', parseInt(e.target.value))}
                              placeholder="5"
                            />
                          </div>
                        </div>
                      )}

                      {/* Prix de base */}
                      <div>
                        <Label>Prix de base (€)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={option.basePrice || 0}
                          onChange={(e) => updateEngravingOption(key, 'basePrice', parseFloat(e.target.value))}
                          placeholder="0"
                        />
                      </div>

                      {/* Option obligatoire */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`engraving-required-${key}`}
                          checked={option.required || false}
                          onCheckedChange={(checked) => updateEngravingOption(key, 'required', checked)}
                        />
                        <Label htmlFor={`engraving-required-${key}`}>Option obligatoire</Label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Message d'aide */}
                {Object.keys(customizationOptions).length === 0 && Object.keys(engravingOptions).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucune option de personnalisation configurée</p>
                    <p className="text-sm">Cliquez sur "Ajouter une option" ou "Ajouter une gravure" pour commencer</p>
                  </div>
                )}

                {/* Aperçu des options */}
                {(Object.keys(customizationOptions).length > 0 || Object.keys(engravingOptions).length > 0) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Aperçu des options configurées :</h4>
                    <div className="space-y-1">
                      {Object.entries(customizationOptions).map(([key, option]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Option</Badge>
                          <span className="font-medium">{option.label}</span>
                          {option.required && <Badge variant="destructive">Obligatoire</Badge>}
                          <span className="text-gray-600">
                            ({option.values.filter(v => v.trim()).length} valeurs)
                          </span>
                        </div>
                      ))}
                      {Object.entries(engravingOptions).map(([key, option]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">Gravure</Badge>
                          <span className="font-medium">{option.label}</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">{option.type}</Badge>
                          {option.required && <Badge variant="destructive">Obligatoire</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Créer le produit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
