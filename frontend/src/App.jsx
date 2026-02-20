import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
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
      setSearchParams({ resource_id: encodeURIComponent(website.domain) });
    } else {
      setSelectedWebsite(null);
      setSearchParams({});
    }
  };

  const handleBack = () => {
    setSelectedWebsite(null);
    setSearchParams({});
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col flex-1">
                <Navbar selectedWebsite={selectedWebsite} onSelectWebsite={handleSelectWebsite}>
                  <Routes>
                    <Route path="/" element={
                      selectedWebsite ? <Analytics website={selectedWebsite} onBack={handleBack} /> : null
                    } />
                    <Route path="/analytics" element={
                      selectedWebsite ? <Analytics website={selectedWebsite} onBack={handleBack} /> : null
                    } />
                  </Routes>
                </Navbar>
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
