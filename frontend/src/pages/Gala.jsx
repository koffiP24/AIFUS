import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ExclamationCircleIcon,
  GiftIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SparklesIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import GalaTicketCard from '../components/GalaTicketCard';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import api from '../services/api';
import {
  formatEventDateLabel,
  formatEventTimeRange
} from '../utils/eventSettings';

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
    iconBg: 'bg-sky-100 dark:bg-sky-900/30'
  },
  {
    value: 'RETRAITE',
    label: 'Retraite',
    price: 25000,
    description: 'Pour les alumni a la retraite',
    icon: UserIcon,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  {
    value: 'SANS_EMPLOI',
    label: 'Sans emploi',
    price: 15000,
    description: "Pour les alumni en quete d'emploi",
    icon: MagnifyingGlassIcon,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30'
  },
  {
    value: 'INVITE',
    label: 'Invite',
    price: 20000,
    description: 'Pour les personnes invitees par un membre',
    icon: GiftIcon,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30'
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
  const [places, setPlaces] = useState({
    ACTIF: 170,
    RETRAITE: 40,
    SANS_EMPLOI: 10,
    INVITE: 50
  });
  const [paymentStep, setPaymentStep] = useState('amount');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { categorie: 'ACTIF', nombreInvites: 0 }
  });

  const galaEvent = getEvent('gala');
  const categorie = watch('categorie');
  const nbInvites = watch('nombreInvites');

  const selectedCategory = categories.find((item) => item.value === categorie);
  const inscriptionCategory =
    categories.find((item) => item.value === inscription?.categorie) || selectedCategory;
  const SelectedCategoryIcon = selectedCategory?.icon;
  const InscriptionCategoryIcon = inscriptionCategory?.icon;
  const isPositiveMessage = /succes|confirme|annule/i.test(message);

  const montant = (categoryValue = categorie, invitesValue = nbInvites) => {
    const category = categories.find((item) => item.value === categoryValue);
    let base = category?.price || 0;

    if (categoryValue !== 'INVITE') {
      base += Number(invitesValue || 0) * 20000;
    }

    return base;
  };

  const getReservationPayload = (values = {}) => {
    const currentValues =
      values && typeof values === 'object' && 'categorie' in values ? values : {};
    const currentCategorie = currentValues.categorie ?? categorie;
    const currentNombreInvites =
      currentCategorie === 'INVITE'
        ? 0
        : Number(currentValues.nombreInvites ?? nbInvites ?? 0);

    return {
      categorie: currentCategorie,
      nombreInvites: currentNombreInvites
    };
  };

  const getAmountToPay = () => inscription?.montantTotal ?? montant();

  useEffect(() => {
    if (user) {
      api
        .get('/inscriptions/gala/mine')
        .then((res) => setInscription(res.data))
        .catch(() => {});
    } else {
      setInscription(null);
    }

    api
      .get('/inscriptions/gala/places')
      .then((res) => setPlaces(res.data))
      .catch(() => {});
  }, [user]);

  const ensurePendingInscription = async (values = {}) => {
    if (inscription?.id) {
      return inscription;
    }

    const payload = getReservationPayload(values);

    try {
      const res = await api.post('/inscriptions/gala', payload);
      setInscription(res.data);
      return res.data;
    } catch (err) {
      if (err.response?.status === 400) {
        try {
          const existing = await api.get('/inscriptions/gala/mine');
          if (existing.data) {
            setInscription(existing.data);
            return existing.data;
          }
        } catch (_existingError) {
          // We keep the original error below if refresh fails.
        }
      }

      throw err;
    }
  };

  const handlePayment = async (values = {}) => {
    setMessage('');
    setLoading(true);

    try {
      await ensurePendingInscription(values);
      setPaymentStep('amount');
      setShowPayment(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la preparation du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    setLoading(true);

    try {
      await api.delete('/inscriptions/gala/cancel');
      setInscription(null);
      setMessage('Reservation supprimee avec succes. Vous pouvez en reserver une nouvelle.');
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'annulation de la reservation");
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (scenario) => {
    if (!paymentPhone || !paymentMethod) {
      setMessage('Veuillez selectionner une methode de paiement et entrer votre numero.');
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      const reservation = await ensurePendingInscription();
      const res = await api.post('/payments/simulate', {
        reservationId: reservation.id,
        scenario,
        method: paymentMethod,
        phone: paymentPhone
      });

      if (res.data?.reservation) {
        setInscription(res.data.reservation);
      }

      setShowPayment(false);
      setPaymentStep('amount');
      setMessage(res.data?.message || 'Simulation de paiement terminee.');

      if (scenario === 'success') {
        setShowSuccess(true);
      }
    } catch (err) {
      setShowPayment(false);
      setPaymentStep('amount');
      setMessage(err.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPayment = async () => {
    await simulatePayment('success');
  };

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-300 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative px-8 py-16 text-center md:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm animate-fade-in">
            <SparklesIcon className="h-4 w-4 animate-spin" />
            <span>Evenement exclusif</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold animate-slide-up md:text-5xl">
            Grand{' '}
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Gala
            </span>{' '}
            des Alumni
          </h1>

          <p
            className="mx-auto mb-8 max-w-2xl text-xl text-amber-100 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Une soiree de celebration, de reconnaissance et de reseautage intergenerationnel
          </p>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
            <div
              className="rounded-xl bg-white/10 p-4 backdrop-blur animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <CalendarIcon className="mx-auto mb-2 h-8 w-8 text-amber-300" />
              <p className="font-semibold">{formatEventDateLabel(galaEvent)}</p>
            </div>
            <div
              className="rounded-xl bg-white/10 p-4 backdrop-blur animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <MapPinIcon className="mx-auto mb-2 h-8 w-8 text-amber-300" />
              <p className="font-semibold">{galaEvent?.location || 'Lieu a confirmer'}</p>
            </div>
            <div
              className="rounded-xl bg-white/10 p-4 backdrop-blur animate-slide-up"
              style={{ animationDelay: '0.5s' }}
            >
              <ClockIcon className="mx-auto mb-2 h-8 w-8 text-amber-300" />
              <p className="font-semibold">{formatEventTimeRange(galaEvent)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <SparklesIcon className="h-5 w-5 text-amber-500" />
            Au programme
          </h3>
          <ul className="space-y-3">
            {[
              'Cocktail de bienvenue',
              'Diner gala gastronomique',
              'Discours et temoignages',
              'Remise de distinctions',
              'Animation musicale',
              'Networking intergenerationnel'
            ].map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <UserGroupIcon className="h-5 w-5 text-primary-500" />
            Pourquoi participer ?
          </h3>
          <ul className="space-y-3">
            {[
              "Rencontrer les generations d'alumni",
              'Echanger avec les partenaires',
              "Participer a la vie de l'association",
              "Profiter d'une soiree inoubliable"
            ].map((item, index) => (
              <li
                key={item}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircleIcon className="h-5 w-5 text-primary-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 animate-fade-in dark:border-amber-800 dark:bg-amber-900/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-800 dark:text-amber-300">
          <ExclamationCircleIcon className="h-5 w-5" />
          Informations importantes - Gala des Alumni AIFUS
        </h3>

        <div className="prose max-w-none text-sm text-amber-700 dark:prose-invert dark:text-amber-400">
          <p className="mb-4">
            Dans le cadre de l&apos;organisation du Gala des Alumni AIFUS, ce formulaire
            permet de reserver votre participation. Toute reservation n&apos;est validee
            qu&apos;apres paiement et verification.
          </p>

          <div className="mb-4 rounded-lg bg-amber-100 p-4 dark:bg-amber-900/40">
            <p className="mb-2 font-semibold">Acces au Gala (places limitees)</p>
            <p className="text-xs">La participation au Gala est strictement limitee a 300 personnes.</p>
          </div>

          <p className="mb-2 font-semibold">Droit d&apos;entree selon le statut professionnel :</p>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>
              Personnes en fonctions : <strong>40 000 FCFA</strong> (170 places)
            </li>
            <li>
              Retraites : <strong>25 000 FCFA</strong> (40 places)
            </li>
            <li>
              Sans emploi : <strong>15 000 FCFA</strong> (10 places)
            </li>
            <li>
              Invites : <strong>20 000 FCFA</strong> (50 places)
            </li>
          </ul>

          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Reservation validee uniquement apres paiement - premier paye, premier servi
          </p>
        </div>
      </section>

      {message && (
        <div
          className={`rounded-lg border p-4 animate-fade-in ${
            isPositiveMessage
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      {user ? (
        inscription ? (
          <section className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 animate-fade-in dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-bounce dark:bg-green-900/30">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">
                  Vous etes inscrit
                </h2>
              </div>

              <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                    <span className="text-slate-500">Categorie</span>
                    <span className="flex items-center gap-2 font-semibold">
                      {InscriptionCategoryIcon && (
                        <InscriptionCategoryIcon
                          className={`h-4 w-4 ${inscriptionCategory?.iconColor}`}
                        />
                      )}
                      {inscriptionCategory?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                    <span className="text-slate-500">Nombre d&apos;invites</span>
                    <span className="font-semibold">{inscription.nombreInvites}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                    <span className="text-slate-500">Montant total</span>
                    <span className="text-lg font-bold text-primary-600">
                      {inscription.montantTotal.toLocaleString()} Fcfa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Statut du paiement</span>
                    <span
                      className={`badge ${
                        inscription.statutPaiement === 'VALIDE'
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      {inscription.statutPaiement === 'VALIDE' ? 'Confirme' : 'En attente'}
                    </span>
                  </div>
                </div>

                {inscription.statutPaiement === 'EN_ATTENTE' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePayment()}
                      className="mt-6 w-full btn-primary py-3 transition-transform hover:scale-105"
                    >
                      Proceder au paiement
                    </button>
                    <button
                      onClick={handleCancelReservation}
                      disabled={loading}
                      className="w-full rounded-xl border border-red-300 py-3 text-red-700 transition-colors hover:bg-red-50"
                    >
                      Annuler ma reservation
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
            <div className="mb-8 text-center animate-fade-in">
              <h2 className="mb-2 text-3xl font-bold">Inscription au Gala</h2>
              <p className="text-slate-500">Choisissez votre categorie et reservez votre place</p>
            </div>

            <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, index) => (
                <label
                  key={cat.value}
                  className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-105 ${
                    categorie === cat.value
                      ? 'border-amber-500 bg-amber-50 shadow-lg dark:bg-amber-900/20'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  } ${places[cat.value] <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <input
                    type="radio"
                    value={cat.value}
                    {...register('categorie')}
                    disabled={places[cat.value] <= 0}
                    className="sr-only"
                  />
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}
                  >
                    <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                  </div>
                  <div className="mb-1 font-semibold">{cat.label}</div>
                  <div className="font-bold text-amber-600">{cat.price.toLocaleString()} Fcfa</div>
                  <div className="mt-1 text-xs text-slate-500">{cat.description}</div>
                  <div className="mt-2 text-xs font-medium">
                    {places[cat.value] > 0 ? (
                      <span className="text-green-600">{places[cat.value]} places restantes</span>
                    ) : (
                      <span className="text-red-500">Complet</span>
                    )}
                  </div>
                  {categorie === cat.value && (
                    <div className="absolute right-2 top-2 animate-bounce">
                      <CheckCircleIcon className="h-5 w-5 text-amber-500" />
                    </div>
                  )}
                </label>
              ))}
            </div>

            {categorie !== 'INVITE' && (
              <div className="mb-4 rounded-xl bg-white p-6 shadow-lg animate-slide-up dark:bg-slate-800">
                <label className="label">Nombre d&apos;invites</label>
                <select
                  {...register('nombreInvites', { valueAsNumber: true })}
                  className="input-field"
                >
                  <option value={0}>0 invite</option>
                  <option value={1}>1 invite</option>
                  <option value={2}>2 invites</option>
                  <option value={3}>3 invites</option>
                </select>
                <p className="mt-2 text-sm text-slate-500">20 000 Fcfa par invite supplementaire</p>
              </div>
            )}

            <div className="mb-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-center text-white animate-pulse">
              <p className="mb-2 text-primary-100">Montant total a payer</p>
              <p className="text-4xl font-bold">{montant().toLocaleString()} Fcfa</p>
              {categorie !== 'INVITE' && nbInvites > 0 && (
                <p className="mt-2 text-sm text-primary-200">
                  ({selectedCategory?.price.toLocaleString()} Fcfa + {nbInvites} x 20 000 Fcfa)
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit(handlePayment)} className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-4 text-lg transition-transform hover:scale-110"
              >
                {loading ? 'Preparation en cours...' : 'Proceder au paiement'}
              </button>
            </form>
          </section>
        )
      ) : (
        <section className="rounded-2xl bg-slate-50 p-8 text-center animate-fade-in dark:bg-slate-800/50">
          <ExclamationCircleIcon className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h3 className="mb-2 text-xl font-semibold">Connexion requise</h3>
          <p className="mb-6 text-slate-500">
            Veuillez vous connecter ou creer un compte pour vous inscrire au Gala.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn-primary">
              Se connecter
            </a>
            <a href="/register" className="btn-outline">
              Creer un compte
            </a>
          </div>
        </section>
      )}

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 animate-scale-in dark:bg-slate-800">
            <button
              onClick={() => {
                setShowPayment(false);
                setPaymentStep('amount');
              }}
              className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-600"
              type="button"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {paymentStep === 'amount' && (
              <>
                <h3 className="mb-4 text-xl font-bold">Paiement - Orange Money / Wave</h3>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                  <p className="text-sm opacity-90">Montant a payer</p>
                  <p className="text-3xl font-bold">{getAmountToPay().toLocaleString()} Fcfa</p>
                </div>

                <div className="mb-4">
                  <label className="label">Methode de paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange')}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        paymentMethod === 'orange'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-sm font-medium">Orange Money</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wave')}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        paymentMethod === 'wave'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <CreditCardIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium">Wave</div>
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label">Numero de telephone</label>
                  <div className="relative">
                    <DevicePhoneMobileIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={paymentPhone}
                      onChange={(event) => setPaymentPhone(event.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="input-field pl-12"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Vous recevrez un code de confirmation sur ce numero.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDirectPayment}
                  disabled={loading}
                  className="w-full btn-primary py-3 transition-transform hover:scale-105"
                >
                  {loading ? 'Traitement en cours...' : `Simuler succes - ${getAmountToPay().toLocaleString()} Fcfa`}
                </button>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => simulatePayment('fail')}
                    disabled={loading}
                    className="rounded-xl border border-amber-300 px-4 py-3 font-medium text-amber-700 transition-colors hover:bg-amber-50"
                  >
                    Simuler echec
                  </button>
                  <button
                    type="button"
                    onClick={() => simulatePayment('cancel')}
                    disabled={loading}
                    className="rounded-xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Simuler annulation
                  </button>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                <p className="text-lg font-medium">Traitement du paiement...</p>
                <p className="text-sm text-slate-500">Veuillez patienter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center animate-scale-in dark:bg-slate-800">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <SparklesIcon className="h-10 w-10 animate-bounce text-green-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Felicitations</h3>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              Votre inscription au Gala des Alumni AIFUS est confirmee.
            </p>

            <div className="mb-6 rounded-lg bg-slate-50 p-4 text-left dark:bg-slate-700">
              <p className="mb-2 text-sm font-medium">Details de la reservation :</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Categorie :</span>
                  <span className="flex items-center gap-2 font-medium">
                    {InscriptionCategoryIcon ? (
                      <InscriptionCategoryIcon
                        className={`h-4 w-4 ${inscriptionCategory?.iconColor}`}
                      />
                    ) : SelectedCategoryIcon ? (
                      <SelectedCategoryIcon className={`h-4 w-4 ${selectedCategory?.iconColor}`} />
                    ) : null}
                    {inscriptionCategory?.label || selectedCategory?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Montant :</span>
                  <span className="font-medium text-green-600">
                    {inscription?.montantTotal?.toLocaleString()} Fcfa
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm text-slate-500">
              Un email de confirmation a ete envoye a votre adresse email.
            </p>
            <button onClick={() => setShowSuccess(false)} className="btn-primary px-8" type="button">
              Retour au Gala
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gala;
