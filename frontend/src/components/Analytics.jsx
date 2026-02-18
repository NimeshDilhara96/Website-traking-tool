import { useState, useEffect } from 'react';
import { analyticsAPI, getTrackingCode } from '../services/api';
import './Analytics.css';

function Analytics({ website, onBack }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showTrackingCode, setShowTrackingCode] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [website.id, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getByWebsiteId(
        website.id,
        dateRange.start || null,
        dateRange.end || null
      );
      setAnalytics(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingCode = () => {
    const code = getTrackingCode(website.id);
    navigator.clipboard.writeText(code);
    alert('Tracking code copied to clipboard!');
  };

  const groupByUrl = (pageviews) => {
    const grouped = {};
    pageviews.forEach(pv => {
      if (!grouped[pv.url]) {
        grouped[pv.url] = 0;
      }
      grouped[pv.url]++;
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const groupByReferrer = (pageviews) => {
    const grouped = {};
    pageviews.forEach(pv => {
      const referrer = pv.referrer || 'direct';
      if (!grouped[referrer]) {
        grouped[referrer] = 0;
      }
      grouped[referrer]++;
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  const groupByCountry = (pageviews) => {
    const grouped = {};
    pageviews.forEach(pv => {
      const country = pv.country || 'Unknown';
      if (!grouped[country]) {
        grouped[country] = 0;
      }
      grouped[country]++;
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics">
      <div className="analytics-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Websites
        </button>
        <h2>{website.name}</h2>
        <p className="domain">{website.domain}</p>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={loadAnalytics}>Retry</button>
        </div>
      )}

      <div className="tracking-code-section">
        <button 
          className="btn btn-primary"
          onClick={() => setShowTrackingCode(!showTrackingCode)}
        >
          {showTrackingCode ? 'Hide' : 'Show'} Tracking Code
        </button>

        {showTrackingCode && (
          <div className="tracking-code-box">
            <div className="tracking-code-header">
              <h3>Installation Instructions</h3>
              <button onClick={copyTrackingCode} className="btn-copy">
                📋 Copy Code
              </button>
            </div>
            <p>Add this code to the <code>&lt;head&gt;</code> section of your website:</p>
            <pre className="code-block">
              {getTrackingCode(website.id)}
            </pre>
          </div>
        )}
      </div>

      <div className="date-range-filter">
        <label>
          Start Date:
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </label>
        <button 
          className="btn btn-secondary"
          onClick={() => setDateRange({ start: '', end: '' })}
        >
          Clear Filter
        </button>
      </div>

      {analytics && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{analytics.total_pageviews || 0}</h3>
              <p>Total Page Views</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.total_events || 0}</h3>
              <p>Total Events</p>
            </div>
            <div className="stat-card">
              <h3>{new Set(analytics.pageviews?.map(pv => pv.session_id) || []).size}</h3>
              <p>Unique Sessions</p>
            </div>
            <div className="stat-card">
              <h3>{new Set(analytics.pageviews?.map(pv => pv.url) || []).size}</h3>
              <p>Unique Pages</p>
            </div>
          </div>

          <div className="analytics-details">
            <div className="analytics-section">
              <h3>Top Pages</h3>
              {analytics.pageviews && analytics.pageviews.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupByUrl(analytics.pageviews).map(([url, count]) => (
                      <tr key={url}>
                        <td className="url-cell" title={url}>{url}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No page views yet</p>
              )}
            </div>

            <div className="analytics-section">
              <h3>Top Referrers</h3>
              {analytics.pageviews && analytics.pageviews.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Referrer</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupByReferrer(analytics.pageviews).map(([referrer, count]) => (
                      <tr key={referrer}>
                        <td className="url-cell" title={referrer}>{referrer}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No referrer data yet</p>
              )}
            </div>

            <div className="analytics-section">
              <h3>Visitors by Country</h3>
              {analytics.pageviews && analytics.pageviews.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupByCountry(analytics.pageviews).map(([country, count]) => (
                      <tr key={country}>
                        <td>{country}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No country data yet</p>
              )}
            </div>

            <div className="analytics-section full-width">
              <h3>Recent Page Views</h3>
              {analytics.pageviews && analytics.pageviews.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>URL</th>
                        <th>Referrer</th>
                        <th>Country</th>
                        <th>Language</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.pageviews.slice(0, 20).map((pv, index) => (
                        <tr key={index}>
                          <td>{new Date(pv.timestamp).toLocaleString()}</td>
                          <td className="url-cell" title={pv.url}>{pv.url}</td>
                          <td className="url-cell" title={pv.referrer}>{pv.referrer || 'direct'}</td>
                          <td>{pv.country || 'Unknown'}</td>
                          <td>{pv.language}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No page views yet</p>
              )}
            </div>

            {analytics.events && analytics.events.length > 0 && (
              <div className="analytics-section full-width">
                <h3>Recent Events</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Event Name</th>
                        <th>URL</th>
                        <th>Event Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.events.slice(0, 20).map((event, index) => (
                        <tr key={index}>
                          <td>{new Date(event.timestamp).toLocaleString()}</td>
                          <td>{event.event_name}</td>
                          <td className="url-cell" title={event.url}>{event.url}</td>
                          <td>
                            <pre className="event-data">
                              {JSON.stringify(event.event_data, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
