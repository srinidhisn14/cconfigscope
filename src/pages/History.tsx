import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import { ImpactBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

export function HistoryPage() {
  const { history, clearAllHistory } = useAnalysis()

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis history</h1>
          <p className="mt-2 text-sm text-slate-400">
            Stored in your browser localStorage (max 50 entries).
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all analysis history?')) clearAllHistory()
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:border-rose-500/40 hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
            Clear history
          </button>
        )}
      </header>

      <Card>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No saved analyses yet.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {history.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-100">{h.summary.configKey}</p>
                  <p className="text-xs text-slate-500">
                    {h.summary.repositoryUrl} · {h.summary.environment}
                  </p>
                  <p className="text-xs text-slate-600">
                    {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-sm text-slate-400">
                    {h.summary.blastRadiusScore}
                  </span>
                  <ImpactBadge level={h.summary.impactLevel} />
                  <Link
                    to={`/results/${h.id}`}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-blue-300 hover:bg-slate-700"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
