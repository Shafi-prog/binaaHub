const fs = require('fs');
const path = require('path');

const allowedEnvFiles = [
  '.env.example',
  '.env.local',
  '.env.production',
  '.env.ecommerce'
];

const allowedRouteGroups = [
  '(auth)', '(public)', '(finance)', '(ai)', '(services)'
];

function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    callback(fullPath, dirent);
    if (dirent.isDirectory()) walk(fullPath, callback);
  });
}

function isComponentFile(name) {
  // React component: PascalCase and .tsx or .jsx
  return /^[A-Z][A-Za-z0-9]*\.(tsx|jsx)$/.test(name);
}

function isAllowedRouteGroup(name) {
  return allowedRouteGroups.includes(name);
}

function validate() {
  const violations = [];
  walk('.', (fullPath, dirent) => {
    const relPath = path.relative('.', fullPath);

    // Skip node_modules and .git
    if (relPath.startsWith('node_modules') || relPath.startsWith('.git')) return;

    // 1. Parentheses
    if (dirent.isDirectory() && /\(.*\)/.test(dirent.name) && !isAllowedRouteGroup(dirent.name)) {
      violations.push(`[Parentheses] Invalid route group: ${relPath}`);
    }

    // 2. "medusa" in name
    if (/medusa/i.test(dirent.name)) {
      violations.push(`[Medusa] Found "medusa" in: ${relPath}`);
    }

    // 3. Capitalization (non-component)
    if (/[A-Z]/.test(dirent.name) && !isComponentFile(dirent.name)) {
      // Allow .md files and backup docs
      if (!/\.md$/i.test(dirent.name) && !/backup/i.test(relPath)) {
        violations.push(`[Capitalization] Uppercase in: ${relPath}`);
      }
    }

    // 4. Pluralization (simple heuristic)
    if (dirent.isDirectory()) {
      // Collections should be plural, concepts singular
      if (
        /(products|orders|categories|users|projects|warranties|commissions|forms|contexts|promos|carts)$/i.test(dirent.name) &&
        !dirent.name.endsWith('s')
      ) {
        violations.push(`[Pluralization] Collection not plural: ${relPath}`);
      }
      if (
        /(dashboard|profile|admin|layout)$/i.test(dirent.name) &&
        dirent.name.endsWith('s')
      ) {
        violations.push(`[Pluralization] Concept should be singular: ${relPath}`);
      }
    }

    // 5. Hyphenation (multi-word, not kebab-case)
    if (/\w[A-Z]\w/.test(dirent.name)) {
      violations.push(`[Hyphenation] Not kebab-case: ${relPath}`);
    }

    // 6. .env files
    if (
      dirent.isFile() &&
      dirent.name.startsWith('.env') &&
      !allowedEnvFiles.includes(dirent.name)
    ) {
      violations.push(`[ENV] Unexpected .env file: ${relPath}`);
    }
  });

  if (violations.length === 0) {
    console.log('✅ All naming conventions are valid!');
  } else {
    console.log('❌ Naming convention violations found:');
    violations.forEach(v => console.log(' -', v));
    process.exit(1);
  }
}

validate();
