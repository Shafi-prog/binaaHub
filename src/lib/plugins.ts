// Plugin utilities
export function getLoyaltyPlugin(plugins: any[]): any | null {
  if (!plugins) return null
  
  return plugins.find(plugin => 
    plugin.name === 'loyalty' || 
    plugin.type === 'loyalty' ||
    plugin.id === 'loyalty'
  ) || null
}

export function getPaymentPlugin(plugins: any[], providerId: string): any | null {
  if (!plugins) return null
  
  return plugins.find(plugin => 
    plugin.provider_id === providerId ||
    plugin.id === providerId
  ) || null
}

export function getFulfillmentPlugin(plugins: any[], providerId: string): any | null {
  if (!plugins) return null
  
  return plugins.find(plugin => 
    plugin.provider_id === providerId ||
    plugin.id === providerId
  ) || null
}

export function isPluginEnabled(plugin: any): boolean {
  return plugin && plugin.enabled !== false
}

export function getPluginConfig(plugin: any): any {
  return plugin?.config || {}
}

export function getPluginOptions(plugin: any): any {
  return plugin?.options || {}
}
