import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewsForm from './pages/AdminNewsForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <>
            <SignedIn>
              <AdminLayout />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="news/new" element={<AdminNewsForm />} />
          <Route path="news/edit/:id" element={<AdminNewsForm />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 