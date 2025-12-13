import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  theme?: mongoose.Types.ObjectId; // Référence au thème (optionnel)
  mainImageUrl: string; // Image principale
  additionalImages: string[]; // Images supplémentaires pour la galerie
  isCustomizable: boolean;
  isForSale: boolean; // Disponible à la vente
  isForRent: boolean; // Disponible à la location
  isActive: boolean; // Produit actif (visible côté client)
  stockQuantity: number;
  dailyRentalPrice?: number;
  viewCount: number; // Nombre de vues du produit
  salesCount: number; // Nombre de ventes du produit
  customizationOptions: {
    [key: string]: {
      type: 'dropdown' | 'checkbox' | 'text' | 'textarea' | 'text_image_upload';
      label: string;
      required: boolean;
      options?: string[]; // Pour les dropdowns et checkboxes
      placeholder?: string; // Pour les champs texte
      maxLength?: number;
      maxFileSize?: number; // Taille maximale du fichier en MB
      allowedFileTypes?: string[]; // Types de fichiers autorisés
      pricePerCharacter?: number; // Prix par caractère supplémentaire
      basePrice?: number; // Prix de base pour cette option
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['shop', 'rent', 'events', 'home', 'co']
  },
  subcategory: {
    type: String,
    trim: true
  },
  theme: {
    type: Schema.Types.ObjectId,
    ref: 'Theme',
    required: false
  },
  mainImageUrl: {
    type: String,
    required: true
  },
  additionalImages: [{
    type: String
  }],
  isCustomizable: {
    type: Boolean,
    default: false
  },
  isForSale: {
    type: Boolean,
    default: true
  },
  isForRent: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyRentalPrice: {
    type: Number,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  customizationOptions: {
    type: Map,
    of: {
      type: {
        type: String,
        enum: ['dropdown', 'checkbox', 'text', 'textarea', 'text_image_upload'],
        required: true
      },
      label: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        default: false
      },
      options: [String], // Pour les dropdowns et checkboxes
      placeholder: String, // Pour les champs texte
      maxLength: Number,
      maxFileSize: {
        type: Number,
        default: 5 // 5MB par défaut
      },
      allowedFileTypes: [String], // ['image/jpeg', 'image/png', 'image/gif']
      pricePerCharacter: {
        type: Number,
        default: 0.1 // 0.10€ par caractère supplémentaire
      },
      basePrice: {
        type: Number,
        default: 0
      }
    },
    default: {}
  }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
