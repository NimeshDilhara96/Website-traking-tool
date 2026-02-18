import { useState, useEffect } from 'react';
import { analyticsAPI, getTrackingCode } from '../services/api';

function Analytics({ website, onBack }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showTrackingCode, setShowTrackingCode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeUsers, setActiveUsers] = useState(null);
  const [activeUsersLoading, setActiveUsersLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
    loadActiveUsers();
  }, [website.id, dateRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAnalytics();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, website.id, dateRange]);

  // Separate interval for active users (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadActiveUsers();
    }, 10000);

    return () => clearInterval(interval);
  }, [website.id]);

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
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveUsers = async () => {
    try {
      setActiveUsersLoading(true);
      const response = await analyticsAPI.getActiveUsers(website.id);
      setActiveUsers(response.data);
    } catch (err) {
      console.error('Error loading active users:', err);
      setActiveUsers({ count: 0, users: [] });
    } finally {
      setActiveUsersLoading(false);
    }
  };

  const copyTrackingCode = () => {
    const code = getTrackingCode(website.id);
    navigator.clipboard.writeText(code);
    // Show toast instead of alert
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
    toast.textContent = '✓ Tracking code copied!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Grouping functions
  const groupBy = (array, key) => {
    const grouped = {};
    array.forEach(item => {
      const value = item[key] || 'Unknown';
      grouped[value] = (grouped[value] || 0) + 1;
    });
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  };

  const groupByUrl = (pageviews) => groupBy(pageviews, 'url').slice(0, 10);
  const groupByReferrer = (pageviews) => {
    const grouped = {};
    pageviews.forEach(pv => {
      const referrer = pv.referrer || 'direct';
      grouped[referrer] = (grouped[referrer] || 0) + 1;
    });
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 10);
  };
  const groupByCountry = (pageviews) => groupBy(pageviews, 'country').slice(0, 10);
  const groupByDevice = (pageviews) => groupBy(pageviews, 'device_type');
  const groupByBrowser = (pageviews) => groupBy(pageviews, 'browser_name').slice(0, 5);
  const groupByOS = (pageviews) => groupBy(pageviews, 'os_name').slice(0, 5);
  const groupByUTMSource = (pageviews) => {
    const filtered = pageviews.filter(pv => pv.utm_source);
    return groupBy(filtered, 'utm_source').slice(0, 10);
  };

  const groupByDay = (pageviews) => {
    const grouped = {};
    pageviews.forEach(pv => {
      const date = new Date(pv.timestamp).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-14);
  };

  const getMaxValue = (data) => Math.max(...data.map(([, count]) => count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Analytics</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={loadAnalytics}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Tracking Code Section */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Installation Code</h3>
                <p className="text-sm text-gray-600">Add this code to your website</p>
              </div>
            </div>
            <button
              onClick={() => setShowTrackingCode(!showTrackingCode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              {showTrackingCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>

          {showTrackingCode && (
            <div className="bg-gray-900 rounded-lg p-4 relative">
              <button
                onClick={copyTrackingCode}
                className="absolute top-3 right-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              <pre className="text-sm text-gray-300 overflow-x-auto pr-24">
                <code>{getTrackingCode(website.id)}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <label className="text-sm font-medium text-gray-700">Date Range:</label>
            </div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Auto-Refresh Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={loadAnalytics}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh Now'}
              </button>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-refresh</span>
              </label>

              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                disabled={!autoRefresh}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={10}>Every 10 seconds</option>
                <option value={30}>Every 30 seconds</option>
                <option value={60}>Every 1 minute</option>
                <option value={120}>Every 2 minutes</option>
                <option value={300}>Every 5 minutes</option>
              </select>
            </div>

            {lastUpdated && (
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Active Users - Real-time */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-green-700 uppercase tracking-wide">Active Now</h3>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${activeUsers?.count > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-green-600">Live</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-green-600">
                      {activeUsersLoading ? '...' : (activeUsers?.count || 0)}
                    </p>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Users online right now</p>
                </div>
              </div>

              <StatCard
                title="Page Views"
                value={(analytics.total_pageviews || 0).toLocaleString()}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                color="blue"
              />
              <StatCard
                title="Unique Visitors"
                value={(analytics.unique_visitors || 0).toLocaleString()}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                color="green"
              />
              <StatCard
                title="Bounce Rate"
                value={`${analytics.bounce_rate || 0}%`}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>}
                color="yellow"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Avg Session"
                value={formatDuration(analytics.avg_session_duration || 0)}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                color="purple"
              />
              <StatCard
                title="Total Sessions"
                value={(analytics.total_sessions || 0).toLocaleString()}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                color="indigo"
              />
              <StatCard
                title="Pages/Session"
                value={analytics.pages_per_session || 0}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                color="pink"
              />
              <StatCard
                title="New Visitors"
                value={(analytics.new_visitors || 0).toLocaleString()}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
                color="teal"
              />
              <StatCard
                title="Returning"
                value={(analytics.returning_visitors || 0).toLocaleString()}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>}
                color="orange"
              />
            </div>

            {/* Timeline Chart */}
            {analytics.pageviews && analytics.pageviews.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Page Views Over Time</h3>
                <div className="flex items-end justify-between gap-2 h-48 border-b border-l border-gray-200 pl-2 pb-2">
                  {groupByDay(analytics.pageviews).map(([date, count]) => {
                    const maxCount = getMaxValue(groupByDay(analytics.pageviews));
                    const height = (count / maxCount) * 100;
                    return (
                      <div key={date} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full group relative">
                          <div 
                            className="w-full bg-linear-to-t from-blue-500 to-blue-400 rounded-t-md hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer"
                            style={{ height: `${Math.max(height, 5)}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {count} views
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 -rotate-45 origin-top-left mt-4">{date.split('/').slice(0, 2).join('/')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Users Details */}
            {activeUsers && activeUsers.count > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Active Users Right Now</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{activeUsers.count}</span>
                  </div>
                  <span className="text-sm text-gray-500">Updates every 10 seconds</span>
                </div>
                <div className="space-y-3">
                  {activeUsers.users.slice(0, 10).map((user, index) => (
                    <div key={user.session_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.page ? new URL(user.page).pathname : 'Unknown page'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDuration(user.time_on_page)} on page • {user.scroll_depth}% scrolled
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((Date.now() - new Date(user.last_seen).getTime()) / 1000)}s ago
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'pages', label: 'Pages' },
                    { id: 'sources', label: 'Sources' },
                    { id: 'location', label: 'Location' },
                    { id: 'technology', label: 'Technology' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && <OverviewTab analytics={analytics} {...{ groupByUrl, groupByReferrer, groupByCountry }} />}
                {activeTab === 'pages' && <PagesTab analytics={analytics} groupByUrl={groupByUrl} />}
                {activeTab === 'sources' && <SourcesTab analytics={analytics} {...{ groupByReferrer, groupByUTMSource }} />}
                {activeTab === 'location' && <LocationTab analytics={analytics} groupByCountry={groupByCountry} />}
                {activeTab === 'technology' && <TechnologyTab analytics={analytics} {...{ groupByDevice, groupByBrowser, groupByOS }} />}
              </div>
            </div>

            {/* Recent Activity */}
            {analytics.pageviews && analytics.pageviews.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Page Views</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Page</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Source</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Device</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.pageviews.slice(0, 15).map((pv, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                            {new Date(pv.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate" title={pv.url}>
                            {pv.url}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {pv.referrer || 'Direct'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {pv.country || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                            {pv.device_type || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {pv.is_new_visitor ? (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">New</span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Return</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    teal: 'from-teal-500 to-teal-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 bg-linear-to-br ${colors[color]} rounded-lg flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}

// Tab Components
function OverviewTab({ analytics, groupByUrl, groupByReferrer, groupByCountry }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DataTable
        title="Top Pages"
        data={groupByUrl(analytics.pageviews || [])}
        columns={['Page', 'Views']}
      />
      <DataTable
        title="Top Sources"
        data={groupByReferrer(analytics.pageviews || [])}
        columns={['Source', 'Visits']}
      />
      <DataTable
        title="Top Countries"
        data={groupByCountry(analytics.pageviews || [])}
        columns={['Country', 'Visitors']}
      />
    </div>
  );
}

function PagesTab({ analytics, groupByUrl }) {
  return (
    <DataTable
      title="All Pages"
      data={groupByUrl(analytics.pageviews || [])}
      columns={['Page URL', 'Page Views']}
      fullWidth
    />
  );
}

function SourcesTab({ analytics, groupByReferrer, groupByUTMSource }) {
  const utmData = groupByUTMSource(analytics.pageviews || []);
  return (
    <div className="space-y-6">
      <DataTable
        title="Traffic Sources"
        data={groupByReferrer(analytics.pageviews || [])}
        columns={['Source', 'Visits']}
        fullWidth
      />
      {utmData.length > 0 && (
        <DataTable
          title="Campaign Sources (UTM)"
          data={utmData}
          columns={['Campaign Source', 'Clicks']}
          fullWidth
        />
      )}
    </div>
  );
}

function LocationTab({ analytics, groupByCountry }) {
  return (
    <DataTable
      title="Visitors by Country"
      data={groupByCountry(analytics.pageviews || [])}
      columns={['Country', 'Visitors']}
      fullWidth
    />
  );
}

function TechnologyTab({ analytics, groupByDevice, groupByBrowser, groupByOS }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DataTable
        title="Devices"
        data={groupByDevice(analytics.pageviews || [])}
        columns={['Device Type', 'Count']}
      />
      <DataTable
        title="Browsers"
        data={groupByBrowser(analytics.pageviews || [])}
        columns={['Browser', 'Count']}
      />
      <DataTable
        title="Operating Systems"
        data={groupByOS(analytics.pageviews || [])}
        columns={['OS', 'Count']}
      />
    </div>
  );
}

// Data Table Component
function DataTable({ title, data, columns, fullWidth }) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <h4 className="text-base font-semibold text-gray-900 mb-4">{title}</h4>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase ${idx === columns.length - 1 ? 'text-right' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(([key, value], index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate" title={key}>
                    {key}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right font-semibold">
                    {value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;
