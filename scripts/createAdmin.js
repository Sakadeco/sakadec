import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Admin Schema (copied from the model)
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.DATABASE_URL;
    
    if (!mongoUri) {
      console.error('❌ Variable d\'environnement DATABASE_URL non définie');
      return;
    }
    
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@sdk.com' });
    
    if (existingAdmin) {
      console.log('⚠️  L\'administrateur admin@sdk.com existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.name);
      console.log('🔑 Rôle:', existingAdmin.role);
      console.log('📅 Créé le:', existingAdmin.createdAt);
      return;
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

    console.log('✅ Administrateur créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('🔑 Rôle:', admin.role);
    console.log('📅 Créé le:', admin.createdAt);
    console.log('');
    console.log('🔐 Identifiants de connexion :');
    console.log('   Email: admin@sdk.com');
    console.log('   Mot de passe: Admin123!');
    console.log('');
    console.log('🌐 Accès admin: /admin/login');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Run the script
createAdmin();
