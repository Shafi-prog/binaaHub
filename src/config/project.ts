export interface ProjectData {
  name: string;
  description: string;
  project_type: string;
  address: string;
  city?: string;
  region?: string;
  status: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  actual_completion_date?: string;
  budget?: number;
  actual_cost?: number;
  progress_percentage?: number;
  location_lat?: number;
  location_lng?: number;
  metadata?: any;
  rooms_count?: number;
  bathrooms_count?: number;
  floors_count?: number;
  plot_area?: number;
  building_area?: number;
  currency?: string;
  is_active?: boolean;
  supervisor_id?: string;
  client_id?: string;
  user_id?: string;
}

export interface Project extends ProjectData {
  id: string;
  created_at: string;
  updated_at: string;
}
