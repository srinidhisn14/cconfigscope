import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultAnalyzer } from '../analysis/ruleBasedAnalyzer'
import {
  clearHistory,
  getAnalysisById,
  loadHistory,
  saveAnalysisResult,
} from '../storage/history'
import type { AnalysisInput, AnalysisResult, StoredAnalysisRecord } from '../types/analysis'

interface AnalysisContextValue {
  currentResult: AnalysisResult | null
  history: StoredAnalysisRecord[]
  runAnalysis: (input: AnalysisInput) => AnalysisResult
  loadResult: (id: string) => AnalysisResult | null
  setCurrentResult: (result: AnalysisResult | null) => void
  refreshHistory: () => void
  clearAllHistory: () => void
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<StoredAnalysisRecord[]>(() => loadHistory())

  const refreshHistory = useCallback(() => {
    setHistory(loadHistory())
  }, [])

  const runAnalysis = useCallback(
    (input: AnalysisInput) => {
      const result = defaultAnalyzer.analyze(input)
      saveAnalysisResult(result)
      setCurrentResult(result)
      refreshHistory()
      return result
    },
    [refreshHistory],
  )

  const loadResult = useCallback((id: string) => {
    const fromStore = getAnalysisById(id)
    if (fromStore) {
      setCurrentResult(fromStore)
      return fromStore
    }
    return null
  }, [])

  const clearAllHistory = useCallback(() => {
    clearHistory()
    setHistory([])
    setCurrentResult(null)
  }, [])

  const value = useMemo(
    () => ({
      currentResult,
      history,
      runAnalysis,
      loadResult,
      setCurrentResult,
      refreshHistory,
      clearAllHistory,
    }),
    [currentResult, history, runAnalysis, loadResult, refreshHistory, clearAllHistory],
  )

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext)
  if (!ctx) {
    throw new Error('useAnalysis must be used within AnalysisProvider')
  }
  return ctx
}
