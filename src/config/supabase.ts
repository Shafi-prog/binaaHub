// @ts-nocheck
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


