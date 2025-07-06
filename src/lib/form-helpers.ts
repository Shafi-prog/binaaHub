export const transformNullableFormData = <T>(data: T): T => {
  if (data === null || data === undefined) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(transformNullableFormData) as T
  }

  if (typeof data === 'object') {
    const transformed = {} as T
    for (const [key, value] of Object.entries(data)) {
      if (value === '') {
        ;(transformed as any)[key] = null
      } else {
        ;(transformed as any)[key] = transformNullableFormData(value)
      }
    }
    return transformed
  }

  return data
}

export const cleanFormData = <T>(data: T): T => {
  if (data === null || data === undefined) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(cleanFormData).filter(Boolean) as T
  }

  if (typeof data === 'object') {
    const cleaned = {} as T
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== '') {
        ;(cleaned as any)[key] = cleanFormData(value)
      }
    }
    return cleaned
  }

  return data
}

export const normalizeFormData = <T>(data: T): T => {
  return transformNullableFormData(cleanFormData(data))
}
