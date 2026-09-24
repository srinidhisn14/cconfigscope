import type { AnalysisInput, AnalysisResult } from '../types/analysis'

/**
 * Pluggable analysis contract. Rule-based implementation today;
 * ML-backed analyzers can implement the same interface later.
 */
export interface ConfigAnalyzer {
  readonly name: string
  analyze(input: AnalysisInput): AnalysisResult
}
