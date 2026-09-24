import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
