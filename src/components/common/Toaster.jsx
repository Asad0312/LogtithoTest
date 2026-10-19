import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import './Toaster.css'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

export default function Toaster() {
  const { toasts, dismissToast } = useApp()

  if (!toasts.length) return null

  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <Icon size={17} className="toast-icon" />
            <p className="toast-message">{toast.message}</p>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
