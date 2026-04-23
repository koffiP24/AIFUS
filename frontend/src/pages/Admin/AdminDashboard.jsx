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
  if (!value || !maxValue) {
    return 0;
  }

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
      group: "count",
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
      group: "count",
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
      group: "count",
      label: "controle acces",
      accentBar: "bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500",
      glowColor: "bg-indigo-200/70 dark:bg-indigo-500/20",
      icon: ShieldCheckIcon,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50/90 dark:bg-indigo-900/20",
    },
    {
      title: "Tickets valides",
      value: stats.validTickets,
      format: "number",
      group: "count",
      label: "scan pret",
      accentBar: "bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-500",
      glowColor: "bg-fuchsia-200/70 dark:bg-fuchsia-500/20",
      icon: QrCodeIcon,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/90 dark:bg-purple-900/20",
    },
    {
      title: "Participants scannes",
      value: stats.checkedInCount,
      format: "number",
      group: "count",
      label: "entrees validees",
      accentBar: "bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500",
      glowColor: "bg-emerald-200/70 dark:bg-emerald-500/20",
      icon: CheckBadgeIcon,
      iconColor: "text-green-600",
      bgColor: "bg-green-50/90 dark:bg-green-900/20",
    },
    {
      title: "Revenus Gala",
      value: stats.montantTotalInscriptions,
      format: "currency",
      group: "revenue",
      label: "encaissement",
      accentBar: "bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500",
      glowColor: "bg-blue-200/70 dark:bg-blue-500/20",
      icon: CurrencyDollarIcon,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/90 dark:bg-blue-900/20",
    },
    {
      title: "Revenus Tombola",
      value: stats.montantTotalTombola,
      format: "currency",
      group: "revenue",
      label: "collecte live",
      accentBar: "bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-500",
      glowColor: "bg-indigo-200/70 dark:bg-indigo-500/20",
      icon: ChartBarIcon,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50/90 dark:bg-indigo-900/20",
    },
  ];

  const metricMaximums = statCards.reduce((accumulator, stat) => {
    const currentMax = accumulator[stat.group] || 0;
    accumulator[stat.group] = Math.max(currentMax, stat.value, 1);
    return accumulator;
  }, {});

  const compactStatCards = statCards.map((stat) => ({
    ...stat,
    progress: getMetricProgress(stat.value, metricMaximums[stat.group]),
  }));

  const totalRevenue =
    stats.montantTotalInscriptions + stats.montantTotalTombola;

  const revenueMix = [
    {
      label: "Gala",
      value: stats.montantTotalInscriptions,
      share:
        totalRevenue > 0
          ? Math.round((stats.montantTotalInscriptions / totalRevenue) * 100)
          : 0,
      accentBar: "bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500",
    },
    {
      label: "Tombola",
      value: stats.montantTotalTombola,
      share:
        totalRevenue > 0
          ? Math.round((stats.montantTotalTombola / totalRevenue) * 100)
          : 0,
      accentBar: "bg-gradient-to-r from-violet-300 via-indigo-400 to-fuchsia-500",
    },
  ];

  const actionCards = [
    {
      title: "Utilisateurs",
      to: "/admin/users",
      icon: UsersIcon,
      iconColor: "text-sky-600",
      bgColor: "bg-sky-50/90 dark:bg-sky-900/20",
      accentBar: "bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500",
      glowColor: "bg-sky-200/70 dark:bg-sky-500/20",
      badge: "Acces",
      description: "Roles, profils et suivi des comptes.",
      metricValue: stats.totalUsers,
      metricFormat: "number",
      metricLabel: "comptes a superviser",
    },
    {
      title: "Inscriptions Gala",
      to: "/admin/inscriptions",
      icon: CalendarIcon,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50/90 dark:bg-amber-900/20",
      accentBar: "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500",
      glowColor: "bg-amber-200/70 dark:bg-amber-500/20",
      badge: "Flux",
      description: "Participants, statuts et paiements.",
      metricValue: stats.totalInscriptions,
      metricFormat: "number",
      metricLabel: "participants",
    },
    {
      title: "Evenements",
      to: "/admin/events",
      icon: CalendarIcon,
      iconColor: "text-slate-700 dark:text-slate-200",
      bgColor: "bg-slate-100/90 dark:bg-slate-700/90",
      accentBar: "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-700",
      glowColor: "bg-slate-200/70 dark:bg-slate-500/20",
      badge: "Public",
      description: "Date, heure, lieu et message visible.",
      metricLabel: "pilotage du contenu public",
    },
    {
      title: "Monitoring",
      to: "/admin/monitoring",
      icon: QrCodeIcon,
      iconColor: "text-violet-600",
      bgColor: "bg-violet-50/90 dark:bg-violet-900/20",
      accentBar: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500",
      glowColor: "bg-violet-200/70 dark:bg-violet-500/20",
      badge: "Scan",
      description: "Controle terrain, tickets et passages.",
      metricValue: stats.checkedInCount,
      metricFormat: "number",
      metricLabel: "check-in(s) valides",
    },
    {
      title: "Gestion Tombola",
      to: "/admin/tombola",
      icon: TicketIcon,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/90 dark:bg-purple-900/20",
      accentBar: "bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500",
      glowColor: "bg-purple-200/70 dark:bg-purple-500/20",
      badge: "Vente",
      description: "Numeros, validation et suivi des billets.",
      metricValue: stats.totalBillets,
      metricFormat: "number",
      metricLabel: "billets vendus",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminSectionNav />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-slate-500">Gestion des festivites AIFUS 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {compactStatCards.map((stat) => (
          <div
            key={stat.title}
            className={`${surfaceCardClass} p-4 sm:p-5`}
          >
            <div className={`absolute inset-x-4 top-0 h-1 rounded-full ${stat.accentBar}`} />
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-80 blur-2xl transition-transform duration-500 group-hover:scale-125 ${stat.glowColor}`}
            />
            <div className="relative mb-4 flex items-start justify-between gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 ${stat.bgColor}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-700/80 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
            </div>
            <div className="relative space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-[1.65rem] font-bold leading-none tracking-tight text-slate-950 dark:text-white">
                  <AnimatedMetricValue value={stat.value} format={stat.format} />
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  <span>{stat.label}</span>
                  <span>{stat.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700/70">
                  <div
                    className={`h-2 rounded-full ${stat.accentBar} transition-all duration-700`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[1.8rem] border border-slate-800/30 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-800 p-5 text-white shadow-[0_22px_45px_-28px_rgba(15,23,42,0.8)] sm:p-6 xl:col-span-2">
          <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" />
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute -bottom-12 left-12 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl transition-transform duration-500 group-hover:scale-110" />

          <div className="relative flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
                  Revenue pulse
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Revenus totaux
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200/80">
                  Vue instantanee des encaissements billetterie et tombola.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                <CurrencyDollarIcon className="h-6 w-6 text-cyan-100" />
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[2rem] font-bold leading-none tracking-tight text-white sm:text-[2.6rem]">
                  <AnimatedMetricValue value={totalRevenue} format="currency" />
                </p>
                <p className="mt-2 text-sm text-cyan-100/75">
                  Suivi global de la caisse evenementielle
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                {revenueMix.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/75">
                      <span>{item.label}</span>
                      <span>{item.share}%</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-white">
                      <AnimatedMetricValue value={item.value} format="currency" />
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full ${item.accentBar}`}
                        style={{ width: `${Math.max(item.share, item.value > 0 ? 12 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {actionCards.slice(0, 2).map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`${surfaceCardClass} p-4 sm:p-5`}
            >
              <div className={`absolute inset-x-4 top-0 h-1 rounded-full ${card.accentBar}`} />
              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-80 blur-2xl transition-transform duration-500 group-hover:scale-125 ${card.glowColor}`}
              />

              <div className="relative flex h-full flex-col justify-between gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 ${card.bgColor}`}
                  >
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <span className="rounded-full bg-slate-100/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-700/80 dark:text-slate-300">
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {card.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xl font-bold leading-none tracking-tight text-slate-950 dark:text-white">
                        <AnimatedMetricValue
                          value={card.metricValue}
                          format={card.metricFormat}
                        />
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        {card.metricLabel}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {actionCards.slice(2).map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`${surfaceCardClass} p-4 sm:p-5`}
          >
            <div className={`absolute inset-x-4 top-0 h-1 rounded-full ${card.accentBar}`} />
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-80 blur-2xl transition-transform duration-500 group-hover:scale-125 ${card.glowColor}`}
            />

            <div className="relative flex h-full flex-col justify-between gap-5">
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 ${card.bgColor}`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <span className="rounded-full bg-slate-100/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-700/80 dark:text-slate-300">
                  {card.badge}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    {typeof card.metricValue === "number" ? (
                      <p className="text-xl font-bold leading-none tracking-tight text-slate-950 dark:text-white">
                        <AnimatedMetricValue
                          value={card.metricValue}
                          format={card.metricFormat}
                        />
                      </p>
                    ) : (
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                        {card.metricLabel}
                      </p>
                    )}
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      {typeof card.metricValue === "number"
                        ? card.metricLabel
                        : "espace de configuration"}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
