"use client";
import { useState } from "react";

export default function ProductNewPage() {
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/store/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price)
        })
      });
      if (!res.ok) throw new Error("فشل إنشاء المنتج");
      setSuccess(true);
      setForm({ title: "", description: "", price: "" });
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">إضافة منتج جديد</h1>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="اسم المنتج"
          className="border p-2 mb-3 w-full rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="وصف المنتج"
          className="border p-2 mb-3 w-full rounded"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="السعر"
          type="number"
          min="0"
          step="0.01"
          className="border p-2 mb-3 w-full rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "جاري الإضافة..." : "إضافة المنتج"}
        </button>
        {success && <div className="text-green-600 mt-3">تمت إضافة المنتج بنجاح!</div>}
        {error && <div className="text-red-600 mt-3">{error}</div>}
      </form>
    </div>
  );
}
