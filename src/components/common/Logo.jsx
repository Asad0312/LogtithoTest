import './Logo.css'

export default function Logo({ size = 30, withText = true, to = '/' }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#4f46e5" />
        <path
          d="M10.5 8v13.2a1.3 1.3 0 0 0 1.3 1.3h8.4"
          stroke="#fff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="21.8" cy="10.6" r="2.1" fill="#c7d2fe" />
      </svg>
      {withText ? (
        <span className="logo-text">
          Logrithoo{to ? null : ''}
        </span>
      ) : null}
    </span>
  )
}
