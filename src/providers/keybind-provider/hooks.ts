// @ts-nocheck
// src/providers/keybind-provider/hooks.ts
import { useContext } from 'react'
import { KeybindContext } from './index'

export const useGlobalShortcuts = () => {
  const context = useContext(KeybindContext)
  if (!context) {
    throw new Error('useGlobalShortcuts must be used within a KeybindProvider')
  }
  return context.shortcuts || []
}


