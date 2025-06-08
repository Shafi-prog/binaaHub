<<<<<<< HEAD
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create Supabase client for builds - fallback to dummy if no env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// For build purposes, create a client or dummy object
export const supabase = (() => {
  try {
    return createClientComponentClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey
    });
  } catch {
    // Fallback dummy for builds without proper env vars
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null })
            })
          })
        })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    };
  }
})();
=======
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// File upload helper for Supabase Storage
export async function uploadOrderDocument(file: File, orderId: string) {
  const filePath = `orders/${orderId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('documents').upload(filePath, file);
  if (error) throw error;
  return data?.path;
}

export async function getOrderDocuments(orderId: string) {
  const { data, error } = await supabase.storage.from('documents').list(`orders/${orderId}`);
  if (error) throw error;
  return data;
}

export async function getDocumentUrl(path: string) {
  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return data.publicUrl;
}
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
