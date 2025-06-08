const { createClient } = require('../node_modules/@supabase/supabase-js/dist/main');

// Use local Supabase instance
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function testColumns() {
  const columnsToTest = [
    'name', 'description', 'start_date', 'end_date', 'budget', 'status',
    'city', 'region', 'district', 'country', 'priority', 'is_active', 'image_url'
  ];

  console.log('🔍 Testing individual columns...\n');

  for (const column of columnsToTest) {
    try {
      const testData = { [column]: 'test_value' };
      const { data, error } = await supabase
        .from('projects')
        .insert(testData)
        .select();

      if (error) {
        console.log(`❌ ${column}: ${error.message}`);
      } else {
        console.log(`✅ ${column}: EXISTS`);
        // Clean up
        if (data && data[0]) {
          await supabase.from('projects').delete().eq('id', data[0].id);
        }
      }
    } catch (err) {
      console.log(`💥 ${column}: ${err.message}`);
    }
  }
}

testColumns();
