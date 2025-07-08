// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupervisorService } from '@/lib/supervisor-service';

// POST /api/supervisors/[id]/request-agreement
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supervisorId = id;
    // Optionally, get projectId or other info from body if needed
    // const { projectId } = await request.json();
    // Call SupervisorService to create/request agreement
    const agreement = await SupervisorService.requestAgreement({
      supervisorId,
      userId: user.id,
      // projectId, // add if needed
    });
    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error('Error requesting supervision agreement:', error);
    return NextResponse.json({ error: 'Failed to request supervision agreement' }, { status: 500 });
  }
}
