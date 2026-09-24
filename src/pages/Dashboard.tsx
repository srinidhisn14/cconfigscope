import { ArrowRight, FlaskConical, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_ANALYSIS_INPUT } from '../data/systemGraph'
import { useAnalysis } from '../context/AnalysisContext'
import { ImpactBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

export function DashboardPage() {
  const navigate = useNavigate()
  const { history, runAnalysis } = useAnalysis()
  const latest = history[0]

  const runDemo = () => {
    const result = runAnalysis(DEMO_ANALYSIS_INPUT)
    navigate(`/results/${result.id}`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          ConfigScope maps configuration changes to dependency blast radius using a
          rule-based engine. Input a key and values, then see what could break and why.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles className="h-5 w-5" />
              <h2 className="font-semibold text-white">Start a new analysis</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Enter repository context, environment, and config diff. No GitHub token required
              for demo mode.
            </p>
          </div>
          <Link
            to="/analyze"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Open analysis form
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-400">
              <FlaskConical className="h-5 w-5" />
              <h2 className="font-semibold text-white">Demo analysis</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Pre-filled Production change to <code className="text-slate-300">database.pool.max</code>{' '}
              with realistic dependency chain through Order, Payment, and Notification services.
            </p>
          </div>
          <button
            type="button"
            onClick={runDemo}
            className="mt-6 w-fit rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
          >
            Run demo & view results
          </button>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-white">Recent analyses</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No history yet — run your first analysis.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-800">
            {history.slice(0, 5).map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-slate-200">{h.summary.configKey}</p>
                  <p className="text-xs text-slate-500">
                    {h.summary.environment} · {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums text-slate-400">
                    Score {h.summary.blastRadiusScore}
                  </span>
                  <ImpactBadge level={h.summary.impactLevel} />
                  <Link
                    to={`/results/${h.id}`}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        {latest && (
          <p className="mt-4 text-xs text-slate-600">
            Latest: {latest.summary.repositoryUrl.replace('https://github.com/', '')}
          </p>
        )}
      </Card>
    </div>
  )
}
