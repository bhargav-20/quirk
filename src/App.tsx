import { useEffect, useState } from 'react'
import type { HistoryEntry, QuizResult } from './types'
import { Background } from './components/Background'
import { Landing } from './components/Landing'
import { Quiz } from './components/Quiz'
import { Results } from './components/Results'
import { Disclaimer } from './components/Disclaimer'
import { loadHistory, saveResult } from './lib/storage'
import { decodeResult } from './lib/share'

type Screen = 'landing' | 'quiz' | 'results'

function parseSharedHash(): QuizResult | null {
  const m = location.hash.match(/^#\/r\/(.+)$/)
  if (!m) return null
  try {
    return decodeResult(decodeURIComponent(m[1]))
  } catch {
    return null
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [result, setResult] = useState<QuizResult | null>(null)
  const [shared, setShared] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  // Handle shared-result links (#/r/<code>) on load and on hash change.
  useEffect(() => {
    function sync() {
      const shipped = parseSharedHash()
      if (shipped) {
        setResult(shipped)
        setShared(true)
        setScreen('results')
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  function handleComplete(r: QuizResult) {
    setShared(false)
    setResult(r)
    setHistory(saveResult(r, Date.now()))
    setScreen('results')
  }

  function goLanding() {
    if (location.hash) location.hash = ''
    setShared(false)
    setScreen('landing')
  }

  function startQuiz() {
    if (location.hash) location.hash = ''
    setShared(false)
    setScreen('quiz')
  }

  return (
    <>
      <Background />

      {screen === 'landing' && (
        <Landing
          onStart={startQuiz}
          onShowDisclaimer={() => setDisclaimerOpen(true)}
          history={history}
        />
      )}

      {screen === 'quiz' && <Quiz onComplete={handleComplete} onExit={goLanding} />}

      {screen === 'results' && result && (
        <Results
          result={result}
          shared={shared}
          onRetake={startQuiz}
          onShowDisclaimer={() => setDisclaimerOpen(true)}
        />
      )}

      <Disclaimer open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
    </>
  )
}
