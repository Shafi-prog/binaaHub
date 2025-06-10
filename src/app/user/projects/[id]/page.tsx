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
  // Directly render the comprehensive dashboard and integrations
  return <ProjectDetailClient />;
}
