import {
  CONFIG_ENTRY_POINTS,
  SYSTEM_EDGES,
  SYSTEM_NODES,
} from '../data/systemGraph'
import type {
  AffectedComponent,
  AnalysisInput,
  AnalysisResult,
  Environment,
  FlagExplanation,
  GraphNodeDefinition,
  ImpactLevel,
} from '../types/analysis'
import type { ConfigAnalyzer } from './analyzer.interface'

const ENV_MULTIPLIER: Record<Environment, number> = {
  Development: 0.6,
  Staging: 0.85,
  Production: 1,
}

function normalizeConfigKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, '.')
}

function resolveEntryPoints(configKey: string): string[] {
  const normalized = normalizeConfigKey(configKey)
  if (CONFIG_ENTRY_POINTS[normalized]) {
    return CONFIG_ENTRY_POINTS[normalized]
  }
  for (const [pattern, targets] of Object.entries(CONFIG_ENTRY_POINTS)) {
    if (normalized.includes(pattern.split('.')[0]!) || normalized.endsWith(pattern.split('.').pop()!)) {
      return targets
    }
  }
  return ['db', 'order']
}

function buildAdjacency(edges: typeof SYSTEM_EDGES): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  for (const edge of edges) {
    const list = adj.get(edge.source) ?? []
    list.push(edge.target)
    adj.set(edge.source, list)
  }
  return adj
}

function bfsReachable(
  starts: string[],
  adj: Map<string, string[]>,
): { direct: Set<string>; all: Set<string> } {
  const direct = new Set(starts)
  const all = new Set<string>(starts)
  const queue = [...starts]
  while (queue.length) {
    const current = queue.shift()!
    for (const next of adj.get(current) ?? []) {
      if (!all.has(next)) {
        all.add(next)
        queue.push(next)
      }
    }
  }
  return { direct, all }
}

function classifyImpact(score: number): ImpactLevel {
  if (score >= 70) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

function nodeById(id: string): GraphNodeDefinition {
  return SYSTEM_NODES.find((n) => n.id === id)!
}

function valueDeltaSeverity(previous: string, next: string): number {
  const prevNum = Number(previous)
  const nextNum = Number(next)
  if (!Number.isNaN(prevNum) && !Number.isNaN(nextNum) && prevNum !== 0) {
    const ratio = Math.abs(nextNum - prevNum) / Math.abs(prevNum)
    return Math.min(25, ratio * 15)
  }
  if (previous.trim().toLowerCase() !== next.trim().toLowerCase()) {
    return 12
  }
  return 5
}

function buildAffected(
  direct: Set<string>,
  all: Set<string>,
  configKey: string,
): AffectedComponent[] {
  const components: AffectedComponent[] = []
  for (const id of all) {
    const node = nodeById(id)
    const impact = direct.has(id) ? 'direct' : 'indirect'
    const reason =
      impact === 'direct'
        ? `Directly reads \`${configKey}\` or inherits its runtime binding.`
        : `Downstream dependency chain from configuration change via ${SYSTEM_EDGES.find((e) => e.target === id)?.source ?? 'upstream'}.`
    components.push({
      id,
      name: node.label,
      kind: node.kind,
      impact,
      reason,
    })
  }
  return components.sort((a, b) => {
    if (a.impact !== b.impact) return a.impact === 'direct' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

function buildExplanations(
  affected: AffectedComponent[],
  input: AnalysisInput,
): FlagExplanation[] {
  return affected.slice(0, 8).map((c) => ({
    componentId: c.id,
    componentName: c.name,
    title: `${c.name} — ${c.impact === 'direct' ? 'Direct' : 'Transitive'} impact`,
    detail:
      c.impact === 'direct'
        ? `Changing \`${input.configKey}\` from "${input.previousValue}" to "${input.newValue}" alters runtime behavior for ${c.name} in ${input.environment}.`
        : `${c.name} does not read the key directly, but depends on upstream services whose connection semantics change when \`${input.configKey}\` is updated.`,
  }))
}

function buildRiskFactors(
  input: AnalysisInput,
  affected: AffectedComponent[],
  score: number,
): string[] {
  const factors: string[] = []
  if (input.environment === 'Production') {
    factors.push('Change targets Production — rollback window and observability are critical.')
  }
  if (affected.some((a) => a.id === 'payment')) {
    factors.push('Payment Service is in the blast radius — revenue and PCI-adjacent flows may be affected.')
  }
  if (affected.some((a) => a.id === 'db')) {
    factors.push('Database Service connectivity settings can cause pool exhaustion or connection storms.')
  }
  if (valueDeltaSeverity(input.previousValue, input.newValue) > 15) {
    factors.push('Large numeric delta detected — non-linear failure modes (timeouts, saturation) are more likely.')
  }
  if (score >= 70) {
    factors.push('Blast-radius score exceeds high-impact threshold due to critical downstream services.')
  }
  if (factors.length === 0) {
    factors.push('Limited downstream exposure, but validate in Staging before Production promotion.')
  }
  return factors
}

function buildPrecautions(input: AnalysisInput, affected: AffectedComponent[]): string[] {
  const steps = [
    'Capture a configuration snapshot and tag the deployment for quick rollback.',
    `Validate the change in ${input.environment === 'Production' ? 'Staging' : 'Development'} with synthetic load first.`,
    'Monitor error rates, latency p95, and connection pool metrics for 30 minutes post-deploy.',
  ]
  if (affected.some((a) => a.id === 'payment')) {
    steps.push('Enable payment provider sandbox mode or canary traffic before full cutover.')
  }
  if (affected.some((a) => a.id === 'db')) {
    steps.push('Gradually ramp pool size and watch DB CPU, active connections, and wait times.')
  }
  return steps
}

function computeScore(
  affected: AffectedComponent[],
  input: AnalysisInput,
): number {
  let raw = 0
  for (const c of affected) {
    const node = nodeById(c.id)
    raw += node.criticality * (c.impact === 'direct' ? 0.35 : 0.2)
  }
  raw += valueDeltaSeverity(input.previousValue, input.newValue)
  raw *= ENV_MULTIPLIER[input.environment]
  return Math.min(100, Math.round(raw))
}

export class RuleBasedAnalyzer implements ConfigAnalyzer {
  readonly name = 'rule-based-v1'

  analyze(input: AnalysisInput): AnalysisResult {
    const entryPoints = resolveEntryPoints(input.configKey)
    const adj = buildAdjacency(SYSTEM_EDGES)
    const { direct, all } = bfsReachable(entryPoints, adj)

    const affected = buildAffected(direct, all, input.configKey)
    const directCount = affected.filter((a) => a.impact === 'direct').length
    const indirectCount = affected.filter((a) => a.impact === 'indirect').length
    const blastRadiusScore = computeScore(affected, input)
    const impactLevel = classifyImpact(blastRadiusScore)

    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()

    return {
      id,
      input: { ...input, isDemo: input.isDemo ?? false },
      createdAt,
      blastRadiusScore,
      impactLevel,
      directCount,
      indirectCount,
      nodes: SYSTEM_NODES,
      edges: SYSTEM_EDGES,
      affectedComponents: affected,
      explanations: buildExplanations(affected, input),
      riskFactors: buildRiskFactors(input, affected, blastRadiusScore),
      precautions: buildPrecautions(input, affected),
    }
  }
}

export const defaultAnalyzer = new RuleBasedAnalyzer()
