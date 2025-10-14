import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/SDK?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📡 Database URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db?.databaseName || 'Unknown');
    
    // Test the connection
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('📚 Available collections:', collections.map(c => c.name));
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('🔍 Error details:', {
      name: (error as any).name,
      message: (error as any).message,
      code: (error as any).code
    });
    
    // In production, we might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Critical: Cannot connect to database in production. Continuing anyway...');
      // Don't exit in production, just log the error
    } else {
      console.log('⚠️  Continuing without database connection in development...');
    }
  }
};

// Export mongoose for use in other files
export { mongoose as db };