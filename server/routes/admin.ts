import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin';
import { Product } from '../models/Product';
import Order from '../models/Order';
import { Realisation } from '../models/Realisation';
import { PromoCode } from '../models/PromoCode';
import { Theme } from '../models/Theme';
import { adminAuth, AdminRequest, requireSuperAdmin } from '../middleware/adminAuth';
import upload from '../middleware/upload';
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET &&
                              process.env.CLOUDINARY_CLOUD_NAME !== 'votre_cloud_name' &&
                              process.env.CLOUDINARY_API_KEY !== 'votre_api_key' &&
                              process.env.CLOUDINARY_API_SECRET !== 'votre_api_secret_cloudinary';

console.log('🔧 Configuration Cloudinary sur Render :');
console.log('  - CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'MANQUANTE');
console.log('  - CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || 'MANQUANTE');
console.log('  - CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'CONFIGURÉE' : 'MANQUANTE');
console.log('  - Configuration valide:', isCloudinaryConfigured ? '✅ OUI' : '❌ NON');

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('☁️  Cloudinary configuré pour les uploads');
} else {
  console.log('⚠️  Cloudinary non configuré - utilisation des images locales');
}

const router = Router();

// Admin Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: admin.role },
      process.env.ADMIN_JWT_SECRET || 'admin-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erreur de connexion admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get admin profile
router.get('/profile', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Erreur récupération profil admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create product
router.post('/products', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), async (req: AdminRequest, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      theme,
      mainImageUrl,
      additionalImages,
      isCustomizable,
      isForSale,
      isForRent,
      stockQuantity,
      dailyRentalPrice,
      customizationOptions
    } = req.body;

    let finalMainImageUrl = mainImageUrl;
    let additionalImageUrls = [];

    // Traiter les fichiers uploadés
    if (req.files) {
      console.log('📸 Fichiers uploadés détectés:', Object.keys(req.files));
      
      // Traiter l'image principale
      if (req.files.image && req.files.image[0]) {
        const mainFile = req.files.image[0];
        console.log('📸 Image principale:', mainFile.originalname);
        
        if (isCloudinaryConfigured) {
          try {
            console.log('☁️  Upload image principale vers Cloudinary...');
            const result = await cloudinary.uploader.upload(mainFile.path, {
              folder: 'sakadeco/products',
              public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            });
            
            finalMainImageUrl = result.secure_url;
            console.log('✅ Image principale uploadée vers Cloudinary:', result.secure_url);
          } catch (cloudinaryError) {
            console.error('❌ Erreur upload Cloudinary image principale:', cloudinaryError);
            finalMainImageUrl = mainImageUrl || '/uploads/products/default-product.jpg';
          }
        } else {
          console.log('⚠️  Cloudinary non configuré, utilisation de l\'image locale');
          finalMainImageUrl = `/uploads/products/${mainFile.filename}`;
        }
      }
      
      // Traiter les images supplémentaires
      if (req.files.additionalImages) {
        console.log('📸 Images supplémentaires:', req.files.additionalImages.length);
        
        for (const file of req.files.additionalImages) {
          if (isCloudinaryConfigured) {
            try {
              console.log('☁️  Upload image supplémentaire vers Cloudinary...');
              const result = await cloudinary.uploader.upload(file.path, {
                folder: 'sakadeco/products',
                public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              });
              
              additionalImageUrls.push(result.secure_url);
              console.log('✅ Image supplémentaire uploadée vers Cloudinary:', result.secure_url);
            } catch (cloudinaryError) {
              console.error('❌ Erreur upload Cloudinary image supplémentaire:', cloudinaryError);
              additionalImageUrls.push(`/uploads/products/${file.filename}`);
            }
          } else {
            console.log('⚠️  Cloudinary non configuré, utilisation de l\'image locale');
            additionalImageUrls.push(`/uploads/products/${file.filename}`);
          }
        }
      }
    } else {
      console.log('📸 Aucun fichier uploadé, utilisation de mainImageUrl fourni');
    }

    // Validation des champs requis
    const errors: any = {};
    if (!name) errors.name = 'Le nom est requis';
    if (!description) errors.description = 'La description est requise';
    if (!category) errors.category = 'La catégorie est requise';
    
    // Validation conditionnelle selon la destination
    const isForSaleBool = isForSale === 'true' || isForSale === true;
    const isForRentBool = isForRent === 'true' || isForRent === true;
    
    if (isForSaleBool && (!price || parseFloat(price) <= 0)) {
      errors.price = 'Le prix de vente doit être supérieur à 0';
    }
    if (isForRentBool && (!dailyRentalPrice || parseFloat(dailyRentalPrice) <= 0)) {
      errors.dailyRentalPrice = 'Le prix de location doit être supérieur à 0';
    }
    if (!isForSaleBool && !isForRentBool) {
      errors.destination = 'Le produit doit être destiné à la vente OU à la location (ou les deux)';
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Champs requis manquants',
        errors
      });
    }

    // Parser customizationOptions si c'est une chaîne JSON
    let parsedCustomizationOptions = {};
    if (customizationOptions) {
      try {
        parsedCustomizationOptions = typeof customizationOptions === 'string' 
          ? JSON.parse(customizationOptions) 
          : customizationOptions;
      } catch (parseError) {
        console.warn('⚠️  Erreur parsing customizationOptions:', parseError);
        parsedCustomizationOptions = {};
      }
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: isForSaleBool ? parseFloat(price) : 0, // Prix 0 si pas destiné à la vente
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : undefined,
      theme: theme && theme.trim() ? new mongoose.Types.ObjectId(theme.trim()) : undefined,
      mainImageUrl: finalMainImageUrl,
      additionalImages: additionalImageUrls.length > 0 ? additionalImageUrls : (additionalImages || []),
      isCustomizable: isCustomizable === 'true' || isCustomizable === true,
      isForSale: isForSaleBool,
      isForRent: isForRentBool,
      isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : true,
      stockQuantity: parseInt(stockQuantity) || 0,
      dailyRentalPrice: isForRentBool ? parseFloat(dailyRentalPrice) : undefined,
      customizationOptions: new Map(Object.entries(parsedCustomizationOptions))
    });

    await product.save();
    console.log('✅ Produit créé avec succès, image:', finalMainImageUrl);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Erreur création produit:', error);
    console.error('❌ Stack trace:', error.stack);
    console.error('❌ Données reçues:', {
      name, description, price, category, subcategory,
      isForSale, isForRent, dailyRentalPrice, stockQuantity,
      isCustomizable, customizationOptions: typeof customizationOptions
    });
    console.error('❌ Variables d\'environnement:');
    console.error('  - CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.error('  - CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
    console.error('  - CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Configurée' : 'Manquante');
    res.status(500).json({ 
      message: 'Erreur lors de la création du produit', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all products (admin)
router.get('/products', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string) * 1)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string));

    const total = await Product.countDocuments(query);

    // Convertir les Map en objets pour le frontend
    const serializedProducts = products.map(product => {
      const productObj = product.toObject();
      if (productObj.customizationOptions && productObj.customizationOptions instanceof Map) {
        productObj.customizationOptions = Object.fromEntries(productObj.customizationOptions);
      }
      return productObj;
    });

    res.json({
      products: serializedProducts,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
      total
    });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get single product (admin)
router.get('/products/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Convertir les Map en objets pour le frontend
    const productObj = product.toObject();
    if (productObj.customizationOptions && productObj.customizationOptions instanceof Map) {
      productObj.customizationOptions = Object.fromEntries(productObj.customizationOptions);
    }

    res.json({ product: productObj });
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update product
router.put('/products/:id', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      subcategory,
      theme,
      mainImageUrl,
      additionalImages,
      existingMainImageUrl,
      existingAdditionalImages,
      isCustomizable,
      isForSale,
      isForRent,
      stockQuantity,
      dailyRentalPrice,
      customizationOptions
    } = req.body;

    // Récupérer le produit existant pour préserver les images si aucune nouvelle n'est fournie
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let finalMainImageUrl = existingMainImageUrl || existingProduct.mainImageUrl;
    let additionalImageUrls = existingAdditionalImages 
      ? (typeof existingAdditionalImages === 'string' ? JSON.parse(existingAdditionalImages) : existingAdditionalImages)
      : (existingProduct.additionalImages || []);

    // Traiter les fichiers uploadés
    if (req.files) {
      console.log('📸 Fichiers uploadés détectés:', Object.keys(req.files));
      
      // Traiter l'image principale
      if (req.files.image && req.files.image[0]) {
        const mainFile = req.files.image[0];
        console.log('📸 Image principale:', mainFile.originalname);
        
        if (isCloudinaryConfigured) {
          try {
            console.log('☁️  Upload image principale vers Cloudinary...');
            const result = await cloudinary.uploader.upload(mainFile.path, {
              folder: 'sakadeco/products',
              public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            });
            
            finalMainImageUrl = result.secure_url;
            console.log('✅ Image principale uploadée vers Cloudinary:', result.secure_url);
          } catch (cloudinaryError) {
            console.error('❌ Erreur upload Cloudinary image principale:', cloudinaryError);
            finalMainImageUrl = mainImageUrl || existingProduct.mainImageUrl;
          }
        } else {
          console.log('⚠️  Cloudinary non configuré, utilisation de l\'image locale');
          finalMainImageUrl = `/uploads/products/${mainFile.filename}`;
        }
      }
      
      // Traiter les images supplémentaires
      if (req.files.additionalImages) {
        console.log('📸 Images supplémentaires:', req.files.additionalImages.length);
        
        for (const file of req.files.additionalImages) {
          if (isCloudinaryConfigured) {
            try {
              console.log('☁️  Upload image supplémentaire vers Cloudinary...');
              const result = await cloudinary.uploader.upload(file.path, {
                folder: 'sakadeco/products',
                public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              });
              
              additionalImageUrls.push(result.secure_url);
              console.log('✅ Image supplémentaire uploadée vers Cloudinary:', result.secure_url);
            } catch (cloudinaryError) {
              console.error('❌ Erreur upload Cloudinary image supplémentaire:', cloudinaryError);
              additionalImageUrls.push(`/uploads/products/${file.filename}`);
            }
          } else {
            console.log('⚠️  Cloudinary non configuré, utilisation de l\'image locale');
            additionalImageUrls.push(`/uploads/products/${file.filename}`);
          }
        }
      }
    } else if (mainImageUrl) {
      // Si aucune image n'est uploadée mais qu'une URL est fournie (upload via ProductImageUpload)
      console.log('📸 Utilisation de l\'URL d\'image principale fournie:', mainImageUrl);
      finalMainImageUrl = mainImageUrl;
      
      // Traiter les images supplémentaires depuis le body
      if (additionalImages) {
        const parsedAdditional = typeof additionalImages === 'string' 
          ? JSON.parse(additionalImages) 
          : additionalImages;
        if (Array.isArray(parsedAdditional)) {
          additionalImageUrls = [...additionalImageUrls, ...parsedAdditional];
        }
      }
    }

    // Parser customizationOptions si c'est une chaîne JSON
    let parsedCustomizationOptions = {};
    if (customizationOptions) {
      try {
        parsedCustomizationOptions = typeof customizationOptions === 'string' 
          ? JSON.parse(customizationOptions) 
          : customizationOptions;
      } catch (parseError) {
        console.warn('⚠️  Erreur parsing customizationOptions:', parseError);
        parsedCustomizationOptions = {};
      }
    }

    // Validation conditionnelle selon la destination
    const isForSaleBool = isForSale === 'true' || isForSale === true;
    const isForRentBool = isForRent === 'true' || isForRent === true;

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price: isForSaleBool ? parseFloat(price) : existingProduct.price,
      category,
      subcategory,
      theme: theme && theme.trim() ? new mongoose.Types.ObjectId(theme.trim()) : (theme === '' ? null : existingProduct.theme),
      mainImageUrl: finalMainImageUrl,
      additionalImages: additionalImageUrls,
      isCustomizable: isCustomizable === 'true' || isCustomizable === true,
      isForSale: isForSaleBool,
      isForRent: isForRentBool,
      isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : existingProduct.isActive,
      stockQuantity: parseInt(stockQuantity) || 0,
      dailyRentalPrice: isForRentBool ? (dailyRentalPrice ? parseFloat(dailyRentalPrice) : undefined) : undefined,
      customizationOptions: new Map(Object.entries(parsedCustomizationOptions))
    }, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convertir les Map en objets pour le frontend
    const productObj = product.toObject();
    if (productObj.customizationOptions && productObj.customizationOptions instanceof Map) {
      productObj.customizationOptions = Object.fromEntries(productObj.customizationOptions);
    }

    console.log('✅ Produit modifié avec succès, image principale:', finalMainImageUrl);
    console.log('✅ Images supplémentaires:', additionalImageUrls.length);
    res.json(productObj);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Toggle product active status
router.patch('/products/:id/toggle-active', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.isActive = !product.isActive;
    await product.save();
    
    // Convertir les Map en objets pour le frontend
    const productObj = product.toObject();
    if (productObj.customizationOptions && productObj.customizationOptions instanceof Map) {
      productObj.customizationOptions = Object.fromEntries(productObj.customizationOptions);
    }
    
    res.json({
      message: product.isActive ? 'Produit activé' : 'Produit masqué',
      product: productObj
    });
  } catch (error) {
    console.error('Error toggling product active status:', error);
    res.status(500).json({ message: 'Error toggling product active status', error: error.message });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get dashboard stats
router.get('/dashboard', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stockQuantity: { $lt: 10 } });
    const totalAdmins = await Admin.countDocuments({ isActive: true });

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalAdmins
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Upload multiple images - simplified for development
router.post('/upload-images', (req: Request, res: Response, next) => {
  // Skip admin auth in development
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️  Skipping admin auth for upload in development mode');
  }
  
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        message: 'Erreur lors de l\'upload des images',
        error: err.message 
      });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    console.log('Upload images request received');
    console.log('Files:', req.files);
    
    if (!req.files || req.files.length === 0) {
      console.log('No files provided');
      return res.status(400).json({ message: 'Aucune image fournie' });
    }
    
    const imageUrls = [];
    
    for (const file of req.files as Express.Multer.File[]) {
      console.log('📸 Traitement de l\'image:', file.originalname);
      
      if (isCloudinaryConfigured) {
        try {
          console.log('☁️  Upload vers Cloudinary...');
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'sakadeco/products',
            public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
          
          imageUrls.push(result.secure_url);
          console.log('✅ Image uploadée vers Cloudinary:', result.secure_url);
        } catch (cloudinaryError) {
          console.error('❌ Erreur upload Cloudinary pour', file.originalname, ':', cloudinaryError);
          // Fallback vers l'URL locale
          imageUrls.push(`/uploads/products/${file.filename}`);
        }
      } else {
        console.log('⚠️  Cloudinary non configuré, utilisation de l\'image locale');
        imageUrls.push(`/uploads/products/${file.filename}`);
      }
    }
    
    console.log('✅ Upload terminé, images:', imageUrls);
    
    res.json({
      message: 'Images uploadées avec succès',
      imageUrls,
      filenames: (req.files as Express.Multer.File[]).map(file => file.filename)
    });
  } catch (error) {
    console.error('Erreur upload images:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'upload des images',
      error: error.message 
    });
  }
});

// Test upload directory
router.get('/test-upload-dir', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const uploadDir = 'uploads/products/';
    const exists = fs.existsSync(uploadDir);
    const isDir = exists ? fs.statSync(uploadDir).isDirectory() : false;
    
    // Vérifier les permissions
    let permissions = 'unknown';
    if (exists) {
      try {
        fs.accessSync(uploadDir, fs.constants.R_OK | fs.constants.W_OK);
        permissions = 'read-write';
      } catch (err) {
        permissions = 'no-access';
      }
    }
    
    // Lister les fichiers avec leurs tailles
    let files = [];
    if (exists && isDir) {
      try {
        const fileList = fs.readdirSync(uploadDir);
        files = fileList.map(filename => {
          const filePath = path.join(uploadDir, filename);
          const stats = fs.statSync(filePath);
          return {
            name: filename,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        });
      } catch (err) {
        files = [{ error: err.message }];
      }
    }
    
    res.json({
      uploadDir,
      exists,
      isDirectory: isDir,
      permissions,
      currentDir: process.cwd(),
      files,
      absolutePath: path.resolve(uploadDir)
    });
  } catch (error) {
    console.error('Test upload dir error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Temporary route to create admin (remove in production)
router.post('/setup', async (req: Request, res: Response) => {
  try {
    const { secret } = req.body;
    
    // Simple security check
    if (secret !== 'sakadeco-setup-2024') {
      return res.status(401).json({ message: 'Secret invalide' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@sdk.com' });
    
    if (existingAdmin) {
      return res.json({ 
        message: 'Administrateur existe déjà',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Create new admin
    const admin = new Admin({
      email: 'admin@sdk.com',
      password: 'Admin123!',
      name: 'Administrateur SakaDeco',
      role: 'super_admin',
      isActive: true
    });

    await admin.save();

    res.json({
      message: 'Administrateur créé avec succès',
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erreur création admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all orders (admin)
router.get('/orders', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const orders = await Order.find({})
      .populate('items.product')
      .populate('user')
      .sort({ createdAt: -1 });

    res.json({
      orders: orders.map(order => ({
        _id: order._id,
        user: order.user,
        items: order.items,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        isRental: order.isRental,
        stripeSessionId: order.stripeSessionId,
        stripePaymentIntentId: order.stripePaymentIntentId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    });
  } catch (error) {
    console.error('Erreur récupération commandes admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get order details (admin)
router.get('/orders/:orderId', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Erreur récupération commande admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update order status (admin)
router.put('/orders/:orderId/status', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({ 
      message: 'Statut de commande mis à jour',
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour statut commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Test image access
router.get('/test-image/:filename', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const filename = req.params.filename;
    const imagePath = path.join('uploads/products', filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ 
        error: 'Image not found',
        path: imagePath,
        absolutePath: path.resolve(imagePath)
      });
    }
    
    const stats = fs.statSync(imagePath);
    
    res.json({
      filename,
      path: imagePath,
      absolutePath: path.resolve(imagePath),
      size: stats.size,
      exists: true,
      accessible: true
    });
  } catch (error) {
    console.error('Test image access error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all rentals (admin)
router.get('/rentals', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { Rental } = await import('../models/Rental.js');
    
    const rentals = await Rental.find()
      .populate('items.product')
      .populate('user')
      .sort({ createdAt: -1 });

    // Convertir les Map en objets pour les produits
    const serializedRentals = rentals.map(rental => {
      const rentalObj = rental.toObject();
      if (rentalObj.items) {
        rentalObj.items = rentalObj.items.map((item: any) => {
          if (item.product && item.product.customizationOptions && item.product.customizationOptions instanceof Map) {
            item.product.customizationOptions = Object.fromEntries(item.product.customizationOptions);
          }
          return item;
        });
      }
      return rentalObj;
    });

    res.json({
      rentals: serializedRentals.map(rental => ({
        _id: rental._id,
        orderNumber: rental.orderNumber,
        user: rental.user,
        items: rental.items,
        status: rental.status,
        paymentStatus: rental.paymentStatus,
        paymentMethod: rental.paymentMethod,
        subtotal: rental.subtotal,
        tax: rental.tax,
        deposit: rental.deposit,
        total: rental.total,
        shippingAddress: rental.shippingAddress,
        billingAddress: rental.billingAddress,
        stripeSessionId: rental.stripeSessionId,
        stripePaymentIntentId: rental.stripePaymentIntentId,
        createdAt: rental.createdAt,
        updatedAt: rental.updatedAt
      }))
    });
  } catch (error) {
    console.error('Erreur récupération locations admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get rental details (admin)
router.get('/rentals/:rentalId', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { rentalId } = req.params;
    const { Rental } = await import('../models/Rental.js');
    
    const rental = await Rental.findById(rentalId)
      .populate('items.product')
      .populate('user');

    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    // Convertir les Map en objets pour les produits
    const rentalObj = rental.toObject();
    if (rentalObj.items) {
      rentalObj.items = rentalObj.items.map((item: any) => {
        if (item.product && item.product.customizationOptions && item.product.customizationOptions instanceof Map) {
          item.product.customizationOptions = Object.fromEntries(item.product.customizationOptions);
        }
        return item;
      });
    }

    res.json({ rental: rentalObj });
  } catch (error) {
    console.error('Erreur récupération location admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update rental status (admin)
router.put('/rentals/:rentalId/status', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { rentalId } = req.params;
    const { status, paymentStatus } = req.body;
    const { Rental } = await import('../models/Rental.js');

    const rental = await Rental.findById(rentalId);
    
    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    if (status) rental.status = status;
    if (paymentStatus) rental.paymentStatus = paymentStatus;

    await rental.save();

    res.json({ 
      message: 'Statut de location mis à jour',
      rental: {
        _id: rental._id,
        status: rental.status,
        paymentStatus: rental.paymentStatus
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour statut location:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ==================== RÉALISATIONS ====================

// Get all réalisations
router.get('/realisations', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const realisations = await Realisation.find().sort({ createdAt: -1 });
    res.json(realisations);
  } catch (error) {
    console.error('Erreur récupération réalisations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get single réalisation
router.get('/realisations/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const realisation = await Realisation.findById(req.params.id);
    if (!realisation) {
      return res.status(404).json({ message: 'Réalisation non trouvée' });
    }
    res.json(realisation);
  } catch (error) {
    console.error('Erreur récupération réalisation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create réalisation
router.post('/realisations', adminAuth, upload.fields([
  { name: 'images', maxCount: 20 }
]), async (req: AdminRequest, res: Response) => {
  try {
    const {
      title,
      category,
      date,
      location,
      guests,
      description,
      highlights,
      rating,
      isPublished,
      existingImages
    } = req.body;

    let imageUrls: string[] = [];

    // Traiter les images uploadées
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of files) {
        if (isCloudinaryConfigured) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'sakadeco/realisations',
              public_id: `realisation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            });
            imageUrls.push(result.secure_url);
          } catch (cloudinaryError) {
            console.error('Erreur upload Cloudinary:', cloudinaryError);
            imageUrls.push(`/uploads/realisations/${file.filename}`);
          }
        } else {
          imageUrls.push(`/uploads/realisations/${file.filename}`);
        }
      }
    }

    // Ajouter les images existantes si fournies
    if (existingImages) {
      const parsedImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      if (Array.isArray(parsedImages)) {
        imageUrls = [...imageUrls, ...parsedImages];
      }
    }

    const highlightsArray = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;

    const realisation = new Realisation({
      title: title.trim(),
      category: category.trim(),
      date: new Date(date),
      location: location.trim(),
      guests: guests ? parseInt(guests) : undefined,
      description: description.trim(),
      images: imageUrls,
      highlights: highlightsArray || [],
      rating: rating ? parseInt(rating) : 5,
      isPublished: isPublished === 'true' || isPublished === true
    });

    await realisation.save();
    res.status(201).json(realisation);
  } catch (error) {
    console.error('Erreur création réalisation:', error);
    res.status(500).json({ message: 'Erreur création réalisation', error: error.message });
  }
});

// Update réalisation
router.put('/realisations/:id', adminAuth, upload.fields([
  { name: 'images', maxCount: 20 }
]), async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      date,
      location,
      guests,
      description,
      highlights,
      rating,
      isPublished,
      existingImages
    } = req.body;

    const realisation = await Realisation.findById(id);
    if (!realisation) {
      return res.status(404).json({ message: 'Réalisation non trouvée' });
    }

    let imageUrls = existingImages 
      ? (typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages)
      : realisation.images;

    // Traiter les nouvelles images uploadées
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of files) {
        if (isCloudinaryConfigured) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'sakadeco/realisations',
              public_id: `realisation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            });
            imageUrls.push(result.secure_url);
          } catch (cloudinaryError) {
            console.error('Erreur upload Cloudinary:', cloudinaryError);
            imageUrls.push(`/uploads/realisations/${file.filename}`);
          }
        } else {
          imageUrls.push(`/uploads/realisations/${file.filename}`);
        }
      }
    }

    const highlightsArray = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;

    realisation.title = title.trim();
    realisation.category = category.trim();
    realisation.date = new Date(date);
    realisation.location = location.trim();
    realisation.guests = guests ? parseInt(guests) : undefined;
    realisation.description = description.trim();
    realisation.images = imageUrls;
    realisation.highlights = highlightsArray || [];
    realisation.rating = rating ? parseInt(rating) : 5;
    realisation.isPublished = isPublished === 'true' || isPublished === true;

    await realisation.save();
    res.json(realisation);
  } catch (error) {
    console.error('Erreur mise à jour réalisation:', error);
    res.status(500).json({ message: 'Erreur mise à jour réalisation', error: error.message });
  }
});

// Delete réalisation
router.delete('/realisations/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const realisation = await Realisation.findByIdAndDelete(req.params.id);
    if (!realisation) {
      return res.status(404).json({ message: 'Réalisation non trouvée' });
    }
    res.json({ message: 'Réalisation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression réalisation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ==================== CODES PROMO ====================

// Get all promo codes
router.get('/promo-codes', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const promoCodes = await PromoCode.find()
      .populate('applicableProducts', 'name')
      .sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (error) {
    console.error('Erreur récupération codes promo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get single promo code
router.get('/promo-codes/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id)
      .populate('applicableProducts', 'name');
    if (!promoCode) {
      return res.status(404).json({ message: 'Code promo non trouvé' });
    }
    res.json(promoCode);
  } catch (error) {
    console.error('Erreur récupération code promo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create promo code
router.post('/promo-codes', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const {
      code,
      discountPercentage,
      applyToAllProducts,
      applicableProducts,
      validFrom,
      validUntil,
      isActive,
      usageLimit,
      description
    } = req.body;

    // Vérifier si le code existe déjà
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ message: 'Ce code promo existe déjà' });
    }

    const promoCode = new PromoCode({
      code: code.toUpperCase().trim(),
      discountPercentage: parseFloat(discountPercentage),
      applyToAllProducts: applyToAllProducts === 'true' || applyToAllProducts === true,
      applicableProducts: applyToAllProducts ? [] : (applicableProducts || []),
      validFrom: new Date(validFrom || Date.now()),
      validUntil: new Date(validUntil),
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      description: description?.trim()
    });

    await promoCode.save();
    
    const populated = await PromoCode.findById(promoCode._id)
      .populate('applicableProducts', 'name');
    
    res.status(201).json(populated);
  } catch (error) {
    console.error('Erreur création code promo:', error);
    res.status(500).json({ message: 'Erreur création code promo', error: error.message });
  }
});

// Update promo code
router.put('/promo-codes/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      code,
      discountPercentage,
      applyToAllProducts,
      applicableProducts,
      validFrom,
      validUntil,
      isActive,
      usageLimit,
      description
    } = req.body;

    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Code promo non trouvé' });
    }

    // Vérifier si le code existe déjà (sauf pour celui qu'on modifie)
    if (code && code.toUpperCase() !== promoCode.code) {
      const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
      if (existingCode) {
        return res.status(400).json({ message: 'Ce code promo existe déjà' });
      }
    }

    promoCode.code = code ? code.toUpperCase().trim() : promoCode.code;
    promoCode.discountPercentage = discountPercentage ? parseFloat(discountPercentage) : promoCode.discountPercentage;
    promoCode.applyToAllProducts = applyToAllProducts !== undefined 
      ? (applyToAllProducts === 'true' || applyToAllProducts === true)
      : promoCode.applyToAllProducts;
    promoCode.applicableProducts = promoCode.applyToAllProducts 
      ? [] 
      : (applicableProducts || promoCode.applicableProducts);
    promoCode.validFrom = validFrom ? new Date(validFrom) : promoCode.validFrom;
    promoCode.validUntil = validUntil ? new Date(validUntil) : promoCode.validUntil;
    promoCode.isActive = isActive !== undefined 
      ? (isActive === 'true' || isActive === true)
      : promoCode.isActive;
    promoCode.usageLimit = usageLimit ? parseInt(usageLimit) : promoCode.usageLimit;
    promoCode.description = description !== undefined ? description?.trim() : promoCode.description;

    await promoCode.save();
    
    const populated = await PromoCode.findById(promoCode._id)
      .populate('applicableProducts', 'name');
    
    res.json(populated);
  } catch (error) {
    console.error('Erreur mise à jour code promo:', error);
    res.status(500).json({ message: 'Erreur mise à jour code promo', error: error.message });
  }
});

// Delete promo code
router.delete('/promo-codes/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Code promo non trouvé' });
    }
    res.json({ message: 'Code promo supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression code promo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ========== ROUTES POUR LES THÈMES ==========

// GET all themes
router.get('/themes', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    res.json(themes);
  } catch (error) {
    console.error('Erreur récupération thèmes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET theme by ID
router.get('/themes/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return res.status(404).json({ message: 'Thème non trouvé' });
    }
    res.json(theme);
  } catch (error) {
    console.error('Erreur récupération thème:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST create theme
router.post('/themes', adminAuth, upload.single('image'), async (req: AdminRequest, res: Response) => {
  try {
    const { title, isActive } = req.body;

    let imageUrl = '';

    // Traiter l'image uploadée
    if (req.file) {
      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'sakadeco/themes',
            public_id: `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
          imageUrl = result.secure_url;
        } catch (cloudinaryError) {
          console.error('Erreur upload Cloudinary:', cloudinaryError);
          imageUrl = `/uploads/themes/${req.file.filename}`;
        }
      } else {
        imageUrl = `/uploads/themes/${req.file.filename}`;
      }
    }

    // Si une URL d'image existante est fournie
    if (req.body.existingImageUrl && !req.file) {
      imageUrl = req.body.existingImageUrl;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image requise' });
    }

    const theme = new Theme({
      title: title.trim(),
      imageUrl,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    });

    await theme.save();
    res.status(201).json(theme);
  } catch (error) {
    console.error('Erreur création thème:', error);
    res.status(500).json({ message: 'Erreur création thème', error: error.message });
  }
});

// PUT update theme
router.put('/themes/:id', adminAuth, upload.single('image'), async (req: AdminRequest, res: Response) => {
  try {
    const { title, isActive, existingImageUrl } = req.body;

    let imageUrl = existingImageUrl || '';

    // Traiter la nouvelle image si uploadée
    if (req.file) {
      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'sakadeco/themes',
            public_id: `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
          imageUrl = result.secure_url;
        } catch (cloudinaryError) {
          console.error('Erreur upload Cloudinary:', cloudinaryError);
          imageUrl = `/uploads/themes/${req.file.filename}`;
        }
      } else {
        imageUrl = `/uploads/themes/${req.file.filename}`;
      }
    }

    const updateData: any = {
      title: title.trim(),
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const theme = await Theme.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!theme) {
      return res.status(404).json({ message: 'Thème non trouvé' });
    }

    res.json(theme);
  } catch (error) {
    console.error('Erreur mise à jour thème:', error);
    res.status(500).json({ message: 'Erreur mise à jour thème', error: error.message });
  }
});

// DELETE theme
router.delete('/themes/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) {
      return res.status(404).json({ message: 'Thème non trouvé' });
    }
    res.json({ message: 'Thème supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression thème:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
