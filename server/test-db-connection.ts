import { connectDB } from './db';
import { storage } from './storage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...\n');
  
  try {
    // Test connection
    await connectDB();
    
    // Test basic operations
    console.log('\n📊 Testing basic operations...');
    
    // Test products
    try {
      const products = await storage.getProducts();
      console.log(`✅ Products: ${products.length} found`);
      
      if (products.length === 0) {
        console.log('⚠️  No products found. You may need to seed the database.');
      } else {
        console.log('📦 Sample products:');
        products.slice(0, 3).forEach(product => {
          console.log(`   - ${product.name} (${product.category}) - ${product.price}€`);
        });
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
    }
    
    // Test categories
    try {
      const shopProducts = await storage.getProductsByCategory('shop');
      const eventProducts = await storage.getProductsByCategory('events');
      const rentProducts = await storage.getProductsByCategory('rent');
      
      console.log(`\n📈 Products by category:`);
      console.log(`   - Shop: ${shopProducts.length}`);
      console.log(`   - Events: ${eventProducts.length}`);
      console.log(`   - Rent: ${rentProducts.length}`);
    } catch (error) {
      console.error('❌ Error fetching products by category:', error.message);
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
