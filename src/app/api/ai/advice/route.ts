import { NextRequest, NextResponse } from 'next/server'
import type { Advice, SbcReference, ExternalReference, MediaReference, TwitterReference } from '@/types/advice'

// Minimal, safe mock to replace legacy AI advice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectType = 'residential', constructionPhase = 'planning', location = 'KSA', specificQuestion = '' } = body || {}

    const text_en = `Advice for ${projectType} - ${constructionPhase} in ${location}. ${specificQuestion ? 'Question: ' + specificQuestion : ''}`
    const text_ar = `نصيحة لمشروع ${projectType} - مرحلة ${constructionPhase} في ${location}. ${specificQuestion ? 'سؤال: ' + specificQuestion : ''}`

    const sbcReferences: SbcReference[] = [
      { code: 'SBC 201', description_en: 'General Requirements', description_ar: 'المتطلبات العامة' },
      { code: 'SBC 303', description_en: 'Structural Design', description_ar: 'التصميم الإنشائي' }
    ]

    const advice: Advice = {
      text_en,
      text_ar,
      sbcReferences,
      externalReferences: [] as ExternalReference[],
      mediaReferences: [] as MediaReference[],
      twitterReferences: [] as TwitterReference[]
    }

    return NextResponse.json(advice)
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate advice', details: String(err?.message || err) }, { status: 400 })
  }
}
