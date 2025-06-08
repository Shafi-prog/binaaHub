import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function verifyAuthWithRetry(retries: number = 3): Promise<any> {
  const supabase = createClientComponentClient();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔐 [verifyAuthWithRetry] Attempt ${attempt}/${retries}`);
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error(`❌ [verifyAuthWithRetry] Session error on attempt ${attempt}:`, sessionError);
        if (attempt === retries) throw sessionError;
        continue;
      }
      
      if (!session) {
        console.log(`❌ [verifyAuthWithRetry] No session found on attempt ${attempt}`);
        if (attempt === retries) return null;
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Get user details
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error(`❌ [verifyAuthWithRetry] User error on attempt ${attempt}:`, userError);
        if (attempt === retries) throw userError;
        continue;
      }
      
      if (!user) {
        console.log(`❌ [verifyAuthWithRetry] No user found on attempt ${attempt}`);
        if (attempt === retries) return null;
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      console.log(`✅ [verifyAuthWithRetry] Authentication successful on attempt ${attempt}`);
      console.log(`📧 User: ${user.email}`);
      console.log(`🆔 User ID: ${user.id}`);
      
      return { user, session };
      
    } catch (error) {
      console.error(`❌ [verifyAuthWithRetry] Error on attempt ${attempt}:`, error);
      if (attempt === retries) throw error;
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return null;
}
