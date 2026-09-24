import type { AffectedComponent } from '../../types/analysis'
import { Card } from '../ui/Card'

export function AffectedTable({ components }: { components: AffectedComponent[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">Affected components</h2>
      <p className="mt-1 text-sm text-slate-500">
        Direct and transitive dependencies flagged by the rule engine.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-3 pr-4 font-medium">Component</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium">Impact</th>
              <th className="pb-3 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {components.map((c) => (
              <tr key={c.id} className="text-slate-300">
                <td className="py-3 pr-4 font-medium text-slate-100">{c.name}</td>
                <td className="py-3 pr-4 capitalize text-slate-400">{c.kind}</td>
                <td className="py-3 pr-4">
                  <span
                    className={
                      c.impact === 'direct'
                        ? 'text-blue-300'
                        : 'text-amber-300/90'
                    }
                  >
                    {c.impact}
                  </span>
                </td>
                <td className="py-3 text-slate-400">{c.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
