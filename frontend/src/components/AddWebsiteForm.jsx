import { useState } from 'react';
import './AddWebsiteForm.css';

function AddWebsiteForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !domain.trim()) {
      setError('Both name and domain are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onAdd(name.trim(), domain.trim());
      setName('');
      setDomain('');
    } catch (err) {
      setError(err.message || 'Failed to add website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-website-form">
      <h3>Add New Website</h3>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Website Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Website"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="domain">Domain</label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            disabled={loading}
            required
          />
          <small>Enter your website domain (e.g., example.com)</small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Website'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddWebsiteForm;
