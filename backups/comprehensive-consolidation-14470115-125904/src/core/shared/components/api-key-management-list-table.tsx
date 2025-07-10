// @ts-nocheck
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../data-table"
import { useApiKeys } from "@/domains/shared/hooks/api/api-keys"
import { useDataTable } from "@/domains/shared/hooks/use-data-table"
import { useApiKeyManagementTableColumns } from "./use-api-key-management-table-columns"
import { useApiKeyManagementTableFilters } from "./use-api-key-management-table-filters"
import { useApiKeyManagementTableQuery } from "./use-api-key-management-table-query"

const PAGE_SIZE = 20

export const ApiKeyManagementListTable = ({
  keyType,
}: {
  keyType: "secret" | "publishable"
}) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useApiKeyManagementTableQuery({
    pageSize: PAGE_SIZE,
  })

  const query = {
    ...searchParams,
    type: keyType,
    fields:
      "id,title,redacted,token,type,created_at,updated_at,revoked_at,last_used_at,created_by,revoked_by",
  }

  const { data, isLoading, isError, error } = useApiKeys(query, {
    placeholderData: keepPreviousData,
  })

  const api_keys = data?.api_keys || []
  const count = data?.count || 0

  const filters = useApiKeyManagementTableFilters()
  const columns = useApiKeyManagementTableColumns()

  const { table } = useDataTable({
    data: api_keys || [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row: any) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">
            {keyType === "publishable"
              ? t(`apiKeyManagement.domain.publishable`)
              : t("apiKeyManagement.domain.secret")}
          </Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {keyType === "publishable"
              ? t(`apiKeyManagement.subtitle.publishable`)
              : t("apiKeyManagement.subtitle.secret")}
          </Text>
        </div>
        <Link to="create">
          <Button variant="secondary" size="small">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        data={api_keys || []}
        filters={filters}
        columns={columns as any}
        rowCount={count}
        getRowId={(row: any) => row.id}
        enablePagination
        enableSearch
        heading={t("api-keys")}
        rowHref={(row: any) => `/settings/api-key-management/${row.id}`}
      />
    </Container>
  )
}


