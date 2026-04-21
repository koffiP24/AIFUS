import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Disclosure, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  MapPinIcon,
  StarIcon,
  GiftIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const userHomePath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const userHomeLabel =
    user?.role === 'ADMIN' ? 'Dashboard admin' : 'Espace participant';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Village', href: '/village', icon: MapPinIcon },
    { name: 'Gala', href: '/gala', icon: StarIcon },
    { name: 'Tombola', href: '/tombola', icon: GiftIcon },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <Disclosure as="nav" className="bg-white dark:bg-slate-900 shadow-lg sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center gap-2">
                  <img src="/logo.jpg" alt="AIFUS" className="w-10 h-10 object-contain rounded-lg" />
                  <span className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
                    AIFUS <span className="text-primary-600">2026</span>
                  </span>
                </Link>
              </div>

              {/* Navigation Desktop */}
              <div className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Auth Buttons Desktop */}
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link 
                      to={userHomePath}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>{userHomeLabel} <span className="text-primary-600 dark:text-primary-400 font-semibold">{user.prenom}</span></span>
                    </Link>
                    
                    {user.role === 'ADMIN' && (
                      <Link 
                        to="/admin" 
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
                      >
                        Admin
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="sr-only">Ouvrir le menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform -translate-y-2 opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform -translate-y-2 opacity-0"
          >
            <Disclosure.Panel className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="px-4 py-4 space-y-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Disclosure.Button>
                ))}

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                        Connecté en tant que <span className="font-semibold text-primary-600">{user.prenom} {user.nom}</span>
                      </div>
                      <Disclosure.Button
                        as={Link}
                        to={userHomePath}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <UserIcon className="w-5 h-5" />
                        {userHomeLabel}
                      </Disclosure.Button>
                      {user.role === 'ADMIN' && (
                        <Disclosure.Button
                          as={Link}
                          to="/admin"
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          Administration
                        </Disclosure.Button>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Disclosure.Button
                        as={Link}
                        to="/login"
                        className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Connexion
                      </Disclosure.Button>
                      <Disclosure.Button
                        as={Link}
                        to="/register"
                        className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                      >
                        Inscription
                      </Disclosure.Button>
                    </div>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
