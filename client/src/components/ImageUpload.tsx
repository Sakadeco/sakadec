import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  maxFileSize?: number; // en MB
  allowedFileTypes?: string[];
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({
  onImageUpload,
  maxFileSize = 5,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'],
  placeholder = "Glissez-déposez votre image ou cliquez pour sélectionner",
  className = ""
}: ImageUploadProps) {
  // Vérification de sécurité
  if (typeof onImageUpload !== 'function') {
    console.error('ImageUpload: onImageUpload must be a function, received:', onImageUpload);
    return (
      <div className={`w-full ${className}`}>
        <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center">
          <p className="text-red-600">Erreur de configuration du composant</p>
        </div>
      </div>
    );
  }
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Vérifier le type de fichier
    if (!allowedFileTypes.includes(file.type)) {
      setError(`Type de fichier non autorisé. Types acceptés: ${allowedFileTypes.join(', ')}`);
      return false;
    }

    // Vérifier la taille du fichier
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      setError(`Fichier trop volumineux. Taille maximale: ${maxFileSize}MB`);
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
      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload vers le serveur
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const data = await response.json();
      if (typeof onImageUpload === 'function') {
        onImageUpload(data.imageUrl);
      } else {
        console.error('onImageUpload is not a function:', onImageUpload);
        setError('Erreur de configuration du composant');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
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
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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
          accept={allowedFileTypes.join(',')}
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
                <p className="font-medium">{placeholder}</p>
                <p className="text-xs mt-1">
                  Types acceptés: {allowedFileTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()}
                </p>
                <p className="text-xs">
                  Taille maximale: {maxFileSize}MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
