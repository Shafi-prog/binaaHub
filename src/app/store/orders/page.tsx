// @ts-nocheck
'use client'

import { OrderListTable } from "./components/order-list-table"
import { SingleColumnPage } from "@/components/layout/pages"

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'

const OrderList = () => {
  // Simplified version without extension widgets for now
  const getWidgets = () => []

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("order.list.after"),
        before: getWidgets("order.list.before"),
      }}
      hasOutlet={false}
    >
      <OrderListTable />
    </SingleColumnPage>
  )
}

export default OrderList;
