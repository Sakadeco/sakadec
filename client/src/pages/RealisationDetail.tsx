import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, Heart, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import Logo from "@/components/Logo";

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
}

export default function RealisationDetail() {
  const [, params] = useRoute("/realisations/:id");
  const [, setLocation] = useLocation();
  const [realisation, setRealisation] = useState<Realisation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchRealisation(params.id);
    }
  }, [params?.id]);

  const fetchRealisation = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/realisations/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRealisation(data);
      } else {
        console.error("Réalisation non trouvée");
        setLocation("/realisations");
      }
    } catch (error) {
      console.error("Erreur récupération réalisation:", error);
      setLocation("/realisations");
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (realisation && realisation.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % realisation.images.length);
    }
  };

  const previousImage = () => {
    if (realisation && realisation.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + realisation.images.length) % realisation.images.length);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la réalisation...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!realisation) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Réalisation non trouvée</p>
            <Button onClick={() => setLocation("/realisations")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux réalisations
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gold via-yellow-500 to-orange-500 py-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/realisations")}
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux réalisations
          </Button>
          <div className="flex justify-center mb-6">
            <Logo width={150} height={100} className="drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 text-center">
            {realisation.title}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-white/90">
            <Badge className="bg-white/20 text-white border-white/30">
              {realisation.category}
            </Badge>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(realisation.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{realisation.location}</span>
            </div>
            {realisation.guests && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{realisation.guests} invités</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: realisation.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Image Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {realisation.images && realisation.images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="relative mb-8">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={realisation.images[selectedImageIndex]}
                      alt={`${realisation.title} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openLightbox(selectedImageIndex)}
                    />
                    {realisation.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          onClick={previousImage}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                      {selectedImageIndex + 1} / {realisation.images.length}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Thumbnail Gallery */}
              {realisation.images.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {realisation.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-gold shadow-lg scale-105"
                          : "border-transparent hover:border-gold/50"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${realisation.title} - Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune image disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* Description and Details */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
                À propos de cette réalisation
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                {realisation.description}
              </p>
              
              {realisation.highlights && realisation.highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Points forts :</h3>
                  <div className="flex flex-wrap gap-2">
                    {realisation.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <Button
                  className="w-full bg-gold hover:bg-yellow-600 text-white"
                  size="lg"
                  onClick={() => setLocation("/contact")}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Demander un devis pour un projet similaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lightbox Modal */}
      {isLightboxOpen && realisation.images && realisation.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <img
              src={realisation.images[selectedImageIndex]}
              alt={`${realisation.title} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {realisation.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 bg-white/20 hover:bg-white/30 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 bg-white/20 hover:bg-white/30 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {selectedImageIndex + 1} / {realisation.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}


