import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, X, Plus } from "lucide-react";
import ProductImageUpload from "@/components/ProductImageUpload";

interface Realisation {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  guests?: number;
  description: string;
  images: string[];
  highlights: string[];
  rating: number;
  isPublished: boolean;
}

export default function AdminEditRealisation() {
  const [, params] = useRoute("/admin/realisations/:id/edit");
  const [, setLocation] = useLocation();
  const realisationId = params?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [highlight, setHighlight] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Mariage",
    date: new Date().toISOString().split('T')[0],
    location: "",
    guests: "",
    description: "",
    rating: "5",
    isPublished: true
  });

  useEffect(() => {
    if (realisationId) {
      fetchRealisation();
    }
  }, [realisationId]);

  const fetchRealisation = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/realisations/${realisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur récupération réalisation");
      }

      const realisation: Realisation = await response.json();
      
      setFormData({
        title: realisation.title,
        category: realisation.category,
        date: new Date(realisation.date).toISOString().split('T')[0],
        location: realisation.location,
        guests: realisation.guests?.toString() || "",
        description: realisation.description,
        rating: realisation.rating.toString(),
        isPublished: realisation.isPublished
      });

      setExistingImages(realisation.images || []);
      setHighlights(realisation.highlights || []);
    } catch (error) {
      console.error("Erreur récupération réalisation:", error);
      alert("Erreur lors du chargement de la réalisation");
      setLocation("/admin/realisations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddHighlight = () => {
    if (highlight.trim()) {
      setHighlights(prev => [...prev, highlight.trim()]);
      setHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
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
      formDataToSend.append('category', formData.category);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('guests', formData.guests || '');
      formDataToSend.append('description', formData.description);
      formDataToSend.append('highlights', JSON.stringify(highlights));
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('isPublished', String(formData.isPublished));
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      // Ajouter les nouvelles URLs d'images
      if (newImageUrls.length > 0) {
        const allImages = [...existingImages, ...newImageUrls];
        formDataToSend.set('existingImages', JSON.stringify(allImages));
      }

      // Ajouter les nouveaux fichiers
      newImageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`/api/admin/realisations/${realisationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la modification");
      }

      setLocation("/admin/realisations");
    } catch (error) {
      console.error("Erreur modification réalisation:", error);
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
          <Button variant="ghost" onClick={() => setLocation("/admin/realisations")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Modifier la réalisation</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mariage">Mariage</SelectItem>
                        <SelectItem value="Anniversaire">Anniversaire</SelectItem>
                        <SelectItem value="Baby Shower">Baby Shower</SelectItem>
                        <SelectItem value="Événement Corporate">Événement Corporate</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">Note (1-5) *</Label>
                    <Select value={formData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 étoiles</SelectItem>
                        <SelectItem value="4">4 étoiles</SelectItem>
                        <SelectItem value="3">3 étoiles</SelectItem>
                        <SelectItem value="2">2 étoiles</SelectItem>
                        <SelectItem value="1">1 étoile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="guests">Nombre d'invités</Label>
                    <Input
                      id="guests"
                      type="number"
                      value={formData.guests}
                      onChange={(e) => handleInputChange("guests", e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Lieu *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Points forts */}
            <Card>
              <CardHeader>
                <CardTitle>Points forts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Ajouter un point fort"
                  />
                  <Button type="button" onClick={handleAddHighlight}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((h, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {h}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveHighlight(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingImages.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Images existantes</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {existingImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                            onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== index))}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="mb-2 block">Ajouter de nouvelles images</Label>
                  <ProductImageUpload
                    onImagesUploaded={setNewImageUrls}
                    onFilesSelected={setNewImageFiles}
                    multiple={true}
                    maxImages={20}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Publication */}
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublished">Publier la réalisation</Label>
                    <p className="text-sm text-gray-500">La réalisation sera visible sur le site</p>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/realisations")}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
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

