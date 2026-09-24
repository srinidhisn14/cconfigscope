import { AlertTriangle, Target, TrendingUp } from 'lucide-react'
import type { AnalysisResult } from '../../types/analysis'
import { ImpactBadge } from '../ui/Badge'
import { Card } from '../ui/Card'

export function BlastRadiusSummary({ result }: { result: AnalysisResult }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 animate-fade-in">
      <Card className="sm:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Blast radius
            </p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-white">
              {result.blastRadiusScore}
            </p>
            <p className="mt-1 text-sm text-slate-400">Score out of 100</p>
          </div>
          <TrendingUp className="h-5 w-5 text-blue-400" />
        </div>
        <div className="mt-4">
          <ImpactBadge level={result.impactLevel} />
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-2 text-slate-400">
          <Target className="h-4 w-4" />
          <p className="text-xs font-medium uppercase tracking-wider">Direct</p>
        </div>
        <p className="mt-2 text-3xl font-semibold text-white">{result.directCount}</p>
        <p className="mt-1 text-sm text-slate-500">Components reading or bound to the config key</p>
      </Card>
      <Card>
        <div className="flex items-center gap-2 text-slate-400">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-xs font-medium uppercase tracking-wider">Indirect</p>
        </div>
        <p className="mt-2 text-3xl font-semibold text-white">{result.indirectCount}</p>
        <p className="mt-1 text-sm text-slate-500">Downstream services in the dependency chain</p>
      </Card>
    </div>
  )
}
