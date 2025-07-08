// @ts-nocheck
export const formatCurrency = (
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    }).format(amount / 100) // Assuming amount is in cents
  } catch (error) {
    // Fallback for invalid currency codes
    return `${(amount / 100).toFixed(2)} ${currencyCode.toUpperCase()}`
  }
}

export const formatAmount = (
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string => {
  return formatCurrency(amount, currencyCode, locale)
}


