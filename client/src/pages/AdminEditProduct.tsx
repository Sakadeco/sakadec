import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Package, 
  ArrowLeft, 
  Save, 
  Plus, 
  X
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import ProductImageUpload from "@/components/ProductImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomizationOption {
  type: string;
  values: string[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  imageUrl: string;
  isCustomizable: boolean;
  isRentable: boolean;
  stockQuantity: number;
  dailyRentalPrice?: number;
  isActive: boolean;
  customizationOptions?: {
    [key: string]: string[];
  };
}

export default function AdminEditProduct() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Extract product ID from URL
  const productId = location.split('/')[3]; // /admin/products/{id}/edit

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    imageUrl: "",
    isCustomizable: false,
    isRentable: false,
    stockQuantity: "",
    dailyRentalPrice: "",
    isActive: true
  });

  // Customization options
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([]);
  const [newOptionType, setNewOptionType] = useState("");
  const [newOptionValues, setNewOptionValues] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
      return;
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération produit");
      }

      const data = await response.json();
      const product: Product = data.product;

      // Populate form data
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        subcategory: product.subcategory,
        imageUrl: product.imageUrl,
        isCustomizable: product.isCustomizable,
        isRentable: product.isRentable,
        stockQuantity: product.stockQuantity.toString(),
        dailyRentalPrice: product.dailyRentalPrice?.toString() || "",
        isActive: product.isActive
      });

      // Populate customization options
      if (product.customizationOptions) {
        const options: CustomizationOption[] = Object.entries(product.customizationOptions).map(([type, values]) => ({
          type,
          values
        }));
        setCustomizationOptions(options);
      }

    } catch (error) {
      setError("Erreur lors du chargement du produit");
      console.error("Erreur récupération produit:", error);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomizationOption = () => {
    if (!newOptionType || !newOptionValues) return;

    const values = newOptionValues.split(',').map(v => v.trim()).filter(v => v);
    
    setCustomizationOptions(prev => [...prev, {
      type: newOptionType,
      values
    }]);

    setNewOptionType("");
    setNewOptionValues("");
  };

  const removeCustomizationOption = (index: number) => {
    setCustomizationOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLocation("/admin/login");
        return;
      }

      // Build customization options object
      const customizationOptionsObj: any = {};
      customizationOptions.forEach(option => {
        customizationOptionsObj[option.type] = option.values;
      });

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity),
          dailyRentalPrice: formData.dailyRentalPrice ? parseFloat(formData.dailyRentalPrice) : undefined,
          customizationOptions: customizationOptionsObj
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la modification du produit");
      }

      setSuccess("Produit modifié avec succès !");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        setLocation(`/admin/products/${productId}`);
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de la modification du produit");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation(`/admin/products/${productId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-gold to-yellow-500 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Modifier le Produit
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Bouquet de roses personnalisé"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="29.99"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Description détaillée du produit..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shop">Boutique</SelectItem>
                      <SelectItem value="events">Événements</SelectItem>
                      <SelectItem value="rent">Location</SelectItem>
                      <SelectItem value="crea">Création</SelectItem>
                      <SelectItem value="home">Maison</SelectItem>
                      <SelectItem value="co">Co</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Sous-catégorie *</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange("subcategory", e.target.value)}
                    placeholder="Ex: Fleurs, Décoration, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Image du produit *</Label>
                <ProductImageUpload
                  onImagesUploaded={(imageUrls) => handleInputChange("imageUrl", imageUrls[0])}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stock and Rental */}
          <Card>
            <CardHeader>
              <CardTitle>Stock et Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockQuantity">Quantité en stock *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dailyRentalPrice">Prix de location par jour (€)</Label>
                  <Input
                    id="dailyRentalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dailyRentalPrice}
                    onChange={(e) => handleInputChange("dailyRentalPrice", e.target.value)}
                    placeholder="15.00"
                    disabled={!formData.isRentable}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRentable"
                    checked={formData.isRentable}
                    onCheckedChange={(checked) => handleInputChange("isRentable", checked)}
                  />
                  <Label htmlFor="isRentable">Disponible à la location</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options de personnalisation</CardTitle>
              <p className="text-sm text-gray-600">
                Configurez les options que le client pourra choisir pour personnaliser ce produit
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isCustomizable"
                  checked={formData.isCustomizable}
                  onCheckedChange={(checked) => handleInputChange("isCustomizable", checked)}
                />
                <Label htmlFor="isCustomizable">Produit personnalisable</Label>
              </div>

              {formData.isCustomizable && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    ⚠️ Interface de personnalisation simplifiée pour l'édition. 
                    Pour une configuration complète, utilisez l'interface de création de produit.
                  </div>
                  
                  {/* Existing options */}
                  {customizationOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{option.type}:</span>
                        <span className="ml-2 text-gray-600">{option.values.join(', ')}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomizationOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add new option */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="Type (ex: Couleurs, Tailles)"
                      value={newOptionType}
                      onChange={(e) => setNewOptionType(e.target.value)}
                    />
                    <Input
                      placeholder="Valeurs (séparées par des virgules)"
                      value={newOptionValues}
                      onChange={(e) => setNewOptionValues(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomizationOption}
                      disabled={!newOptionType || !newOptionValues}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Statut du Produit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Produit actif</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation(`/admin/products/${productId}`)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Modification...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Modifier le produit
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
