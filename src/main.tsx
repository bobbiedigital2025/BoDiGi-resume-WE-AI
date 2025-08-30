
import React from 'react'
import ReactDOM from 'react-dom/client'
import OddsCalculator from './features/odds/OddsCalculator'
import VideoPortfolio from './pages/VideoPortfolio'
import { AppBackgroundProvider, useBackgroundService } from './AppBackgroundProvider'
import AdminPage from './pages/AdminPage'

function App() {
  const [tab, setTab] = React.useState('home' as 'home'|'odds'|'portfolio'|'admin')
  const [users, setUsers] = React.useState<any[]>([]);
  const { isAdmin } = useBackgroundService();
  React.useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>BoDiGi IWork</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setTab('home')}>Home</button>
        <button onClick={() => setTab('odds')}>Odds Calculator</button>
        <button onClick={() => setTab('portfolio')}>Video Portfolio</button>
        {isAdmin && (
          <button onClick={() => setTab('admin')}>Admin Page</button>
        )}
      </nav>

      {tab === 'home' && (
        <div>
          <p>Connected to API at <code>/api/users</code></p>
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      )}

      {tab === 'odds' && <OddsCalculator />}
      {tab === 'portfolio' && <VideoPortfolio />}
      {tab === 'admin' && <AdminPage />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppBackgroundProvider>
    <App />
  </AppBackgroundProvider>
)
