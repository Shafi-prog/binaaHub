// @ts-nocheck
'use client'


// Force dynamic rendering to avoid SSG auth context issues
import { SingleColumnPage } from "@/components/layout/pages"
import { CustomerListTable } from "./components/customer-list-table"


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid static generation issues

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

