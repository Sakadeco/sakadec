import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft } from "lucide-react";
import ProductImageUpload from "@/components/ProductImageUpload";

export default function AdminAddTheme() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    isActive: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesUploaded = (urls: string[]) => {
    if (urls.length > 0) {
      setImageUrl(urls[0]);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setImageFile(files[0]);
    }
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

      if (!imageUrl && !imageFile) {
        alert("Veuillez uploader une image");
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('isActive', String(formData.isActive));
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (imageUrl) {
        formDataToSend.append('existingImageUrl', imageUrl);
      }

      const response = await fetch("/api/admin/themes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création");
      }

      setLocation("/admin/themes");
    } catch (error) {
      console.error("Erreur création thème:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/admin/themes")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Créer un thème</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations du thème</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  placeholder="Ex: Thème Fille"
                />
              </div>

              <div>
                <Label>Image *</Label>
                <ProductImageUpload
                  onImagesUploaded={handleImagesUploaded}
                  onFilesSelected={handleFilesSelected}
                  multiple={false}
                  maxImages={1}
                />
                {imageUrl && (
                  <div className="mt-4">
                    <img
                      src={imageUrl}
                      alt="Aperçu"
                      className="w-48 h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Thème actif</Label>
                  <p className="text-sm text-gray-500">Le thème sera visible sur le site</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/themes")}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Création..." : "Créer le thème"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

