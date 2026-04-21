import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from "../context/EventContext";
import api from '../services/api';
import GalaTicketCard from '../components/GalaTicketCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  BriefcaseIcon,
  CalendarIcon, 
  CreditCardIcon,
  MapPinIcon, 
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  GiftIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  formatEventDateLabel,
  formatEventTimeRange,
} from "../utils/eventSettings";

const schema = z.object({
  categorie: z.enum(['ACTIF', 'RETRAITE', 'SANS_EMPLOI', 'INVITE']),
  nombreInvites: z.number().min(0).max(3)
});

const categories = [
  {
    value: 'ACTIF',
    label: 'Alumni en fonction',
    price: 40000,
    description: 'Pour les alumni actuellement en poste',
    icon: BriefcaseIcon,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    places: 170
  },
  {
    value: 'RETRAITE',
    label: 'Retraité',
    price: 25000,
    description: 'Pour les alumni à la retraite',
    icon: UserIcon,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    places: 40
  },
  {
    value: 'SANS_EMPLOI',
    label: 'Sans emploi',
    price: 15000,
    description: 'Pour les alumni en quête d\'emploi',
    icon: MagnifyingGlassIcon,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    places: 10
  },
  {
    value: 'INVITE',
    label: 'Invité',
    price: 20000,
    description: 'Pour les personnes invitées par un membre',
    icon: GiftIcon,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    places: 50
  }
];

const Gala = () => {
  const { user } = useAuth();
  const { getEvent } = useEvents();
  const [inscription, setInscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [places, setPlaces] = useState({ ACTIF: 170, RETRAITE: 40, SANS_EMPLOI: 10, INVITE: 50 });
  const [paymentStep, setPaymentStep] = useState('amount');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { categorie: 'ACTIF', nombreInvites: 0 }
  });
  const galaEvent = getEvent("gala");

  const categorie = watch('categorie');
  const nbInvites = watch('nombreInvites');

  const selectedCategory = categories.find(c => c.value === categorie);
  const inscriptionCategory = categories.find(c => c.value === inscription?.categorie) || selectedCategory;
  const SelectedCategoryIcon = selectedCategory?.icon;
  const InscriptionCategoryIcon = inscriptionCategory?.icon;
  const montant = () => {
    let base = selectedCategory?.price || 0;
    if (categorie !== 'INVITE') base += nbInvites * 20000;
    return base;
  };

  useEffect(() => {
    if (user) {
      api.get('/inscriptions/gala/mine').then(res => setInscription(res.data)).catch(() => {});
    }
    api.get('/inscriptions/gala/places').then(res => setPlaces(res.data)).catch(() => {});
  }, [user]);

  const handlePayment = () => {
    setShowPayment(true);
    setPaymentStep('amount');
  };

  const handleCancelReservation = async () => {
    setLoading(true);
    try {
      await api.delete('/inscriptions/gala/cancel');
      setInscription(null);
      setMessage('Réservation supprimée avec succès. Vous pouvez en réserver une nouvelle.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de l\'annulation de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPayment = async () => {
    if (!paymentPhone || !paymentMethod) {
      setMessage('Veuillez sélectionner un méthode de paiement et entrer votre numéro');
      return;
    }
    setLoading(true);
    setPaymentStep('processing');
    try {
      const res = await api.post('/inscriptions/gala/payer-direct', {
        categorie,
        nombreInvites: categorie === 'INVITE' ? 0 : nbInvites,
        montant: montant(),
        phone: paymentPhone,
        method: paymentMethod
      });
      setInscription(res.data);
      setShowPayment(false);
      setShowSuccess(true);
      setMessage('Paiement confirmé avec succès.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors du paiement');
      setPaymentStep('amount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6 animate-fade-in">
            <SparklesIcon className="w-4 h-4 animate-spin" />
            <span>Événement exclusif</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
            Grand <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">Gala</span> des Alumni
          </h1>
          
          <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Une soirée de célébration, de reconnaissance et de réseautage intergénérationnel
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-amber-300" />
              <p className="font-semibold">{formatEventDateLabel(galaEvent)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <MapPinIcon className="w-8 h-8 mx-auto mb-2 text-amber-300" />
              <p className="font-semibold">{galaEvent?.location || "Lieu a confirmer"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <ClockIcon className="w-8 h-8 mx-auto mb-2 text-amber-300" />
              <p className="font-semibold">{formatEventTimeRange(galaEvent)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Détails */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-amber-500" />
            Au programme
          </h3>
          <ul className="space-y-3">
            {['Cocktail de bienvenue', 'Dîner gala gastronomique', 'Discours et témoignages', 'Remise de distinctions', 'Animation musicale', 'Networking intergénérationnel'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-primary-500" />
            Pourquoi participer ?
          </h3>
          <ul className="space-y-3">
            {['Rencontrer les générations d\'alumni', 'Échanger avec les partenaires', 'Participer à la vie de l\'association', 'Profiter d\'une soirée inoubliable'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CheckCircleIcon className="w-5 h-5 text-primary-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Info importante */}
      <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
          <ExclamationCircleIcon className="w-5 h-5" />
          Informations importantes - Gala des Alumni AIFUS
        </h3>
        <div className="prose dark:prose-invert max-w-none text-sm text-amber-700 dark:text-amber-400">
          <p className="mb-4">Dans le cadre de l'organisation du Gala des Alumni AIFUS, ce formulaire permet de réserver votre participation. Toute réservation n'est validée qu'après paiement et vérification.</p>
          
          <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-4 mb-4">
            <p className="font-semibold mb-2">Accès au Gala (places limitées)</p>
            <p className="text-xs">La participation au Gala est strictement limitée à 300 personnes.</p>
          </div>
          
          <p className="font-semibold mb-2">Droit d'entrée selon le statut professionnel :</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Personnes en fonctions : <strong>40 000 FCFA</strong> (170 places)</li>
            <li>Retraités : <strong>25 000 FCFA</strong> (40 places)</li>
            <li>Sans emploi : <strong>15 000 FCFA</strong> (10 places)</li>
            <li>Invités : <strong>20 000 FCFA</strong> (50 places)</li>
          </ul>
          
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Réservation validée uniquement après paiement – premier payé, premier servi
          </p>
        </div>
      </section>

      {/* Inscription */}
      {user ? (
        inscription ? (
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 animate-fade-in">
            <div className="space-y-6">
              <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-bounce">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">Vous êtes inscrit</h2>
            </div>
            
            <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Catégorie</span>
                  <span className="flex items-center gap-2 font-semibold">
                    {InscriptionCategoryIcon && (
                      <InscriptionCategoryIcon className={`h-4 w-4 ${inscriptionCategory?.iconColor}`} />
                    )}
                    {inscriptionCategory?.label}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Nombre d'invités</span>
                  <span className="font-semibold">{inscription.nombreInvites}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Montant total</span>
                  <span className="font-bold text-lg text-primary-600">{inscription.montantTotal.toLocaleString()} Fcfa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Statut du paiement</span>
                  <span className={`badge ${inscription.statutPaiement === 'VALIDE' ? 'badge-success' : 'badge-warning'}`}>
                    {inscription.statutPaiement === 'VALIDE' ? 'Confirmé' : 'En attente'}
                  </span>
                </div>
              </div>
              
              {inscription.statutPaiement === 'EN_ATTENTE' && (
                <div className="space-y-3">
                  <button onClick={handlePayment} className="w-full mt-6 btn-primary py-3 hover:scale-105 transition-transform">
                    Procéder au paiement
                  </button>
                  <button onClick={handleCancelReservation} disabled={loading} className="w-full py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors">
                    Annuler ma réservation
                  </button>
                </div>
              )}

              {inscription.statutPaiement === 'VALIDE' && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-900/30">
                    <p className="flex items-center justify-center gap-2 font-medium text-green-800 dark:text-green-300">
                      <CheckCircleIcon className="h-5 w-5" />
                      Votre place est reservee
                    </p>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                      Un email de confirmation vous a ete envoye.
                    </p>
                  </div>

                </div>
              )}
            </div>

            {inscription.statutPaiement === 'VALIDE' && (
              <div className="mt-6">
                <GalaTicketCard
                  inscription={inscription}
                  participantName={`${user?.prenom || ''} ${user?.nom || ''}`.trim()}
                />
              </div>
            )}
            </div>
          </section>
        ) : (
          <section>
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Inscription au Gala</h2>
              <p className="text-slate-500">Choisissez votre catégorie et réservez votre place</p>
            </div>
            
            {message && (
              <div className={`mb-6 p-4 rounded-lg animate-fade-in ${message.toLowerCase().includes('succès') || message.toLowerCase().includes('confirm') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}
            
            {/* Catégories */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {categories.map((cat, i) => (
                <label
                  key={cat.value}
                  className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    categorie === cat.value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  } ${places[cat.value] <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <input
                    type="radio"
                    value={cat.value}
                    {...register('categorie')}
                    disabled={places[cat.value] <= 0}
                    className="sr-only"
                  />
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                  </div>
                  <div className="font-semibold mb-1">{cat.label}</div>
                  <div className="text-amber-600 font-bold">{cat.price.toLocaleString()} Fcfa</div>
                  <div className="text-xs text-slate-500 mt-1">{cat.description}</div>
                  <div className="text-xs mt-2 font-medium">
                    {places[cat.value] > 0 ? (
                      <span className="text-green-600">{places[cat.value]} places restantes</span>
                    ) : (
                      <span className="text-red-500">Complet</span>
                    )}
                  </div>
                  {categorie === cat.value && (
                    <div className="absolute top-2 right-2 animate-bounce">
                      <CheckCircleIcon className="w-5 h-5 text-amber-500" />
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Invités */}
            {categorie !== 'INVITE' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-4 animate-slide-up">
                <label className="label">Nombre d'invités</label>
                <select
                  {...register('nombreInvites', { valueAsNumber: true })}
                  className="input-field"
                >
                  <option value={0}>0 invité</option>
                  <option value={1}>1 invité</option>
                  <option value={2}>2 invités</option>
                  <option value={3}>3 invités</option>
                </select>
                <p className="text-sm text-slate-500 mt-2">20 000 Fcfa par invité supplémentaire</p>
              </div>
            )}
            
            {/* Montant dynamique */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white text-center mb-6 animate-pulse">
              <p className="text-primary-100 mb-2">Montant total à payer</p>
              <p className="text-4xl font-bold">{montant().toLocaleString()} Fcfa</p>
              {categorie !== 'INVITE' && nbInvites > 0 && (
                <p className="text-sm text-primary-200 mt-2">({selectedCategory?.price.toLocaleString()} Fcfa + {nbInvites} × 20 000 Fcfa)</p>
              )}
            </div>
            
            {/* Submit */}
            <form onSubmit={handleSubmit(handlePayment)} className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-4 text-lg hover:scale-110 transition-transform"
              >
                {loading ? 'Inscription en cours...' : 'Procéder au paiement'}
              </button>
            </form>
          </section>
        )
      ) : (
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center animate-fade-in">
          <ExclamationCircleIcon className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connexion requise</h3>
          <p className="text-slate-500 mb-6">Veuillez vous connecter ou créer un compte pour vous inscrire au Gala.</p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn-primary">Se connecter</a>
            <a href="/register" className="btn-outline">Créer un compte</a>
          </div>
        </section>
      )}

      {/* Modal Paiement */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {paymentStep === 'amount' && (
              <>
                <h3 className="text-xl font-bold mb-4">Paiement - Orange Money / Wave</h3>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white">
                  <p className="text-sm opacity-90">Montant à payer</p>
                  <p className="text-3xl font-bold">{montant().toLocaleString()} Fcfa</p>
                </div>
                
                <div className="mb-4">
                  <label className="label">Méthode de paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('orange')}
                      className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === 'orange' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-sm font-medium">Orange Money</div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('wave')}
                      className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === 'wave' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <CreditCardIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium">Wave</div>
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="label">Numéro de téléphone</label>
                  <div className="relative">
                    <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="input-field pl-12"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vous recevrez un code de confirmation sur ce numéro</p>
                </div>
                
                <button onClick={handleDirectPayment} disabled={loading} className="w-full btn-primary py-3 hover:scale-105 transition-transform">
                  {loading ? 'Traitement en cours...' : `Payer ${montant().toLocaleString()} Fcfa`}
                </button>
              </>
            )}
            
            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium">Traitement du paiement...</p>
                <p className="text-sm text-slate-500">Veuillez patienter</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-10 h-10 text-green-600 animate-bounce" />
              </div>
            <h3 className="text-2xl font-bold mb-2">Félicitations</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Votre inscription au Gala des Alumni AIFUS est confirmée.</p>
            
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium mb-2">Détails de la réservation :</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Catégorie :</span>
                  <span className="flex items-center gap-2 font-medium">
                    {SelectedCategoryIcon && (
                      <SelectedCategoryIcon className={`h-4 w-4 ${selectedCategory?.iconColor}`} />
                    )}
                    {selectedCategory?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Montant :</span>
                  <span className="font-medium text-green-600">{inscription?.montantTotal?.toLocaleString()} Fcfa</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">Un email de confirmation a été envoyé à votre adresse email.</p>
            <button onClick={() => setShowSuccess(false)} className="btn-primary px-8">
              Retour au Gala
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gala;
