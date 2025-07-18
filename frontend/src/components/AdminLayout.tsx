import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Plus, Settings, ArrowLeft, User, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Panel
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="font-medium">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'Admin'}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          {/* Back to Public Site */}
          <div className="px-4 pt-6 pb-4 border-b border-gray-200">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Site</span>
            </Link>
          </div>
          
          <nav className="mt-8">
            <div className="px-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/dashboard')
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Home size={20} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/news/new"
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/news/new')
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Plus size={20} />
                    <span>Add News</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 