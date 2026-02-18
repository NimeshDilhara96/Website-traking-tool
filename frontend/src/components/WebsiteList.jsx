import { useState, useEffect } from 'react';
import { websiteAPI } from '../services/api';
import AddWebsiteForm from './AddWebsiteForm';
import WebsiteCard from './WebsiteCard';
import './WebsiteList.css';

function WebsiteList({ onSelectWebsite, selectedWebsite }) {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await websiteAPI.getAll();
      setWebsites(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load websites');
      console.error('Error loading websites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebsite = async (name, domain) => {
    try {
      await websiteAPI.create(name, domain);
      await loadWebsites();
      setShowAddForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteWebsite = async (id) => {
    if (!window.confirm('Are you sure you want to delete this website?')) {
      return;
    }

    try {
      await websiteAPI.delete(id);
      await loadWebsites();
    } catch (err) {
      alert('Failed to delete website: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading websites...</div>;
  }

  return (
    <div className="website-list">
      <div className="website-list-header">
        <h2>Your Websites</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Website'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={loadWebsites}>Retry</button>
        </div>
      )}

      {showAddForm && (
        <AddWebsiteForm 
          onAdd={handleAddWebsite}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {websites.length === 0 && !showAddForm && (
        <div className="empty-state">
          <p>No websites added yet. Click "Add Website" to get started!</p>
        </div>
      )}

      <div className="websites-grid">
        {websites.map((website) => (
          <WebsiteCard
            key={website.id}
            website={website}
            selected={selectedWebsite?.id === website.id}
            onSelect={() => onSelectWebsite(website)}
            onDelete={() => handleDeleteWebsite(website.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default WebsiteList;
