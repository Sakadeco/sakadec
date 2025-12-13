import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  _id: string;
  name: string;
  category: string;
}

export default function AdminAddPromoCode() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    applyToAllProducts: true,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: "",
    isActive: true,
    usageLimit: "",
    description: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.filter((p: Product) => p._id)); // Filtrer les produits valides
      }
    } catch (error) {
      console.error("Erreur récupération produits:", error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'applyToAllProducts' && value === true) {
      setSelectedProducts([]); // Réinitialiser la sélection si "tous les produits"
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLocation("/admin/login");
        return;
      }

      const payload = {
        code: formData.code,
        discountPercentage: parseFloat(formData.discountPercentage),
        applyToAllProducts: formData.applyToAllProducts,
        applicableProducts: formData.applyToAllProducts ? [] : selectedProducts,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: formData.isActive,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        description: formData.description
      };

      const response = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création");
      }

      setLocation("/admin/promo-codes");
    } catch (error) {
      console.error("Erreur création code promo:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/admin/promo-codes")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Créer un code promo</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du code promo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">Code promo *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    required
                    placeholder="EX: PROMO2024"
                    className="font-mono uppercase"
                  />
                  <p className="text-xs text-gray-500 mt-1">Le code sera automatiquement converti en majuscules</p>
                </div>

                <div>
                  <Label htmlFor="discountPercentage">Pourcentage de réduction *</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange("discountPercentage", e.target.value)}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Ex: 10 pour 10%"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    placeholder="Description optionnelle du code promo"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Application du code */}
            <Card>
              <CardHeader>
                <CardTitle>Application du code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="applyToAllProducts">Appliquer à tous les produits</Label>
                    <p className="text-sm text-gray-500">Le code sera valide sur tous les produits</p>
                  </div>
                  <Switch
                    id="applyToAllProducts"
                    checked={formData.applyToAllProducts}
                    onCheckedChange={(checked) => handleInputChange("applyToAllProducts", checked)}
                  />
                </div>

                {!formData.applyToAllProducts && (
                  <div>
                    <Label>Sélectionner les produits ({(selectedProducts.length)} sélectionné(s))</Label>
                    <div className="mt-2 border rounded-lg p-4 max-h-64 overflow-y-auto">
                      {products.length === 0 ? (
                        <p className="text-sm text-gray-500">Aucun produit disponible</p>
                      ) : (
                        <div className="space-y-2">
                          {products.map((product) => (
                            <div key={product._id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`product-${product._id}`}
                                checked={selectedProducts.includes(product._id)}
                                onCheckedChange={() => handleProductToggle(product._id)}
                              />
                              <Label
                                htmlFor={`product-${product._id}`}
                                className="flex-1 cursor-pointer"
                              >
                                {product.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {!formData.applyToAllProducts && selectedProducts.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">Veuillez sélectionner au moins un produit</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates de validité */}
            <Card>
              <CardHeader>
                <CardTitle>Dates de validité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validFrom">Date de début *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => handleInputChange("validFrom", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="validUntil">Date de fin *</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => handleInputChange("validUntil", e.target.value)}
                      required
                      min={formData.validFrom}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="usageLimit">Limite d'utilisation (optionnel)</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                    min="1"
                    placeholder="Nombre maximum d'utilisations (laisser vide pour illimité)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Statut */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Code promo actif</Label>
                    <p className="text-sm text-gray-500">Le code sera utilisable si actif</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/promo-codes")}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || (!formData.applyToAllProducts && selectedProducts.length === 0)} 
                className="bg-gold hover:bg-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Création..." : "Créer le code promo"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

