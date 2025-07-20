#!/usr/bin/env node
/**
 * Auto-generated Store Pages Fix Script
 * Generated on: 2025-07-19T23:53:47.775Z
 */

const fs = require('fs');

console.log('🔧 Applying store page fixes...');

// Function to apply fixes
function applyFixes() {

  // Fix English text: English text found: placeholder="Example: Cement & Building Materials"
  try {
    const filePath = 'src\app\store\categories\construction\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Example/g, 'placeholder=Example: Cement & Building Materials');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Example: Resistant Cement"
  try {
    const filePath = 'src\app\store\construction-products\new\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Example/g, 'placeholder=Example: Resistant Cement');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="SBC-XXX-XXXX"
  try {
    const filePath = 'src\app\store\construction-products\new\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="SBC-XXX-XXXX"/g, 'placeholder=SBC-XXX-XXXX');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="628XXXXXXXXXX (باركود سعودي)"
  try {
    const filePath = 'src\app\store\construction-products\new\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="628XXXXXXXXXX (باركود سعودي)"/g, 'placeholder=628XXXXXXXXXX (باركود سعودي)');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="USD"
  try {
    const filePath = 'src\app\store\currency-region\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="USD"/g, 'placeholder=USD');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="US Dollar"
  try {
    const filePath = 'src\app\store\currency-region\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="US Dollar"/g, 'placeholder=US Dollar');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="North America"
  try {
    const filePath = 'src\app\store\currency-region\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="North America"/g, 'placeholder=North America');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search segments..."
  try {
    const filePath = 'src\app\store\customer-segmentation\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search segments..."/g, 'placeholder=Search segments...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search campaigns..."
  try {
    const filePath = 'src\app\store\email-campaigns\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search campaigns..."/g, 'placeholder=Search campaigns...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search invoices..."
  try {
    const filePath = 'src\app\store\financial-management\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search invoices..."/g, 'placeholder=Search invoices...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search products..."
  try {
    const filePath = 'src\app\store\marketplace\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search products..."/g, 'placeholder=Search products...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search vendors..."
  try {
    const filePath = 'src\app\store\marketplace-vendors\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search vendors..."/g, 'placeholder=Search vendors...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Filter by status"
  try {
    const filePath = 'src\app\store\marketplace-vendors\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Filter by status"/g, 'placeholder=Filter by status');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Enter price list name"
  try {
    const filePath = 'src\app\store\pricing\create\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Enter price list name"/g, 'placeholder=Enter price list name');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search price lists..."
  try {
    const filePath = 'src\app\store\pricing\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search price lists..."/g, 'placeholder=Search price lists...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search bundles..."
  try {
    const filePath = 'src\app\store\product-bundles\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search bundles..."/g, 'placeholder=Search bundles...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search promotions..."
  try {
    const filePath = 'src\app\store\promotions\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search promotions..."/g, 'placeholder=Search promotions...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search products..."
  try {
    const filePath = 'src\app\store\storefront\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search products..."/g, 'placeholder=Search products...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

  // Fix English text: English text found: placeholder="Search warehouses..."
  try {
    const filePath = 'src\app\store\warehouses\page.tsx';
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/placeholder="Search warehouses..."/g, 'placeholder=Search warehouses...');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed English text in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }

}

applyFixes();
console.log('✅ Fix script completed!');
