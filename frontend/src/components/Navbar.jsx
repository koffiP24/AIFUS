import { Disclosure, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  GiftIcon,
  HomeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Accueil", href: "/", icon: HomeIcon },
  { name: "Village", href: "/village", icon: MapPinIcon },
  { name: "Gala", href: "/gala", icon: SparklesIcon },
  { name: "Tombola", href: "/tombola", icon: GiftIcon },
];

const routeLabels = [
  { match: (pathname) => pathname.startsWith("/admin/monitoring"), label: "Scan QR" },
  { match: (pathname) => pathname.startsWith("/admin"), label: "Console admin" },
  { match: (pathname) => pathname.startsWith("/dashboard"), label: "Espace participant" },
  { match: (pathname) => pathname.startsWith("/village"), label: "Village" },
  { match: (pathname) => pathname.startsWith("/gala"), label: "Gala" },
  { match: (pathname) => pathname.startsWith("/tombola"), label: "Tombola" },
  { match: (pathname) => pathname.startsWith("/login"), label: "Connexion" },
  { match: (pathname) => pathname.startsWith("/register"), label: "Inscription" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const userHomePath = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const userHomeLabel =
    user?.role === "ADMIN" ? "Dashboard admin" : "Espace participant";
  const mobileTitle =
    routeLabels.find((item) => item.match(location.pathname))?.label || "AIFUS 2026";

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isActive = (href) =>
    href === "/"
      ? location.pathname === href
      : location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b border-white/60 bg-white/82 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.5)] backdrop-blur-2xl dark:border-white/5 dark:bg-slate-950/82"
    >
      {({ open, close }) => (
        <>
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="flex h-[4.5rem] items-center justify-between md:h-20">
              <div className="flex min-w-0 items-center gap-3">
                <Link to="/" className="flex items-center gap-3">
                  <img
                    src="/logo.jpg"
                    alt="AIFUS"
                    className="h-11 w-11 rounded-2xl object-contain shadow-sm"
                  />
                  <div className="hidden sm:block">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-slate-400">
                      AIFUS
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Festivites 2026
                    </p>
                  </div>
                  <div className="min-w-0 sm:hidden">
                    <p className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Mobile
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {mobileTitle}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="hidden items-center gap-1 md:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="hidden items-center gap-3 md:flex">
                {user ? (
                  <>
                    <Link
                      to={userHomePath}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span>{user.prenom}</span>
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin/monitoring"
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2.5 text-sm font-medium text-white transition hover:from-slate-800 hover:to-slate-600 dark:from-white dark:to-slate-200 dark:text-slate-900"
                      >
                        <ShieldCheckIcon className="h-4 w-4" />
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Deconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-primary-600 hover:to-primary-700"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 md:hidden">
                {user && (
                  <Link
                    to={userHomePath}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
                  >
                    <UserCircleIcon className="h-4 w-4" />
                    <span className="max-w-[5.5rem] truncate">{user.prenom}</span>
                  </Link>
                )}

                <Disclosure.Button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800">
                  <span className="sr-only">Ouvrir le menu</span>
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <Disclosure.Panel className="md:hidden">
              <div className="border-t border-slate-200/70 bg-white/96 px-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/96">
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="grid gap-2">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        onClick={() => close()}
                        className={`flex w-full items-center gap-3 rounded-[1.35rem] px-4 py-4 text-sm font-medium transition ${
                          isActive(item.href)
                            ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900"
                            : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>

                  <div className="mt-3 rounded-[1.5rem] bg-white px-4 py-4 dark:bg-slate-950">
                    {user ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                            Connecte en tant que
                          </p>
                          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                            {user.prenom} {user.nom}
                          </p>
                        </div>

                        <Disclosure.Button
                          as={Link}
                          to={userHomePath}
                          onClick={() => close()}
                          className="flex w-full items-center gap-3 rounded-[1.3rem] border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <UserCircleIcon className="h-5 w-5" />
                          {userHomeLabel}
                        </Disclosure.Button>

                        {user.role === "ADMIN" && (
                          <Disclosure.Button
                            as={Link}
                            to="/admin/monitoring"
                            onClick={() => close()}
                            className="flex w-full items-center gap-3 rounded-[1.3rem] bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                          >
                            <ShieldCheckIcon className="h-5 w-5" />
                            Outils admin
                          </Disclosure.Button>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-[1.3rem] border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          Deconnexion
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Disclosure.Button
                          as={Link}
                          to="/login"
                          onClick={() => close()}
                          className="inline-flex items-center justify-center rounded-[1.25rem] border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          Connexion
                        </Disclosure.Button>
                        <Disclosure.Button
                          as={Link}
                          to="/register"
                          onClick={() => close()}
                          className="inline-flex items-center justify-center rounded-[1.25rem] bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 text-sm font-medium text-white transition hover:from-primary-600 hover:to-primary-700"
                        >
                          Inscription
                        </Disclosure.Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Link
                      to="/conditions"
                      onClick={() => close()}
                      className="rounded-2xl bg-white px-3 py-3 text-center transition hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800"
                    >
                      Conditions
                    </Link>
                    <Link
                      to="/confidentialite"
                      onClick={() => close()}
                      className="rounded-2xl bg-white px-3 py-3 text-center transition hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800"
                    >
                      Confidentialite
                    </Link>
                  </div>
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
