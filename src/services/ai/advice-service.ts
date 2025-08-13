// Lightweight Construction Advice AI service (mock). Replace later with real logic.
import type { Advice, SbcReference } from '@/types/advice'

export interface AdviceRequest {
  projectType: string
  constructionPhase: string
  location: string
  budget?: number
  soilType?: string
  specificQuestion?: string
}

export async function getConstructionAdvice(req: AdviceRequest): Promise<Advice> {
  const { projectType, constructionPhase, location, specificQuestion } = req
  const text_en = `Advice for ${projectType} - ${constructionPhase} in ${location}. ${specificQuestion ? 'Question: ' + specificQuestion : ''}`
  const text_ar = `نصيحة لمشروع ${projectType} - مرحلة ${constructionPhase} في ${location}. ${specificQuestion ? 'سؤال: ' + specificQuestion : ''}`

  const sbcReferences: SbcReference[] = [
    { code: 'SBC 201', description_en: 'General Requirements', description_ar: 'المتطلبات العامة' },
    { code: 'SBC 303', description_en: 'Structural Design', description_ar: 'التصميم الإنشائي' }
  ]

  return { text_en, text_ar, sbcReferences }
}
