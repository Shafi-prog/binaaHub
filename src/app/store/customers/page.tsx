// @ts-nocheck
'use client'

import { SingleColumnPage } from "@/components/layout/pages"
import { CustomerListTable } from "./components/customer-list-table"

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

const CustomersList = () => {
  // Simplified version without extension widgets for now
  const getWidgets = () => []

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("customer.list.after"),
        before: getWidgets("customer.list.before"),
      }}
    >
      <CustomerListTable />
    </SingleColumnPage>
  )
}

export default CustomersList;

