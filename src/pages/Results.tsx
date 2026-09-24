import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useAnalysis } from '../context/AnalysisContext'
import { getAnalysisById } from '../storage/history'
import type { AnalysisResult } from '../types/analysis'
import { BlastRadiusSummary } from '../components/results/BlastRadiusSummary'
import { AffectedTable } from '../components/results/AffectedTable'
import { ExplanationsList } from '../components/results/ExplanationsList'
import { RiskAndPrecautions } from '../components/results/RiskAndPrecautions'
import { DependencyGraph } from '../components/graph/DependencyGraph'
import { Card } from '../components/ui/Card'

export function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentResult, loadResult, setCurrentResult } = useAnalysis()
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    if (!id) {
      setResult(currentResult)
      return
    }
    if (currentResult?.id === id) {
      setResult(currentResult)
      return
    }
    const loaded = loadResult(id) ?? getAnalysisById(id)
    if (loaded) {
      setCurrentResult(loaded)
      setResult(loaded)
    } else {
      setResult(null)
    }
  }, [id, currentResult, loadResult, setCurrentResult])

  if (!result) {
    return (
      <div className="animate-fade-in space-y-4">
        <p className="text-slate-400">Analysis not found.</p>
        <Link to="/analyze" className="text-blue-400 hover:text-blue-300">
          Start a new analysis
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Analysis results</h1>
          <p className="mt-2 text-sm text-slate-400">
            <code className="text-slate-300">{result.input.configKey}</code>
            {' · '}
            {result.input.environment}
            {result.input.isDemo && (
              <span className="ml-2 rounded bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
                Demo
              </span>
            )}
          </p>
        </div>
        <Link
          to="/graph"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Full graph view
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </header>

      <BlastRadiusSummary result={result} />

      <Card>
        <h2 className="text-lg font-semibold text-white">Dependency graph</h2>
        <p className="mt-1 text-sm text-slate-500">
          Highlighted nodes and animated edges are within the computed blast radius.
        </p>
        <div className="mt-4">
          <DependencyGraph result={result} height={440} />
        </div>
      </Card>

      <AffectedTable components={result.affectedComponents} />
      <ExplanationsList items={result.explanations} />
      <RiskAndPrecautions
        riskFactors={result.riskFactors}
        precautions={result.precautions}
      />

      <Card className="text-sm text-slate-400">
        <p>
          <span className="text-slate-300">Repository:</span> {result.input.repositoryUrl}
        </p>
        <p className="mt-1">
          <span className="text-slate-300">Branch:</span> {result.input.branch}
        </p>
        <p className="mt-1">
          <span className="text-slate-300">Change:</span> "{result.input.previousValue}" → "
          {result.input.newValue}"
        </p>
        {result.input.changeDescription && (
          <p className="mt-2 text-slate-500">{result.input.changeDescription}</p>
        )}
      </Card>
    </div>
  )
}
