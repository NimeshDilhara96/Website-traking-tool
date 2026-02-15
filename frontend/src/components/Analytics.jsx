import { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics({ website, onBack }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [website.id]);

  const fetchAnalytics = async (startDate, endDate) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const url = `http://localhost:3000/api/analytics/${website.id}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    fetchAnalytics(dateRange.start, dateRange.end);
  };

  const handleClearFilter = () => {
    setDateRange({ start: '', end: '' });
    fetchAnalytics();
  };

  const trackingCode = `<!-- Add this to your website -->
<script>
  window.TRACKING_WEBSITE_ID = '${website.id}';
</script>
<script src="http://localhost:3000/track.js"></script>`;

  return (
    <div className="analytics">
      <div className="analytics-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Websites
        </button>
        <h2>{website.name}</h2>
        <p className="domain">{website.domain}</p>
      </div>

      <div className="tracking-setup">
        <h3>📊 Tracking Setup</h3>
        <p>Add this code to your website before the closing &lt;/body&gt; tag:</p>
        <pre className="code-block">{trackingCode}</pre>
        <button
          className="btn btn-secondary"
          onClick={() => navigator.clipboard.writeText(trackingCode)}
        >
          📋 Copy to Clipboard
        </button>
      </div>

      <div className="date-filter">
        <h3>Filter by Date Range</h3>
        <div className="filter-inputs">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleDateFilter}>
            Apply Filter
          </button>
          {(dateRange.start || dateRange.end) && (
            <button className="btn btn-secondary" onClick={handleClearFilter}>
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : analytics ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Page Views</h3>
              <p className="stat-number">{analytics.total_pageviews}</p>
            </div>
            <div className="stat-card">
              <h3>Total Events</h3>
              <p className="stat-number">{analytics.total_events}</p>
            </div>
            <div className="stat-card">
              <h3>Unique Sessions</h3>
              <p className="stat-number">
                {new Set(analytics.pageviews.map((pv) => pv.session_id)).size}
              </p>
            </div>
          </div>

          <div className="data-tables">
            <div className="table-section">
              <h3>Recent Page Views</h3>
              {analytics.pageviews.length === 0 ? (
                <p className="no-data">No page views yet</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>URL</th>
                        <th>Referrer</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.pageviews.slice(0, 10).map((pv) => (
                        <tr key={pv.id}>
                          <td className="url-cell" title={pv.url}>
                            {pv.url}
                          </td>
                          <td>{pv.referrer}</td>
                          <td>{new Date(pv.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="table-section">
              <h3>Recent Events</h3>
              {analytics.events.length === 0 ? (
                <p className="no-data">No events tracked yet</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>URL</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.events.slice(0, 10).map((event) => (
                        <tr key={event.id}>
                          <td>{event.event_name}</td>
                          <td className="url-cell" title={event.url}>
                            {event.url}
                          </td>
                          <td>{new Date(event.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Analytics;
