import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

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
    } catch (error) {
      alert("Erreur lors de la validation");
    } finally {
      setValidating(null);
    }
  };

  const categoriesLabels = {
    ACTIF: { label: "Alumni en fonction", color: "blue" },
    RETRAITE: { label: "Retraité", color: "gray" },
    SANS_EMPLOI: { label: "Sans emploi", color: "yellow" },
    INVITE: { label: "Invité", color: "purple" },
  };

  const totalMontant = inscriptions.reduce(
    (sum, ins) => sum + ins.montantTotal,
    0,
  );
  const enAttente = inscriptions.filter(
    (ins) => ins.statutPaiement === "EN_ATTENTE",
  ).length;
  const validees = inscriptions.filter(
    (ins) => ins.statutPaiement === "VALIDE",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inscriptions au Gala</h1>
          <p className="text-slate-500">
            Gestion des inscriptions des participants
          </p>
        </div>
        <button
          onClick={fetchInscriptions}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-xl font-bold">{inscriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Validées</p>
              <p className="text-xl font-bold">{validees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">En attente</p>
              <p className="text-xl font-bold">{enAttente}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-primary-600" />
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Invités
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                inscriptions.map((ins) => (
                  <tr
                    key={ins.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {ins.user.prenom} {ins.user.nom}
                        </p>
                        <p className="text-sm text-slate-500">
                          {ins.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${categoriesLabels[ins.categorie]?.color}-100 text-${categoriesLabels[ins.categorie]?.color}-800 dark:bg-${categoriesLabels[ins.categorie]?.color}-900/30 dark:text-${categoriesLabels[ins.categorie]?.color}-400`}
                      >
                        {categoriesLabels[ins.categorie]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ins.nombreInvites}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {ins.montantTotal.toLocaleString()} Fcfa
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ins.statutPaiement === "VALIDE"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {ins.statutPaiement === "VALIDE"
                          ? "Validé"
                          : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ins.statutPaiement === "EN_ATTENTE" && (
                        <button
                          onClick={() => valider(ins.id)}
                          disabled={validating === ins.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {validating === ins.id ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircleIcon className="w-4 h-4" />
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
