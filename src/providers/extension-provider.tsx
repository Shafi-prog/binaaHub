"use client"
// @ts-nocheck
import React, { createContext, useContext } from 'react'

interface ExtensionContextType {
  extensions: any[]
  getWidgets: (location: string) => any[]
  getMenu: (location: string) => any[]
}

const ExtensionContext = createContext<ExtensionContextType>({ 
  extensions: [],
  getWidgets: () => [],
  getMenu: () => []
})

export const ExtensionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ExtensionContext.Provider value={{ 
      extensions: [],
      getWidgets: () => [],
      getMenu: () => []
    }}>
      {children}
    </ExtensionContext.Provider>
  )
}

export const useExtension = () => {
  const context = useContext(ExtensionContext)
  if (!context) {
    throw new Error('useExtension must be used within an ExtensionProvider')
  }
  return context
}


