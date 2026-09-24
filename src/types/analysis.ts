export type Environment = 'Development' | 'Staging' | 'Production'

export type ImpactLevel = 'Low' | 'Medium' | 'High'

export type ComponentKind =
  | 'configuration'
  | 'database'
  | 'service'
  | 'gateway'
  | 'cache'
  | 'queue'

export interface AnalysisInput {
  repositoryUrl: string
  branch: string
  environment: Environment
  configKey: string
  previousValue: string
  newValue: string
  changeDescription?: string
  isDemo?: boolean
}

export interface GraphNodeDefinition {
  id: string
  label: string
  kind: ComponentKind
  criticality: number
}

export interface GraphEdgeDefinition {
  id: string
  source: string
  target: string
  label?: string
}

export interface AffectedComponent {
  id: string
  name: string
  kind: ComponentKind
  impact: 'direct' | 'indirect'
  reason: string
}

export interface FlagExplanation {
  componentId: string
  componentName: string
  title: string
  detail: string
}

export interface AnalysisResult {
  id: string
  input: AnalysisInput
  createdAt: string
  blastRadiusScore: number
  impactLevel: ImpactLevel
  directCount: number
  indirectCount: number
  nodes: GraphNodeDefinition[]
  edges: GraphEdgeDefinition[]
  affectedComponents: AffectedComponent[]
  explanations: FlagExplanation[]
  riskFactors: string[]
  precautions: string[]
}

export interface StoredAnalysisRecord {
  id: string
  createdAt: string
  summary: {
    repositoryUrl: string
    configKey: string
    environment: Environment
    impactLevel: ImpactLevel
    blastRadiusScore: number
  }
  result: AnalysisResult
}
