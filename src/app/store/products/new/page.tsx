'use client';
// New product creation page for stores, reusing the same form logic as the inline add in products list
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('يجب تسجيل الدخول');
      // Get store id
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
      if (!store?.id) throw new Error('لم يتم العثور على المتجر');
      // Insert product
      const { error } = await supabase.from('products').insert({
        store_id: store.id,
        name: formData.name,
        description: formData.description,
        barcode: formData.barcode,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
      });
      if (error) throw error;
      router.push('/store/products');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">إضافة منتج جديد</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" placeholder="اسم المنتج" required />
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" placeholder="وصف المنتج" />
        <input name="barcode" value={formData.barcode} onChange={handleChange} className="w-full border rounded p-2" placeholder="الباركود (اختياري)" />
        <input name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2" placeholder="السعر" type="number" min="0" required />
        <input name="stock" value={formData.stock} onChange={handleChange} className="w-full border rounded p-2" placeholder="المخزون" type="number" min="0" required />
        <input name="image_url" value={formData.image_url} onChange={handleChange} className="w-full border rounded p-2" placeholder="رابط صورة المنتج (اختياري)" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700" disabled={saving}>{saving ? 'جاري الحفظ...' : 'إضافة المنتج'}</button>
      </form>
    </main>
  );
}
