import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  TicketIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import AdminSectionNav from "../../components/AdminSectionNav";

const formatDate = (value) => {
  if (!value) return "--";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalParticipants: 0,
    totalGalaParticipants: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingUserId, setSavingUserId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showScroll, setShowScroll] = useState(false);

  // Gestion de l'affichage du bouton scroll to top
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

  const fetchUsers = async (searchValue = "") => {
    // Désactiver le rafraîchissement si c'est le premier chargement
    if (!loading) {
      setRefreshing(true);
    } else {
      setFeedback("");
    }

    try {
      const hasSearch = searchValue.trim().length > 0;
      const response = await api.get("/admin/users", {
        params: hasSearch ? { search: searchValue.trim() } : {},
      });
      setUsers(response.data.users);
      setStats(response.data.stats);
    } catch (_error) {
      setFeedback("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchUsers(search);
  };

  const handleRoleChange = async (userId, role) => {
    setSavingUserId(userId);
    setFeedback("");

    try {
      const response = await api.put(`/admin/users/${userId}`, { role });

      // Mise à jour locale immédiate
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? { ...user, ...response.data } : user,
        ),
      );

      setFeedback("Rôle utilisateur mis à jour.");

      // Rechargement silencieux des stats (sans bloquer l'UI)
      const statsResponse = await api.get("/admin/stats");
      if (statsResponse.data) {
        setStats((prevStats) => ({
          ...prevStats,
          totalAdmins: statsResponse.data.totalAdmins,
          totalUsers: statsResponse.data.totalUsers,
        }));
      }
    } catch (error) {
      setFeedback(
        error.response?.data?.message ||
          "Impossible de mettre à jour cet utilisateur.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: UsersIcon,
      accent: "text-sky-600",
      surface: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      title: "Administrateurs",
      value: stats.totalAdmins,
      icon: ShieldCheckIcon,
      accent: "text-violet-600",
      surface: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      title: "Participants",
      value: stats.totalParticipants,
      icon: UserCircleIcon,
      accent: "text-emerald-600",
      surface: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Inscrits gala",
      value: stats.totalGalaParticipants,
      icon: TicketIcon,
      accent: "text-amber-600",
      surface: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

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

      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-8 py-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
              <UsersIcon className="h-4 w-4" />
              Gestion des utilisateurs
            </p>
            <h1 className="text-3xl font-bold">
              Comptes participants et admins
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Recherchez un compte, visualisez son activité et ajustez son rôle
              d&apos;administration depuis ce tableau.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchUsers(search)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15 disabled:opacity-60"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-2 text-3xl font-bold">{card.value}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.surface}`}
              >
                <card.icon className={`h-6 w-6 ${card.accent}`} />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom, prénom, email ou téléphone"
              className="input-field pl-12"
            />
          </div>
          <button
            type="submit"
            className="btn-primary whitespace-nowrap px-6 py-3"
          >
            Rechercher
          </button>
        </form>

        {feedback && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            {feedback}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Gala
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tombola
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rôle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Créé le
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const galaRegistration = user.inscriptionsGala?.[0] || null;
                  const tombolaCount = user._count?.billetsTombola ?? 0;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {user.telephone || "Téléphone non renseigné"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {galaRegistration ? (
                          <div className="space-y-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {galaRegistration.statutPaiement === "VALIDE"
                                ? "Inscription validée"
                                : "Inscription en attente"}
                            </p>
                            <p className="text-slate-500">
                              {galaRegistration.ticketCode || "Ticket non émis"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-500">
                            Aucune inscription
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {tombolaCount} billet(s)
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(user.id, event.target.value)
                          }
                          disabled={savingUserId === user.id}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="USER">Participant</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
