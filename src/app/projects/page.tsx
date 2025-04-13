import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    name: "مشروع بناء فيلا شمال الرياض",
    status: "قيد التنفيذ",
    cost: "450,000 ريال",
    stores: [
      { name: "متجر الخرسانة", url: "#" },
      { name: "متجر الأدوات الصحية", url: "#" },
    ],
  },
    {
    id: 2,
    name: "مشروع ترميم شقة حي الملقا",
    status: "مكتمل",
    cost: "95,000 ريال",
    stores: [
      { name: "متجر البويا", url: "#" },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className="p-4 md:p-8 font-[Tajawal] space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">مشاريعي</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="rounded-2xl shadow-md">
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <Badge variant="outline" className="text-sm">
                {project.status}
              </Badge>
              <div className="text-sm text-gray-600">التكلفة: {project.cost}</div>
              <div>
                <div className="text-sm font-medium mb-1">المتاجر المرتبطة:</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {project.stores.map((store, i) => (
                    <li key={i}>
                      <a
                        href={store.url}
                        className="text-blue-600 hover:underline"
                      >
                        {store.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" className="mt-2 w-full">
                تفاصيل المشروع
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
console.log('🔍 projects rendered')
