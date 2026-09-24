import { Link } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import { DependencyGraph } from '../components/graph/DependencyGraph'
import { Card } from '../components/ui/Card'

export function DependencyGraphPage() {
  const { currentResult, history } = useAnalysis()
  const result = currentResult ?? history[0]?.result ?? null

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white">Dependency graph</h1>
        <p className="mt-2 text-sm text-slate-400">
          Interactive topology for the most recent analysis. Run an analysis to refresh highlights.
        </p>
      </header>

      {!result ? (
        <Card>
          <p className="text-slate-400">No analysis loaded.</p>
          <Link to="/analyze" className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300">
            Create new analysis →
          </Link>
        </Card>
      ) : (
        <>
          <Card className="text-sm text-slate-400">
            Showing blast radius for{' '}
            <span className="text-slate-200">{result.input.configKey}</span> (
            {result.impactLevel} impact, score {result.blastRadiusScore})
          </Card>
          <DependencyGraph result={result} height={560} />
        </>
      )}
    </div>
  )
}
