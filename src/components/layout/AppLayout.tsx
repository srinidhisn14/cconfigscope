import {
  CircleDot,
  GitBranch,
  History,
  LayoutDashboard,
  Network,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyze', label: 'New Analysis', icon: PlusCircle },
  { to: '/graph', label: 'Dependency Graph', icon: Network },
  { to: '/history', label: 'Analysis History', icon: History },
  { to: '/settings', label: 'Settings / About', icon: Settings },
]

export function AppLayout() {
  return (
    <div className="flex min-h-full">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
          <CircleDot className="h-7 w-7 text-blue-400" strokeWidth={2.2} />
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">ConfigScope</p>
            <p className="text-xs text-slate-500">Blast radius analyzer</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-200'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            Rule-based v1 · ML-ready interface
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
