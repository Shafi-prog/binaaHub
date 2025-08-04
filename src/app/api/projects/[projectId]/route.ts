import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/domains/projects/services/ProjectService';
import { ProjectRepository } from '@/domains/projects/repositories/ProjectRepository';

const projectService = new ProjectService(new ProjectRepository());

interface RouteParams {
  params: {
    projectId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const project = await projectService.getProject(params.projectId);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const project = await projectService.updateProject(params.projectId, body);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await projectService.deleteProject(params.projectId);
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
