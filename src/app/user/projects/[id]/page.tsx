"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Card, LoadingSpinner, StatusBadge, ProgressBar } from '@/components/ui';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import type { Project } from '@/types/dashboard';
import { MapPicker } from '@/components/maps/MapPicker';
import dynamicImport from 'next/dynamic';

const ProjectDetailClient = dynamicImport(() => import('./ProjectDetailClient'), { ssr: false });

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          setAuthError(null);
          fetchProject();
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

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
      if (error || !data) {
        router.push('/user/projects');
      } else {
        setProject(data);
      }
    } catch (error) {
      router.push('/user/projects');
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
          <h1 className="text-3xl font-bold">{project?.name}</h1>
          <p>{project?.description}</p>
        </Card>
      </div>
    </div>
  );
}
