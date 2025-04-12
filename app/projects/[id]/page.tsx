import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fakeProjects = [
  {
    id: "1",
    name: "مشروع بناء فيلا شمال الرياض",
    status: "قيد التنفيذ",
    cost: "450,000 ريال",
    description: "مشروع متكامل لبناء فيلا من دورين تشمل التشطيبات.",
    stores: [
      { name: "متجر الخرسانة", url: "#" },
      { name: "متجر الأدوات الصحية", url: "#" },
    ],
  },
  {
    id: "2",
    name: "مشروع ترميم شقة حي الملقا",
    status: "مكتمل",
    cost: "95,000 ريال",
    description: "تمت صيانة شاملة وتشطيب فاخر.",
    stores: [
      { name: "متجر البويا", url: "#" },
    ],
  },
];

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = fakeProjects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="p-8 font-[Tajawal] text-center text-red-600">
        المشروع غير موجود ❌
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 font-[Tajawal] space-y-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <Badge variant="outline">{project.status}</Badge>
      <div className="text-gray-700 text-lg">التكلفة: {project.cost}</div>
      <p className="text-gray-600">{project.description}</p>

      <div>
        <h2 className="font-semibold mt-4 mb-2">المتاجر المرتبطة:</h2>
        <ul className="list-disc list-inside space-y-1">
          {project.stores.map((store, i) => (
            <li key={i}>
              <a href={store.url} className="text-blue-600 hover:underline">
                {store.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Link href={`/projects/${project.id}`}>
  <Button variant="outline" className="mt-2 w-full">
    تفاصيل المشروع
  </Button>
</Link>
    </div>
  );
}
