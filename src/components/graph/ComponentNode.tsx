import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Database, Layers, Radio, Server, Settings, Zap } from 'lucide-react'
import type { ComponentKind } from '../../types/analysis'

export type ComponentFlowData = {
  label: string
  kind: ComponentKind
  highlighted?: boolean
  dimmed?: boolean
}

const kindIcon: Record<ComponentKind, typeof Server> = {
  configuration: Settings,
  database: Database,
  service: Server,
  gateway: Radio,
  cache: Zap,
  queue: Layers,
}

export function ComponentNode({ data }: NodeProps) {
  const d = data as ComponentFlowData
  const Icon = kindIcon[d.kind] ?? Server
  const base =
    'min-w-[160px] rounded-lg border px-3 py-2.5 shadow-md transition-all duration-200'
  const state = d.highlighted
    ? 'border-blue-400 bg-blue-950/80 ring-2 ring-blue-500/40'
    : d.dimmed
      ? 'border-slate-800 bg-slate-900/40 opacity-40'
      : 'border-slate-700 bg-slate-900/90'

  return (
    <div className={`${base} ${state}`}>
      <Handle type="target" position={Position.Left} className="!bg-slate-500" />
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-100">{d.label}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-slate-500" />
    </div>
  )
}
