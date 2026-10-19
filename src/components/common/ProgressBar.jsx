import './ProgressBar.css'

export default function ProgressBar({ value = 0, label = null, hint = null }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="progress">
      {label ? (
        <div className="progress-head">
          <span className="progress-label">{label}</span>
          <span className="progress-value">{pct}%</span>
        </div>
      ) : null}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {hint ? <p className="progress-hint">{hint}</p> : null}
    </div>
  )
}
