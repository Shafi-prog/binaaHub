const fs = require('fs');
const path = require('path');

// List of files and the exports they need to add
const exportsToAdd = [
  // Construction ecosystem manager
  {
    file: 'src/core/shared/services/construction/construction-ecosystem-manager.ts',
    exports: ['ConstructionEcosystemManager']
  },
  // GCC market manager
  {
    file: 'src/core/shared/services/markets/gcc-market-manager.ts',
    exports: ['GCCMarketManager']
  },
  // Temp auth
  {
    file: 'src/core/shared/services/temp-auth.ts',
    exports: ['verifyTempAuth', 'clearTempAuth']
  },
  // Notifications
  {
    file: 'src/core/shared/services/notifications.ts',
    exports: ['NotificationService']
  },
  // Medusa integration
  {
    file: 'src/core/shared/services/medusa-integration.ts',
    exports: ['syncUserWithMedusa']
  },
  // Supervisor service
  {
    file: 'src/core/shared/services/supervisor-service.ts',
    exports: ['SupervisorService']
  },
  // ERP MongoDB service
  {
    file: 'src/core/shared/services/erp/mongodb-service.ts',
    exports: ['initERPService', 'generateId', 'generateOrderNumber', 'generateInvoiceNumber', 'calculateTotal']
  },
  // Excel import service
  {
    file: 'src/core/shared/services/excel-import.ts',
    exports: ['ExcelImportService']
  },
  // Common skeleton
  {
    file: 'src/shared/components/common/skeleton.tsx',
    exports: ['TwoColumnPageSkeleton']
  }
];

// Component files that need default exports
const defaultExportsToAdd = [
  'components/payments/PaymentGatewayIntegration.tsx',
  'components/shipping/ShippingLogisticsIntegration.tsx'
];

function addExportsToFile(filePath, exports) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if exports already exist
    const existingExports = [];
    exports.forEach(exportName => {
      if (content.includes(`export { ${exportName}`) || 
          content.includes(`export const ${exportName}`) ||
          content.includes(`export class ${exportName}`) ||
          content.includes(`export function ${exportName}`)) {
        existingExports.push(exportName);
      }
    });

    const missingExports = exports.filter(exp => !existingExports.includes(exp));
    
    if (missingExports.length === 0) {
      console.log(`All exports already exist in ${filePath}`);
      return;
    }

    // Add exports at the end of the file
    const exportStatements = missingExports.map(exp => `export { ${exp} };`).join('\n');
    content += '\n\n' + exportStatements + '\n';

    fs.writeFileSync(filePath, content);
    console.log(`Added exports to ${filePath}: ${missingExports.join(', ')}`);

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function addDefaultExport(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if default export already exists
    if (content.includes('export default')) {
      console.log(`Default export already exists in ${filePath}`);
      return;
    }

    // Get the component name from the file path
    const fileName = path.basename(filePath, '.tsx');
    
    // Add default export at the end
    content += `\n\nexport default ${fileName};\n`;

    fs.writeFileSync(filePath, content);
    console.log(`Added default export to ${filePath}`);

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Add named exports
exportsToAdd.forEach(({ file, exports }) => {
  addExportsToFile(file, exports);
});

// Add default exports
defaultExportsToAdd.forEach(filePath => {
  addDefaultExport(filePath);
});

console.log('Export fixing completed!');
