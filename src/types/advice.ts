// Construction Advice AI - shared types

export interface SbcReference {
  code: string
  description_en: string
  description_ar: string
  url?: string
}

export interface ExternalReference {
  title_en: string
  title_ar: string
  url: string
  source?: string
}

export interface MediaReference {
  type: 'image' | 'video' | 'link'
  url: string
  title_en?: string
  title_ar?: string
  caption_en?: string
  caption_ar?: string
  alt?: string
}

export interface TwitterReference {
  id: string
  text: string
  authorName: string
  authorUsername: string
  authorProfileImage: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

export interface Advice {
  text_en: string
  text_ar: string
  sbcReferences?: SbcReference[]
  externalReferences?: ExternalReference[]
  mediaReferences?: MediaReference[]
  twitterReferences?: TwitterReference[]
}
