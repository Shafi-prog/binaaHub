import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function verifyAuthWithRetry(maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Auth error:', error);
        if (retries === maxRetries - 1) {
          throw error;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      return {
        user,
        isAuthenticated: !!user,
        error: null
      };
    } catch (error) {
      console.error('Auth verification error:', error);
      if (retries === maxRetries - 1) {
        return {
          user: null,
          isAuthenticated: false,
          error
        };
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    user: null,
    isAuthenticated: false,
    error: new Error('Max retries exceeded')
  };
}

export default verifyAuthWithRetry;
