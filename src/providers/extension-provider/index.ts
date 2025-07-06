import React, { createContext, useContext, ReactNode } from "react"
import { ExtensionContextType } from "../types"

const ExtensionContext = createContext<ExtensionContextType | null>(null)

interface ExtensionProviderProps {
  children: ReactNode
}

export function ExtensionProvider({ children }: ExtensionProviderProps) {
  const getMenu = (type: string) => {
    // Mock implementation - return empty array for now
    return []
  }

  const getFormConfigs = () => {
    return {}
  }

  const getFormFields = (zone: string) => {
    return []
  }

  const getDisplays = (type: string, zone: string) => {
    return []
  }

  return React.createElement(
    ExtensionContext.Provider,
    {
      value: {
        getMenu,
        getFormConfigs,
        getFormFields,
        getDisplays
      }
    },
    children
  )
}

export const useExtensions = () => {
  const context = useContext(ExtensionContext)
  if (!context) {
    throw new Error("useExtensions must be used within an ExtensionProvider")
  }
  return context
}

export { ExtensionContext }
