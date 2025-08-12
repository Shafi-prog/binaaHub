import { mapSupabaseProjectToProject, type SupabaseProject } from '@/types/types'

describe('mapSupabaseProjectToProject', () => {
  it('maps project_name and user_id correctly', () => {
    const input: SupabaseProject = {
      id: 'p1', user_id: 'u1', project_name: 'Villa A', description: null, project_type: 'residential', status: 'planning',
      budget: 1000, actual_cost: null, start_date: null, completion_percentage: 15, location: null, created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z', name: null, title: null, type: null, spent: null, end_date: null, estimated_completion: null,
      progress: null, area: null, estimated_cost: null, spent_cost: null
    }

    const out = mapSupabaseProjectToProject(input)
    expect(out.id).toBe('p1')
    expect(out.userId).toBe('u1')
    expect(out.name).toBe('Villa A')
    expect(out.projectType).toBe('residential')
    expect(out.status).toBe('planning')
    expect(out.progress).toBe(15)
  })

  it('falls back to name when project_name is missing', () => {
    const input: SupabaseProject = {
      id: 'p2', user_id: 'u2', project_name: '' as any, description: 'desc', project_type: null, status: null,
      budget: null, actual_cost: null, start_date: null, completion_percentage: null, location: 'Riyadh', created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z', name: 'Office Tower', title: null, type: null, spent: null, end_date: null, estimated_completion: null,
      progress: 70, area: 3000, estimated_cost: 500000, spent_cost: 100000
    }

    const out = mapSupabaseProjectToProject(input)
    expect(out.name).toBe('Office Tower')
    expect(out.progress).toBe(70)
    expect(out.area).toBe(3000)
    expect(out.location).toBe('Riyadh')
  })
})
