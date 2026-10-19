import './EmptyState.css'

export default function EmptyState({ icon: Icon, title, description, action = null, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'empty-state-compact' : ''}`}>
      {Icon ? (
        <span className="empty-state-icon">
          <Icon size={compact ? 22 : 28} strokeWidth={1.6} />
        </span>
      ) : null}
      <h3 className="empty-state-title">{title}</h3>
      {description ? <p className="empty-state-desc">{description}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  )
}
