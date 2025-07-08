// @ts-nocheck
import { NextResponse } from 'next/server';
import { createFallbackResponse, isMedusaBackendAvailable } from '../api-route-fallback';

export const POST = async (req: any) => {
  if (!isMedusaBackendAvailable()) {
    return createFallbackResponse();
  }

  try {
    // Dynamically import Medusa modules only when backend is available
    const { createFulfillmentWorkflow } = await import("@medusajs/core-flows");
    const { refetchFulfillment } = await import("./helpers");
    
    const { result: fullfillment } = await createFulfillmentWorkflow(
      req.scope
    ).run({
      input: {
        ...req.validatedBody,
        created_by: req.auth_context.actor_id,
      },
    })

    const fulfillment = await refetchFulfillment(
      fullfillment.id,
      req.scope,
      req.queryConfig.fields
    )

    return NextResponse.json({ fulfillment }, { status: 200 });
  } catch (error) {
    console.error('Fulfillment API error:', error);
    return createFallbackResponse();
  }
}