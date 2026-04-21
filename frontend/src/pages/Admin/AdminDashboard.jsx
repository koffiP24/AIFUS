import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import AdminSectionNav from "../../components/AdminSectionNav";
import {
  UsersIcon,
  TicketIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightIcon,
  QrCodeIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalInscriptions: 0,
    totalBillets: 0,
    validTickets: 0,
    checkedInCount: 0,
    montantTotalInscriptions: 0,
    montantTotalTombola: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Inscriptions Gala",
      value: stats.totalInscriptions,
      icon: CalendarIcon,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: UsersIcon,
      iconColor: "text-sky-600",
      bgColor: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      title: "Admins",
      value: stats.totalAdmins,
      icon: ShieldCheckIcon,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: "Tickets valides",
      value: stats.validTickets,
      icon: QrCodeIcon,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Participants scannes",
      value: stats.checkedInCount,
      icon: CheckBadgeIcon,
      iconColor: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Revenus Gala",
      value: `${stats.montantTotalInscriptions.toLocaleString()} Fcfa`,
      icon: CurrencyDollarIcon,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Revenus Tombola",
      value: `${stats.montantTotalTombola.toLocaleString()} Fcfa`,
      icon: ChartBarIcon,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  const totalRevenue =
    stats.montantTotalInscriptions + stats.montantTotalTombola;

  return (
    <div className="space-y-8">
      <AdminSectionNav />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-slate-500">Gestion des festivites AIFUS 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="mb-1 text-sm text-slate-500">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-primary-100">Revenus totaux</p>
            <p className="text-4xl font-bold">
              {totalRevenue.toLocaleString()} Fcfa
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <CurrencyDollarIcon className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <Link
          to="/admin/users"
          className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                <UsersIcon className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Utilisateurs</h3>
                <p className="text-sm text-slate-500">
                  {stats.totalUsers} compte(s) a superviser
                </p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
          </div>
        </Link>

        <Link
          to="/admin/inscriptions"
          className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <UsersIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Inscriptions Gala</h3>
                <p className="text-sm text-slate-500">
                  {stats.totalInscriptions} participants
                </p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
          </div>
        </Link>

        <Link
          to="/admin/events"
          className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                <CalendarIcon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Evenements</h3>
                <p className="text-sm text-slate-500">
                  Date, heure et lieu publics
                </p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
          </div>
        </Link>

        <Link
          to="/admin/monitoring"
          className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <QrCodeIcon className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monitoring</h3>
                <p className="text-sm text-slate-500">
                  {stats.checkedInCount} check-in(s) deja valides
                </p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
          </div>
        </Link>

        <Link
          to="/admin/tombola"
          className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <TicketIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gestion Tombola</h3>
                <p className="text-sm text-slate-500">
                  {stats.totalBillets} billets vendus
                </p>
              </div>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
