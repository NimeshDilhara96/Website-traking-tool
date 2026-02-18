import { useState } from 'react'
import './App.css'
import WebsiteList from './components/WebsiteList'
import Analytics from './components/Analytics'

function App() {
  const [selectedWebsite, setSelectedWebsite] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Website Tracking Tool</h1>
        <p>Monitor your websites with powerful analytics</p>
      </header>

      <main className="app-main">
        {selectedWebsite ? (
          <Analytics 
            website={selectedWebsite} 
            onBack={() => setSelectedWebsite(null)}
          />
        ) : (
          <WebsiteList 
            onSelectWebsite={setSelectedWebsite}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using React + Vite</p>
      </footer>
    </div>
  )
}

export default App
