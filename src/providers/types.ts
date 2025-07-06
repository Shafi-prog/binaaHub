// Keybind Provider Types
export interface Shortcut {
  id: string
  to: string
  label: string
  keys: {
    Mac?: string[]
    Windows?: string[]
  }
  category?: string
}

export type ShortcutType = "navigation" | "action" | "command"

export interface KeybindProviderProps {
  children: React.ReactNode;
  shortcuts?: Shortcut[];
}

// Extension Context Types
export interface ExtensionContextType {
  getMenu: (type: string) => any[]
  getFormConfigs?: () => any
  getFormFields?: (zone: string) => any[]
  getDisplays?: (type: string, zone: string) => any[]
}

// Theme Types
export interface ThemeContextType {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
}
