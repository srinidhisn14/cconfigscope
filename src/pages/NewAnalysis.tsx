import { Play, Sparkles } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import { DEMO_ANALYSIS_INPUT } from '../data/systemGraph'
import type { AnalysisInput, Environment } from '../types/analysis'
import { Card } from '../components/ui/Card'

const environments: Environment[] = ['Development', 'Staging', 'Production']

const emptyForm: AnalysisInput = {
  repositoryUrl: '',
  branch: 'main',
  environment: 'Staging',
  configKey: '',
  previousValue: '',
  newValue: '',
  changeDescription: '',
}

export function NewAnalysisPage() {
  const navigate = useNavigate()
  const { runAnalysis } = useAnalysis()
  const [form, setForm] = useState<AnalysisInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof AnalysisInput>(key: K, value: AnalysisInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = (e: FormEvent, demo = false) => {
    e.preventDefault()
    const input = demo ? { ...DEMO_ANALYSIS_INPUT } : { ...form, isDemo: false }

    if (!input.repositoryUrl.trim()) {
      setError('Repository URL is required (or use Demo Analysis).')
      return
    }
    if (!input.configKey.trim() || !input.previousValue.trim() || !input.newValue.trim()) {
      setError('Config key and both values are required.')
      return
    }
    setError(null)
    const result = runAnalysis(input)
    navigate(`/results/${result.id}`)
  }

  const fillDemo = () => {
    setForm({ ...DEMO_ANALYSIS_INPUT, isDemo: true })
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white">New analysis</h1>
        <p className="mt-2 text-sm text-slate-400">
          Describe the configuration change. Analysis uses rule-based dependency rules — no live
          GitHub fetch in this version.
        </p>
      </header>

      <Card>
        <form
          onSubmit={(e) => submit(e, false)}
          className="space-y-4"
        >
          <Field label="GitHub repository URL">
            <input
              className={inputClass}
              value={form.repositoryUrl}
              onChange={(e) => update('repositoryUrl', e.target.value)}
              placeholder="https://github.com/org/repo"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Branch">
              <input
                className={inputClass}
                value={form.branch}
                onChange={(e) => update('branch', e.target.value)}
              />
            </Field>
            <Field label="Environment">
              <select
                className={inputClass}
                value={form.environment}
                onChange={(e) => update('environment', e.target.value as Environment)}
              >
                {environments.map((env) => (
                  <option key={env} value={env}>
                    {env}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Configuration file / key">
            <input
              className={inputClass}
              value={form.configKey}
              onChange={(e) => update('configKey', e.target.value)}
              placeholder="database.pool.max"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Previous value">
              <input
                className={inputClass}
                value={form.previousValue}
                onChange={(e) => update('previousValue', e.target.value)}
              />
            </Field>
            <Field label="New value">
              <input
                className={inputClass}
                value={form.newValue}
                onChange={(e) => update('newValue', e.target.value)}
              />
            </Field>
          </div>
          <Field label="Change description (optional)">
            <textarea
              className={`${inputClass} min-h-[88px] resize-y`}
              value={form.changeDescription ?? ''}
              onChange={(e) => update('changeDescription', e.target.value)}
              placeholder="Why are you making this change?"
            />
          </Field>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
            >
              <Play className="h-4 w-4" />
              Analyze dependencies
            </button>
            <button
              type="button"
              onClick={fillDemo}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4 text-violet-400" />
              Fill demo values
            </button>
            <button
              type="button"
              onClick={(e) => submit(e as unknown as FormEvent, true)}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600/90 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
            >
              Demo analysis
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}
