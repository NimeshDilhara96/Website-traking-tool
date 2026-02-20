import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Analytics from './components/Analytics';
import { websiteAPI } from './services/api';

function AppContent() {
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load website from URL parameter on mount
  useEffect(() => {
    const encodedDomain = searchParams.get('resource_id');
    if (encodedDomain) {
      const domain = decodeURIComponent(encodedDomain);
      loadWebsiteByDomain(domain);
    }
  }, []);

  const loadWebsiteByDomain = async (domain) => {
    try {
      const response = await websiteAPI.getAll();
      const website = response.data?.find(w => w.domain === domain);
      if (website) {
        setSelectedWebsite(website);
      } else {
        // If website not found, clear the URL parameter
        setSearchParams({});
      }
    } catch (err) {
      console.error('Error loading website:', err);
      setSearchParams({});
    }
  };

  const handleSelectWebsite = (website) => {
    if (website) {
      setSelectedWebsite(website);
      // Update URL with encoded domain
      setSearchParams({ resource_id: encodeURIComponent(website.domain) });
    } else {
      setSelectedWebsite(null);
      // Clear URL parameter
      setSearchParams({});
    }
  };

  const handleBack = () => {
    setSelectedWebsite(null);
    setSearchParams({});
  };

  return (
    <Navbar selectedWebsite={selectedWebsite} onSelectWebsite={handleSelectWebsite}>
      <Routes>
        <Route path="/" element={
          selectedWebsite && <Analytics website={selectedWebsite} onBack={handleBack} />
        } />
        <Route path="/analytics" element={
          selectedWebsite && <Analytics website={selectedWebsite} onBack={handleBack} />
        } />
        <Route path="/websites" element={null} />
        <Route path="/profile" element={null} />
      </Routes>
    </Navbar>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
