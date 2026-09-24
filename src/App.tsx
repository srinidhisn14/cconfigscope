import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard'
import { NewAnalysisPage } from './pages/NewAnalysis'
import { ResultsPage } from './pages/Results'
import { DependencyGraphPage } from './pages/DependencyGraphPage'
import { HistoryPage } from './pages/History'
import { SettingsAboutPage } from './pages/SettingsAbout'

function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analyze" element={<NewAnalysisPage />} />
            <Route path="results/:id" element={<ResultsPage />} />
            <Route path="results" element={<Navigate to="/analyze" replace />} />
            <Route path="graph" element={<DependencyGraphPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsAboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  )
}

export default App
