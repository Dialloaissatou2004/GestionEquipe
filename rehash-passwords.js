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
  nom: String,
  poste: String,
  role: String,
  photo: String
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

const rehashPasswords = async () => {
  try {
    console.log('🔄 Début du processus de re-hachage des mots de passe...');
    
    // Get all users
    const users = await User.find({}).select('+motDePasse');
    console.log(`📊 ${users.length} utilisateurs trouvés`);
    
    for (const user of users) {
      console.log(`🔄 Traitement de l'utilisateur: ${user.email}`);
      
      // Check if password is already bcryptjs format (starts with $2a$ or $2b$)
      if (user.motDePasse.startsWith('$2a$') || user.motDePasse.startsWith('$2b$')) {
        console.log(`✅ ${user.email} - Mot de passe déjà au bon format`);
        continue;
      }
      
      // If it's old bcrypt format ($2b$ with different structure), we need to prompt for new password
      console.log(`⚠️  ${user.email} - Mot de passe au format bcrypt détecté`);
      console.log(`   Pour cet utilisateur, vous devrez utiliser la fonction "Mot de passe oublié"`);
      console.log(`   ou réinitialiser manuellement le mot de passe.`);
    }
    
    console.log('✅ Processus terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du re-hachage:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Helper function to create a new user with bcryptjs (for testing)
const createTestUser = async () => {
  try {
    const testEmail = 'test@example.com';
    const testPassword = 'test123';
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      await User.deleteOne({ email: testEmail });
      console.log('🗑️  Ancien utilisateur test supprimé');
    }
    
    // Hash password with bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(testPassword, salt);
    
    // Create new test user
    const testUser = new User({
      email: testEmail,
      motDePasse: hashedPassword,
      nom: 'Test User',
      poste: 'Testeur',
      role: 'membre'
    });
    
    await testUser.save();
    console.log('✅ Utilisateur test créé avec bcryptjs');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Mot de passe: ${testPassword}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur test:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--create-test')) {
    await createTestUser();
  } else {
    await rehashPasswords();
  }
};

main();
