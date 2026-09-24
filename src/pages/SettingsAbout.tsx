import { Card } from '../components/ui/Card'

export function SettingsAboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white">Settings / About</h1>
        <p className="mt-2 text-sm text-slate-400">ConfigScope — configuration change blast radius tool.</p>
      </header>

      <Card>
        <h2 className="font-semibold text-white">About</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          ConfigScope helps teams understand the dependency impact of configuration changes before
          deploy. The current release uses a <strong className="font-medium text-slate-300">rule-based</strong>{' '}
          analyzer that maps config keys to a known service graph, propagates reachability, and
          scores blast radius by environment and service criticality.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Machine learning is not enabled. The <code className="text-slate-400">ConfigAnalyzer</code>{' '}
          interface is designed so ML models can be plugged in later without rewriting the UI.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-white">Demo flow</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-400">
          <li>Use <strong className="text-slate-300">Demo Analysis</strong> on the New Analysis page — no GitHub API calls.</li>
          <li>Example chain: Configuration → Database → Order → Payment → Notification.</li>
          <li>History persists in localStorage on this device only.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-white">Preferences</h2>
        <p className="mt-2 text-sm text-slate-500">
          Theme and export settings can be added here in future releases. No server-side storage in
          v1.
        </p>
      </Card>
    </div>
  )
}
