'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, MapPin, Phone, Mail, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, Button, Input, Modal, Select, LoadingSpinner } from '@/components/ui';
import { 
  Typography, 
  EnhancedCard, 
  EnhancedButton, 
  EnhancedInput,
  EnhancedSelect,
  EnhancedBadge 
} from '@/components/ui/enhanced-components';
import { useTranslation } from '@/hooks/useTranslation';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  store_count: number;
  status: 'active' | 'inactive';
  stores: string[];
  created_at: string;
}

interface Store {
  id: string;
  name: string;
  location: string;
}

export default function SupervisorManagement() {
  const { t, locale } = useTranslation();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    stores: [] as string[]
  });

  const fetchSupervisors = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/supervisors');
      if (!response.ok) {
        throw new Error('Failed to fetch supervisors');
      }
      const data = await response.json();
      setSupervisors(data.supervisors || []);
    } catch (err) {
      setError('Failed to load supervisors');
      console.error('Supervisors fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data.stores || []);
      }
    } catch (err) {
      console.error('Stores fetch error:', err);
    }
  };

  const createSupervisor = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.area) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/supervisors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create supervisor');
      }

      setModalOpen(false);
      resetForm();
      fetchSupervisors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create supervisor');
    }
  };

  const updateSupervisor = async () => {
    if (!selectedSupervisor || !formData.name || !formData.email || !formData.phone || !formData.area) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/supervisors/${selectedSupervisor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update supervisor');
      }

      setModalOpen(false);
      setSelectedSupervisor(null);
      resetForm();
      fetchSupervisors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update supervisor');
    }
  };

  const toggleSupervisorStatus = async (supervisor: Supervisor) => {
    try {
      const newStatus = supervisor.status === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/supervisors/${supervisor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update supervisor status');
      }

      fetchSupervisors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update supervisor status');
    }
  };

  const deleteSupervisor = async (supervisorId: string) => {
    if (!confirm('Are you sure you want to delete this supervisor?')) {
      return;
    }

    try {
      const response = await fetch(`/api/supervisors/${supervisorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete supervisor');
      }

      fetchSupervisors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete supervisor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      area: '',
      stores: [],
    });
    setError(null);
  };

  const openEditModal = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setFormData({
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      area: supervisor.area,
      stores: supervisor.stores,
    });
    setEditMode(true);
    setModalOpen(true);
  };

  const filteredSupervisors = supervisors.filter((supervisor) => supervisor.status === activeTab);

  useEffect(() => {
    fetchSupervisors();
    fetchStores();
  }, []);

  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle store selection changes
  const handleStoresChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      stores: selectedOptions
    }));
  };

  const handleEdit = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setFormData({
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      area: supervisor.area,
      stores: supervisor.stores
    });
    setEditMode(true);
    setModalOpen(true);
  };

  const handleStatusChange = async (supervisorId: string, newStatus: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/supervisors/${supervisorId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update supervisor status');
      }

      fetchSupervisors();
    } catch (err) {
      setError('Failed to update supervisor status');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelectedSupervisor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      area: '',
      stores: []
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('supervisor.management')}</h1>
            <p className="text-gray-600">{t('supervisor.description')}</p>
          </div>          <Button
            variant="default"
            onClick={() => {
              setEditMode(false);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 ml-2" />
            <span>{t('supervisor.addNew')}</span>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supervisor.active')}
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inactive'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supervisor.inactive')}
            </button>
          </nav>
        </div>

        {/* Supervisors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupervisors.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('supervisor.noSupervisors')}</h3>
                <p className="text-gray-600">
                  {activeTab === 'active'
                    ? t('supervisor.noActiveSupervisors')
                    : t('supervisor.noInactiveSupervisors')}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSupervisors.map((supervisor) => (
              <Card key={supervisor.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex-1">
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
                      </div>

                      {/* Assigned Stores */}
                      {supervisor.stores.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t('supervisor.assignedStoresTitle')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {supervisor.stores.map((storeId) => {
                              const store = stores.find((s) => s.id === storeId);
                              return (
                                <span 
                                  key={storeId}
                                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                                >
                                  {store?.name || storeId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0 mr-4">
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(supervisor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>                      {supervisor.status === 'active' ? (
                        <Button
                          variant="destructive"
                          onClick={() => handleStatusChange(supervisor.id, 'inactive')}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      ) : (                        <Button
                          variant="default"
                          onClick={() => handleStatusChange(supervisor.id, 'active')}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={editMode ? t('supervisor.edit') : t('supervisor.addNew')}
        >
          <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('supervisor.name')}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('supervisor.namePlaceholder')}
                className="text-start"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('supervisor.email')}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('supervisor.emailPlaceholder')}
                dir="ltr"
                className="text-start"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('supervisor.phone')}
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('supervisor.phonePlaceholder')}
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('supervisor.area')}
              </label>
              <Input
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                placeholder={t('supervisor.areaPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('supervisor.assignStores')}
              </label>
              <select
                multiple
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={formData.stores}
                onChange={handleStoresChange}
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name} ({store.location})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {t('supervisor.storesHelp')}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={closeModal}
              >
                <span>{t('cancel')}</span>
              </Button>              <Button
                variant="default"
                onClick={editMode ? updateSupervisor : createSupervisor}
              >
                <span>{editMode ? t('supervisor.update') : t('supervisor.create')}</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
