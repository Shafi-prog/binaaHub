const fs = require('fs');
const path = require('path');

// Deep redundancy analysis patterns
const functionalRedundancy = {
  // Create/New/Add patterns
  createPatterns: [
    /\/(create|new|add)\//gi,
    /\/page\.tsx$/,
    /create.*page\.tsx$/i,
    /new.*page\.tsx$/i,
    /add.*page\.tsx$/i
  ],

  // List/Index/View patterns  
  listPatterns: [
    /\/(list|index|view)\//gi,
    /\/page\.tsx$/,
    /list.*page\.tsx$/i,
    /index.*page\.tsx$/i
  ],

  // Edit/Update/Modify patterns
  editPatterns: [
    /\/(edit|update|modify)\//gi,
    /edit.*page\.tsx$/i,
    /update.*page\.tsx$/i,
    /modify.*page\.tsx$/i
  ],

  // Plural/Singular patterns
  pluralSingular: [
    { pattern: /products?/gi, variations: ['product', 'products'] },
    { pattern: /orders?/gi, variations: ['order', 'orders'] },
    { pattern: /users?/gi, variations: ['user', 'users'] },
    { pattern: /stores?/gi, variations: ['store', 'stores'] },
    { pattern: /categories?/gi, variations: ['category', 'categories'] },
    { pattern: /services?/gi, variations: ['service', 'services'] },
    { pattern: /projects?/gi, variations: ['project', 'projects'] },
    { pattern: /invoices?/gi, variations: ['invoice', 'invoices'] },
    { pattern: /warranties?/gi, variations: ['warranty', 'warranties'] },
    { pattern: /notifications?/gi, variations: ['notification', 'notifications'] }
  ]
};

function deepRedundancySearch() {
  console.log('🔍 Deep Redundancy Analysis Starting...\n');
  
  const allFiles = [];
  const redundantGroups = {};
  const caseInconsistencies = [];
  const functionalDuplicates = [];

  // Collect all files
  collectAllFiles(path.join(__dirname, 'src'), allFiles);
  
  console.log(`📊 Analyzing ${allFiles.length} files for redundancy...\n`);
  
  // 1. Analyze functional redundancy
  analyzeFunctionalRedundancy(allFiles, functionalDuplicates);
  
  // 2. Check case inconsistencies
  analyzeCaseInconsistencies(allFiles, caseInconsistencies);
  
  // 3. Find plural/singular inconsistencies
  analyzePluralSingularInconsistencies(allFiles, redundantGroups);
  
  // 4. Find similar functionality with different names
  analyzeSimilarFunctionality(allFiles, functionalDuplicates);
  
  // Generate reports
  generateRedundancyReport(functionalDuplicates, caseInconsistencies, redundantGroups);
}

function collectAllFiles(dirPath, fileList, relativePath = '') {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // Skip node_modules and .git
        if (!['node_modules', '.git', '.next', 'dist'].includes(item)) {
          collectAllFiles(fullPath, fileList, itemRelativePath);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js')) {
        fileList.push({
          fullPath,
          relativePath: itemRelativePath,
          name: item,
          directory: relativePath,
          size: fs.statSync(fullPath).size
        });
      }
    });
  } catch (error) {
    // Skip directories we can't read
  }
}

function analyzeFunctionalRedundancy(files, functionalDuplicates) {
  console.log('🔧 Analyzing functional redundancy (create/new/add patterns)...\n');
  
  const functionalGroups = {
    create: [],
    list: [],
    edit: [],
    dashboard: [],
    profile: []
  };

  files.forEach(file => {
    const pathLower = file.relativePath.toLowerCase();
    
    // Group by functionality
    if (pathLower.includes('/create/') || pathLower.includes('/new/') || pathLower.includes('/add/')) {
      functionalGroups.create.push(file);
    }
    if (pathLower.includes('/list/') || pathLower.includes('/index/') || pathLower.match(/\/page\.tsx$/) && !pathLower.includes('/create/') && !pathLower.includes('/edit/')) {
      functionalGroups.list.push(file);
    }
    if (pathLower.includes('/edit/') || pathLower.includes('/update/') || pathLower.includes('/modify/')) {
      functionalGroups.edit.push(file);
    }
    if (pathLower.includes('/dashboard/')) {
      functionalGroups.dashboard.push(file);
    }
    if (pathLower.includes('/profile/')) {
      functionalGroups.profile.push(file);
    }
  });

  // Check for potential duplicates within each group
  Object.entries(functionalGroups).forEach(([type, groupFiles]) => {
    if (groupFiles.length > 0) {
      console.log(`📁 ${type.toUpperCase()} functionality found in ${groupFiles.length} locations:`);
      
      const duplicatePatterns = {};
      groupFiles.forEach(file => {
        const basePath = file.directory.split('/').slice(0, -1).join('/');
        if (!duplicatePatterns[basePath]) duplicatePatterns[basePath] = [];
        duplicatePatterns[basePath].push(file);
      });
      
      Object.entries(duplicatePatterns).forEach(([basePath, files]) => {
        if (files.length > 1) {
          console.log(`   ⚠️  Multiple ${type} pages in ${basePath}:`);
          files.forEach(file => {
            console.log(`      - ${file.relativePath} (${(file.size / 1024).toFixed(2)} KB)`);
          });
          functionalDuplicates.push({ type, basePath, files });
        } else {
          console.log(`   ✅ ${files[0].relativePath}`);
        }
      });
      console.log('');
    }
  });
}

function analyzeCaseInconsistencies(files, caseInconsistencies) {
  console.log('🔤 Analyzing case inconsistencies...\n');
  
  const pathGroups = {};
  
  files.forEach(file => {
    const pathLower = file.relativePath.toLowerCase();
    if (!pathGroups[pathLower]) pathGroups[pathLower] = [];
    pathGroups[pathLower].push(file);
  });
  
  Object.entries(pathGroups).forEach(([lowercasePath, files]) => {
    if (files.length > 1) {
      console.log(`⚠️ Case inconsistency found:`);
      files.forEach(file => {
        console.log(`   - ${file.relativePath}`);
      });
      caseInconsistencies.push({ lowercasePath, files });
      console.log('');
    }
  });
  
  if (caseInconsistencies.length === 0) {
    console.log('✅ No case inconsistencies found\n');
  }
}

function analyzePluralSingularInconsistencies(files, redundantGroups) {
  console.log('📝 Analyzing plural/singular inconsistencies...\n');
  
  functionalRedundancy.pluralSingular.forEach(({ pattern, variations }) => {
    const matches = files.filter(file => pattern.test(file.relativePath));
    
    if (matches.length > 0) {
      const groups = {};
      matches.forEach(file => {
        variations.forEach(variant => {
          if (file.relativePath.toLowerCase().includes(variant.toLowerCase())) {
            if (!groups[variant]) groups[variant] = [];
            groups[variant].push(file);
          }
        });
      });
      
      const variantsFound = Object.keys(groups);
      if (variantsFound.length > 1) {
        console.log(`⚠️ Plural/Singular inconsistency - ${variations.join('/')}:`);
        Object.entries(groups).forEach(([variant, files]) => {
          console.log(`   ${variant.toUpperCase()}:`);
          files.forEach(file => {
            console.log(`   - ${file.relativePath}`);
          });
        });
        redundantGroups[variations.join('/')] = groups;
        console.log('');
      }
    }
  });
}

function analyzeSimilarFunctionality(files, functionalDuplicates) {
  console.log('🎯 Analyzing similar functionality with different names...\n');
  
  // Group files by their parent directory and functionality
  const functionalityMap = {};
  
  files.forEach(file => {
    const parts = file.directory.split('/');
    const content = fs.readFileSync(file.fullPath, 'utf8').toLowerCase();
    
    // Detect functionality based on content patterns
    const functionality = {
      hasForm: /form|input|submit|validation/.test(content),
      hasList: /map\(|foreach|\.length|table|grid/.test(content),
      hasCreate: /create|add|insert|post/.test(content),
      hasEdit: /edit|update|modify|put|patch/.test(content),
      hasDelete: /delete|remove|destroy/.test(content),
      hasDashboard: /dashboard|overview|summary|stats/.test(content),
      hasAuth: /login|signup|auth|password/.test(content),
      hasNavigation: /link|href|router|redirect/.test(content)
    };
    
    const funcKey = Object.entries(functionality)
      .filter(([key, value]) => value)
      .map(([key]) => key)
      .join(',');
    
    if (funcKey) {
      if (!functionalityMap[funcKey]) functionalityMap[funcKey] = [];
      functionalityMap[funcKey].push({ ...file, functionality });
    }
  });
  
  // Find potential duplicates
  Object.entries(functionalityMap).forEach(([funcSignature, files]) => {
    if (files.length > 1) {
      // Group by similar directory structure
      const directoryGroups = {};
      files.forEach(file => {
        const mainDir = file.directory.split('/')[0] || 'root';
        if (!directoryGroups[mainDir]) directoryGroups[mainDir] = [];
        directoryGroups[mainDir].push(file);
      });
      
      Object.entries(directoryGroups).forEach(([dir, dirFiles]) => {
        if (dirFiles.length > 1) {
          console.log(`⚠️ Similar functionality in /${dir}/:`);
          console.log(`   Functionality: ${funcSignature.replace(/has/g, '').replace(/,/g, ', ')}`);
          dirFiles.forEach(file => {
            console.log(`   - ${file.relativePath} (${(file.size / 1024).toFixed(2)} KB)`);
          });
          console.log('');
        }
      });
    }
  });
}

function generateRedundancyReport(functionalDuplicates, caseInconsistencies, redundantGroups) {
  console.log('\n📋 REDUNDANCY ANALYSIS SUMMARY\n');
  
  let totalIssues = 0;
  let potentialSavings = 0;
  
  // Functional duplicates
  if (functionalDuplicates.length > 0) {
    console.log(`⚠️ Functional Duplicates Found: ${functionalDuplicates.length}`);
    functionalDuplicates.forEach(duplicate => {
      console.log(`   ${duplicate.type} in ${duplicate.basePath}: ${duplicate.files.length} files`);
      duplicate.files.forEach(file => {
        potentialSavings += file.size;
      });
    });
    totalIssues += functionalDuplicates.length;
    console.log('');
  }
  
  // Case inconsistencies
  if (caseInconsistencies.length > 0) {
    console.log(`⚠️ Case Inconsistencies Found: ${caseInconsistencies.length}`);
    totalIssues += caseInconsistencies.length;
    console.log('');
  }
  
  // Plural/Singular issues
  const pluralIssues = Object.keys(redundantGroups).length;
  if (pluralIssues > 0) {
    console.log(`⚠️ Plural/Singular Inconsistencies: ${pluralIssues}`);
    totalIssues += pluralIssues;
    console.log('');
  }
  
  // Summary
  console.log('📊 FINAL SUMMARY:');
  console.log(`   Total Issues: ${totalIssues}`);
  console.log(`   Potential Space Savings: ${(potentialSavings / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 NO DEEP REDUNDANCY FOUND!');
    console.log('✅ Your codebase has clean naming conventions');
    console.log('✅ No functional duplicates detected');
    console.log('✅ Consistent case usage');
    console.log('✅ No plural/singular conflicts');
  } else {
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('1. Consolidate functional duplicates');
    console.log('2. Standardize case conventions (prefer lowercase)');
    console.log('3. Choose consistent plural/singular naming');
    console.log('4. Review similar functionality for potential merging');
  }
}

// Run the analysis
deepRedundancySearch();
