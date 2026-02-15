import { useState } from 'react';
import './WebsiteList.css';

function WebsiteList({ websites, onSelectWebsite, onDeleteWebsite, onAddNew }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      await onDeleteWebsite(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="website-list">
      <div className="list-header">
        <h2>Your Websites</h2>
        <button className="btn btn-primary" onClick={onAddNew}>
          + Add Website
        </button>
      </div>

      {websites.length === 0 ? (
        <div className="empty-state">
          <p>No websites added yet. Click "Add Website" to get started!</p>
        </div>
      ) : (
        <div className="websites-grid">
          {websites.map((website) => (
            <div key={website.id} className="website-card">
              <div className="website-info">
                <h3>{website.name}</h3>
                <p className="domain">{website.domain}</p>
                <p className="date">
                  Added: {new Date(website.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="website-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onSelectWebsite(website)}
                >
                  View Analytics
                </button>
                <button
                  className={`btn btn-danger ${deleteConfirm === website.id ? 'confirm' : ''}`}
                  onClick={() => handleDelete(website.id)}
                >
                  {deleteConfirm === website.id ? 'Click again to confirm' : 'Delete'}
                </button>
              </div>
              <div className="tracking-code">
                <small>Website ID: <code>{website.id}</code></small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WebsiteList;
