import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CustomizationOptions {
  productType: string;
  message: string;
  color: string;
  size?: string;
  quantity: number;
  additionalNotes: string;
}

const productTypes = [
  { value: "mug", label: "Mug personnalisé", price: 12 },
  { value: "totebag", label: "Sac tote bag", price: 15 },
  { value: "giftbox", label: "Boîte cadeau", price: 20 },
  { value: "invitations", label: "Invitations mariage", price: 8 },
  { value: "menu", label: "Menus événement", price: 6 },
  { value: "cookies", label: "Sablés personnalisés", price: 18 },
];

const colors = [
  { value: "lavender", label: "Lavande", color: "bg-skd-crea" },
  { value: "gold", label: "Or", color: "bg-gold" },
  { value: "black", label: "Noir", color: "bg-gray-800" },
  { value: "white", label: "Blanc", color: "bg-white border border-gray-300" },
  { value: "pink", label: "Rose", color: "bg-skd-shop" },
  { value: "blue", label: "Bleu", color: "bg-skd-co" },
];

const sizes = [
  { value: "small", label: "Petit" },
  { value: "medium", label: "Moyen" },
  { value: "large", label: "Grand" },
];

export default function ProductCustomizer() {
  const [customization, setCustomization] = useState<CustomizationOptions>({
    productType: "",
    message: "",
    color: "",
    size: "medium",
    quantity: 1,
    additionalNotes: "",
  });

  const [preview, setPreview] = useState(false);

  const selectedProduct = productTypes.find(p => p.value === customization.productType);
  const selectedColor = colors.find(c => c.value === customization.color);
  
  const totalPrice = selectedProduct ? selectedProduct.price * customization.quantity : 0;

  const handleInputChange = (field: keyof CustomizationOptions, value: string | number) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreview = () => {
    if (!customization.productType || !customization.message) {
      return;
    }
    setPreview(true);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", customization);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-skd-crea">Configurateur de Produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product-type">Type de produit *</Label>
            <Select value={customization.productType} onValueChange={(value) => handleInputChange("productType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un produit" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((product) => (
                  <SelectItem key={product.value} value={product.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{product.label}</span>
                      <Badge variant="outline" className="ml-2">{product.price}€</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Votre message *</Label>
            <Textarea
              id="message"
              placeholder="Entrez votre texte personnalisé..."
              value={customization.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500">
              {customization.message.length}/100 caractères maximum
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Couleur *</Label>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleInputChange("color", color.value)}
                  className={`w-10 h-10 rounded-full ${color.color} border-2 transition-all ${
                    customization.color === color.value 
                      ? "border-skd-crea ring-2 ring-skd-crea ring-offset-2" 
                      : "border-gray-300 hover:border-skd-crea"
                  }`}
                  title={color.label}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="text-sm text-gray-600">Couleur sélectionnée: {selectedColor.label}</p>
            )}
          </div>

          {/* Size (for applicable products) */}
          {(customization.productType === "totebag" || customization.productType === "giftbox") && (
            <div className="space-y-2">
              <Label htmlFor="size">Taille</Label>
              <Select value={customization.size} onValueChange={(value) => handleInputChange("size", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={customization.quantity}
              onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
              className="w-24"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Instructions supplémentaires</Label>
            <Textarea
              id="notes"
              placeholder="Toute information complémentaire..."
              value={customization.additionalNotes}
              onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Price Display */}
          {selectedProduct && (
            <div className="bg-skd-crea/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Prix total</p>
                  <p className="text-sm text-gray-600">
                    {customization.quantity} × {selectedProduct.price}€
                  </p>
                </div>
                <div className="text-2xl font-bold text-skd-crea">
                  {totalPrice}€
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="flex-1 border-skd-crea text-skd-crea hover:bg-skd-crea/10"
              disabled={!customization.productType || !customization.message || !customization.color}
            >
              Aperçu
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-skd-crea text-white hover:bg-skd-crea/90"
              disabled={!customization.productType || !customization.message || !customization.color}
            >
              Ajouter au panier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {preview && (
        <Card className="border-2 border-skd-crea">
          <CardHeader>
            <CardTitle className="font-playfair text-skd-crea">Aperçu de votre création</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className={`inline-block p-6 rounded-lg ${selectedColor?.color} ${customization.color === "white" ? "border border-gray-300" : ""}`}>
                <div className={`text-lg font-medium ${customization.color === "white" ? "text-gray-800" : "text-white"}`}>
                  {customization.message}
                </div>
                <div className={`text-sm mt-2 ${customization.color === "white" ? "text-gray-600" : "text-white/80"}`}>
                  {selectedProduct?.label}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => setPreview(false)}
                variant="outline"
                className="mr-3"
              >
                Modifier
              </Button>
              <Button
                onClick={handleAddToCart}
                className="bg-skd-crea text-white hover:bg-skd-crea/90"
              >
                Confirmer et ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
