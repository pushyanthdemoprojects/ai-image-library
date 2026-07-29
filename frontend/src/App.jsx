import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Image, Upload, Search, LogIn, LogOut, User, Menu, X } from 'lucide-react'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadPage from './pages/Upload'
import SearchPage from './pages/Search'
import ImageDetails from './pages/ImageDetails'
import Profile from './pages/Profile'
import useAuth from './hooks/useAuth'

// Simple Route Guard for authenticated paths
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-dark-400">Loading session...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Route Guard for Guest-only paths (Login / Register)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-dark-400">Loading session...</div>;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// Temp placeholder components to demonstrate layout and routing
const HomePlaceholder = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="relative p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-6">
        <Image className="w-12 h-12 text-brand-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        Welcome {user ? `, ${user.username}` : ''} to the <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent glow-text">AI Image Library</span>
      </h1>
      <p className="text-dark-400 max-w-xl text-lg mb-8">
        Explore a smart repository powered by Artificial Intelligence. Experience semantic search, auto-categorization, and instant downloads.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/upload" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-lg hover:shadow-brand-500/25 transition-all">
          <Upload className="w-4 h-4" /> Upload Image
        </Link>
        <Link to="/search" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-medium border border-dark-700 hover:border-dark-600 transition-all">
          <Search className="w-4 h-4" /> Search Gallery
        </Link>
      </div>
    </div>
  );
};

const PagePlaceholder = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
    <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 mb-4">
      <Icon className="w-8 h-8 text-brand-400" />
    </div>
    <h2 className="text-2xl font-bold mb-2">{title} Page</h2>
    <p className="text-dark-400">This feature is currently under active design development.</p>
  </div>
);

function Navigation() {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-dark-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 group-hover:border-brand-500/40 transition-all">
            <Image className="w-5 h-5 text-brand-400" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent group-hover:text-brand-400 transition-colors">
            AI Image Library
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/search" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Search</Link>
          <Link to="/upload" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Upload</Link>
          <Link to="/profile" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Profile</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-400" />
                {user?.username}
              </span>
              <button 
                onClick={logout} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-200 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium shadow-lg hover:shadow-brand-500/20 transition-all">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-dark-400 hover:text-white hover:bg-dark-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-dark-800 px-4 pt-2 pb-4 space-y-2">
          <Link 
            to="/search" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-white hover:bg-dark-900"
          >
            Search
          </Link>
          <Link 
            to="/upload" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-white hover:bg-dark-900"
          >
            Upload
          </Link>
          <Link 
            to="/profile" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-white hover:bg-dark-900"
          >
            Profile
          </Link>
          
          <div className="border-t border-dark-800 pt-4 pb-2">
            {isAuthenticated ? (
              <div className="space-y-2 px-3">
                <div className="flex items-center gap-2 text-sm text-dark-300 font-semibold uppercase tracking-wider mb-2">
                  <User className="w-4 h-4 text-brand-400" />
                  {user?.username}
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-200 text-sm font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="px-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium shadow-lg transition-all"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-dark-950 text-dark-50">
          <Navigation />

          {/* Main Content Area */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public homepage route */}
              <Route path="/" element={<HomePlaceholder />} />

              {/* Guest Only routes (redirect to home if already logged in) */}
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              {/* Protected routes (require auth) */}
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/image/:id" 
                element={
                  <ProtectedRoute>
                    <ImageDetails />
                  </ProtectedRoute>
                } 
              />

              {/* Search gallery is public */}
              <Route path="/search" element={<SearchPage />} />
              
              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-dark-900 bg-dark-950/80 py-6 text-center text-xs text-dark-500">
            <div className="max-w-7xl mx-auto px-4">
              &copy; {new Date().getFullYear()} AI Image Library. Made with ❤️ for visual discovery.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  )
}
