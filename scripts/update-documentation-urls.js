#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const VERCEL_BASE_URL = 'https://binaa-hub-shafi-projs-projects.vercel.app';
const LOCAL_BASE_URL = 'http://localhost:3000';
const DOCS_FILE = './PLATFORM_PAGES_DOCUMENTATION.md';

function updateDocumentationUrls() {
    try {
        // Read the current documentation
        let content = fs.readFileSync(DOCS_FILE, 'utf8');
        
        console.log('🔄 Updating documentation URLs...');
        
        // Pattern to match existing single URL entries
        // Example: │   🔗 [localhost:3000/user/profile](http://localhost:3000/user/profile)
        const singleUrlPattern = /│(\s+)🔗 \[localhost:3000(\/[^\]]*)\]\(http:\/\/localhost:3000([^)]*)\)/g;
        
        // Replace with dual URL format
        content = content.replace(singleUrlPattern, (match, spaces, path1, path2) => {
            const urlPath = path1; // Use the first captured path
            return `│${spaces}🏠 [localhost:3000${urlPath}](${LOCAL_BASE_URL}${urlPath})\n│${spaces}🌐 [vercel${urlPath}](${VERCEL_BASE_URL}${urlPath})`;
        });
        
        // Also handle patterns without the tree structure (just indented)
        const simpleUrlPattern = /(\s+)🔗 \[localhost:3000(\/[^\]]*)\]\(http:\/\/localhost:3000([^)]*)\)/g;
        
        content = content.replace(simpleUrlPattern, (match, spaces, path1, path2) => {
            const urlPath = path1;
            return `${spaces}🏠 [localhost:3000${urlPath}](${LOCAL_BASE_URL}${urlPath})\n${spaces}🌐 [vercel${urlPath}](${VERCEL_BASE_URL}${urlPath})`;
        });
        
        // Write the updated content back to the file
        fs.writeFileSync(DOCS_FILE, content, 'utf8');
        
        console.log('✅ Documentation URLs updated successfully!');
        console.log(`🏠 Local development: ${LOCAL_BASE_URL}`);
        console.log(`🌐 Production (Vercel): ${VERCEL_BASE_URL}`);
        
        // Count the number of pages
        const pageMatches = content.match(/page\.tsx/g);
        const pageCount = pageMatches ? pageMatches.length : 0;
        console.log(`📄 Total pages documented: ${pageCount}`);
        
    } catch (error) {
        console.error('❌ Error updating documentation:', error.message);
        process.exit(1);
    }
}

// Add a section for quick access links at the top
function addQuickAccessSection() {
    try {
        let content = fs.readFileSync(DOCS_FILE, 'utf8');
        
        // Check if quick access section already exists
        if (content.includes('## 🚀 Quick Access - Most Used Pages')) {
            console.log('ℹ️ Quick access section already exists, skipping...');
            return;
        }
        
        const quickAccessSection = `
## 🚀 Quick Access - Most Used Pages

### 👤 User Pages
- **User Dashboard**: 🏠 [localhost](http://localhost:3000/user/dashboard) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/user/dashboard)
- **User Profile**: 🏠 [localhost](http://localhost:3000/user/profile) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/user/profile)
- **Projects**: 🏠 [localhost](http://localhost:3000/user/projects) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/user/projects)
- **Construction Calculator**: 🏠 [localhost](http://localhost:3000/user/comprehensive-construction-calculator) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/user/comprehensive-construction-calculator)
- **AI Hub**: 🏠 [localhost](http://localhost:3000/user/ai-hub) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/user/ai-hub)

### 🏪 Store Pages  
- **Store Dashboard**: 🏠 [localhost](http://localhost:3000/store/dashboard) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/store/dashboard)
- **POS System**: 🏠 [localhost](http://localhost:3000/store/pos) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/store/pos)
- **Products**: 🏠 [localhost](http://localhost:3000/store/construction-products) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/store/construction-products)
- **Orders**: 🏠 [localhost](http://localhost:3000/store/orders) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/store/orders)

### 🌍 Public Pages
- **Main Landing**: 🏠 [localhost](http://localhost:3000/) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/)
- **Public Marketplace**: 🏠 [localhost](http://localhost:3000/marketplace) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/marketplace)
- **Construction Data**: 🏠 [localhost](http://localhost:3000/construction-data) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/construction-data)

### 🔐 Authentication
- **Login**: 🏠 [localhost](http://localhost:3000/auth/login) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/auth/login)
- **Signup**: 🏠 [localhost](http://localhost:3000/auth/signup) | 🌐 [vercel](https://binaa-hub-shafi-projs-projects.vercel.app/auth/signup)

---
`;
        
        // Find where to insert the quick access section (after the overview section)
        const insertAfter = '### 🔗 URL Format';
        const insertIndex = content.indexOf(insertAfter);
        
        if (insertIndex !== -1) {
            const endOfSection = content.indexOf('\n', insertIndex + insertAfter.length);
            content = content.slice(0, endOfSection) + quickAccessSection + content.slice(endOfSection);
            
            fs.writeFileSync(DOCS_FILE, content, 'utf8');
            console.log('✅ Quick access section added successfully!');
        }
        
    } catch (error) {
        console.error('❌ Error adding quick access section:', error.message);
    }
}

// Main execution
console.log('🏗️ Binna Platform - Documentation URL Updater');
console.log('===============================================');

updateDocumentationUrls();
addQuickAccessSection();

console.log('\n🎉 Documentation update completed!');
console.log('📖 Check PLATFORM_PAGES_DOCUMENTATION.md for the updated URLs');
