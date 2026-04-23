import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuthStore } from '@/store/auth';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Public pages
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const StructurePage = lazy(() => import('@/pages/public/StructurePage'));
const LabsPage = lazy(() => import('@/pages/public/LabsPage'));
const NewsPage = lazy(() => import('@/pages/public/NewsPage'));
const NewsDetailPage = lazy(() => import('@/pages/public/NewsDetailPage'));
const PublicationsPage = lazy(() => import('@/pages/public/PublicationsPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));

// Admin pages
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminNewsPage = lazy(() => import('@/pages/admin/AdminNewsPage'));
const AdminPublicationsPage = lazy(() => import('@/pages/admin/AdminPublicationsPage'));
const AdminStructurePage = lazy(() => import('@/pages/admin/AdminStructurePage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminMessagesPage = lazy(() => import('@/pages/admin/AdminMessagesPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/structure" element={<StructurePage />} />
          <Route path="/laboratories" element={<LabsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="publications" element={<AdminPublicationsPage />} />
          <Route path="structure" element={<AdminStructurePage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
