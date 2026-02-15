import { useState } from 'react';
import './AddWebsite.css';

function AddWebsite({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Website name is required');
      return;
    }

    if (!formData.domain.trim()) {
      setError('Domain is required');
      return;
    }

    setLoading(true);
    try {
      await onAdd(formData);
    } catch (err) {
      setError(err.message || 'Failed to add website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-website">
      <div className="form-header">
        <h2>Add New Website</h2>
        <button className="btn-close" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Website Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="My Awesome Website"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="domain">Domain</label>
          <input
            type="text"
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="example.com"
            disabled={loading}
          />
          <small>Enter your website domain (e.g., example.com)</small>
        </div>

        {error && <div className="error-message">{error}</div>}

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

export default AddWebsite;
