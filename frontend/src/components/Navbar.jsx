import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import WebsiteList from './WebsiteList';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children, selectedWebsite, onSelectWebsite }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="max-w-full px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">MoAnalytics</h1>
                  <p className="text-xs text-gray-500">Website Dashboard</p>
                </div>
              </Link>
            </div>

            {/* User Profile & Logout (Desktop) */}
            <div className="items-center hidden space-x-4 md:flex">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 rounded-lg hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-gray-50">
            {/* Mobile User Actions */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full">
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 font-medium text-left text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Website List */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}>
          <WebsiteList 
            onSelectWebsite={onSelectWebsite}
            selectedWebsite={selectedWebsite}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;