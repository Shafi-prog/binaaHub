import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function verifyAuthWithRetry(retries: number = 3): Promise<any> {
  const supabase = createClientComponentClient();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔐 [verifyAuthWithRetry] Attempt ${attempt}/${retries}`);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        if (attempt === retries) throw sessionError;
        continue;
      }

      if (!session) {
        if (attempt === retries) return null;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        if (attempt === retries) throw userError;
        continue;
      }

      if (!user) {
        if (attempt === retries) return null;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      return { user, session };
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return null;
}
