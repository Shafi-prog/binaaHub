// Quick fix for wrong AuthProvider import paths
const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes("@/core/shared/contexts/AuthProvider")) {
      content = content.replace(
        /@\/core\/shared\/contexts\/AuthProvider/g,
        "@/core/shared/auth/AuthProvider"
      );
      
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed import path in: ${file}`);
    }
  } catch (error) {
    // Skip files that can't be read
  }
});

console.log('✅ Import path fix completed!');
