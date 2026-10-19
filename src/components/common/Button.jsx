import './Button.css'

export default function Button({
  variant = 'primary',
  size = 'md',
  as: As = 'button',
  loading = false,
  disabled = false,
  icon = null,
  children,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, loading ? 'is-loading' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <As className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : icon}
      {children ? <span className="btn-label">{children}</span> : null}
    </As>
  )
}
