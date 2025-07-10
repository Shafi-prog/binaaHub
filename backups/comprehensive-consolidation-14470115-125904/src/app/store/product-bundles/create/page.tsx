// @ts-nocheck
'use client'


// Force dynamic rendering to avoid SSG auth context issues
import ProductBundleEdit from "../[id]/edit/page"



export const dynamic = 'force-dynamic'
export default function CreateProductBundle() {
  return <ProductBundleEdit />
}


