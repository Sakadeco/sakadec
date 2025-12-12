import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ProductImageUploadProps {
  onImagesUploaded?: (imageUrls: string[]) => void;
  onFilesSelected?: (files: File[]) => void;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
}

export default function ProductImageUpload({
  onImagesUploaded,
  onFilesSelected,
  multiple = false,
  maxImages = 10,
  className = ""
}: ProductImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non autorisé. Types acceptés: JPEG, PNG, GIF, WebP');
      return false;
    }

    if (file.size > maxSize) {
      setError('Fichier trop volumineux. Taille maximale: 5MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        const newImages = [...uploadedImages, data.imageUrl];
        setUploadedImages(newImages);
        
        if (onImagesUploaded) {
          onImagesUploaded(newImages);
        }
      } else {
        throw new Error('URL d\'image non reçue');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilesUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Vérifier la limite de nombre d'images
    const totalImages = uploadedImages.length + fileArray.length;
    if (totalImages > maxImages) {
      setError(`Vous ne pouvez pas ajouter plus de ${maxImages} images. Vous avez déjà ${uploadedImages.length} image(s).`);
      return;
    }

    // Valider tous les fichiers avant de continuer
    const validFiles: File[] = [];
    for (const file of fileArray) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      return;
    }
    
    // Accumuler les fichiers sélectionnés
    const newSelectedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newSelectedFiles);
    
    if (onFilesSelected) {
      // Envoyer tous les fichiers accumulés
      onFilesSelected(newSelectedFiles);
    }

    // Upload des images si onImagesUploaded est fourni
    if (onImagesUploaded) {
      for (const file of validFiles) {
        await handleFileUpload(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (multiple) {
        handleFilesUpload(files);
      } else {
        handleFileUpload(files[0]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        handleFilesUpload(files);
      } else {
        handleFileUpload(files[0]);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setSelectedFiles(newFiles);
    
    if (onImagesUploaded) {
      onImagesUploaded(newImages);
    }
    
    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-2">
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Téléchargement en cours...</span>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  {multiple ? 'Glissez-déposez vos images ou cliquez pour sélectionner' : 'Glissez-déposez votre image ou cliquez pour sélectionner'}
                </p>
                <p className="text-xs mt-1">
                  Types acceptés: JPEG, PNG, GIF, WebP
                </p>
                <p className="text-xs">
                  Taille maximale: 5MB par image
                </p>
                {multiple && (
                  <p className="text-xs">
                    Maximum: {maxImages} images
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Affichage des images uploadées */}
      {uploadedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
