// Currency information for the system

export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  symbol_native: string
  decimal_digits: number
}

export const currencies: Record<string, CurrencyInfo> = {
  SAR: {
    code: 'SAR',
    name: 'Saudi Arabian Riyal',
    symbol: 'ر.س',
    symbol_native: 'ر.س',
    decimal_digits: 2,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbol_native: '$',
    decimal_digits: 2,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbol_native: '€',
    decimal_digits: 2,
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    symbol_native: 'د.إ',
    decimal_digits: 2,
  },
  KWD: {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    symbol: 'د.ك',
    symbol_native: 'د.ك',
    decimal_digits: 3,
  },
  BHD: {
    code: 'BHD',
    name: 'Bahraini Dinar',
    symbol: 'د.ب',
    symbol_native: 'د.ب',
    decimal_digits: 3,
  },
  QAR: {
    code: 'QAR',
    name: 'Qatari Riyal',
    symbol: 'ر.ق',
    symbol_native: 'ر.ق',
    decimal_digits: 2,
  },
  OMR: {
    code: 'OMR',
    name: 'Omani Rial',
    symbol: 'ر.ع.',
    symbol_native: 'ر.ع.',
    decimal_digits: 3,
  },
}

export const getCurrencyInfo = (code: string): CurrencyInfo => {
  return currencies[code] || currencies.SAR
}

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyInfo(currencyCode)
  return `${currency.symbol} ${amount.toFixed(currency.decimal_digits)}`
}
