import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  ChefHat, 
  Calculator, 
  FileText, 
  Settings,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataEntryOpen, setDataEntryOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
  ];

  const dataEntryItems = [
    { name: 'Purchase Entry', href: '/purchases', icon: ShoppingCart },
    { name: 'Production Entry', href: '/production', icon: ChefHat },
    { name: 'Indirect Costs', href: '/indirect-costs', icon: Calculator },
  ];

  const reportsItems = [
    { name: 'Weekly Report', href: '/reports/weekly', icon: FileText },
    { name: 'Monthly Report', href: '/reports/monthly', icon: FileText },
  ];

  const settingsItems = [
    { name: 'Schools', href: '/settings/schools', icon: Building2 },
    { name: 'Ingredients', href: '/settings/ingredients', icon: Package },
  ];

  const isActiveGroup = (items: any[]) => {
    return items.some(item => location.pathname === item.href);
  };

  const NavGroup = ({ title, items, isOpen, setIsOpen, icon: Icon }: any) => (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActiveGroup(items)
            ? 'bg-solid-red text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center">
          <Icon
            className={`mr-3 h-5 w-5 ${
              isActiveGroup(items) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          {title}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isActiveGroup(items) ? 'text-white' : 'text-gray-400'
          }`}
        />
      </button>
      {isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-solid-red text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-4 w-4 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'block' : 'hidden'} lg:block`}>
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-solid-red">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">School Feeding</h1>
            <p className="text-xs text-gray-500">Cost Management</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-solid-red text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          );
        })}

        <NavGroup
          title="Data Entry"
          items={dataEntryItems}
          isOpen={dataEntryOpen}
          setIsOpen={setDataEntryOpen}
          icon={ShoppingCart}
        />

        <NavGroup
          title="Reports"
          items={reportsItems}
          isOpen={reportsOpen}
          setIsOpen={setReportsOpen}
          icon={FileText}
        />

        <NavGroup
          title="Settings"
          items={settingsItems}
          isOpen={settingsOpen}
          setIsOpen={setSettingsOpen}
          icon={Settings}
        />
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://www.solidafrica.org/wp-content/uploads/2021/03/cropped-solid-africa-logo-32x32.png"
              alt="Solid Africa"
              className="h-8 w-8"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Solid Africa</p>
              <p className="text-xs text-gray-500">Feeding Program</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <Sidebar mobile />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:block hidden">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-md p-2 text-gray-400 hover:text-gray-600 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900 lg:ml-0">
                {location.pathname === '/' ? 'Dashboard' :
                 location.pathname === '/purchases' ? 'Purchase Entry' :
                 location.pathname === '/production' ? 'Production Entry' :
                 location.pathname === '/indirect-costs' ? 'Indirect Costs' :
                 location.pathname === '/reports/weekly' ? 'Weekly Report' :
                 location.pathname === '/reports/monthly' ? 'Monthly Report' :
                 location.pathname === '/settings/schools' ? 'Schools' :
                 location.pathname === '/settings/ingredients' ? 'Ingredients' :
                 'School Feeding Program'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-solid-red">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="rounded-md p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;