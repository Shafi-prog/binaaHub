// Format provider utilities for payment and fulfillment providers
export function formatProvider(provider: any): string {
  if (!provider) return 'Unknown'
  
  // If provider is a string, return it formatted
  if (typeof provider === 'string') {
    return provider
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // If provider is an object with id
  if (provider.id) {
    return formatProvider(provider.id)
  }
  
  // If provider has a name
  if (provider.name) {
    return provider.name
  }
  
  // If provider has a display_name
  if (provider.display_name) {
    return provider.display_name
  }
  
  return 'Unknown Provider'
}

export function formatProviderName(providerName: string): string {
  return formatProvider(providerName)
}

export function getProviderDisplayName(provider: any): string {
  return formatProvider(provider)
}
