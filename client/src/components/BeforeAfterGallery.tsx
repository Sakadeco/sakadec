import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface BeforeAfterImage {
  id: string;
  before: {
    url: string;
    alt: string;
    description: string;
  };
  after: {
    url: string;
    alt: string;
    description: string;
  };
  title: string;
  category: string;
}

interface BeforeAfterGalleryProps {
  images: BeforeAfterImage[];
}

export default function BeforeAfterGallery({ images }: BeforeAfterGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<BeforeAfterImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'before' | 'after'>('before');

  const handleImageClick = (image: BeforeAfterImage) => {
    setSelectedImage(image);
    setCurrentView('before');
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  const switchView = () => {
    setCurrentView(currentView === 'before' ? 'after' : 'before');
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleImageClick(image)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-playfair">{image.title}</CardTitle>
              <p className="text-sm text-gray-600">{image.category}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative group">
                  <img
                    src={image.before.url}
                    alt={image.before.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <span className="text-white text-sm font-medium">Avant</span>
                  </div>
                </div>
                <div className="relative group">
                  <img
                    src={image.after.url}
                    alt={image.after.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <span className="text-white text-sm font-medium">Après</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Cliquez pour voir en détail
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedImage?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDialog}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative">
                <img
                  src={currentView === 'before' ? selectedImage.before.url : selectedImage.after.url}
                  alt={currentView === 'before' ? selectedImage.before.alt : selectedImage.after.alt}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Bouton de basculement */}
                <Button
                  onClick={switchView}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800"
                  size="sm"
                >
                  {currentView === 'before' ? (
                    <>
                      <ChevronRight className="h-4 w-4 mr-1" />
                      Voir après
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Voir avant
                    </>
                  )}
                </Button>
              </div>

              {/* Miniatures */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant={currentView === 'before' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('before')}
                  className="flex items-center gap-2"
                >
                  <img
                    src={selectedImage.before.url}
                    alt="Avant"
                    className="w-8 h-8 object-cover rounded"
                  />
                  Avant
                </Button>
                <Button
                  variant={currentView === 'after' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('after')}
                  className="flex items-center gap-2"
                >
                  <img
                    src={selectedImage.after.url}
                    alt="Après"
                    className="w-8 h-8 object-cover rounded"
                  />
                  Après
                </Button>
              </div>

              {/* Description */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {currentView === 'before' ? 'Avant' : 'Après'}
                </h4>
                <p className="text-gray-600">
                  {currentView === 'before' ? selectedImage.before.description : selectedImage.after.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
