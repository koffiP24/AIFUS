import { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  TicketIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const TombolaManagement = () => {
  const [billets, setBillets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(null);

  const fetchBillets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/tombola');
      setBillets(res.data);
    } catch (error) {
      console.error('Erreur chargement billets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillets();
  }, []);

  const handleValider = async (id) => {
    setValidating(id);
    try {
      await api.put(`/admin/tombola/${id}/valider`);
      await fetchBillets();
    } catch (_error) {
      alert('Erreur lors de la validation');
    } finally {
      setValidating(null);
    }
  };

  const totalMontant = billets.reduce((sum, b) => sum + b.montant, 0);
  const totalValides = billets.filter(b => b.statutPaiement === 'VALIDE').length;
  const enAttente = billets.filter(b => b.statutPaiement === 'EN_ATTENTE').length;

  const statCards = [
    {
      title: 'Total billets vendus',
      value: billets.length,
      icon: TicketIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Billets validés',
      value: totalValides,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'En attente',
      value: enAttente,
      icon: ClockIcon,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Revenus totaux',
      value: `${totalMontant.toLocaleString()} Fcfa`,
      icon: CurrencyDollarIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

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
          <h1 className="text-3xl font-bold">Gestion des billets de Tombola</h1>
          <p className="text-slate-500">Suivi des ventes et validations</p>
        </div>
        <button 
          onClick={fetchBillets}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-slate-500">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Prize Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              🚗
            </div>
            <div>
              <p className="text-amber-100 text-sm">Tirage au sort prévu lors du Gala</p>
              <p className="text-xl font-bold">1er août 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-amber-100 text-sm">Gros lot</p>
            <p className="text-2xl font-bold">Voiture</p>
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
                  Acheteur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  N° Billet
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date achat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {billets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <TicketIcon className="w-12 h-12 text-slate-300 mb-3" />
                      <p>Aucun billet vendu pour le moment</p>
                    </div>
                  </td>
                </tr>
              ) : (
                billets.map((billet) => (
                  <tr key={billet.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{billet.user.prenom} {billet.user.nom}</p>
                        <p className="text-sm text-slate-500">{billet.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                        {billet.numeroBillet}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{billet.montant.toLocaleString()} Fcfa</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        billet.statutPaiement === 'VALIDE' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : billet.statutPaiement === 'ANNULE'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {billet.statutPaiement === 'VALIDE' ? 'Validé' : billet.statutPaiement === 'ANNULE' ? 'Annulé' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(billet.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {billet.statutPaiement === 'EN_ATTENTE' && (
                        <button 
                          onClick={() => handleValider(billet.id)}
                          disabled={validating === billet.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {validating === billet.id ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircleIcon className="w-4 h-4" />
                          )}
                          Valider
                        </button>
                      )}
                      {billet.statutPaiement === 'VALIDE' && (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircleIcon className="w-4 h-4" />
                          Validé
                        </span>
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

export default TombolaManagement;