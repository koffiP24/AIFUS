import { Link, useLocation } from "react-router-dom";
import {
  GiftIcon,
  HomeIcon,
  MapPinIcon,
  QrCodeIcon,
  SparklesIcon,
  UserCircleIcon,
  UsersIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const participantItems = (user) => [
  { label: "Accueil", to: "/", icon: HomeIcon, match: ["/"] },
  { label: "Village", to: "/village", icon: MapPinIcon, match: ["/village"] },
  { label: "Gala", to: "/gala", icon: SparklesIcon, match: ["/gala"] },
  { label: "Tombola", to: "/tombola", icon: GiftIcon, match: ["/tombola"] },
  {
    label: user ? "Espace" : "Compte",
    to: user?.role === "ADMIN" ? "/admin" : user ? "/dashboard" : "/login",
    icon: UserCircleIcon,
    match: ["/dashboard", "/login", "/register", "/forgot-password", "/reset-password"],
  },
];

const adminItems = [
  { label: "Accueil", to: "/admin", icon: HomeIcon, match: ["/admin"] },
  { label: "Users", to: "/admin/users", icon: UsersIcon, match: ["/admin/users"] },
  {
    label: "Events",
    to: "/admin/events",
    icon: CalendarDaysIcon,
    match: ["/admin/events", "/admin/inscriptions", "/admin/tombola"],
  },
  {
    label: "Scan",
    to: "/admin/monitoring",
    icon: QrCodeIcon,
    match: ["/admin/monitoring"],
  },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const hiddenRoutes = ["/conditions", "/confidentialite"];
  const shouldHide = hiddenRoutes.includes(location.pathname);

  if (shouldHide) {
    return null;
  }

  const items =
    user?.role === "ADMIN" && location.pathname.startsWith("/admin")
      ? adminItems
      : participantItems(user);

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.85rem)] md:hidden">
      <div className="pointer-events-auto mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-2 shadow-[0_28px_90px_-38px_rgba(15,23,42,0.68)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/88">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((item) => {
            const isActive = item.match.some((path) =>
              path === "/admin"
                ? location.pathname === path
                : location.pathname === path || location.pathname.startsWith(`${path}/`),
            );

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-h-[4.25rem] flex-col items-center justify-center gap-1 rounded-[1.4rem] px-2 py-2 text-[0.72rem] font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "" : "opacity-80"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
