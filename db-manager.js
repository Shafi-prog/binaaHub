#!/usr/bin/env node

/**
 * Database Management Script for Binna Project
 * Helps manage database schema and migrations without Docker
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Check current database schema
 */
async function checkSchema() {
  console.log('🔍 Checking current database schema...\n');
  
  try {
    // Get projects table schema
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'projects')
      .order('ordinal_position');

    if (error) {
      throw error;
    }

    console.log('📋 Current projects table schema:');
    console.log('================================');
    
    data.forEach(column => {
      console.log(`${column.column_name.padEnd(25)} | ${column.data_type.padEnd(15)} | ${column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check for required columns
    const requiredColumns = ['name', 'description', 'project_type', 'status', 'address', 'budget', 'end_date', 'currency'];
    const existingColumns = data.map(col => col.column_name);
    
    console.log('\n🔍 Required column check:');
    console.log('========================');
    
    requiredColumns.forEach(col => {
      const exists = existingColumns.includes(col);
      console.log(`${col.padEnd(20)} | ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });

    return existingColumns;

  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
    return null;
  }
}

/**
 * Apply a migration file
 */
async function applyMigration(migrationFile) {
  console.log(`\n🚀 Applying migration: ${migrationFile}`);
  
  try {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      throw error;
    }

    console.log('✅ Migration applied successfully');
    return true;

  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    return false;
  }
}

/**
 * Create a custom SQL function to execute arbitrary SQL
 */
async function createExecSQLFunction() {
  const functionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
      RETURN 'success';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN SQLERRM;
    END;
    $$;
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: functionSQL });
    if (error && !error.message.includes('already exists')) {
      throw error;
    }
    return true;
  } catch (error) {
    // Try direct execution
    try {
      await supabase.from('').select().limit(0); // This will fail but establish connection
      console.log('⚠️  Could not create exec_sql function. Using alternative method.');
      return false;
    } catch (e) {
      console.error('❌ Database connection failed:', e.message);
      return false;
    }
  }
}

/**
 * Test database connection and basic operations
 */
async function testDatabase() {
  console.log('🧪 Testing database connection and operations...\n');
  
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      throw testError;
    }

    console.log('✅ Database connection successful');
    console.log(`📊 Total projects: ${testData}`);

    // Test schema
    const schema = await checkSchema();
    
    if (schema) {
      console.log('\n✅ Schema check completed');
      return true;
    }

    return false;

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

/**
 * Fix schema issues automatically
 */
async function fixSchema() {
  console.log('🔧 Attempting to fix schema issues...\n');
  
  try {
    // Check if migration exists
    const migrationFile = '00008_fix_schema_mismatches.sql';
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`);
      return false;
    }

    // Apply the schema fix migration
    const success = await applyMigration(migrationFile);
    
    if (success) {
      console.log('✅ Schema fix completed successfully');
      
      // Verify the fix
      await checkSchema();
      return true;
    }

    return false;

  } catch (error) {
    console.error('❌ Error fixing schema:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🏗️  Binna Database Management Tool');
  console.log('==================================\n');

  const command = process.argv[2];

  switch (command) {
    case 'check':
      await testDatabase();
      break;
      
    case 'schema':
      await checkSchema();
      break;
      
    case 'fix':
      await fixSchema();
      break;
      
    case 'migrate':
      const migrationFile = process.argv[3];
      if (!migrationFile) {
        console.error('❌ Please specify a migration file');
        console.log('Usage: node db-manager.js migrate <migration-file>');
        break;
      }
      await applyMigration(migrationFile);
      break;
      
    default:
      console.log('Available commands:');
      console.log('  check    - Test database connection and operations');
      console.log('  schema   - Check current database schema');
      console.log('  fix      - Fix schema mismatches automatically');
      console.log('  migrate  - Apply a specific migration file');
      console.log('\nExamples:');
      console.log('  node db-manager.js check');
      console.log('  node db-manager.js schema');
      console.log('  node db-manager.js fix');
      console.log('  node db-manager.js migrate 00008_fix_schema_mismatches.sql');
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  checkSchema,
  applyMigration,
  testDatabase,
  fixSchema
};
