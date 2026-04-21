import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminSectionNav from "../../components/AdminSectionNav";
import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const categoriesLabels = {
  ACTIF: {
    label: "Alumni en fonction",
    badgeClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  RETRAITE: {
    label: "Retraite",
    badgeClass:
      "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
  SANS_EMPLOI: {
    label: "Sans emploi",
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  INVITE: {
    label: "Invite",
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

const InscriptionsAdmin = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(null);

  const fetchInscriptions = async () => {
    try {
      const res = await api.get("/admin/inscriptions");
      setInscriptions(res.data);
    } catch (error) {
      console.error("Erreur chargement inscriptions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const valider = async (id) => {
    setValidating(id);

    try {
      await api.put(`/admin/inscriptions/${id}/valider`);
      await fetchInscriptions();
    } catch (_error) {
      alert("Erreur lors de la validation");
    } finally {
      setValidating(null);
    }
  };

  const totalMontant = inscriptions.reduce(
    (sum, inscription) => sum + inscription.montantTotal,
    0,
  );
  const enAttente = inscriptions.filter(
    (inscription) => inscription.statutPaiement === "EN_ATTENTE",
  ).length;
  const validees = inscriptions.filter(
    (inscription) => inscription.statutPaiement === "VALIDE",
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminSectionNav />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inscriptions au Gala</h1>
          <p className="text-slate-500">
            Gestion des inscriptions des participants
          </p>
        </div>
        <button
          onClick={fetchInscriptions}
          className="rounded-lg bg-slate-100 p-2 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-xl font-bold">{inscriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Validees</p>
              <p className="text-xl font-bold">{validees}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">En attente</p>
              <p className="text-xl font-bold">{enAttente}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <CurrencyDollarIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Revenus</p>
              <p className="text-xl font-bold">
                {totalMontant.toLocaleString()} Fcfa
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Participant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Categorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Invites
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {inscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Aucune inscription pour le moment
                  </td>
                </tr>
              ) : (
                inscriptions.map((inscription) => (
                  <tr
                    key={inscription.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {inscription.user.prenom} {inscription.user.nom}
                        </p>
                        <p className="text-sm text-slate-500">
                          {inscription.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoriesLabels[inscription.categorie]?.badgeClass}`}
                      >
                        {categoriesLabels[inscription.categorie]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {inscription.nombreInvites}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {inscription.montantTotal.toLocaleString()} Fcfa
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          inscription.statutPaiement === "VALIDE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {inscription.statutPaiement === "VALIDE"
                          ? "Valide"
                          : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {inscription.statutPaiement === "EN_ATTENTE" && (
                        <button
                          onClick={() => valider(inscription.id)}
                          disabled={validating === inscription.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                          {validating === inscription.id ? (
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4" />
                          )}
                          Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InscriptionsAdmin;
