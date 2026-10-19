import './Tooltip.css'

export default function Tooltip({ label, children, placement = 'bottom' }) {
  return (
    <span className={`tooltip tooltip-${placement}`} data-tip={label}>
      {children}
    </span>
  )
}
