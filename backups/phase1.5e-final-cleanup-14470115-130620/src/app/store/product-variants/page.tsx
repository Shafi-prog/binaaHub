// @ts-nocheck
'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TwoColumnPageSkeleton } from "@/components/common/skeleton"
import { TwoColumnPage } from "@/components/layout/pages"
import { VariantGeneralSection } from "./components/variant-general-section"
import {
  InventorySectionPlaceholder,
  VariantInventorySection,
} from "./components/variant-inventory-section"

// Force dynamic rendering to avoid SSG auth context issues
import { VariantPricesSection } from "./components/variant-prices-section"


export const dynamic = 'force-dynamic'
// Force dynamic rendering for this page to avoid SSG issues with auth context


// Check if we're in SSR/build environment
const isSSR = typeof window === 'undefined';

// Mock data for variant
const mockVariant = {
  id: "var_123",
  title: "Sample Variant",
  manage_inventory: true,
  inventory_items: [
    {
      inventory: {
        id: "inv_123",
        sku: "SKU-123",
        quantity: 10,
        location: "Warehouse A"
      },
      required_quantity: 1
    }
  ]
}

export default function ProductVariantDetail() {
  // Return a loading skeleton during SSR/build to avoid auth context issues
  if (isSSR) {
    return <TwoColumnPageSkeleton />
  }

  const params = useParams()
  const [variant, setVariant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Mock getWidgets function
  const getWidgets = (section: string) => []

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setVariant(mockVariant)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading || !variant) {
    return (
      <TwoColumnPageSkeleton
        mainSections={2}
        sidebarSections={1}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    return <div>Error loading variant</div>
  }

  return (
    <TwoColumnPage
      data={variant}
      hasOutlet
      showJSON
      showMetadata
      widgets={{
        after: getWidgets("product_variant.details.after"),
        before: getWidgets("product_variant.details.before"),
        sideAfter: getWidgets("product_variant.details.side.after"),
        sideBefore: getWidgets("product_variant.details.side.before"),
      }}
    >
      <TwoColumnPage.Main>
        <VariantGeneralSection variant={variant} />
        {!variant.manage_inventory ? (
          <InventorySectionPlaceholder />
        ) : (
          <VariantInventorySection
            inventoryItems={variant.inventory_items.map((i) => {
              return {
                ...i.inventory,
                required_quantity: i.required_quantity,
                variant,
              }
            })}
          />
        )}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <VariantPricesSection variant={variant} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}


