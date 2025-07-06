import React, { createContext, useContext, ReactNode } from "react"
import { Shortcut, ShortcutType } from "../types"

interface KeybindContextType {
  shortcuts: Shortcut[]
  addShortcut: (shortcut: Shortcut) => void
  removeShortcut: (id: string) => void
  getShortcutsByType: (type: ShortcutType) => Shortcut[]
}

const KeybindContext = createContext<KeybindContextType | null>(null)

interface KeybindProviderProps {
  children: ReactNode
  shortcuts?: Shortcut[]
}

export function KeybindProvider({ children, shortcuts: initialShortcuts = [] }: KeybindProviderProps) {
  const defaultShortcuts: Shortcut[] = [
    {
      id: "global-search",
      to: "/search",
      label: "Global Search",
      keys: { Mac: ["⌘", "K"], Windows: ["Ctrl", "K"] },
      category: "navigation"
    },
    {
      id: "orders",
      to: "/orders",
      label: "Orders",
      keys: { Mac: ["⌘", "O"], Windows: ["Ctrl", "O"] },
      category: "navigation"
    },
    {
      id: "products",
      to: "/products",
      label: "Products",
      keys: { Mac: ["⌘", "P"], Windows: ["Ctrl", "P"] },
      category: "navigation"
    },
    {
      id: "customers",
      to: "/customers",
      label: "Customers",
      keys: { Mac: ["⌘", "U"], Windows: ["Ctrl", "U"] },
      category: "navigation"
    }
  ]

  const shortcuts = [...defaultShortcuts, ...initialShortcuts]

  const addShortcut = (shortcut: Shortcut) => {
    // Implementation would add to state
  }

  const removeShortcut = (id: string) => {
    // Implementation would remove from state
  }

  const getShortcutsByType = (type: ShortcutType) => {
    return shortcuts.filter(s => s.category === type)
  }

  return React.createElement(
    KeybindContext.Provider,
    {
      value: {
        shortcuts,
        addShortcut,
        removeShortcut,
        getShortcutsByType
      }
    },
    children
  )
}

export { KeybindContext }
