// Simple data seeding script using SQL
const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// Generate UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

async function seedData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database for seeding...');

    // Check if products already exist
    const existingCheck = await client.query('SELECT COUNT(*) FROM product');
    const count = parseInt(existingCheck.rows[0].count);
    
    if (count > 0) {
      console.log(`Found ${count} existing products. Skipping seeding.`);
      return;
    }

    console.log('No existing products found. Creating sample data...');

    // First, ensure USD currency exists
    const currencyCheck = await client.query('SELECT code FROM currency WHERE code = $1', ['USD']);
    if (currencyCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO currency (code, symbol, symbol_native, name)
        VALUES ($1, $2, $3, $4)
      `, ['USD', '$', '$', 'US Dollar']);
      console.log('✓ Created USD currency');
    } else {
      console.log('✓ USD currency already exists');
    }

    // Sample product data
    const products = [
      {
        title: 'Construction Helmet',
        description: 'High-quality safety helmet for construction workers',
        handle: 'construction-helmet',
        variants: [
          { title: 'Red Construction Helmet', sku: 'HELMET-RED', price: 2999 },
          { title: 'Yellow Construction Helmet', sku: 'HELMET-YELLOW', price: 2999 },
          { title: 'White Construction Helmet', sku: 'HELMET-WHITE', price: 2999 }
        ]
      },
      {
        title: 'Safety Vest',
        description: 'High-visibility safety vest for construction sites',
        handle: 'safety-vest',
        variants: [
          { title: 'Small Safety Vest', sku: 'VEST-S', price: 1999 },
          { title: 'Medium Safety Vest', sku: 'VEST-M', price: 1999 },
          { title: 'Large Safety Vest', sku: 'VEST-L', price: 1999 },
          { title: 'XL Safety Vest', sku: 'VEST-XL', price: 2199 }
        ]
      },
      {
        title: 'Steel Toe Boots',
        description: 'Durable steel toe boots for construction work',
        handle: 'steel-toe-boots',
        variants: [
          { title: 'Size 8 Steel Toe Boots', sku: 'BOOTS-8', price: 8999 },
          { title: 'Size 9 Steel Toe Boots', sku: 'BOOTS-9', price: 8999 },
          { title: 'Size 10 Steel Toe Boots', sku: 'BOOTS-10', price: 8999 },
          { title: 'Size 11 Steel Toe Boots', sku: 'BOOTS-11', price: 8999 }
        ]
      }
    ];    // Create products and variants
    for (const productData of products) {
      const productId = generateUUID();
      
      // Insert product
      await client.query(`
        INSERT INTO product (
          id, title, subtitle, description, handle, status, 
          is_giftcard, discountable, weight, length, height, width,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      `, [
        productId,
        productData.title,
        null, // subtitle
        productData.description,
        productData.handle,
        'published',
        false, // is_giftcard
        true, // discountable
        0, 0, 0, 0 // dimensions
      ]);

      console.log(`✓ Created product: ${productData.title} (ID: ${productId})`);

      // Insert product variants
      for (let i = 0; i < productData.variants.length; i++) {
        const variantData = productData.variants[i];
        const variantId = generateUUID();
        
        await client.query(`
          INSERT INTO product_variant (
            id, title, product_id, sku, barcode, ean, upc,
            inventory_quantity, allow_backorder, manage_inventory,
            variant_rank, weight, length, height, width,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        `, [
          variantId,
          variantData.title,
          productId,
          variantData.sku,
          null, null, null, // barcode, ean, upc
          100, // inventory_quantity
          false, // allow_backorder
          true, // manage_inventory
          i, // variant_rank
          0, 0, 0, 0 // dimensions
        ]);

        console.log(`  ✓ Created variant: ${variantData.title} (SKU: ${variantData.sku})`);        // Insert money amount (price)
        const moneyAmountId = generateUUID();
        await client.query(`
          INSERT INTO money_amount (
            id, currency_code, amount, created_at, updated_at
          ) VALUES ($1, $2, $3, NOW(), NOW())
        `, [moneyAmountId, 'USD', variantData.price]);

        // Link the money amount to the variant
        const junctionId = generateUUID();
        await client.query(`
          INSERT INTO product_variant_money_amount (
            id, money_amount_id, variant_id, created_at, updated_at
          ) VALUES ($1, $2, $3, NOW(), NOW())
        `, [junctionId, moneyAmountId, variantId]);

        console.log(`    ✓ Set price: $${(variantData.price / 100).toFixed(2)} USD`);
      }
    }

    console.log('\n🎉 Sample data seeded successfully!');
    console.log('You can now test the API endpoints:');
    console.log('- GET http://localhost:9000/store/products');
    console.log('- GET http://localhost:9000/health');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedData().catch(console.error);
}

module.exports = { seedData };
