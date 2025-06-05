"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MapPin, Phone, Mail, UserCheck, MessageCircle, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  rating?: number;
  total_projects?: number;
}

export default function PublicSupervisorsPage() {
  const { t, locale } = useTranslation();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/supervisors?public=1');
        if (!response.ok) throw new Error('Failed to fetch supervisors');
        const data = await response.json();
        setSupervisors(data.supervisors || []);
      } catch (err) {
        setError('Failed to load supervisors');
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('supervisor.publicList', 'الإشراف العلني')}</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supervisors.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('supervisor.noSupervisors')}</h3>
                  <p className="text-gray-600">{t('supervisor.noActiveSupervisors')}</p>
                </CardContent>
              </Card>
            ) : (
              supervisors.map((supervisor) => (
                <Card key={supervisor.id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{supervisor.name}</h3>
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1" dir="ltr">{supervisor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1" dir="ltr">{supervisor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{supervisor.area}</span>
                      </div>
                      {supervisor.rating !== undefined && (
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>التقييم: {supervisor.rating}</span>
                        </div>
                      )}
                      {supervisor.total_projects !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>المشاريع المكتملة: {supervisor.total_projects}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
