// @ts-nocheck
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Placeholder API route to prevent CloudFlare sockets import error
  return NextResponse.json({
    api_keys: [],
    count: 0,
    offset: 0,
    limit: 10,
  })
}

export async function POST(request: NextRequest) {
  // Placeholder API route to prevent CloudFlare sockets import error
  const body = await request.json()
  return NextResponse.json({
    api_key: {
      id: "temp_key_id",
      title: body.title || "Temporary Key",
      type: body.type || "publishable",
      created_at: new Date().toISOString(),
    }
  })
}


