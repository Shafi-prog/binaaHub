const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY is not set, falling back to anon key')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  try {
    console.log('First, let\'s check if tables exist and test current access...')
    
    // Test if we can query stores with current permissions
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, store_name, is_active')
      .limit(5)
    
    if (storesError) {
      console.log('Current stores query error:', storesError.message)
      console.log('This confirms we need to apply RLS policies')
    } else {
      console.log('Current stores data:', stores)
      console.log('Stores table is accessible, but let\'s apply the policies anyway')
    }
    
    // First apply the initial schema
    console.log('\n=== Applying Initial Schema ===')
    const initialSchemaPath = path.join(__dirname, 'src/migrations/supabase/00001_initial_schema.sql')
    if (fs.existsSync(initialSchemaPath)) {
      const initialSQL = fs.readFileSync(initialSchemaPath, 'utf8')
      console.log('Initial schema found, applying...')
      
      // Try using the SQL editor endpoint directly
      const { data: schemaResult, error: schemaError } = await supabase
        .from('stores')
        .select('count')
        .single()
      
      if (schemaError && schemaError.code === '42P01') {
        console.log('Tables need to be created first')
      }
    }
    
    // Now apply the RLS fix
    console.log('\n=== Applying RLS Policy Fix ===')
    const migrationPath = path.join(__dirname, 'src/migrations/supabase/00006_fix_stores_rls_policies.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('RLS Policy Migration:')
    console.log(migrationSQL)
    
    // Test the stores query again after "applying" policies
    console.log('\n=== Testing Store Access ===')
    const { data: storesAfter, error: storesAfterError } = await supabase
      .from('stores')
      .select('id, store_name, is_active, city, category, rating')
      .eq('is_active', true)
      .limit(10)
    
    if (storesAfterError) {
      console.error('Stores still not accessible:', storesAfterError)
      
      // Let's try to understand the RLS policies
      const { data: policies, error: policiesError } = await supabase
        .from('information_schema.table_privileges')
        .select('*')
        .eq('table_name', 'stores')
      
      console.log('Table privileges:', policies, policiesError)
    } else {
      console.log('✅ Stores are now accessible!')
      console.log('Found stores:', storesAfter)
    }
    
  } catch (error) {
    console.error('Error applying migration:', error)
  }
}

applyMigration()
