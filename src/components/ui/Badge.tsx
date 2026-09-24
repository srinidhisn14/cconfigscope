import type { ImpactLevel } from '../../types/analysis'

const impactStyles: Record<ImpactLevel, string> = {
  Low: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  High: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
}

export function ImpactBadge({ level }: { level: ImpactLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${impactStyles[level]}`}
    >
      {level} impact
    </span>
  )
}
