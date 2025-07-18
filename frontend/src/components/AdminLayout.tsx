import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Plus, ArrowLeft, User, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
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

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm flex-shrink-0 overflow-y-auto flex flex-col hidden md:flex">
          <div className="flex-1">
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
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500">
              <div className="font-semibold text-gray-700 mb-1">Admin Panel</div>
              <div>© {new Date().getFullYear()} News Platform</div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
          <div className="flex justify-around">
            <Link
              to="/admin/dashboard"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/dashboard')
                  ? 'text-primary-700'
                  : 'text-gray-600'
              }`}
            >
              <Home size={20} />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link
              to="/admin/news/new"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/news/new')
                  ? 'text-primary-700'
                  : 'text-gray-600'
              }`}
            >
              <Plus size={20} />
              <span className="text-xs">Add News</span>
            </Link>
            <Link
              to="/"
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
              <span className="text-xs">Back</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 