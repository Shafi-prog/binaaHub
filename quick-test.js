const { createClient } = require('@supabase/supabase-js');

console.log('Starting test...');

const supabase = createClient(
  'https://lqhopwohuddhapkhhikf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ'
);

async function quickTest() {
  console.log('Getting session...');
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    console.log('Session found for:', data.session.user.email);
    
    console.log('Testing minimal project insert...');
    const result = await supabase
      .from('projects')
      .insert({
        user_id: data.session.user.id,
        name: 'Quick Test'
      })
      .select()
      .single();
      
    if (result.error) {
      console.log('Error:', result.error.message);
    } else {
      console.log('Success! Project ID:', result.data.id);
      
      // Clean up
      await supabase.from('projects').delete().eq('id', result.data.id);
      console.log('Cleaned up');
    }
  } else {
    console.log('No session found');
  }
}

quickTest().catch(e => console.log('Exception:', e.message));
