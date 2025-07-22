"use client"

import type React from "react"

import { forwardRef, useState, useEffect, useRef, useCallback, createContext, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
      className="fixed bottom-0 right-0 left-auto top-auto z-[100] flex flex-col gap-2 m-6 w-full max-w-[380px] pointer-events-none"
      onMouseEnter={() => setViewportPaused(true)}
      onMouseLeave={() => setViewportPaused(false)}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            pauseDuration={viewportPaused ? Number.POSITIVE_INFINITY : undefined}
            onDismiss={() => onRemoveToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface ToastProps extends ToastDetails {
  pauseDuration?: number
  onDismiss?: () => void
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, action, duration = 5000, type = "default", onClose, onDismiss }, ref) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [progress, setProgress] = useState(100)

    useEffect(() => {
      let start = Date.now()
      let frame: number
      const tick = () => {
        const elapsed = Date.now() - start
        const percent = Math.max(0, 100 - (elapsed / duration) * 100)
        setProgress(percent)
        if (percent > 0) {
          frame = requestAnimationFrame(tick)
        }
      }
      frame = requestAnimationFrame(tick)
      timerRef.current = setTimeout(() => {
        onDismiss?.()
      }, duration)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        if (frame) cancelAnimationFrame(frame)
      }
    }, [duration, onDismiss])

    const handleClose = () => {
      onClose?.()
      onDismiss?.()
    }

    const accentColor = type === "destructive" ? "bg-red-500" : "bg-cyan-500"
    const progressColor = type === "destructive" ? "bg-red-400" : "bg-cyan-400"

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center overflow-hidden rounded-xl border shadow-lg backdrop-blur-md bg-white/10 dark:bg-black/40 px-5 py-4",
          "transition-all duration-300",
          type === "destructive" ? "border-red-500" : "border-cyan-500"
        )}
        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
      >
        {/* Accent bar */}
        <div className={cn("absolute left-0 top-0 h-full w-1.5", accentColor)} />
        <div className="flex-1 grid gap-1 pl-4">
          {title && (
            <ToastTitle className={type === "destructive" ? "text-red-400" : "text-white font-semibold"}>{title}</ToastTitle>
          )}
          {description && (
            <ToastDescription className={type === "destructive" ? "text-red-300" : "text-gray-200"}>{description}</ToastDescription>
          )}
        </div>
        {action && (
          <ToastAction altLabel={action.label} onClick={action.onClick}>
            {action.label}
          </ToastAction>
        )}
        <button
          onClick={handleClose}
          className={cn(
            "ml-4 flex items-center justify-center rounded-full p-1.5 transition hover:bg-white/20 focus:bg-white/30 focus:outline-none",
            type === "destructive" ? "text-red-400" : "text-cyan-400"
          )}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Progress bar */}
        <div className="absolute left-0 bottom-0 h-1 w-full bg-transparent">
          <div
            className={cn("h-full transition-all duration-100", progressColor)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
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

export { Toast, ToastViewport, ToastTitle, ToastDescription, ToastClose, ToastAction, ToastContext }
