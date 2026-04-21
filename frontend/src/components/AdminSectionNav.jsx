import { Link, useLocation } from "react-router-dom";
import {
  CalendarDaysIcon,
  HomeModernIcon,
  QrCodeIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const items = [
  { label: "Dashboard", to: "/admin", icon: HomeModernIcon },
  { label: "Utilisateurs", to: "/admin/users", icon: UsersIcon },
  { label: "Inscriptions", to: "/admin/inscriptions", icon: CalendarDaysIcon },
  { label: "Evenements", to: "/admin/events", icon: CalendarDaysIcon },
  { label: "Monitoring", to: "/admin/monitoring", icon: QrCodeIcon },
  { label: "Tombola", to: "/admin/tombola", icon: TicketIcon },
];

const AdminSectionNav = () => {
  const location = useLocation();

  return (
    <nav className="w-full">
      <div className="flex w-full flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:justify-start">
        {items.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminSectionNav;
