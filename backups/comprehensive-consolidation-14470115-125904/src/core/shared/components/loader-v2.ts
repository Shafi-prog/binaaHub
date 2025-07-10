// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { productsQueryKeys } from "@/domains/shared/hooks/api/products"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"
import { PRODUCT_DETAIL_FIELDS } from "./constants"

const productDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id, { fields: PRODUCT_DETAIL_FIELDS }),
  queryFn: async () =>
    sdk.admin.product.retrieve(id, { fields: PRODUCT_DETAIL_FIELDS }),
})

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = productDetailQuery(id!)

  const response = await queryClient.ensureQueryData({
    ...query,
    staleTime: 90000,
  })

  return response
}


