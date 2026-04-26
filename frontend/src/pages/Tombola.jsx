import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import {
  BoltIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  TicketIcon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { formatEventShortDate } from "../utils/eventSettings";
import {
  TOMBOLA_EVENT_SLUG,
  createTicketingOrder,
  initiateTicketingPayment,
  listTicketTypes,
} from "../services/ticketingV2";
import { getApiErrorMessage } from "../utils/apiError";
import {
  buildPaymentReturnPath,
  getLatestPaymentSessionForPath,
  savePaymentSession,
} from "../utils/paymentSession";
import {
  FEDAPAY_SANDBOX_MTN_HINT,
  isLikelyFedapaySandbox,
} from "../utils/fedapaySandbox";

const buildCustomerFromUser = (user, phoneOverride) => ({
  firstName: String(user?.prenom || user?.firstName || "").trim(),
  lastName: String(user?.nom || user?.lastName || "").trim(),
  email: String(user?.email || "").trim().toLowerCase(),
  phone: String(phoneOverride || user?.telephone || user?.phone || "").trim(),
});

const Tombola = () => {
  const { user } = useAuth();
  const { getEvent } = useEvents();
  const [quantite, setQuantite] = useState(1);
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [places, setPlaces] = useState({ totale: 100, restantes: 100 });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState("details");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [ticketType, setTicketType] = useState(null);
  const [recentSession, setRecentSession] = useState(null);
  const tombolaEvent = getEvent("tombola");

  const prixBillet = ticketType?.priceAmount || 10000;
  const maxBillets = Math.min(ticketType?.maxPerOrder || 10, 10);
  const maxAllowedQuantity = Math.max(
    1,
    Math.min(maxBillets, places.restantes || maxBillets),
  );
  const isPositiveMessage = /redirection|pret|reprendre|verification/i.test(
    message,
  );
  const showSandboxHint = isLikelyFedapaySandbox();

  useEffect(() => {
    setPaymentPhone(String(user?.telephone || user?.phone || "").trim());
  }, [user?.telephone, user?.phone]);

  useEffect(() => {
    setRecentSession(getLatestPaymentSessionForPath("/tombola"));
  }, []);

  useEffect(() => {
    setQuantite((current) => Math.min(current, maxAllowedQuantity));
  }, [maxAllowedQuantity]);

  useEffect(() => {
    let isMounted = true;

    const loadTicketType = async () => {
      setCatalogLoading(true);

      try {
        const ticketTypes = await listTicketTypes({
          eventSlug: TOMBOLA_EVENT_SLUG,
        });
        const currentTicketType =
          ticketTypes.find((item) => item.code === "TOMBOLA_STD") ||
          ticketTypes[0] ||
          null;

        if (!isMounted) {
          return;
        }

        setTicketType(currentTicketType);
        setPlaces({
          totale: currentTicketType?.stockTotal || 100,
          restantes: currentTicketType?.availableQuantity ?? 0,
        });
      } catch (_error) {
        if (isMounted) {
          setMessage(
            "La billetterie tombola est temporairement indisponible. Rechargez la page dans un instant.",
          );
        }
      } finally {
        if (isMounted) {
          setCatalogLoading(false);
        }
      }
    };

    loadTicketType();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInitiatePurchase = () => {
    setShowPayment(true);
    setPaymentStep("details");
    setMessage("");
  };

  const handleDirectPayment = async () => {
    setLoading(true);
    setPaymentStep("processing");
    setMessage("");

    try {
      const customer = buildCustomerFromUser(user, paymentPhone);

      if (!customer.firstName || !customer.lastName || !customer.email) {
        throw new Error(
          "Votre profil est incomplet. Ajoutez votre nom, prenom et email avant le paiement.",
        );
      }

      if (!ticketType?.id) {
        throw new Error("Le billet tombola n'est pas disponible.");
      }

      const order = await createTicketingOrder({
        items: [
          {
            ticketTypeId: ticketType.id,
            quantity: quantite,
          },
        ],
        customer,
      });

      const payment = await initiateTicketingPayment({
        orderReference: order.reference,
        customerEmail: customer.email,
        provider: "FEDAPAY",
      });

      const paymentUrl =
        payment?.instructions?.paymentUrl || payment?.payment?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Aucun lien de paiement FedaPay n'a ete retourne.");
      }

      const session = {
        orderReference: payment.order.reference,
        paymentReference: payment.payment.transactionReference,
        customerEmail: customer.email,
        sourcePath: "/tombola",
        label: "Tombola AIFUS",
      };

      savePaymentSession(session);
      setRecentSession(session);
      setMessage("Redirection vers FedaPay en cours...");
      window.location.assign(paymentUrl);
    } catch (error) {
      setPaymentStep("details");
      setMessage(
        getApiErrorMessage(
          error,
          "Impossible de lancer le paiement FedaPay pour la tombola.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const lots = [
    {
      rang: 1,
      libelle: "Voiture",
      valeur: "8 000 000 Fcfa",
      icon: TruckIcon,
      couleur: "from-yellow-500 to-amber-600",
    },
    {
      rang: 2,
      libelle: "Moto Yamaha",
      valeur: "1 500 000 Fcfa",
      icon: BoltIcon,
      couleur: "from-gray-500 to-gray-700",
    },
    {
      rang: 3,
      libelle: "Smartphone Premium",
      valeur: "800 000 Fcfa",
      icon: DevicePhoneMobileIcon,
      couleur: "from-blue-500 to-blue-700",
    },
    {
      rang: 4,
      libelle: "Ordinateur Portable",
      valeur: "600 000 Fcfa",
      icon: ComputerDesktopIcon,
      couleur: "from-purple-500 to-purple-700",
    },
    {
      rang: 5,
      libelle: "Voyage Russia",
      valeur: "500 000 Fcfa",
      icon: PaperAirplaneIcon,
      couleur: "from-red-500 to-red-700",
    },
  ];

  const autresLots = [
    'Television 55"',
    "Machine a laver",
    "Refrigerateur",
    "Climatiseur",
    "Tablette",
    "Montre connectee",
    "Casque audio",
    "Appareil photo",
    "Sejour en Resort",
    "Billet avion Abidjan-Moscou",
    "Cours de russe",
    "Pack tech",
    "Bon d'achat",
    "Et autres lots...",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse-slow rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse-slow rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 left-1/4 h-48 w-48 animate-float rounded-full bg-gradient-to-br from-white/5 to-white/10 blur-xl" style={{animationDelay: '2.5s'}}></div>

          {/* Star Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Badge */}
            <div className="mb-8 flex justify-center animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/40 bg-purple-500/15 px-6 py-3 backdrop-blur-sm">
                <SparklesIcon className="h-5 w-5 text-purple-300 animate-pulse" />
                <span className="text-sm font-bold tracking-wide uppercase">
                  Tirage lors du Gala - {formatEventShortDate(tombolaEvent)}
                </span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 animate-slide-up text-center text-5xl font-bold tracking-tight md:text-6xl">
              <div className="mb-2">Grande</div>
              <div className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Tombola AIFUS 2026
              </div>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-12 max-w-3xl animate-slide-up text-center text-xl leading-relaxed text-purple-100 md:text-2xl" style={{animationDelay: '0.2s'}}>
              Tentez de gagner une voiture et de nombreux lots exceptionnels
            </p>

            {/* Price Badge */}
            <div className="mb-12 flex justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-6 shadow-2xl">
                <p className="mb-1 text-sm text-amber-100">Prix du billet</p>
                <p className="text-5xl font-bold text-white">
                  {prixBillet.toLocaleString()}{" "}
                  <span className="text-2xl text-amber-200">Fcfa</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 dark:to-transparent"></div>
      </section>

      {/* Prizes Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-100 to-indigo-50 px-4 py-2 text-sm font-bold text-purple-700 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-300">
              Les lots à gagner
            </div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Plus de 50 lots exceptionnels
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              De la voiture aux appareils électroniques, découvrez les prix
            </p>
          </div>

          {/* Main Prizes */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {lots.map((lot, index) => (
              <div
                key={lot.rang}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl dark:bg-slate-800"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${lot.couleur}`}></div>

                {/* Icon */}
                <div className="mx-auto mb-4 mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <lot.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="mb-2 text-xs text-slate-500 uppercase tracking-wider">
                  Rang {lot.rang}
                </div>
                <h3 className="mb-2 text-lg font-bold">{lot.libelle}</h3>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {lot.valeur}
                </p>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${lot.couleur} opacity-5`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Prizes */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 shadow-xl dark:from-slate-800 dark:to-slate-900">
            <h3 className="mb-6 text-center text-2xl font-bold">Et aussi...</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {autresLots.map((lot, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-md transition-all hover:scale-110 hover:shadow-lg dark:bg-slate-700 dark:text-slate-300"
                >
                  {lot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Session Warning */}
      {recentSession && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="group overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 p-6 shadow-lg transition-all hover:shadow-xl dark:border-sky-700 dark:from-sky-900/30 dark:to-blue-900/30">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-sky-800 dark:text-sky-300">
                    Un paiement Tombola est déjà en cours ou récent sur cet appareil.
                  </p>
                  <p className="mt-1 text-sm text-sky-700 dark:text-sky-200">
                    Référence : <span className="font-mono">{recentSession.orderReference}</span>
                  </p>
                </div>
                <Link
                  to={buildPaymentReturnPath({
                    provider: "fedapay",
                    orderReference: recentSession.orderReference,
                    paymentReference: recentSession.paymentReference,
                  })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-sky-700 hover:scale-105"
                >
                  Vérifier mon paiement
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Message Display */}
      {message && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className={`overflow-hidden rounded-2xl border-2 p-6 animate-fade-in ${
              isPositiveMessage
                ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-800 dark:border-green-800 dark:from-green-900/30 dark:to-emerald-900/30"
                : "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 text-red-800 dark:border-red-800 dark:from-red-900/30 dark:to-rose-900/30"
            }`}>
              <div className="flex items-center gap-3">
                {isPositiveMessage ? (
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0" />
                ) : (
                  <ExclamationCircleIcon className="h-6 w-6 flex-shrink-0" />
                )}
                <p className="text-lg font-medium">{message}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Purchase Section */}
      {user ? (
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6 md:px-8 md:py-8">
                <h3 className="flex items-center gap-3 text-2xl font-bold text-white md:text-3xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <TicketIcon className="h-6 w-6 text-white" />
                  </div>
                  Acheter vos billets
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Quantity Selector */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <label className="text-lg font-bold">
                      Nombre de billets (max {maxBillets})
                    </label>
                    <span className="text-sm text-slate-500">
                      {catalogLoading ? (
                        <span className="flex items-center gap-2 font-medium text-slate-500">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                          Vérification du stock...
                        </span>
                      ) : places.restantes > 0 ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {places.restantes} billets disponibles
                        </span>
                      ) : (
                        <span className="font-semibold text-red-500">Complet</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={() => setQuantite(Math.max(1, quantite - 1))}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl font-bold transition-all duration-200 hover:scale-110 hover:from-slate-200 hover:to-slate-300 shadow-md dark:from-slate-700 dark:to-slate-600"
                    >
                      -
                    </button>

                    <div className="flex h-14 min-w-[4rem] items-center justify-center rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 px-6 text-3xl font-bold shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                      {quantite}
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuantite(Math.min(maxAllowedQuantity, quantite + 1))}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl font-bold transition-all duration-200 hover:scale-110 hover:from-slate-200 hover:to-slate-300 shadow-md dark:from-slate-700 dark:to-slate-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-inner dark:from-slate-700 dark:to-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Prix unitaire</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {prixBillet.toLocaleString()} Fcfa
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {(quantite * prixBillet).toLocaleString()} Fcfa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  type="button"
                  onClick={handleInitiatePurchase}
                  disabled={
                    loading ||
                    catalogLoading ||
                    quantite < 1 ||
                    places.restantes < 1 ||
                    quantite > places.restantes
                  }
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-primary-600 px-6 py-5 text-xl font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-primary-700 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        Préparation du paiement...
                      </>
                    ) : catalogLoading ? (
                      "Vérification du stock..."
                    ) : (
                      <>
                        <TicketIcon className="h-6 w-6" />
                        Acheter {quantite} billet{quantite > 1 ? "s" : ""} avec FedaPay
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Login Required */
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-10 text-center shadow-2xl dark:from-slate-800 dark:to-slate-900">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                <ExclamationCircleIcon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Connexion requise</h3>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Veuillez vous connecter ou créer un compte pour acheter des billets de tombola.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/login"
                  className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-700 hover:scale-105"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border-2 border-primary-500 px-8 py-3 text-lg font-semibold text-primary-600 transition-all duration-300 hover:bg-primary-50 hover:scale-105"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 animate-scale-in shadow-2xl dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {paymentStep === "details" && (
              <>
                <h3 className="mb-6 text-2xl font-bold">Paiement sécurisé FedaPay</h3>
                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-primary-700 p-6 text-white shadow-lg">
                  <p className="mb-2 text-purple-100">Montant à payer</p>
                  <p className="text-4xl font-bold">
                    {(quantite * prixBillet).toLocaleString()} Fcfa
                  </p>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block font-bold">Numéro de téléphone</label>
                  <div className="relative">
                    <DevicePhoneMobileIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={paymentPhone}
                      onChange={(event) => setPaymentPhone(event.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="input-field py-3 pl-12 text-lg"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Orange Money, Wave et les moyens compatibles seront proposés sur FedaPay.
                  </p>
                  {showSandboxHint && (
                    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
                      {FEDAPAY_SANDBOX_MTN_HINT}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDirectPayment}
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-primary-600 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        Préparation du paiement...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5" />
                        Payer {(quantite * prixBillet).toLocaleString()} Fcfa avec FedaPay
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-primary-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>
              </>
            )}

            {paymentStep === "processing" && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                <p className="mb-2 text-xl font-medium">Création du paiement...</p>
                <p className="text-slate-500">
                  Vous allez être redirigé vers FedaPay.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tombola;
