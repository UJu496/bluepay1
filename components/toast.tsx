import { useState, useEffect } from "react"
import { Check } from "lucide-react"

interface ToastProps {
  message: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([])

  const showToast = (message: string, duration = 2000) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)
  }

  return { toasts, showToast }
}

export function Toast({ message, duration = 2000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50 animate-fade-in">
      <Check size={18} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export function ToastContainer({ toasts }: { toasts: Array<{ id: string; message: string }> }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg animate-fade-in"
        >
          <Check size={18} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
