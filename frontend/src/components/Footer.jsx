import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">MoAnalytics</h3>
                <p className="text-xs text-gray-500">Website Analytics</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Simple, powerful analytics for your websites. Track visitors, page views, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-blue-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Connect With Us</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:support@moanalytics.com"
                className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-blue-100 hover:text-blue-600"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-600">
              <a href="mailto:support@moanalytics.com" className="transition-colors hover:text-blue-600">
                support@moanalytics.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-8 border-t border-gray-200">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              © {currentYear} MoAnalytics. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-600">
              Made with <Heart size={16} className="text-red-500 fill-current" /> by Your Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;