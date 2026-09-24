import type { AnalysisResult, StoredAnalysisRecord } from '../types/analysis'

const STORAGE_KEY = 'configscope.analysis.history'
const MAX_RECORDS = 50

function readRaw(): StoredAnalysisRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredAnalysisRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRaw(records: StoredAnalysisRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)))
}

export function loadHistory(): StoredAnalysisRecord[] {
  return readRaw().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function saveAnalysisResult(result: AnalysisResult): StoredAnalysisRecord {
  const record: StoredAnalysisRecord = {
    id: result.id,
    createdAt: result.createdAt,
    summary: {
      repositoryUrl: result.input.repositoryUrl,
      configKey: result.input.configKey,
      environment: result.input.environment,
      impactLevel: result.impactLevel,
      blastRadiusScore: result.blastRadiusScore,
    },
    result,
  }
  const existing = readRaw().filter((r) => r.id !== record.id)
  writeRaw([record, ...existing])
  return record
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const found = readRaw().find((r) => r.id === id)
  return found?.result ?? null
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
