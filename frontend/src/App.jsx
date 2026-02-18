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
        <div className="split-layout">
          <div className="left-panel">
            <WebsiteList 
              onSelectWebsite={setSelectedWebsite}
              selectedWebsite={selectedWebsite}
            />
          </div>
          <div className="right-panel">
            {selectedWebsite ? (
              <Analytics 
                website={selectedWebsite} 
                onBack={() => setSelectedWebsite(null)}
              />
            ) : (
              <div className="no-selection">
                <div className="no-selection-content">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  <h2>Select a Website</h2>
                  <p>Choose a website from the list to view its analytics and tracking data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using React + Vite</p>
      </footer>
    </div>
  )
}

export default App
