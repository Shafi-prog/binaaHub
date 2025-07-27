require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function investigateDataMismatch() {
  console.log('🔍 Investigating data mismatch...');
  
  try {
    // Check all users in user_profiles
    console.log('\n=== USER PROFILES ===');
    const { data: users } = await supabase
      .from('user_profiles')
      .select('*');
    
    console.log('Users in user_profiles table:');
    users?.forEach(user => {
      console.log(`  👤 ${user.user_id} (${user.display_name})`);
    });
    
    // Check all orders and their user_ids
    console.log('\n=== ORDERS ===');
    const { data: orders } = await supabase
      .from('orders')
      .select('*');
    
    console.log('Orders in orders table:');
    orders?.forEach(order => {
      console.log(`  📦 ${order.order_number} - User: ${order.user_id} - Store: ${order.store_name}`);
    });
    
    // Check all projects and their user_ids
    console.log('\n=== PROJECTS ===');
    const { data: projects } = await supabase
      .from('construction_projects')
      .select('*');
    
    console.log('Projects in construction_projects table:');
    projects?.forEach(project => {
      console.log(`  🏗️ ${project.name} - User: ${project.user_id}`);
    });
    
    // Check all warranties and their user_ids
    console.log('\n=== WARRANTIES ===');
    const { data: warranties } = await supabase
      .from('warranties')
      .select('*');
    
    console.log('Warranties in warranties table:');
    warranties?.forEach(warranty => {
      console.log(`  🛡️ ${warranty.product_name} - User: ${warranty.user_id}`);
    });
    
    // Check all invoices and their user_ids
    console.log('\n=== INVOICES ===');
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*');
    
    console.log('Invoices in invoices table:');
    invoices?.forEach(invoice => {
      console.log(`  📄 ${invoice.invoice_number} - User: ${invoice.user_id}`);
    });
    
    // Check stores
    console.log('\n=== STORES ===');
    const { data: stores } = await supabase
      .from('stores')
      .select('*');
    
    console.log('Stores in stores table:');
    if (stores && stores.length > 0) {
      stores.forEach(store => {
        console.log(`  🏪 ${store.store_id} - ${store.name} - Owner: ${store.owner_user_id}`);
      });
    } else {
      console.log('  No stores found');
    }
    
    // Find orphaned data (data without matching users)
    console.log('\n=== ORPHANED DATA ANALYSIS ===');
    const userIds = users?.map(u => u.user_id) || [];
    
    const orphanedOrderUsers = [...new Set(orders?.map(o => o.user_id))].filter(id => !userIds.includes(id));
    const orphanedProjectUsers = [...new Set(projects?.map(p => p.user_id))].filter(id => !userIds.includes(id));
    const orphanedWarrantyUsers = [...new Set(warranties?.map(w => w.user_id))].filter(id => !userIds.includes(id));
    const orphanedInvoiceUsers = [...new Set(invoices?.map(i => i.user_id))].filter(id => !userIds.includes(id));
    
    console.log('Orphaned data (data without matching user profiles):');
    if (orphanedOrderUsers.length > 0) {
      console.log(`  📦 Orders without users: ${orphanedOrderUsers.join(', ')}`);
    }
    if (orphanedProjectUsers.length > 0) {
      console.log(`  🏗️ Projects without users: ${orphanedProjectUsers.join(', ')}`);
    }
    if (orphanedWarrantyUsers.length > 0) {
      console.log(`  🛡️ Warranties without users: ${orphanedWarrantyUsers.join(', ')}`);
    }
    if (orphanedInvoiceUsers.length > 0) {
      console.log(`  📄 Invoices without users: ${orphanedInvoiceUsers.join(', ')}`);
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total user profiles: ${users?.length || 0}`);
    console.log(`Total orders: ${orders?.length || 0}`);
    console.log(`Total projects: ${projects?.length || 0}`);
    console.log(`Total warranties: ${warranties?.length || 0}`);
    console.log(`Total invoices: ${invoices?.length || 0}`);
    console.log(`Total stores: ${stores?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error investigating data:', error.message);
  }
}

investigateDataMismatch();
