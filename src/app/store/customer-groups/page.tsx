'use client'

import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { CustomerGroupListTable } from "../../../components/customers/customer-groups/customer-group-list-table"

export default function CustomerGroupsList() {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("customer_group.list.after"),
        before: getWidgets("customer_group.list.before"),
      }}
    >
      <CustomerGroupListTable />
    </SingleColumnPage>
  )
}
