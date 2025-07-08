// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { SupervisorService } from '@/lib/supervisor-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, ...data } = await request.json();

    switch (action) {
      case 'register_warranty':
        const { orderId, itemId, purchaseDate, warrantyPeriodMonths } = data;
        
        // Calculate warranty expiration
        const expirationDate = new Date(purchaseDate);
        expirationDate.setMonth(expirationDate.getMonth() + warrantyPeriodMonths);

        const { data: warranty, error: warrantyError } = await supabase
          .from('warranties')
          .insert({
            user_id: user.id,
            order_id: orderId,
            item_id: itemId,
            purchase_date: purchaseDate,
            warranty_expiration: expirationDate.toISOString(),
            status: 'active'
          })
          .select()
          .single();

        if (warrantyError) {
          return NextResponse.json(
            { error: 'Failed to register warranty' },
            { status: 500 }
          );
        }

        return NextResponse.json(warranty);

      case 'claim_warranty':
        const { warrantyId, claimReason, description } = data;
        
        // Check if warranty exists and is active
        const { data: existingWarranty, error: checkError } = await supabase
          .from('warranties')
          .select('*')
          .eq('id', warrantyId)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (checkError || !existingWarranty) {
          return NextResponse.json(
            { error: 'Warranty not found or not active' },
            { status: 404 }
          );
        }

        // Check if warranty is still valid
        if (new Date() > new Date(existingWarranty.warranty_expiration)) {
          return NextResponse.json(
            { error: 'Warranty has expired' },
            { status: 400 }
          );
        }

        // Create warranty claim
        const { data: claim, error: claimError } = await supabase
          .from('warranty_claims')
          .insert({
            warranty_id: warrantyId,
            claim_reason: claimReason,
            description: description,
            status: 'pending',
            claim_date: new Date().toISOString()
          })
          .select()
          .single();

        if (claimError) {
          return NextResponse.json(
            { error: 'Failed to create warranty claim' },
            { status: 500 }
          );
        }

        return NextResponse.json(claim);

      case 'record_construction_warranty':
        const { projectId, itemData } = data;
        
        const constructionWarranty = await SupervisorService.recordWarranty(
          projectId,
          user.id,
          itemData
        );
        
        return NextResponse.json(constructionWarranty);

      case 'update_construction_warranty':
        const { constructionWarrantyId, warrantyStatus, claimDetails } = data;
        
        const updatedWarranty = await SupervisorService.updateWarrantyStatus(
          constructionWarrantyId,
          warrantyStatus,
          claimDetails
        );
        
        return NextResponse.json(updatedWarranty);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Warranty API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process warranty action' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
      case 'my_warranties':
        const { data: warranties, error: warrantiesError } = await supabase
          .from('warranties')
          .select(`
            *,
            global_items (
              name,
              brand,
              image_url
            ),
            warranty_claims (
              id,
              claim_reason,
              status,
              claim_date,
              resolution_date
            )
          `)
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });

        if (warrantiesError) {
          return NextResponse.json(
            { error: 'Failed to fetch warranties' },
            { status: 500 }
          );
        }

        return NextResponse.json(warranties);

      case 'warranty_details':
        const warrantyDetailsId = searchParams.get('warrantyId');
        if (!warrantyDetailsId) {
          return NextResponse.json(
            { error: 'Warranty ID is required' },
            { status: 400 }
          );
        }

        const { data: warranty, error: warrantyError } = await supabase
          .from('warranties')
          .select(`
            *,
            global_items (
              name,
              brand,
              description,
              image_url,
              specifications
            ),
            warranty_claims (
              id,
              claim_reason,
              description,
              status,
              claim_date,
              resolution_date,
              resolution_notes
            )
          `)
          .eq('id', warrantyDetailsId)
          .eq('user_id', user.id)
          .single();

        if (warrantyError) {
          return NextResponse.json(
            { error: 'Warranty not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(warranty);

      case 'expiring_soon':
        const daysAhead = parseInt(searchParams.get('days') || '30', 10);
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);

        const { data: expiringWarranties, error: expiringError } = await supabase
          .from('warranties')
          .select(`
            *,
            global_items (
              name,
              brand,
              image_url
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gte('warranty_expiration', new Date().toISOString())
          .lte('warranty_expiration', futureDate.toISOString())
          .order('warranty_expiration', { ascending: true });

        if (expiringError) {
          return NextResponse.json(
            { error: 'Failed to fetch expiring warranties' },
            { status: 500 }
          );
        }
        
        return NextResponse.json(expiringWarranties);

      case 'project_warranties':
        const projectWarrantiesId = searchParams.get('projectId');
        let query = supabase
          .from('warranty_records')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (projectWarrantiesId) {
          query = query.eq('project_id', projectWarrantiesId);
        } else {
          // If no specific project, get warranties related to projects where user is supervisor
          const { data: supervisorData } = await supabase
            .from('construction_supervisors')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (supervisorData) {
            const { data: supervisorProjects } = await supabase
              .from('construction_contracts')
              .select('project_id')
              .eq('supervisor_id', supervisorData.id);
              
            if (supervisorProjects && supervisorProjects.length > 0) {
              query = query.in('project_id', supervisorProjects.map(p => p.project_id));
            }
          }
        }
        
        const { data: projectWarranties, error: projectWarrantiesError } = await query;
        
        if (projectWarrantiesError) {
          return NextResponse.json(
            { error: 'Failed to fetch project warranties' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({ warranties: projectWarranties });

      case 'construction_warranties':
        const constructionProjectId = searchParams.get('projectId');
        if (!constructionProjectId) {
          return NextResponse.json(
            { error: 'Project ID is required' },
            { status: 400 }
          );
        }
        
        const constructionWarranties = await SupervisorService.getProjectWarranties(constructionProjectId);
        return NextResponse.json(constructionWarranties);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Warranty GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warranty data' },
      { status: 500 }
    );
  }
}


