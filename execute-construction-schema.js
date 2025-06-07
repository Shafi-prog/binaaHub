const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ogblgvqmmyzvzyjpnnec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYmxndnFtbXl6dnp5anBubmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MDUwNzksImV4cCI6MjA0OTA4MTA3OX0.8-MYQ3h5rVpepdfqaOPHRiCQxEqLcCAOPNMoHRSE1lE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeConstructionSchema() {
  try {
    console.log('Creating construction tables manually...');
    
    // First, create construction_categories table
    console.log('\n=== Creating construction_categories table ===');
    const { error: catTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS construction_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          name_ar VARCHAR(100) NOT NULL,
          color VARCHAR(7) DEFAULT '#3B82F6',
          description TEXT,
          description_ar TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (catTableError) {
      console.error('❌ Error creating construction_categories:', catTableError);
    } else {
      console.log('✅ construction_categories table created');
    }
    
    // Insert default categories
    console.log('\n=== Inserting default categories ===');
    const defaultCategories = [
      { name: 'Foundation', name_ar: 'الأساسات', color: '#8B5CF6' },
      { name: 'Structure', name_ar: 'الهيكل الإنشائي', color: '#EF4444' },
      { name: 'Masonry', name_ar: 'أعمال البناء', color: '#F59E0B' },
      { name: 'Electrical', name_ar: 'الأعمال الكهربائية', color: '#10B981' },
      { name: 'Plumbing', name_ar: 'السباكة', color: '#3B82F6' },
      { name: 'Flooring', name_ar: 'الأرضيات', color: '#6B7280' },
      { name: 'Painting', name_ar: 'الدهانات', color: '#EC4899' },
      { name: 'Finishing', name_ar: 'التشطيبات', color: '#14B8A6' }
    ];
    
    for (const category of defaultCategories) {
      const { error } = await supabase
        .from('construction_categories')
        .insert(category);
      
      if (error) {
        console.log(`Warning: Could not insert category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Inserted category: ${category.name}`);
      }
    }
    
    // Create construction_expenses table
    console.log('\n=== Creating construction_expenses table ===');
    const { error: expTableError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS construction_expenses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
          category_id UUID NOT NULL REFERENCES construction_categories(id) ON DELETE RESTRICT,
          amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
          currency VARCHAR(3) DEFAULT 'SAR',
          description TEXT,
          description_ar TEXT,
          expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
          receipt_url TEXT,
          vendor_name VARCHAR(200),
          vendor_name_ar VARCHAR(200),
          notes TEXT,
          notes_ar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (expTableError) {
      console.error('❌ Error creating construction_expenses:', expTableError);
    } else {
      console.log('✅ construction_expenses table created');
    }
    
    // Create indexes
    console.log('\n=== Creating indexes ===');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_construction_expenses_project_id ON construction_expenses(project_id);',
      'CREATE INDEX IF NOT EXISTS idx_construction_expenses_category_id ON construction_expenses(category_id);',
      'CREATE INDEX IF NOT EXISTS idx_construction_expenses_date ON construction_expenses(expense_date);',
      'CREATE INDEX IF NOT EXISTS idx_construction_categories_active ON construction_categories(is_active) WHERE is_active = true;'
    ];
    
    for (const indexSQL of indexes) {
      const { error } = await supabase.rpc('exec_sql', { query: indexSQL });
      if (error) {
        console.log('Warning: Index creation failed:', error.message);
      } else {
        console.log('✅ Index created');
      }
    }
    
    // Enable RLS
    console.log('\n=== Enabling RLS ===');
    const rlsCommands = [
      'ALTER TABLE construction_categories ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE construction_expenses ENABLE ROW LEVEL SECURITY;'
    ];
    
    for (const rlsSQL of rlsCommands) {
      const { error } = await supabase.rpc('exec_sql', { query: rlsSQL });
      if (error) {
        console.log('Warning: RLS enablement failed:', error.message);
      } else {
        console.log('✅ RLS enabled');
      }
    }
    
    // Test the tables
    console.log('\n=== Testing Construction Tables ===');
    
    const { data: categories, error: catError } = await supabase
      .from('construction_categories')
      .select('*')
      .limit(5);
      
    if (catError) {
      console.error('❌ construction_categories table test failed:', catError);
    } else {
      console.log('✅ construction_categories table working!');
      console.log(`Found ${categories.length} categories`);
    }
    
    const { data: expenses, error: expError } = await supabase
      .from('construction_expenses')
      .select('*')
      .limit(5);
      
    if (expError) {
      console.error('❌ construction_expenses table test failed:', expError);
    } else {
      console.log('✅ construction_expenses table working!');
      console.log(`Found ${expenses.length} expenses`);
    }
    
    console.log('\n✅ Construction tables setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

executeConstructionSchema();
