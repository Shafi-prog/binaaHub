export const isFetchError = (error: unknown): error is { status: number; message: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as any).status === 'number'
  )
}

export const isNetworkError = (error: unknown): boolean => {
  return isFetchError(error) && error.status >= 500
}

export const isClientError = (error: unknown): boolean => {
  return isFetchError(error) && error.status >= 400 && error.status < 500
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return isFetchError(error) && error.status === 401
}

export const isForbiddenError = (error: unknown): boolean => {
  return isFetchError(error) && error.status === 403
}

export const isNotFoundError = (error: unknown): boolean => {
  return isFetchError(error) && error.status === 404
}
