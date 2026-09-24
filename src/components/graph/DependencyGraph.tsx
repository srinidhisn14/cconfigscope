import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react'
import { useEffect, useMemo } from 'react'
import type { AnalysisResult } from '../../types/analysis'
import { ComponentNode, type ComponentFlowData } from './ComponentNode'

const nodeTypes = { component: ComponentNode }

const layoutPositions: Record<string, { x: number; y: number }> = {
  config: { x: 0, y: 200 },
  db: { x: 220, y: 80 },
  cache: { x: 220, y: 200 },
  'api-gateway': { x: 220, y: 320 },
  order: { x: 460, y: 140 },
  inventory: { x: 460, y: 280 },
  payment: { x: 700, y: 100 },
  notification: { x: 700, y: 220 },
  events: { x: 460, y: 400 },
}

function toFlowModel(result: AnalysisResult | null): { nodes: Node[]; edges: Edge[] } {
  const affectedIds = new Set(result?.affectedComponents.map((c) => c.id) ?? [])

  const nodes: Node[] = (result?.nodes ?? []).map((n) => {
    const pos = layoutPositions[n.id] ?? { x: 0, y: 0 }
    const highlighted = affectedIds.has(n.id)
    const dimmed = result != null && !highlighted && n.id !== 'config'
    return {
      id: n.id,
      type: 'component',
      position: pos,
      data: {
        label: n.label,
        kind: n.kind,
        highlighted,
        dimmed,
      } satisfies ComponentFlowData,
    }
  })

  const edges: Edge[] = (result?.edges ?? []).map((e) => {
    const active =
      result &&
      affectedIds.has(e.source) &&
      affectedIds.has(e.target)
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: !!active,
      style: {
        stroke: active ? '#60a5fa' : '#334155',
        strokeWidth: active ? 2 : 1,
      },
      labelStyle: { fill: '#94a3b8', fontSize: 10 },
    }
  })

  return { nodes, edges }
}

export function DependencyGraph({
  result,
  height = 420,
}: {
  result: AnalysisResult | null
  height?: number
}) {
  const model = useMemo(() => toFlowModel(result), [result])
  const [nodes, setNodes, onNodesChange] = useNodesState(model.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(model.edges)

  useEffect(() => {
    setNodes(model.nodes)
    setEdges(model.edges)
  }, [model, setNodes, setEdges])

  if (!result) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-sm text-slate-500"
        style={{ height }}
      >
        Run an analysis to visualize the dependency graph.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800" style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={16} />
        <Controls className="!border-slate-700 !bg-slate-900 !shadow-lg [&>button]:!border-slate-700 [&>button]:!bg-slate-800 [&>button]:!fill-slate-300" />
        <MiniMap
          className="!border-slate-700 !bg-slate-900"
          nodeColor={(n) => ((n.data as ComponentFlowData).highlighted ? '#3b82f6' : '#475569')}
        />
      </ReactFlow>
    </div>
  )
}
