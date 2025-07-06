export const getLocaleAmount = (
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
    return `${(amount / 100).toFixed(2)} ${currencyCode.toUpperCase()}`
  }
}

export const getStylizedAmount = (
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string => {
  return getLocaleAmount(amount, currencyCode, locale)
}

export const formatAmountWithSymbol = (
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): { formatted: string; symbol: string } => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
    })
    
    const formatted = formatter.format(amount / 100)
    const parts = formatter.formatToParts(amount / 100)
    const symbol = parts.find(part => part.type === 'currency')?.value || currencyCode
    
    return { formatted, symbol }
  } catch (error) {
    return {
      formatted: `${(amount / 100).toFixed(2)} ${currencyCode.toUpperCase()}`,
      symbol: currencyCode.toUpperCase()
    }
  }
}

export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number = 1
): number => {
  if (fromCurrency === toCurrency) return amount
  return Math.round(amount * exchangeRate)
}
