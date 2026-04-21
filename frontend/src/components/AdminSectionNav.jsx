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
      <div className="no-scrollbar flex w-full gap-3 overflow-x-auto rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-3 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 lg:flex-wrap lg:justify-start">
        {items.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`inline-flex shrink-0 items-center gap-2 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-800"
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
