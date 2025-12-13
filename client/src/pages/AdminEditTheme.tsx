import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Theme {
  _id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
}

export default function AdminEditTheme() {
  const [, params] = useRoute("/admin/themes/:id/edit");
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    isActive: true
  });

  useEffect(() => {
    if (params?.id) {
      fetchTheme(params.id);
    }
  }, [params?.id]);

  const fetchTheme = async (id: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/themes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération thème");
      }

      const theme: Theme = await response.json();
      
      setFormData({
        title: theme.title,
        isActive: theme.isActive
      });
      setExistingImageUrl(theme.imageUrl);
    } catch (error) {
      console.error("Erreur récupération thème:", error);
      alert("Erreur lors du chargement du thème");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUploaded = (urls: string[]) => {
    if (urls.length > 0) {
      setNewImageUrl(urls[0]);
    }
  };

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setNewImageFile(files[0]);
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

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('isActive', String(formData.isActive));
      
      if (newImageFile) {
        formDataToSend.append('image', newImageFile);
      } else if (newImageUrl) {
        formDataToSend.append('existingImageUrl', newImageUrl);
      } else {
        formDataToSend.append('existingImageUrl', existingImageUrl);
      }

      const response = await fetch(`/api/admin/themes/${params?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      setLocation("/admin/themes");
    } catch (error) {
      console.error("Erreur mise à jour thème:", error);
      alert(error instanceof Error ? error.message : "Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du thème...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/admin/themes")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Modifier le thème</h1>
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
                {existingImageUrl && !newImageUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Image actuelle :</p>
                    <img
                      src={existingImageUrl}
                      alt="Image actuelle"
                      className="w-48 h-48 object-cover rounded border"
                    />
                  </div>
                )}
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  onFileSelected={handleFileSelected}
                />
                {newImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Nouvelle image :</p>
                    <img
                      src={newImageUrl}
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
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

