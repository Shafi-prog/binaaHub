// @ts-nocheck
'use client'


// Force dynamic rendering to avoid SSG auth context issues
import { OrderListTable } from "./components/order-list-table"
import { SingleColumnPage } from "@/components/layout/pages"


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid static generation issues

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
