// @ts-nocheck
import { useCallback, useRef, useState } from 'react'

export interface Command {
  id?: string
  execute: () => void
  undo: () => void
  description?: string
}

export interface CommandHistory {
  commands: Command[]
  currentIndex: number
  canUndo: boolean
  canRedo: boolean
  execute: (command: Command) => void
  undo: () => void
  redo: () => void
  clear: () => void
}

export function useCommandHistory(): CommandHistory {
  const [commands, setCommands] = useState<Command[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const commandIdCounter = useRef(0)

  const execute = useCallback((command: Command) => {
    // Generate unique ID if not provided
    const commandWithId = {
      ...command,
      id: command.id || `cmd_${commandIdCounter.current++}`,
    }

    // Execute the command
    commandWithId.execute()

    // Add to history (remove any commands after current index)
    setCommands(prev => {
      const newCommands = prev.slice(0, currentIndex + 1)
      return [...newCommands, commandWithId]
    })
    
    setCurrentIndex(prev => prev + 1)
  }, [currentIndex])

  const undo = useCallback(() => {
    if (currentIndex >= 0 && commands[currentIndex]) {
      commands[currentIndex].undo()
      setCurrentIndex(prev => prev - 1)
    }
  }, [commands, currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < commands.length - 1) {
      const nextCommand = commands[currentIndex + 1]
      if (nextCommand) {
        nextCommand.execute()
        setCurrentIndex(prev => prev + 1)
      }
    }
  }, [commands, currentIndex])

  const clear = useCallback(() => {
    setCommands([])
    setCurrentIndex(-1)
  }, [])

  const canUndo = currentIndex >= 0
  const canRedo = currentIndex < commands.length - 1

  return {
    commands,
    currentIndex,
    canUndo,
    canRedo,
    execute,
    undo,
    redo,
    clear,
  }
}


