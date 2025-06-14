// src/lib/temp-auth.ts
// Authentication helper for our temporary cookie-based auth system

export interface TempAuthUser {
  id: string;
  email: string;
  account_type: 'user' | 'store' | 'client' | 'engineer' | 'consultant' | 'admin';
  name?: string;
}

export function getTempAuthUser(): TempAuthUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Get the temp auth cookie
    const cookies = document.cookie.split(';');
    const tempAuthCookie = cookies
      .find(cookie => cookie.trim().startsWith('temp_auth_user='))
      ?.split('=')[1];
    
    if (!tempAuthCookie) {
      console.log('🍪 [getTempAuthUser] No temp auth cookie found');
      console.log('🍪 [getTempAuthUser] Available cookies:', document.cookie);
      return null;
    }
    
    const user = JSON.parse(decodeURIComponent(tempAuthCookie));
    console.log('✅ [getTempAuthUser] Found temp auth user:', user.email);
    return user;
  } catch (error) {
    console.error('❌ [getTempAuthUser] Error parsing temp auth cookie:', error);
    console.log('🍪 [getTempAuthUser] Raw cookies:', document.cookie);
    return null;
  }
}

export async function verifyTempAuth(retries: number = 3): Promise<{ user: TempAuthUser } | null> {
  // Try multiple times with delays to handle timing issues
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`🔐 [verifyTempAuth] Attempt ${attempt}/${retries}`);
    
    const user = getTempAuthUser();
    
    if (user) {
      console.log('✅ [verifyTempAuth] User authenticated:', user.email);
      return { user };
    }
    
    if (attempt < retries) {
      console.log(`⏳ [verifyTempAuth] No user found, waiting 500ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('❌ [verifyTempAuth] No authenticated user found after retries');
  return null;
}

export function clearTempAuth(): void {
  if (typeof window === 'undefined') return;
  
  // Clear the temp auth cookie
  document.cookie = 'temp_auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  console.log('🧹 [clearTempAuth] Temp auth cookie cleared');
}

export function setTempAuthUser(user: TempAuthUser): void {
  if (typeof window === 'undefined') return;
  
  try {
    const userJson = JSON.stringify(user);
    const encodedUser = encodeURIComponent(userJson);
    
    // Set cookie with 24 hour expiration
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
    
    document.cookie = `temp_auth_user=${encodedUser}; path=/; expires=${expires.toUTCString()}`;
    console.log('✅ [setTempAuthUser] Temp auth user set:', user.email);
  } catch (error) {
    console.error('❌ [setTempAuthUser] Error setting temp auth cookie:', error);
  }
}
