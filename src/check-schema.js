const { createClient } = require('../node_modules/@supabase/supabase-js/dist/main');

// Use local Supabase instance
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function checkSchema() {
  try {
    console.log('🔍 Checking projects table schema...');
      // Try to insert a test record to see what columns are available
    const testProject = {
      name: 'Test Project Schema Check',
      description: 'Testing schema',
      start_date: '2025-06-04',
      end_date: '2025-12-31',
      budget: 100000,
      status: 'planning',
      location: 'Test Location', // Add location field
      city: 'Riyadh',
      region: 'Riyadh Region',
      district: 'Al Olaya',
      country: 'Saudi Arabia',
      priority: 'medium',
      is_active: true,
      image_url: 'https://example.com/image.jpg'
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(testProject)
      .select();

    if (error) {
      console.error('❌ Schema check failed:', error.message);
      console.error('Error details:', error);
    } else {
      console.log('✅ Schema check passed! All columns exist.');
      console.log('Created test project:', data);
      
      // Clean up test record
      if (data && data[0]) {
        await supabase.from('projects').delete().eq('id', data[0].id);
        console.log('🧹 Cleaned up test record');
      }
    }
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

checkSchema();
