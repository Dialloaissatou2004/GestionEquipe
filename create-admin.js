const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// User schema (simplified for this script)
const userSchema = new mongoose.Schema({
  email: String,
  motDePasse: String,
  role: String
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

// Function to create a new admin user
const createAdminUser = async (email, password) => {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️  Un utilisateur avec l'email ${email} existe déjà`);
      console.log(`   Rôle actuel: ${existingUser.role}`);
      
      if (existingUser.role !== 'admin') {
        // Update existing user to admin
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`✅ Utilisateur ${email} mis à jour vers le rôle admin`);
      }
      return;
    }
    
    // Hash password with bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    // Create new admin user
    const adminUser = new User({
      email: email.toLowerCase().trim(),
      motDePasse: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('✅ Administrateur créé avec succès');
    console.log(`   Email: ${email}`);
    console.log(`   Rôle: admin`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  }
};

// Interactive admin creation
const createInteractiveAdmin = async () => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise(resolve => rl.question(query, resolve));

  try {
    console.log('🔧 Création d\'un nouvel administrateur\n');
    
    const email = await question('Email de l\'administrateur: ');
    const password = await question('Mot de passe: ');
    
    console.log('\n📋 Récapitulatif:');
    console.log(`Email: ${email}`);
    console.log(`Rôle: admin\n`);
    
    const confirm = await question('Confirmer la création? (o/n): ');
    
    if (confirm.toLowerCase() === 'o' || confirm.toLowerCase() === 'oui') {
      await createAdminUser(email, password);
    } else {
      console.log('❌ Création annulée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    rl.close();
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  console.log('🔧 Script de création d\'administrateur\n');
  
  // Check for command line arguments
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    // Direct creation with arguments: node create-admin.js email@example.com password123
    const [email, password] = args;
    console.log(`📧 Création automatique pour: ${email}`);
    await createAdminUser(email, password);
  } else {
    // Interactive mode
    await createInteractiveAdmin();
  }
  
  await mongoose.connection.close();
  console.log('🔌 Connexion fermée');
};

main();
