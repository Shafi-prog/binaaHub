// @ts-nocheck
export const castNumber = (value: string | number | undefined | null): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) {
    return undefined
  }
  
  return num
}

export const castToPositiveNumber = (value: string | number | undefined | null): number | undefined => {
  const result = castNumber(value)
  return result !== undefined && result >= 0 ? result : undefined
}

export const castToInteger = (value: string | number | undefined | null): number | undefined => {
  const result = castNumber(value)
  return result !== undefined ? Math.floor(result) : undefined
}


