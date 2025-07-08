// @ts-nocheck
export interface UserDashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
  pendingPayments: number;
  documentsCount: number;
  recentProjects: Project[];
  upcomingPayments: Payment[];
}

export interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  description?: string;
  budget?: number;
  progress?: number;
}

export interface Payment {
  id: string;
  amount: number;
  due_date: string;
  status: string;
  project_title: string;
  project_id: string;
}

export async function getUserDashboardStats(userId?: string): Promise<UserDashboardStats> {
  // Mock data for development
  const mockStats: UserDashboardStats = {
    totalProjects: 8,
    activeProjects: 3,
    completedProjects: 5,
    totalSpent: 145000,
    pendingPayments: 25000,
    documentsCount: 12,
    recentProjects: [
      {
        id: '1',
        title: 'مشروع البناء السكني',
        type: 'residential',
        status: 'in_progress',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        description: 'بناء فيلا سكنية بمساحة 300 متر مربع',
        budget: 85000,
        progress: 65
      },
      {
        id: '2',
        title: 'مشروع التجديد التجاري',
        type: 'commercial',
        status: 'planning',
        created_at: '2024-01-10T08:00:00Z',
        updated_at: '2024-01-18T12:15:00Z',
        description: 'تجديد محل تجاري في المنطقة الوسطى',
        budget: 45000,
        progress: 25
      },
      {
        id: '3',
        title: 'مشروع الصيانة الدورية',
        type: 'maintenance',
        status: 'completed',
        created_at: '2024-01-05T14:00:00Z',
        updated_at: '2024-01-12T09:45:00Z',
        description: 'صيانة دورية للمبنى السكني',
        budget: 15000,
        progress: 100
      }
    ],
    upcomingPayments: [
      {
        id: '1',
        amount: 15000,
        due_date: '2024-02-15',
        status: 'pending',
        project_title: 'مشروع البناء السكني',
        project_id: '1'
      },
      {
        id: '2',
        amount: 10000,
        due_date: '2024-02-20',
        status: 'pending',
        project_title: 'مشروع التجديد التجاري',
        project_id: '2'
      }
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockStats;
}
