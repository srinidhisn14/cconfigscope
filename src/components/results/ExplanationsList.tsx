import { HelpCircle } from 'lucide-react'
import type { FlagExplanation } from '../../types/analysis'
import { Card } from '../ui/Card'

export function ExplanationsList({ items }: { items: FlagExplanation[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Why was this flagged?</h2>
      </div>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li
            key={`${item.componentId}-${item.title}`}
            className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
          >
            <p className="font-medium text-slate-100">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.detail}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
