import { useEffect, useState } from 'react'
import type { HistoryEntry, QuizResult } from './types'
import { Background } from './components/Background'
import { Landing } from './components/Landing'
import { Quiz } from './components/Quiz'
import { Results } from './components/Results'
import { Disclaimer } from './components/Disclaimer'
import {
  clearProgress,
  loadHistory,
  loadProgress,
  loadView,
  saveResult,
  saveView,
} from './lib/storage'
import { decodeResult } from './lib/share'

type Screen = 'landing' | 'quiz' | 'results'

interface Boot {
  screen: Screen
  result: QuizResult | null
  shared: boolean
}

function parseSharedHash(): QuizResult | null {
  const m = location.hash.match(/^#\/r\/(.+)$/)
  if (!m) return null
  try {
    return decodeResult(decodeURIComponent(m[1]))
  } catch {
    return null
  }
}

// Decide which screen to show on load, restoring persisted state across reloads.
function bootView(): Boot {
  // 1. A shared link always wins.
  const shipped = parseSharedHash()
  if (shipped) return { screen: 'results', result: shipped, shared: true }

  // 2. Restore exactly where the user last was.
  const view = loadView()
  if (view?.screen === 'results') {
    return { screen: 'results', result: view.result, shared: false }
  }
  if (view?.screen === 'quiz' && loadProgress()) {
    return { screen: 'quiz', result: null, shared: false }
  }

  // 3. No saved view yet (e.g. returning from before persistence existed):
  //    recover the last completed result so it isn't lost.
  if (!view) {
    const last = loadHistory()[0]
    if (last) {
      return { screen: 'results', result: { type: last.type, axes: last.axes }, shared: false }
    }
  }

  return { screen: 'landing', result: null, shared: false }
}

export default function App() {
  const [boot] = useState<Boot>(bootView)
  const [screen, setScreen] = useState<Screen>(boot.screen)
  const [result, setResult] = useState<QuizResult | null>(boot.result)
  const [shared, setShared] = useState(boot.shared)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  // Handle shared-result links (#/r/<code>) navigated to after load.
  useEffect(() => {
    function sync() {
      const shipped = parseSharedHash()
      if (shipped) {
        setResult(shipped)
        setShared(true)
        setScreen('results')
      }
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  function handleComplete(r: QuizResult) {
    clearProgress()
    setShared(false)
    setResult(r)
    setHistory(saveResult(r, Date.now()))
    saveView({ screen: 'results', result: r })
    setScreen('results')
  }

  function goLanding() {
    if (location.hash) location.hash = ''
    clearProgress()
    saveView({ screen: 'landing' })
    setShared(false)
    setScreen('landing')
  }

  function startQuiz() {
    if (location.hash) location.hash = ''
    clearProgress() // a fresh run starts at question 1
    saveView({ screen: 'quiz' })
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
          onHome={goLanding}
          onShowDisclaimer={() => setDisclaimerOpen(true)}
        />
      )}

      <Disclaimer open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} />
    </>
  )
}
