// src/app/projects/page.tsx
import { Button, Card, CardContent } from '@/components/ui'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const projects = [
    {
      id: 1,
      name: 'مشروع توسعة فلة بالرياض',
      location: 'حي الرمال',
      status: 'قيد التنفيذ',
      startDate: '2024-04-01',
    },
    {
      id: 2,
      name: 'مشروع تسوير أرض تجارية',
      location: 'الدمام - الصناعية الجديدة',
      status: 'بإنتظار المقاول',
      startDate: '2024-05-12',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold text-blue-800">مشاريعي</h1>
      {projects.map(({ id, name, location, status, startDate }) => (
        <Card key={id} className="p-4">
          <CardContent className="space-y-2 text-right">
            <p>
              <strong>اسم المشروع:</strong> {name}
            </p>
            <p>
              <strong>الموقع:</strong> {location}
            </p>
            <p>
              <strong>الحالة:</strong> {status}
            </p>
            <p>
              <strong>تاريخ البدء:</strong> {startDate}
            </p>
            <Button className="mt-2 w-full">تفاصيل المشروع</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
