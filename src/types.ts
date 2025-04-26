// الطلب
export type Order = {
  id: number
  item: string
  date: string
  status?: string
}

// الضمان
export type Warranty = {
  id: number
  item: string
  store: string
  purchaseDate: string
  warrantyYears: number
  expiryDate: string
  isActive: boolean
}

// المشروع
export type Project = {
  id: number
  name: string
  stage: string
  progress: number
}

// المستخدم
export type User = {
  id: string
  name: string
  email?: string
}
