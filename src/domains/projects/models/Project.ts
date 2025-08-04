
export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  type: 'residential' | 'commercial' | 'renovation';
  budget?: number;
  startDate?: Date;
  expectedCompletion?: Date;
  actualCompletion?: Date;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStage {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  orderIndex: number;
  status: 'pending' | 'in_progress' | 'completed';
  startDate?: Date;
  completionDate?: Date;
  budgetAllocated?: number;
  actualCost?: number;
  images: StageImage[];
}

export interface StageImage {
  id: string;
  stageId: string;
  imageUrl: string;
  caption?: string;
  uploadedBy: string;
  uploadDate: Date;
  imageType: 'progress' | 'before' | 'after' | 'issue';
}

export interface ProjectMaterial {
  id: string;
  projectId: string;
  name: string;
  category?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplierName?: string;
  purchaseDate?: Date;
  warrantyPeriodMonths?: number;
  warrantyDocumentUrl?: string;
}

export interface ProjectTeamMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'supervisor' | 'contractor' | 'architect';
  permissions: string[];
  joinedAt: Date;
  status: 'active' | 'inactive' | 'pending';
}
