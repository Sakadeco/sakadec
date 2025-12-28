import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { z } from "zod";
import adminRoutes from "./routes/admin";
import paymentRoutes from "./routes/payment";
import rentalRoutes from "./routes/rental";
import invoiceRoutes from "./routes/invoice";
import multer from "multer";
import path from "path";
import express from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import emailService from "./services/emailService";

// Obtenir __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration multer pour l'upload d'images
const upload = multer({
  storage: multer.memoryStorage(), // Utiliser le stockage en mémoire
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Validation schemas for MongoDB
const insertProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string(),
  subcategory: z.string().optional(),
  imageUrl: z.string().optional(),
  isCustomizable: z.boolean().optional(),
  isRentable: z.boolean().optional(),
  stockQuantity: z.number().optional(),
  dailyRentalPrice: z.number().optional(),
  customizationOptions: z.any().optional(),
});

const insertOrderSchema = z.object({
  userId: z.string().optional(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  customerPhone: z.string().optional(),
  total: z.number(),
  orderType: z.string(),
  eventDate: z.string().optional(),
  notes: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
});

const insertQuoteSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  serviceType: z.string().optional(),
  service: z.string().optional(), // Pour compatibilité
  description: z.string(),
  eventDate: z.string().optional(),
  budget: z.string().optional(),
  estimatedPrice: z.number().optional(),
});

const insertNewsletterSubscriptionSchema = z.object({
  email: z.string().email(),
});

const insertReviewSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  service: z.string(),
});

const insertGalleryItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string(),
  category: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - only in development or if Replit Auth is configured
  if (process.env.NODE_ENV === 'development' || process.env.REPLIT_DOMAINS) {
    await setupAuth(app);
  }

  // Auth routes - simplified for development
  app.get('/api/auth/user', (req, res) => {
    // Return mock user data for development
    res.json({ 
      message: "Auth disabled in development",
      user: {
        id: "dev-user-1",
        email: "dev@example.com",
        name: "Development User",
        isAuthenticated: true
      },
      isAuthenticated: true
    });
  });

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      const dbStatus = db.connection.readyState === 1 ? 'connected' : 'disconnected';
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        environment: process.env.NODE_ENV || 'development',
        databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: (error as any).message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Test endpoint for debugging
  app.get('/api/test', async (req, res) => {
    try {
      res.json({
        message: 'API is working',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        dbConnected: db.connection.readyState === 1,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      });
    } catch (error) {
      res.status(500).json({
        error: (error as any).message
      });
    }
  });

  // Simple test endpoint without database
  app.get('/api/simple', (req, res) => {
    res.json({
      message: 'Simple API endpoint working',
      timestamp: new Date().toISOString(),
      status: 'ok'
    });
  });

  // List all products with their image URLs
  app.get('/api/products-images', async (req, res) => {
    try {
      const { Product } = await import('./models/Product');
      const products = await Product.find({});
      
      const productsWithImages = products.map(product => ({
        id: product._id,
        name: product.name,
        mainImageUrl: product.mainImageUrl,
        additionalImages: product.additionalImages || [],
        hasMainImage: !!product.mainImageUrl,
        hasAdditionalImages: product.additionalImages && product.additionalImages.length > 0
      }));
      
      res.json({
        totalProducts: products.length,
        products: productsWithImages
      });
    } catch (error) {
      console.error('Error fetching products with images:', error);
      res.status(500).json({
        error: error.message
      });
    }
  });

  // Simple image upload endpoint - no auth required
  app.post('/api/upload-images', async (req, res) => {
    try {
      const multer = await import('multer');
      const path = await import('path');
      
      // Configure multer for image upload
      const storage = multer.default.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/products/');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, 'product-' + uniqueSuffix + path.default.extname(file.originalname));
        }
      });
      
      const upload = multer.default({ 
        storage: storage,
        limits: {
          fileSize: 5 * 1024 * 1024 // 5MB limit
        },
        fileFilter: (req, file, cb) => {
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed'));
          }
        }
      });
      
      // Handle the upload
      upload.array('images', 10)(req, res, (err) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(400).json({ 
            message: 'Erreur lors de l\'upload des images',
            error: err.message 
          });
        }
        
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: 'Aucune image fournie' });
        }
        
        const imageUrls = (req.files as Express.Multer.File[]).map(file => {
          return `/uploads/products/${file.filename}`;
        });
        
        res.json({
          message: 'Images uploadées avec succès',
          imageUrls,
          filenames: (req.files as Express.Multer.File[]).map(file => file.filename)
        });
      });
    } catch (error) {
      console.error('Erreur upload images:', error);
      res.status(500).json({ 
        message: 'Erreur lors de l\'upload des images',
        error: error.message 
      });
    }
  });

  // Create test images for all products - public endpoint
  app.post('/api/create-test-images', async (req, res) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const uploadDir = 'uploads/products/';
      if (!fs.default.existsSync(uploadDir)) {
        fs.default.mkdirSync(uploadDir, { recursive: true });
      }

      // Créer une image de test simple (1x1 pixel PNG en base64)
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const testImageBuffer = Buffer.from(testImageBase64, 'base64');

      // Récupérer tous les produits de la base de données
      const { Product } = await import('./models/Product');
      const products = await Product.find({});
      
      const createdImages = [];
      const existingImages = [];

      for (const product of products) {
        // Créer une image de test pour chaque produit
        const testImageName = `product-${product._id}-test.jpg`;
        const filePath = path.default.join(uploadDir, testImageName);
        
        if (!fs.default.existsSync(filePath)) {
          fs.default.writeFileSync(filePath, testImageBuffer);
          createdImages.push(testImageName);
        } else {
          existingImages.push(testImageName);
        }

        // Mettre à jour le produit avec l'image de test s'il n'en a pas
        if (!product.mainImageUrl) {
          product.mainImageUrl = `/uploads/products/${testImageName}`;
          await product.save();
          console.log(`✅ Updated product ${product.name} with test image`);
        }
      }

      res.json({
        message: 'Images de test créées avec succès',
        createdImages,
        existingImages,
        totalCreated: createdImages.length,
        totalExisting: existingImages.length,
        totalProducts: products.length
      });
    } catch (error) {
      console.error('Erreur lors de la création des images de test:', error);
      res.status(500).json({
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Force create test images for all products
  app.post('/api/force-create-images', async (req, res) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const uploadDir = 'uploads/products/';
      if (!fs.default.existsSync(uploadDir)) {
        fs.default.mkdirSync(uploadDir, { recursive: true });
      }

      // Créer une image de test simple (1x1 pixel PNG en base64)
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const testImageBuffer = Buffer.from(testImageBase64, 'base64');

      // Récupérer tous les produits de la base de données
      const { Product } = await import('./models/Product');
      const products = await Product.find({});
      
      const createdImages = [];
      const updatedProducts = [];

      for (const product of products) {
        // Créer une image de test pour chaque produit
        const testImageName = `product-${product._id}-test.jpg`;
        const filePath = path.default.join(uploadDir, testImageName);
        
        // Toujours créer l'image (forcer la création)
        fs.default.writeFileSync(filePath, testImageBuffer);
        createdImages.push(testImageName);

        // Mettre à jour le produit avec l'image de test
        product.mainImageUrl = `/uploads/products/${testImageName}`;
        await product.save();
        updatedProducts.push(product.name);
      }

      res.json({
        message: 'Images de test créées et produits mis à jour avec succès',
        createdImages,
        updatedProducts,
        totalCreated: createdImages.length,
        totalProducts: products.length
      });
    } catch (error) {
      console.error('Erreur lors de la création forcée des images:', error);
      res.status(500).json({
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Create missing product images - public endpoint
  app.post('/api/create-missing-images', async (req, res) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const uploadDir = 'uploads/products/';
      if (!fs.default.existsSync(uploadDir)) {
        fs.default.mkdirSync(uploadDir, { recursive: true });
      }

      // Créer une image de test simple (1x1 pixel PNG en base64)
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const testImageBuffer = Buffer.from(testImageBase64, 'base64');

      // Récupérer tous les produits de la base de données
      const { Product } = await import('./models/Product');
      const products = await Product.find({});
      
      const createdImages = [];
      const existingImages = [];

      for (const product of products) {
        if (product.mainImageUrl && product.mainImageUrl.startsWith('/uploads/products/')) {
          const filename = product.mainImageUrl.replace('/uploads/products/', '');
          const filePath = path.default.join(uploadDir, filename);
          
          if (!fs.default.existsSync(filePath)) {
            fs.default.writeFileSync(filePath, testImageBuffer);
            createdImages.push(filename);
          } else {
            existingImages.push(filename);
          }
        }

        // Vérifier aussi les images supplémentaires
        if (product.additionalImages && Array.isArray(product.additionalImages)) {
          for (const imageUrl of product.additionalImages) {
            if (imageUrl && imageUrl.startsWith('/uploads/products/')) {
              const filename = imageUrl.replace('/uploads/products/', '');
              const filePath = path.default.join(uploadDir, filename);
              
              if (!fs.default.existsSync(filePath)) {
                fs.default.writeFileSync(filePath, testImageBuffer);
                createdImages.push(filename);
              } else {
                existingImages.push(filename);
              }
            }
          }
        }
      }

      res.json({
        message: 'Images manquantes créées avec succès',
        createdImages,
        existingImages,
        totalCreated: createdImages.length,
        totalExisting: existingImages.length
      });
    } catch (error) {
      console.error('Erreur lors de la création des images manquantes:', error);
      res.status(500).json({
        error: error.message,
        stack: error.stack
      });
    }
  });

  

  // Product routes
  // Route pour les produits vedettes (les plus consultés ou achetés)
  app.get('/api/products/featured', async (req, res) => {
    try {
      if (db.connection.readyState === 1) {
        const { Product } = await import('./models/Product');
        
        // Récupérer les produits actifs, triés par popularité (vues + ventes)
        const products = await Product.find({
          $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        .sort({ 
          // Trier par la somme de viewCount et salesCount (popularité totale)
          // Utiliser une agrégation pour calculer la popularité
        })
        .limit(4)
        .lean();

        // Calculer la popularité pour chaque produit et trier
        const productsWithPopularity = products.map(product => ({
          ...product,
          popularity: (product.viewCount || 0) + (product.salesCount || 0) * 2 // Les ventes comptent double
        }));

        // Trier par popularité décroissante
        productsWithPopularity.sort((a, b) => b.popularity - a.popularity);

        // Si aucun produit n'a de vues/ventes, prendre les 4 premiers produits actifs
        if (productsWithPopularity.length === 0 || productsWithPopularity.every(p => p.popularity === 0)) {
          const fallbackProducts = await Product.find({
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
          })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean();
          
          return res.json(fallbackProducts);
        }

        res.json(productsWithPopularity.slice(0, 4));
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Erreur récupération produits vedettes:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const { category } = req.query;
      console.log('📦 Fetching products...', category ? `Category: ${category}` : 'All categories');
      
      // Check if database is connected
      if (db.connection.readyState === 1) {
        console.log('✅ Database connected, fetching real products');
        const { Product } = await import('./models/Product');
        
        const query: any = {
          // Inclure les produits actifs OU les produits sans le champ isActive (anciens produits)
          $or: [
            { isActive: true },
            { isActive: { $exists: false } }
          ]
        };
        if (category) {
          query.category = category;
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        console.log(`📦 Found ${products.length} products in database`);
        
        // Convertir les Map en objets pour le frontend
        const serializedProducts = products.map(product => {
          const productObj = product.toObject();
          if (productObj.customizationOptions && productObj.customizationOptions instanceof Map) {
            const customizationOptionsObj: any = {};
            productObj.customizationOptions.forEach((value: any, key: string) => {
              customizationOptionsObj[key] = value instanceof Map ? Object.fromEntries(value) : value;
              // Convertir aussi valuePrices si c'est une Map
              if (customizationOptionsObj[key] && customizationOptionsObj[key].valuePrices instanceof Map) {
                customizationOptionsObj[key].valuePrices = Object.fromEntries(customizationOptionsObj[key].valuePrices);
              }
            });
            productObj.customizationOptions = customizationOptionsObj;
          }
          return productObj;
        });
        
        res.json(serializedProducts);
      } else {
        console.log('⚠️ Database not connected, using mock data');
        // Mock products with new structure
        const mockProducts = [
          {
            _id: "mock-1",
            name: "Ballons de Fête Colorés",
            description: "Lot de 50 ballons de fête multicolores de haute qualité, parfaits pour toutes vos célébrations. Ballons en latex naturel, résistants et durables.",
            price: 25.99,
            category: "shop",
            subcategory: "ballons",
            mainImageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
            additionalImages: [
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop"
            ],
            isCustomizable: true,
            isRentable: false,
            stockQuantity: 100,
            dailyRentalPrice: undefined,
            customizationOptions: {
              "couleurs": {
                type: "dropdown",
                label: "Couleurs disponibles",
                required: true,
                options: ["rouge", "bleu", "vert", "jaune", "rose", "orange", "violet"]
              },
              "taille": {
                type: "dropdown",
                label: "Taille des ballons",
                required: false,
                options: ["petit", "moyen", "grand"]
              },
              "message": {
                type: "text",
                label: "Message personnalisé",
                required: false,
                placeholder: "Entrez votre message...",
                maxLength: 50
              }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: "mock-2",
            name: "Décoration de Table Élégante",
            description: "Set complet de décoration de table pour événements spéciaux. Inclut nappes, serviettes, bougies et accessoires décoratifs.",
            price: 89.99,
            category: "shop",
            subcategory: "décoration",
            mainImageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
            additionalImages: [
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
            ],
            isCustomizable: true,
            isRentable: true,
            stockQuantity: 25,
            dailyRentalPrice: 15.00,
            customizationOptions: {
              "thème": {
                type: "dropdown",
                label: "Thème de décoration",
                required: true,
                options: ["romantique", "moderne", "vintage", "naturel", "luxe"]
              },
              "couleurs": {
                type: "checkbox",
                label: "Couleurs préférées",
                required: false,
                options: ["blanc", "rose", "doré", "argenté", "vert"]
              },
              "message": {
                type: "textarea",
                label: "Instructions spéciales",
                required: false,
                placeholder: "Décrivez vos préférences...",
                maxLength: 200
              }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        const filteredProducts = category 
          ? mockProducts.filter(p => p.category === category)
          : mockProducts;
        
        res.json(filteredProducts);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      if ((error as any).message && (error as any).message.includes('Database not connected')) {
        res.status(503).json({ 
          message: "Service temporairement indisponible - Problème de connexion à la base de données",
          error: "DATABASE_CONNECTION_ERROR"
        });
      } else {
        res.status(500).json({ 
          message: "Erreur lors de la récupération des produits",
          error: "INTERNAL_SERVER_ERROR"
        });
      }
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📦 Fetching product:', id);
      
      // Check if database is connected
      if (db.connection.readyState === 1) {
        console.log('✅ Database connected, fetching real product');
        const { Product } = await import('./models/Product');
        
        // Incrémenter le compteur de vues
        await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        
        const product = await Product.findOne({
          _id: id,
          $or: [
            { isActive: true },
            { isActive: { $exists: false } }
          ]
        });
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log('📦 Found product:', product.name);
        
        // Convertir les Map en objets pour le frontend
        const productObj = product.toObject();
        if (productObj.customizationOptions && productObj.customizationOptions instanceof Map) {
          const customizationOptionsObj: any = {};
          productObj.customizationOptions.forEach((value: any, key: string) => {
            if (value instanceof Map) {
              customizationOptionsObj[key] = Object.fromEntries(value);
              // Convertir aussi valuePrices si c'est une Map
              if (customizationOptionsObj[key].valuePrices instanceof Map) {
                customizationOptionsObj[key].valuePrices = Object.fromEntries(customizationOptionsObj[key].valuePrices);
              }
            } else {
              customizationOptionsObj[key] = value;
            }
          });
          productObj.customizationOptions = customizationOptionsObj;
        }
        
        res.json(productObj);
      } else {
        console.log('⚠️ Database not connected, using mock data');
        // Return mock product for testing
        const mockProduct = {
          _id: id,
          name: "Ballons de Fête Colorés",
          description: "Lot de 50 ballons de fête multicolores de haute qualité, parfaits pour toutes vos célébrations. Ballons en latex naturel, résistants et durables.",
          price: 25.99,
          category: "shop",
          subcategory: "ballons",
          mainImageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
          additionalImages: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop"
          ],
          isCustomizable: true,
          isRentable: false,
          stockQuantity: 100,
          dailyRentalPrice: undefined,
          customizationOptions: {
            "couleurs": {
              type: "dropdown",
              label: "Couleurs disponibles",
              required: true,
              options: ["rouge", "bleu", "vert", "jaune", "rose", "orange", "violet"]
            },
            "taille": {
              type: "dropdown",
              label: "Taille des ballons",
              required: false,
              options: ["petit", "moyen", "grand"]
            },
            "message": {
              type: "text",
              label: "Message personnalisé",
              required: false,
              placeholder: "Entrez votre message...",
              maxLength: 50
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        res.json(mockProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  });

  app.post('/api/products', async (req: any, res) => {
    try {
      // Only check auth if it's enabled
      if (process.env.NODE_ENV === 'development' || process.env.REPLIT_DOMAINS) {
        // Check if user is admin
        const user = await storage.getUser(req.user.claims.sub);
        if (user?.role !== 'admin') {
          return res.status(403).json({ message: "Admin access required" });
        }
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Admin can see all orders, users only their own
      const orders = user?.role === 'admin' 
        ? await storage.getOrders()
        : await storage.getOrders(userId);
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Add order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.addOrderItem({
            ...item,
            orderId: order.id,
          });
        }
      }

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Rental availability check
  app.get('/api/rentals/availability/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      const isAvailable = await storage.getRentalAvailability(productId, start, end);
      res.json({ available: isAvailable });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Quote routes
  app.post('/api/quotes', async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      // Normaliser serviceType/service pour compatibilité
      if (quoteData.serviceType && !quoteData.service) {
        quoteData.service = quoteData.serviceType;
      }
      const quote = await storage.createQuote(quoteData);
      
      // Envoyer les emails
      try {
        // Email de confirmation au client
        await emailService.sendQuoteConfirmationEmail(quote);
        
        // Notification à l'admin
        await emailService.sendQuoteAdminNotificationEmail(quote);
        
        console.log(`✅ Emails de devis envoyés pour ${quote._id}`);
      } catch (emailError) {
        console.error('❌ Erreur envoi emails devis:', emailError);
      }
      
      res.status(201).json(quote);
    } catch (error) {
      console.error("Error creating quote:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quote data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quote" });
    }
  });

  app.get('/api/quotes', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.patch('/api/quotes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const updateData = req.body;
      
      const quote = await storage.updateQuoteStatus(id, updateData.status, updateData.estimatedPrice);
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote:", error);
      res.status(500).json({ message: "Failed to update quote" });
    }
  });

  // Payment routes (placeholder for future integration)
  app.post("/api/create-payment-intent", async (req, res) => {
    res.status(501).json({ 
      message: "Payment system not implemented yet",
      info: "Payment integration will be added in a future version"
    });
  });

  // Newsletter routes
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.subscribeToNewsletter(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.get('/api/newsletter', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const subscriptions = await storage.getNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch newsletter subscriptions" });
    }
  });

  // Review routes
  app.get('/api/reviews', async (req, res) => {
    try {
      // Always return mock data for now
      console.log('⚠️ Using mock reviews data to avoid database issues');
      const mockReviews = [
        {
          _id: "review-1",
          customerName: "Marie Dupont",
          customerEmail: "marie@example.com",
          rating: 5,
          comment: "Service exceptionnel ! Les décorations étaient magnifiques.",
          serviceType: "events",
          isPublished: true
        },
        {
          _id: "review-2",
          customerName: "Jean Martin",
          customerEmail: "jean@example.com",
          rating: 4,
          comment: "Très satisfait du service et de la qualité des produits.",
          serviceType: "shop",
          isPublished: true
        }
      ];
      res.json(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Gallery routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const { category } = req.query;
      
      // Always return mock data for now
      console.log('⚠️ Using mock gallery data to avoid database issues');
      const mockGallery = [
        {
          _id: "gallery-1",
          title: "Décoration Mariage",
          description: "Magnifique décoration pour mariage",
          imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
          category: "events",
          isPublished: true
        },
        {
          _id: "gallery-2",
          title: "Arche de Ballons",
          description: "Arche de ballons événementielle",
          imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
          category: "events",
          isPublished: true
        }
      ];
      
      const filteredItems = category 
        ? mockGallery.filter(item => item.category === category)
        : mockGallery;
        
      res.json(filteredItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });

  app.post('/api/gallery', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const itemData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating gallery item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid gallery item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });

  // Upload route for customization images
  app.post('/api/upload/image', upload.single('image'), async (req: any, res) => {
    try {
      console.log('📸 Upload image request received');
      console.log('📸 File:', req.file);
      
      if (!req.file) {
        console.log('❌ No file provided');
        return res.status(400).json({ message: 'Aucune image fournie' });
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        console.log('❌ Invalid file type:', req.file.mimetype);
        return res.status(400).json({ 
          message: 'Type de fichier non autorisé. Types acceptés: JPEG, PNG, GIF' 
        });
      }

      // Vérifier la taille (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        console.log('❌ File too large:', req.file.size);
        return res.status(400).json({ 
          message: 'Fichier trop volumineux. Taille maximale: 5MB' 
        });
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `customization-${timestamp}-${randomString}.${fileExtension}`;

      console.log('📸 Generated filename:', fileName);

      // Importer fs de manière asynchrone
      const fs = await import('fs');

      // Créer le dossier s'il n'existe pas
      const uploadDir = path.join(process.cwd(), 'uploads', 'customizations');
      console.log('📸 Upload directory:', uploadDir);
      
      if (!fs.existsSync(uploadDir)) {
        console.log('📸 Creating upload directory');
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Écrire le fichier depuis la mémoire
      const finalPath = path.join(uploadDir, fileName);
      console.log('📸 Writing file to:', finalPath);
      
      try {
        fs.writeFileSync(finalPath, req.file.buffer);
      } catch (writeError) {
        console.error('❌ Error writing file:', writeError);
        return res.status(500).json({ message: 'Erreur lors de l\'écriture du fichier' });
      }

      // Retourner l'URL de l'image
      const imageUrl = `/uploads/customizations/${fileName}`;
      console.log('✅ Image uploaded successfully:', imageUrl);

      res.json({ 
        message: 'Image uploadée avec succès',
        imageUrl: imageUrl,
        fileName: fileName
      });

    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      console.error('❌ Stack trace:', error.stack);
      res.status(500).json({ 
        message: 'Erreur lors de l\'upload de l\'image',
        error: error.message 
      });
    }
  });

  // Webhook placeholder for future payment integration
  app.post('/api/payment-webhook', async (req, res) => {
    res.status(501).json({ 
      message: "Payment webhook not implemented yet",
      info: "Webhook will be configured when payment system is integrated"
    });
  });

  // Public routes for réalisations
  app.get('/api/realisations', async (req, res) => {
    try {
      if (db.connection.readyState === 1) {
        const { Realisation } = await import('./models/Realisation');
        const realisations = await Realisation.find({ isPublished: true })
          .sort({ createdAt: -1 });
        res.json(realisations);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Erreur récupération réalisations:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Route pour récupérer une réalisation par ID
  app.get('/api/realisations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (db.connection.readyState === 1) {
        const { Realisation } = await import('./models/Realisation');
        const mongoose = await import('mongoose');
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'ID de réalisation invalide' });
        }
        
        const realisation = await Realisation.findById(id);
        
        if (!realisation) {
          return res.status(404).json({ message: 'Réalisation non trouvée' });
        }
        
        if (!realisation.isPublished) {
          return res.status(404).json({ message: 'Réalisation non trouvée' });
        }
        
        res.json(realisation);
      } else {
        res.status(503).json({ message: 'Base de données non connectée' });
      }
    } catch (error) {
      console.error("❌ Error fetching realisation:", error);
      res.status(500).json({ message: 'Error fetching realisation', error: error.message });
    }
  });

  // Public routes for themes
  app.get('/api/themes', async (req, res) => {
    try {
      if (db.connection.readyState === 1) {
        const { Theme } = await import('./models/Theme');
        const themes = await Theme.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(themes);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Erreur récupération thèmes:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Public route for active announcement
  app.get('/api/announcement/active', async (req, res) => {
    try {
      if (db.connection.readyState === 1) {
        const { Announcement } = await import('./models/Announcement');
        const announcement = await Announcement.findOne({ isActive: true })
          .sort({ createdAt: -1 });
        res.json(announcement || null);
      } else {
        res.json(null);
      }
    } catch (error) {
      console.error('Erreur récupération actualité:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Get products by theme
  app.get('/api/themes/:themeId/products', async (req, res) => {
    try {
      const { themeId } = req.params;
      if (db.connection.readyState === 1) {
        const { Product } = await import('./models/Product');
        const mongoose = await import('mongoose');
        
        if (!mongoose.Types.ObjectId.isValid(themeId)) {
          return res.status(400).json({ message: 'ID de thème invalide' });
        }
        
        const products = await Product.find({
          theme: themeId,
          $or: [{ isActive: true }, { isActive: { $exists: false } }]
        }).sort({ createdAt: -1 });
        
        res.json(products);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Erreur récupération produits par thème:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Public route for promo code validation
  app.post('/api/promo-codes/validate', async (req, res) => {
    try {
      const { code, productId } = req.body;

      if (!code) {
        return res.status(400).json({ message: 'Code promo requis' });
      }

      if (db.connection.readyState === 1) {
        const { PromoCode } = await import('./models/PromoCode');
        const mongoose = await import('mongoose');
        
        const promoCode = await PromoCode.findOne({ 
          code: code.toUpperCase().trim(),
          isActive: true
        });

        if (!promoCode) {
          return res.status(404).json({ message: 'Code promo invalide' });
        }

        // Vérifier les dates de validité
        const now = new Date();
        if (now < promoCode.validFrom || now > promoCode.validUntil) {
          return res.status(400).json({ message: 'Code promo expiré ou non encore valide' });
        }

        // Vérifier la limite d'utilisation
        if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
          return res.status(400).json({ message: 'Code promo atteint sa limite d\'utilisation' });
        }

        // Vérifier si le code s'applique au produit
        if (!promoCode.applyToAllProducts && productId) {
          const productObjectId = typeof productId === 'string' 
            ? new mongoose.default.Types.ObjectId(productId) 
            : productId;
          
          if (!promoCode.applicableProducts.some(id => id.toString() === productObjectId.toString())) {
            return res.status(400).json({ message: 'Ce code promo ne s\'applique pas à ce produit' });
          }
        }

        res.json({
          valid: true,
          code: promoCode.code,
          discountPercentage: promoCode.discountPercentage,
          description: promoCode.description,
          applyToAllProducts: promoCode.applyToAllProducts
        });
      } else {
        res.status(503).json({ message: 'Base de données non disponible' });
      }
    } catch (error) {
      console.error('Erreur validation code promo:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Admin routes
  app.use('/api/admin', adminRoutes);
  
  // Payment routes
  app.use('/api/payment', paymentRoutes);
  
  // Rental routes
  app.use('/api/rental', rentalRoutes);
  
  // Invoice routes
  app.use('/api/invoice', invoiceRoutes);

  // Logo avatar route for email clients
  app.get('/logo-avatar.png', (req, res) => {
    // Rediriger vers le logo SVG ou servir une version PNG
    res.redirect('/api/logo-avatar');
  });

  app.get('/api/logo-avatar', (req, res) => {
    // Servir le logo SVG comme avatar
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24h
    
    const svgLogo = `<svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="300" height="200" fill="#faf9f6"/>
      
      <!-- Balloons -->
      <!-- Left balloon (pink) -->
      <ellipse cx="60" cy="40" rx="15" ry="20" fill="#ffb6c1" stroke="#d4af37" stroke-width="1"/>
      <line x1="60" y1="60" x2="60" y2="80" stroke="#d4af37" stroke-width="1"/>
      
      <!-- Right balloon (teal) -->
      <ellipse cx="90" cy="40" rx="15" ry="20" fill="#98d8c8" stroke="#d4af37" stroke-width="1"/>
      <line x1="90" y1="60" x2="90" y2="80" stroke="#d4af37" stroke-width="1"/>
      
      <!-- Floral branch -->
      <g stroke="#d4af37" stroke-width="1" fill="none">
        <!-- Main stem -->
        <path d="M 120 80 Q 140 60 160 40"/>
        
        <!-- Flowers -->
        <g fill="#ffb6c1">
          <circle cx="150" cy="35" r="8"/>
          <circle cx="165" cy="25" r="6"/>
        </g>
        
        <!-- Leaves -->
        <g fill="#98d8c8">
          <ellipse cx="135" cy="50" rx="4" ry="8" transform="rotate(-30 135 50)"/>
          <ellipse cx="145" cy="45" rx="3" ry="6" transform="rotate(20 145 45)"/>
          <ellipse cx="155" cy="55" rx="4" ry="7" transform="rotate(-15 155 55)"/>
        </g>
      </g>
      
      <!-- SKD text -->
      <text x="150" y="120" font-family="cursive, serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#d4af37">SKD</text>
      
      <!-- GROUP text -->
      <text x="150" y="145" font-family="Arial, sans-serif" font-size="16" font-weight="normal" text-anchor="middle" fill="#98d8c8">GROUP</text>
    </svg>`;
    
    res.send(svgLogo);
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Test route pour vérifier l'upload
  app.get('/api/upload/test', (req, res) => {
    res.json({
      message: 'Upload endpoint is working',
      tempDir: process.env.TEMP || process.env.TMP || '/tmp',
      uploadDir: path.join(process.env.TEMP || process.env.TMP || '/tmp', 'sakadeco-uploads'),
      cwd: process.cwd()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
