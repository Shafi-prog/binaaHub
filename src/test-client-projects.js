// Test client-side authentication and data fetching
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

async function testClientSideProjects() {
  console.log('🧪 Testing client-side projects retrieval...');
  
  const supabase = createClientComponentClient();
  
  try {
    // Check authentication
    console.log('🔍 Checking client authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }
    
    if (!user) {
      console.error('❌ No user found');
      return;
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Test direct projects query
    console.log('📊 Testing direct projects query...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);
    
    if (projectsError) {
      console.error('❌ Projects error:', projectsError);
      return;
    }
    
    console.log('✅ Projects found:', projects?.length || 0);
    console.log('📋 Projects:', projects);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Export for use in browser console
window.testClientSideProjects = testClientSideProjects;
