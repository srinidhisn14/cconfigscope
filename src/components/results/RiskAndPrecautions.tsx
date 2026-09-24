import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { Card } from '../ui/Card'

export function RiskAndPrecautions({
  riskFactors,
  precautions,
}: {
  riskFactors: string[]
  precautions: string[]
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-400" />
          <h2 className="text-lg font-semibold text-white">Main risk factors</h2>
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-400">
          {riskFactors.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Possible precautions</h2>
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-400">
          {precautions.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
