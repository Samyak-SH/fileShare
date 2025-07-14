"use client"

import type React from "react"

import { forwardRef, useState, useEffect, useRef, useCallback, createContext, type ReactNode } from "react"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = createContext<{
  addToast: (toast: ToastDetails) => void
  removeToast: (id: string) => void
  updateToast: (id: string, toast: Partial<ToastDetails>) => void
}>({
  addToast: () => {},
  removeToast: () => {},
  updateToast: () => {},
})

interface ToastProviderProps {
  children: ReactNode
}

interface ToastDetails {
  id: string
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
  type?: "default" | "destructive"
  onClose?: () => void
}

// const VIEWPORT_GAP = 16

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastDetails[]>([])

  const addToast = useCallback((toast: ToastDetails) => {
    setToasts((prev) => [...prev, toast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const updateToast = useCallback((id: string, toast: Partial<ToastDetails>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...toast } : t)))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, updateToast }}>
      {children}
      <ToastViewport toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  )
}

interface ToastViewportProps {
  toasts: ToastDetails[]
  onRemoveToast: (id: string) => void
}

const ToastViewport = ({ toasts, onRemoveToast }: ToastViewportProps) => {
  const [viewportPaused, setViewportPaused] = useState(false)

  return (
    <div
      className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 m-6 w-full max-w-[380px] pointer-events-none"
      onMouseEnter={() => setViewportPaused(true)}
      onMouseLeave={() => setViewportPaused(false)}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          pauseDuration={viewportPaused ? Number.POSITIVE_INFINITY : undefined}
          onDismiss={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps extends ToastDetails {
  pauseDuration?: number
  onDismiss?: () => void
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, action, duration = 5000, type = "default", onClose, pauseDuration, onDismiss }, ref) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
      if (!visible) return

      const handleDismiss = () => {
        setVisible(false)
        onDismiss?.()
      }

      timerRef.current = setTimeout(handleDismiss, duration)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      }
    }, [duration, onDismiss, visible])

    useEffect(() => {
      if (pauseDuration === Number.POSITIVE_INFINITY) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      } else if (timerRef.current) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          setVisible(false)
          onDismiss?.()
        }, duration)
      }
    }, [duration, onDismiss, pauseDuration])

    const handleClose = () => {
      setVisible(false)
      onClose?.()
      onDismiss?.()
    }

    return (
      visible && (
        <div
          ref={ref}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center overflow-hidden rounded-md border bg-background px-4 py-2 shadow-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:zoom-out-95 data-[side=top]:border-b data-[side=bottom]:border-t",
            type === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
            "border-border",
          )}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action && (
            <ToastAction altLabel={action.label} onClick={action.onClick}>
              {action.label}
            </ToastAction>
          )}
          <ToastClose onClick={handleClose} />
        </div>
      )
    )
  },
)
Toast.displayName = "Toast"

const ToastTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm font-semibold [&+div]:text-xs", className)} {...props} />
  ),
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm opacity-70", className)} {...props} />,
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-sm opacity-0 transition-opacity hover:opacity-50 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-50 group-focus:opacity-100",
        className,
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  ),
)
ToastClose.displayName = "ToastClose"

interface ToastActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  altLabel?: string
}

const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(({ className, altLabel, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "ml-auto inline-flex h-8 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 disabled:pointer-events-none data-[state=open]:bg-secondary/80",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

export { Toast, ToastViewport, ToastTitle, ToastDescription, ToastClose, ToastAction }
