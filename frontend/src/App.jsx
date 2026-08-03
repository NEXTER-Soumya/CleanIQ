import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import InsightsDashboard from './pages/InsightsDashboard';
import SettingsPage from './pages/SettingsPage';
import DatasetViewPage from './pages/DatasetViewPage';
import ProductPage from './pages/ProductPage';
import HowItWorksPage from './pages/HowItWorksPage';
import TechStackPage from './pages/TechStackPage';
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/tech-stack" element={<TechStackPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/:id/insights"
          element={
            <ProtectedRoute>
              <InsightsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/:id/data"
          element={
            <ProtectedRoute>
              <DatasetViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function Layout() {
  const location = useLocation();
  const isMarketingPage = ['/', '/product', '/how-it-works', '/tech-stack'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {isMarketingPage ? <LandingNavbar /> : <Navbar />}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Layout />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
