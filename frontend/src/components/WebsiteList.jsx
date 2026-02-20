import { useState, useEffect } from 'react';
import { websiteAPI } from '../services/api';
import AddWebsiteForm from './AddWebsiteForm';
import WebsiteCard from './WebsiteCard';

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
      if (selectedWebsite?.id === id) {
        onSelectWebsite(null);
      }
    } catch (err) {
      alert('Failed to delete website: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-sm text-gray-500">Loading websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">My Websites</h2>
          <span className="px-2.5 py-1 text-xs font-semibold bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-sm">
            {websites.length}
          </span>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm ${
            showAddForm 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showAddForm ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            )}
          </svg>
          {showAddForm ? 'Cancel' : 'Add Website'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 m-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error loading websites</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button 
                onClick={loadWebsites} 
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
              >
                Try Again →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200 bg-linear-to-br from-gray-50 to-blue-50">
          <AddWebsiteForm 
            onAdd={handleAddWebsite}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Websites List */}
      <div className="flex-1 overflow-y-auto">
        {websites.length === 0 && !showAddForm ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-sm bg-linear-to-br from-blue-100 to-purple-100">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No websites yet</h3>
            <p className="max-w-xs mb-4 text-sm text-gray-500">
              Start tracking your website analytics by adding your first site
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Add Your First Website
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
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
        )}
      </div>
    </div>
  );
}

export default WebsiteList;
