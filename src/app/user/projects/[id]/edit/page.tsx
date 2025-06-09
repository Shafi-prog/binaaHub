"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getProjectById, updateProject } from '@/lib/api/dashboard';
import type { ProjectData } from '@/types/project';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: '',
    address: '',
    city: '',
    region: '',
    budget: '',
    end_date: '',
    priority: 'medium',
    status: 'planning',
    progress_percentage: '',
    actual_cost: '',
    location_lat: '',
    location_lng: '',
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await verifyAuthWithRetry(3);
        if (user) {
          setUser(user.user);
          setAuthError(null);
          loadProjectData();
        } else {
          setAuthError('يرجى تسجيل الدخول للمتابعة');
          router.push('/login');
        }
      } catch (error) {
        setAuthError('خطأ في المصادقة');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router, projectId]);

  const loadProjectData = async () => {
    try {
      const projectData = await getProjectById(projectId);
      if (projectData) {
        setFormData({
          name: projectData.name,
          description: projectData.description || '',
          project_type: projectData.project_type,
          address: projectData.address || '',
          city: projectData.city || '',
          region: projectData.region || '',
          budget: projectData.budget?.toString() || '',
          end_date: projectData.expected_completion_date || '',
          priority: projectData.priority,
          status: projectData.status,
          progress_percentage: projectData.progress_percentage?.toString() || '',
          actual_cost: projectData.actual_cost?.toString() || '',
          location_lat: projectData.location ? (JSON.parse(projectData.location).lat || '').toString() : '',
          location_lng: projectData.location ? (JSON.parse(projectData.location).lng || '').toString() : '',
        });
      } else {
        alert('المشروع غير موجود');
        router.push('/user/projects');
      }
    } catch (error) {
      alert('حدث خطأ في تحميل بيانات المشروع');
      router.push('/user/projects');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        project_type: formData.project_type,
        address: formData.address || undefined,
        city: formData.city || undefined,
        region: formData.region || undefined,
        budget: formData.budget
          ? parseFloat(formData.budget)
          : undefined,
        expected_completion_date: formData.end_date || undefined,
        priority: formData.priority,
        status: formData.status,
        progress_percentage: formData.progress_percentage ? parseInt(formData.progress_percentage) : undefined,
        actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : undefined,
        location: formData.location_lat && formData.location_lng ? JSON.stringify({ lat: parseFloat(formData.location_lat), lng: parseFloat(formData.location_lng) }) : undefined,
      };

      const result = await updateProject(projectId, updateData);
      router.push(`/user/projects/${projectId}`);
    } catch (error) {
      alert('حدث خطأ في تحديث المشروع');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ في المصادقة</h2>
          <p className="text-gray-600">{authError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المشروع *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
