import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ArrowLeft } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  category: string;
}

interface PromoCode {
  _id: string;
  code: string;
  discountPercentage: number;
  applyToAllProducts: boolean;
  applicableProducts: Array<{ _id: string; name: string }>;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  description?: string;
}

export default function AdminEditPromoCode() {
  const [, params] = useRoute("/admin/promo-codes/:id/edit");
  const [, setLocation] = useLocation();
  const promoCodeId = params?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    applyToAllProducts: true,
    validFrom: "",
    validUntil: "",
    isActive: true,
    usageLimit: "",
    description: ""
  });

  useEffect(() => {
    if (promoCodeId) {
      fetchProducts();
      fetchPromoCode();
    }
  }, [promoCodeId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.filter((p: Product) => p._id));
      }
    } catch (error) {
      console.error("Erreur récupération produits:", error);
    }
  };

  const fetchPromoCode = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/promo-codes/${promoCodeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération code promo");
      }

      const code: PromoCode = await response.json();
      
      setFormData({
        code: code.code,
        discountPercentage: code.discountPercentage.toString(),
        applyToAllProducts: code.applyToAllProducts,
        validFrom: new Date(code.validFrom).toISOString().split('T')[0],
        validUntil: new Date(code.validUntil).toISOString().split('T')[0],
        isActive: code.isActive,
        usageLimit: code.usageLimit?.toString() || "",
        description: code.description || ""
      });

      setSelectedProducts(code.applicableProducts.map(p => p._id));
    } catch (error) {
      console.error("Erreur récupération code promo:", error);
      alert("Erreur lors du chargement du code promo");
      setLocation("/admin/promo-codes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'applyToAllProducts' && value === true) {
      setSelectedProducts([]);
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

      const response = await fetch(`/api/admin/promo-codes/${promoCodeId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la modification");
      }

      setLocation("/admin/promo-codes");
    } catch (error) {
      console.error("Erreur modification code promo:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/admin/promo-codes")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Modifier le code promo</h1>
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
                    className="font-mono uppercase"
                  />
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
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

