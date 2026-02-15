import { useState, useEffect } from 'react';
import './App.css';
import WebsiteList from './components/WebsiteList';
import AddWebsite from './components/AddWebsite';
import Analytics from './components/Analytics';
import { websiteAPI } from './services/api';

function App() {
  const [websites, setWebsites] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'analytics'
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await websiteAPI.getAll();
      if (response.success) {
        setWebsites(response.data);
      } else {
        setError(response.error || 'Failed to fetch websites');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch websites');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (websiteData) => {
    try {
      const response = await websiteAPI.create(websiteData);
      if (response.success) {
        await fetchWebsites();
        setCurrentView('list');
      } else {
        throw new Error(response.error || 'Failed to add website');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteWebsite = async (id) => {
    try {
      const response = await websiteAPI.delete(id);
      if (response.success) {
        await fetchWebsites();
      } else {
        alert(response.error || 'Failed to delete website');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete website');
    }
  };

  const handleSelectWebsite = (website) => {
    setSelectedWebsite(website);
    setCurrentView('analytics');
  };

  const handleBackToList = () => {
    setSelectedWebsite(null);
    setCurrentView('list');
  };

  if (loading && websites.length === 0) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>📊 Website Analytics Tracker</h1>
        </header>
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Website Analytics Tracker</h1>
        <p className="tagline">Track page views and events across all your websites</p>
      </header>

      <main className="app-content">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {currentView === 'list' && (
          <WebsiteList
            websites={websites}
            onSelectWebsite={handleSelectWebsite}
            onDeleteWebsite={handleDeleteWebsite}
            onAddNew={() => setCurrentView('add')}
          />
        )}

        {currentView === 'add' && (
          <AddWebsite
            onAdd={handleAddWebsite}
            onCancel={() => setCurrentView('list')}
          />
        )}

        {currentView === 'analytics' && selectedWebsite && (
          <Analytics
            website={selectedWebsite}
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}

export default App;
