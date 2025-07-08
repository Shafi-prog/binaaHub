// @ts-nocheck
export const useDate = () => {
  const getFullDate = (options: { date?: Date | string | null, includeTime?: boolean }) => {
    if (!options.date) return null
    const d = typeof options.date === 'string' ? new Date(options.date) : options.date
    
    if (options.includeTime) {
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    }
    
    return d.toLocaleDateString()
  }

  const getShortDate = (date: Date | string | null) => {
    if (!date) return null
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', { 
      year: '2-digit', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return {
    getFullDate,
    getShortDate
  }
}


