// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { ordersQueryKeys } from "@/domains/shared/hooks/api/orders"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"
import { DEFAULT_FIELDS } from "./constants"

const orderDetailQuery = (id: string) => ({
  queryKey: ordersQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.order.retrieve(id, {
      fields: DEFAULT_FIELDS,
    }),
})

export const orderLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = orderDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}


