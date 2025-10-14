import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from "./db";

const app = express();

// Middleware spécial pour capturer le body brut des webhooks Stripe
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Middleware JSON pour toutes les autres routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    console.log("🚀 Starting SakaDeco server...");
    console.log("📊 Environment:", process.env.NODE_ENV);
    console.log("🔌 Database URL:", process.env.DATABASE_URL ? "Configured" : "Missing");
    
    // Connect to MongoDB (non-blocking)
    connectDB().catch(console.error);
    
    // Create missing images for all products (non-blocking)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(async () => {
        try {
          console.log('🖼️  Checking for missing product images...');
          const response = await fetch('http://localhost:5000/api/create-missing-images', {
            method: 'POST'
          });
          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Images check completed: ${result.totalCreated} created, ${result.totalExisting} existing`);
          }
        } catch (error) {
          console.log('⚠️  Could not check for missing images (server not ready yet)');
        }
      }, 3000); // Wait 3 seconds for server to be ready
    }
    
    console.log("🛣️  Registering routes...");
    const server = await registerRoutes(app);
    console.log("✅ Routes registered successfully");

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error('Server error:', err);
      res.status(status).json({ message });
      // Don't throw the error to prevent server crash
    });

    // Setup static file serving for production (Render)
    if (app.get("env") === "production") {
      // Serve static files from the dist directory
      app.use(express.static('dist'));
      
      // Serve uploaded files
      app.use('/uploads', express.static('uploads'));
      
      // Serve index.html for all non-API routes (SPA routing)
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.sendFile('dist/index.html', { root: process.cwd() });
        }
      });
    } else {
      // Development: serve uploaded files BEFORE vite setup
      app.use('/uploads', express.static('uploads'));
      
      // Development: setup vite
      await setupVite(app, server);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    console.log("🌐 Starting server on port:", port);
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
      console.log("🎉 Server started successfully!");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
