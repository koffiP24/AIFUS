import { useEffect, useRef, useState } from "react";
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

const formatMetricValue = (value, format = "number") => {
  if (format === "currency") {
    return `${value.toLocaleString()} Fcfa`;
  }
  return value.toLocaleString();
};

const getMetricProgress = (value, maxValue) => {
  if (!value || !maxValue) return 0;
  return Math.max(Math.round((value / maxValue) * 100), 14);
};

const AnimatedMetricValue = ({ value, format = "number" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);

  useEffect(() => {
    const from = previousValueRef.current;
    const to = value;
    const duration = 850;
    if (from === to) {
      setDisplayValue(to);
      return;
    }
    let frameId;
    const startTime = performance.now();
    const updateValue = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(from + (to - from) * easedProgress);
      setDisplayValue(nextValue);
      if (progress < 1) {
        frameId = requestAnimationFrame(updateValue);
        return;
      }
      previousValueRef.current = to;
    };
    frameId = requestAnimationFrame(updateValue);
    return () => {
      cancelAnimationFrame(frameId);
      previousValueRef.current = to;
    };
  }, [value]);

  return formatMetricValue(displayValue, format);
};

const surfaceCardClass =
  "group relative overflow-hidden rounded-[1.6rem] border border-slate-200/70 bg-white/95 shadow-[0_16px_35px_-26px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_-26px_rgba(15,23,42,0.45)] dark:border-slate-700/80 dark:bg-slate-800/95";

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
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const toggleScrollButton = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      setShowScroll(scrolled > 300);
    };
    window.addEventListener("scroll", toggleScrollButton);
    window.addEventListener("load", toggleScrollButton);
    return () => {
      window.removeEventListener("scroll", toggleScrollButton);
      window.removeEventListener("load", toggleScrollButton);
    };
  }, []);

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
      format: "number",
      label: "niveau gala",
      accentBar: "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500",
      glowColor: "bg-amber-200/70 dark:bg-amber-500/20",
      icon: CalendarIcon,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50/90 dark:bg-amber-900/20",
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      format: "number",
      label: "base active",
      accentBar: "bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500",
      glowColor: "bg-sky-200/70 dark:bg-sky-500/20",
      icon: UsersIcon,
      iconColor: "text-sky-600",
      bgColor: "bg-sky-50/90 dark:bg-sky-900/20",
    },
    {
      title: "Admins",
      value: stats.totalAdmins,
      format: "number",
      label: "controle acces",
      accentBar:
        "bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500",
      glowColor: "bg-indigo-200/70 dark:bg-indigo-500/20",
      icon: ShieldCheckIcon,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50/90 dark:bg-indigo-900/20",
    },
    {
      title: "Tickets valides",
      value: stats.validTickets,
      format: "number",
      label: "scan pret",
      accentBar:
        "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500",
      glowColor: "bg-emerald-200/70 dark:bg-emerald-500/20",
      icon: CheckBadgeIcon,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50/90 dark:bg-emerald-900/20",
    },
  ];

  const metricItems = [
    {
      title: "Téléchargements",
      metricLabel: "Billet(s) validé(s)",
      metricValue: stats.checkedInCount || 0,
      metricMax: Number.POSITIVE_INFINITY,
      icon: QrCodeIcon,
      iconColor: "text-purple-600",
      progress: getMetricProgress(stats.checkedInCount || 0, 100),
      glowColor: "bg-purple-200/70 dark:bg-purple-500/20",
      accentBar:
        "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500",
      bgColor: "bg-purple-50/90 dark:bg-purple-900/20",
      link: "/admin/monitoring", // chemin corrigé vers la page de monitoring (scans)
    },
    {
      title: "Revenus Gala",
      metricLabel: "Total encaissé",
      metricValue: formatMetricValue(
        stats.montantTotalInscriptions,
        "currency",
      ),
      metricMax: 1000000,
      icon: CurrencyDollarIcon,
      iconColor: "text-amber-600",
      progress: getMetricProgress(stats.montantTotalInscriptions, 1000000),
      glowColor: "bg-amber-200/70 dark:bg-amber-500/20",
      accentBar: "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500",
      bgColor: "bg-amber-50/90 dark:bg-amber-900/20",
      link: "/admin/inscriptions", // route correcte (pluriel)
    },
    {
      title: "Revenus Tombola",
      metricLabel: "Total billets",
      metricValue: formatMetricValue(stats.montantTotalTombola, "currency"),
      metricMax: 500000,
      icon: TicketIcon,
      iconColor: "text-purple-600",
      progress: getMetricProgress(stats.montantTotalTombola, 500000),
      glowColor: "bg-purple-200/70 dark:bg-purple-500/20",
      accentBar:
        "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500",
      bgColor: "bg-purple-50/90 dark:bg-purple-900/20",
      link: "/admin/tombola", // route correcte
    },
    {
      title: "Participations",
      metricLabel: "Total billets vendus",
      metricValue: stats.totalBillets,
      metricMax: 500,
      icon: ChartBarIcon,
      iconColor: "text-teal-600",
      progress: getMetricProgress(stats.totalBillets, 500),
      glowColor: "bg-teal-200/70 dark:bg-teal-500/20",
      accentBar: "bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500",
      bgColor: "bg-teal-50/90 dark:bg-teal-900/20",
      link: "/admin/tombola", // route correcte
    },
  ];

  const quickActions = [];

  return (
    <div className="space-y-8">
      {/* Bouton retour en haut - apparaît après scroll */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-90 ${
          showScroll
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
        aria-label="Remonter en haut"
        title="Remonter en haut"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transition-transform duration-200 group-hover:rotate-12"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <AdminSectionNav />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={surfaceCardClass}>
            <div className="flex items-center justify-between">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.bgColor}`}
              >
                <card.icon className={`h-7 w-7 ${card.iconColor}`} />
              </div>
              <div
                className={`h-2 w-2 rounded-full ${card.glowColor} animate-pulse`}
              />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                <AnimatedMetricValue value={card.value} format={card.format} />
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full ${card.accentBar} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(card.progress, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricItems.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`${surfaceCardClass} p-6 group relative cursor-pointer`}
          >
            <div
              className={`absolute bottom-0 left-0 h-1 ${card.accentBar} transition-all duration-500 group-hover:w-full group-hover:opacity-100 w-0 opacity-0`}
            />
            <div
              className={`absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${card.glowColor}`}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">
                  {card.metricValue}
                </p>
                {typeof card.metricValue === "number" ? (
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    {card.metricLabel}
                  </p>
                ) : (
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    espace de configuration
                  </p>
                )}
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accentColor} ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${card.accentBar.split(" ")[0]}`}
                />
                <span>Cliquez pour gérer</span>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.href}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${action.bgColor})`,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.accentColor} text-slate-700 dark:text-slate-200`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
