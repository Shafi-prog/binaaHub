import * as React from "react"

import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({ children, open: controlledOpen, onOpenChange }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

const DialogTrigger = ({ children, asChild }: DialogTriggerProps) => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("DialogTrigger must be used within a Dialog component")
  }

  const handleClick = () => {
    context.onOpenChange(true)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as any)
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children }, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) {
      throw new Error("DialogContent must be used within a Dialog component")
    }

    if (!context.open) {
      return null
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => context.onOpenChange(false)}
        />
        
        {/* Content */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg",
            className
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

const DialogHeader = ({ className, children }: DialogHeaderProps) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
  >
    {children}
  </div>
)

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  )
)
DialogTitle.displayName = "DialogTitle"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
}
