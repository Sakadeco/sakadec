import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { Product } from '../models/Product';
import Order from '../models/Order';
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
      mainImageUrl: finalMainImageUrl,
      additionalImages: additionalImageUrls.length > 0 ? additionalImageUrls : (additionalImages || []),
      isCustomizable: isCustomizable === 'true' || isCustomizable === true,
      isForSale: isForSaleBool,
      isForRent: isForRentBool,
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
router.put('/products/:id', adminAuth, async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      subcategory,
      mainImageUrl,
      additionalImages,
      isCustomizable,
      isRentable,
      stockQuantity,
      dailyRentalPrice,
      customizationOptions
    } = req.body;

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

    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price: parseFloat(price),
      category,
      subcategory,
      mainImageUrl,
      additionalImages: additionalImages || [],
      isCustomizable: isCustomizable === 'true',
      isRentable: isRentable === 'true',
      stockQuantity: parseInt(stockQuantity) || 0,
      dailyRentalPrice: dailyRentalPrice ? parseFloat(dailyRentalPrice) : undefined,
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

    res.json(productObj);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
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

    res.json({
      rentals: rentals.map(rental => ({
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

    res.json({ rental });
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

export default router;
