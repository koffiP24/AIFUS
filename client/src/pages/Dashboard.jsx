import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  CalendarIcon,
  TicketIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user } = useAuth();
  const [inscription, setInscription] = useState(null);
  const [billets, setBillets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    Promise.all([
      api.get("/inscriptions/gala/mine").catch(() => null),
      api.get("/tombola/mes-billets").catch(() => []),
    ]).then(([inscriptionRes, billetsRes]) => {
      setInscription(inscriptionRes?.data || null);
      setBillets(billetsRes.data || []);
      setLoading(false);
    });
  }, []);

  const handleCancelInscription = async () => {
    try {
      await api.delete('/inscriptions/gala/cancel');
      setInscription(null);
      setNotification('Réservation annulée avec succès.');
    } catch (err) {
      setNotification(err.response?.data?.message || 'Impossible d\'annuler la réservation.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="loader"></div>
      </div>
    );
  }

  const categoriesLabels = {
    ACTIF: { label: "Alumni en fonction", icon: "💼" },
    RETRAITE: { label: "Retraité", icon: "🌴" },
    SANS_EMPLOI: { label: "Sans emploi", icon: "🔍" },
    INVITE: { label: "Invité", icon: "🎁" },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-slate-900 to-purple-700 opacity-95"></div>
        <div className="absolute -top-12 -right-8 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-8 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
              <UserCircleIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Bienvenue, {user?.prenom} !
              </h1>
              <p className="text-primary-100">Membre AIFUS • {user?.email}</p>
            </div>
          </div>
          <p className="text-primary-100 max-w-xl">
            Gérez vos inscriptions aux événements et consultez vos billets de
            tombola depuis votre espace personnel.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Gala</p>
              <p className="text-xl font-bold">{inscription ? "1" : "0"}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TicketIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Billets Tombola</p>
              <p className="text-xl font-bold">{billets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Validés</p>
              <p className="text-xl font-bold">
                {billets.filter((b) => b.statutPaiement === "VALIDE").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">En attente</p>
              <p className="text-xl font-bold">
                {billets.filter((b) => b.statutPaiement !== "VALIDE").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Gala Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <SparklesIcon className="w-6 h-6" />
              Inscription au Gala
            </h2>
          </div>

          <div className="p-6">
            {inscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold">Inscrit</p>
                      <p className="text-sm text-slate-500">1er août 2026</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Catégorie</span>
                    <span className="font-medium">
                      {categoriesLabels[inscription.categorie]?.icon}{" "}
                      {categoriesLabels[inscription.categorie]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Invités</span>
                    <span className="font-medium">
                      {inscription.nombreInvites}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Montant</span>
                    <span className="font-bold text-primary-600">
                      {inscription.montantTotal.toLocaleString()} Fcfa
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500">Statut</span>
                    <span
                      className={`badge ${inscription.statutPaiement === "VALIDE" ? "badge-success" : "badge-warning"}`}
                    >
                      {inscription.statutPaiement === "VALIDE"
                        ? "Confirmé"
                        : "En attente"}
                    </span>
                  </div>
                </div>
                {inscription.statutPaiement === 'EN_ATTENTE' && (
                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={handleCancelInscription}
                      className="w-full py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Annuler la réservation
                    </button>
                    {notification && (
                      <div className="text-sm text-slate-600">{notification}</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-4">
                  Vous n'êtes pas encore inscrit au Gala
                </p>
                <Link
                  to="/gala"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  S'inscrire au Gala
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tombola Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TicketIcon className="w-6 h-6" />
              Billets de Tombola
            </h2>
          </div>

          <div className="p-6">
            {billets.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-semibold">
                        {billets.length} billet(s) acheté(s)
                      </p>
                      <p className="text-sm text-slate-500">
                        Tirage le 1er août 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    Vos numéros :
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {billets.slice(0, 6).map((billet) => (
                      <div
                        key={billet.id}
                        className={`p-2 rounded-lg text-center ${
                          billet.statutPaiement === "VALIDE"
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                        }`}
                      >
                        <span className="font-mono font-bold">
                          {billet.numeroBillet}
                        </span>
                        <div
                          className={`text-xs ${billet.statutPaiement === "VALIDE" ? "text-green-600" : "text-yellow-600"}`}
                        >
                          {billet.statutPaiement === "VALIDE" ? "✓" : "⏳"}
                        </div>
                      </div>
                    ))}
                  </div>
                  {billets.length > 6 && (
                    <p className="text-sm text-slate-500 text-center">
                      + {billets.length - 6} autres
                    </p>
                  )}
                </div>

                <Link
                  to="/tombola"
                  className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
                >
                  Acheter plus de billets →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TicketIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-4">
                  Vous n'avez pas encore de billets
                </p>
                <Link
                  to="/tombola"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Participer à la Tombola
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-gradient-to-r from-primary-600 to-purple-700 text-white p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Restez prêt pour les événements</h2>
            <p className="text-primary-100 max-w-2xl">
              Vos expériences AIFUS sont centralisées ici : gala, tombola et village d'opportunités.
              Profitez d'un accès immédiat à vos billets et réservations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/gala" className="btn-outline text-white border-white/40 hover:bg-white/10">
              Voir le Gala
            </Link>
            <Link to="/tombola" className="btn-primary bg-white text-slate-900 hover:shadow-lg">
              Acheter des billets
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/village"
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            🏛️
          </div>
          <div>
            <p className="font-medium">Village Opportunités</p>
            <p className="text-sm text-slate-500">Découvrir</p>
          </div>
        </Link>
        <Link
          to="/gala"
          className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
            ✨
          </div>
          <div>
            <p className="font-medium">Gala des Alumni</p>
            <p className="text-sm text-slate-500">Voir détails</p>
          </div>
        </Link>
        <Link
          to="/tombola"
          className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
            🎁
          </div>
          <div>
            <p className="font-medium">Tombola</p>
            <p className="text-sm text-slate-500">Gagner des lots</p>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
