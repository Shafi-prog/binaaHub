"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const fakeProjects = [
  {
    id: "1",
    name: "مشروع بناء فيلا شمال الرياض",
    status: "قيد التنفيذ",
    cost: "450,000 ريال",
    stores: ["متجر الخرسانة", "متجر الأدوات الصحية"],
  },
  {
    id: "2",
    name: "مشروع ترميم شقة حي الملقا",
    status: "مكتمل",
    cost: "95,000 ريال",
    stores: ["متجر البويا"],
  },
];

export default function EditProject({ params }: { params: { id: string } }) {
  const router = useRouter();
  const project = fakeProjects.find((p) => p.id === params.id);

  const [name, setName] = useState(project?.name || "");
  const [status, setStatus] = useState(project?.status || "");
  const [cost, setCost] = useState(project?.cost || "");
  const [stores, setStores] = useState(project?.stores.join(", ") || "");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // هنا يتم إرسال التعديلات لقاعدة البيانات (لاحقًا)
    console.log({ name, status, cost, stores: stores.split(",") });
    router.push(`/projects/${params.id}`);
  };

  if (!project) {
    return <div className="p-8 font-[Tajawal] text-red-600">المشروع غير موجود</div>;
  }

  return (
    <div className="p-6 font-[Tajawal] max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل المشروع</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المشروع"
          className="w-full border p-2 rounded"
        />
        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="الحالة (مثل: قيد التنفيذ)"
          className="w-full border p-2 rounded"
        />
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="التكلفة"
          className="w-full border p-2 rounded"
        />
        <input
          value={stores}
          onChange={(e) => setStores(e.target.value)}
          placeholder="المتاجر (مفصولة بفاصلة)"
          className="w-full border p-2 rounded"
        />

        <Button type="submit" className="w-full">
          حفظ التعديلات
        </Button>
      </form>
    </div>
  );
}
