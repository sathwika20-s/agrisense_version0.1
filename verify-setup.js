// Quick verification script to check if everything is set up correctly
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Smart Agriculture Project Setup...\n');

let allGood = true;

// Check backend files
console.log('📦 Checking Backend...');
const backendFiles = [
  'backend/server.js',
  'backend/package.json',
  'backend/.env',
  'backend/routes/climate.js',
  'backend/routes/crops.js',
  'backend/routes/disease.js',
  'backend/routes/chatbot.js',
  'backend/data/crops_database.json',
  'backend/data/diseases_database.json',
  'backend/data/climatezone_datbase.json'
];

backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check frontend files
console.log('\n🎨 Checking Frontend...');
const frontendFiles = [
  'Frontend/package.json',
  'Frontend/src/App.jsx',
  'Frontend/src/main.jsx',
  'Frontend/src/services/api.js',
  'Frontend/src/pages/Dashboard.jsx',
  'Frontend/src/pages/ClimateInsights.jsx',
  'Frontend/src/pages/CropAdvisor.jsx',
  'Frontend/src/pages/DiseaseScanner.jsx',
  'Frontend/src/pages/SmartChat.jsx'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check uploads directory
console.log('\n📁 Checking Directories...');
if (fs.existsSync('backend/uploads')) {
  console.log('  ✅ backend/uploads/');
} else {
  console.log('  ⚠️  backend/uploads/ - Will be created automatically');
}

// Check .env configuration
console.log('\n⚙️  Checking Configuration...');
try {
  const envContent = fs.readFileSync('backend/.env', 'utf8');
  if (envContent.includes('PORT=')) {
    console.log('  ✅ PORT configured');
  }
  if (envContent.includes('MONGO_URI=')) {
    console.log('  ✅ MONGO_URI configured');
  }
  if (envContent.includes('ANTHROPIC_API_KEY=')) {
    console.log('  ✅ ANTHROPIC_API_KEY configured');
  } else {
    console.log('  ⚠️  ANTHROPIC_API_KEY not set (chatbot will use fallback)');
  }
} catch (e) {
  console.log('  ❌ backend/.env file not found');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ Setup verification complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Make sure MongoDB is running');
  console.log('  2. Run: cd backend && npm install && npm start');
  console.log('  3. Run: cd Frontend && npm install && npm run dev');
  console.log('  4. Or use the batch files: start-all.bat');
} else {
  console.log('❌ Some files are missing. Please check the errors above.');
}
console.log('='.repeat(50));
