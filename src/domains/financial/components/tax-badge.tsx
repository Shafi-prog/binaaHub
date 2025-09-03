// @ts-nocheck
import { TaxExclusive, TaxInclusive } from "@platform/icons"
import { Tooltip } from "@platform/ui"
import { useTranslation } from "react-i18next"

type IncludesTaxTooltipProps = {
  includesTax?: boolean
}

export const IncludesTaxTooltip = ({
  includesTax,
}: IncludesTaxTooltipProps) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      maxWidth={999}
      content={
        includesTax
          ? t("general.includesTaxTooltip")
          : t("general.excludesTaxTooltip")
      }
    >
      {includesTax ? (
        <TaxInclusive className="text-ui-fg-muted shrink-0" />
      ) : (
        <TaxExclusive className="text-ui-fg-muted shrink-0" />
      )}
    </Tooltip>
  )
}





