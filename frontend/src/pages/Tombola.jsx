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
  email: String(user?.email || "")
    .trim()
    .toLowerCase(),
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
  const [showScroll, setShowScroll] = useState(false);
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
          "Votre profil est incomplet. Ajoutez votre nom, prénom et email avant le paiement.",
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
        throw new Error("Aucun lien de paiement FedaPay n'a été retourné.");
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
    <div className="space-y-16">
      {/* ========== NOUVEAU BOUTON SCROLL TO TOP ========== */}
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

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-400 blur-3xl"></div>
        </div>

        <div className="relative px-8 py-16 text-center md:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
            <SparklesIcon className="h-4 w-4 animate-spin" />
            <span>
              Tirage lors du Gala - {formatEventShortDate(tombolaEvent)}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Grande{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Tombola
            </span>{" "}
            AIFUS 2026
          </h1>

          <div className="flex flex-col items-center justify-center text-center w-full">
            <p className="text-xl md:text-2xl">
              Tentez de gagner une voiture et de nombreux lots exceptionnels
            </p>
          </div>

          <div className="mt-8 inline-block">
            <div className="rounded-2xl bg-white/10 px-8 py-4 backdrop-blur">
              <p className="mb-1 text-sm text-purple-200">Prix du billet</p>
              <p className="text-4xl font-bold text-white">
                {prixBillet.toLocaleString()}{" "}
                <span className="text-lg">Fcfa</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">Les lots à gagner</h2>
          <p className="text-slate-500">Plus de 50 lots à remporter !</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          {lots.map((lot) => (
            <div
              key={lot.rang}
              className="rounded-xl bg-white p-4 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
            >
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${lot.couleur} text-3xl`}
              >
                <lot.icon className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 text-xs text-slate-500">Rang {lot.rang}</div>
              <div className="mb-1 text-sm font-bold">{lot.libelle}</div>
              <div className="text-sm font-semibold text-primary-600">
                {lot.valeur}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800/50">
          <h3 className="mb-4 text-lg font-semibold">Et aussi...</h3>
          <div className="flex flex-wrap gap-2">
            {autresLots.map((lot) => (
              <span
                key={lot}
                className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-400"
              >
                {lot}
              </span>
            ))}
          </div>
        </div>
      </section>

      {recentSession && (
        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-900/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                Un paiement Tombola est déjà en cours ou récent sur cet
                appareil.
              </p>
              <p className="mt-1 text-sm text-sky-700 dark:text-sky-200">
                Reference:{" "}
                <span className="font-mono">
                  {recentSession.orderReference}
                </span>
              </p>
            </div>
            <Link
              to={buildPaymentReturnPath({
                provider: "fedapay",
                orderReference: recentSession.orderReference,
                paymentReference: recentSession.paymentReference,
              })}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Verifier mon paiement
            </Link>
          </div>
        </section>
      )}

      {message && (
        <div
          className={`rounded-lg border p-4 ${
            isPositiveMessage
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {user ? (
        <section className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                <TicketIcon className="h-6 w-6" />
                Acheter des billets
              </h3>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label className="label mb-0">
                    Nombre de billets (max {maxBillets})
                  </label>
                  <span className="text-sm text-slate-500">
                    {catalogLoading ? (
                      <span className="font-medium text-slate-500">
                        Vérification du stock...
                      </span>
                    ) : places.restantes > 0 ? (
                      <span className="font-medium text-green-600">
                        {places.restantes} billets disponibles
                      </span>
                    ) : (
                      <span className="font-medium text-red-500">Complet</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    className="h-10 w-10 rounded-lg bg-slate-100 text-xl font-bold transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxAllowedQuantity}
                    value={quantite}
                    onChange={(event) =>
                      setQuantite(
                        Math.min(
                          maxAllowedQuantity,
                          Math.max(1, parseInt(event.target.value, 10) || 1),
                        ),
                      )
                    }
                    className="input-field w-24 text-center text-xl font-bold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuantite(Math.min(maxAllowedQuantity, quantite + 1))
                    }
                    className="h-10 w-10 rounded-lg bg-slate-100 text-xl font-bold transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
                <div>
                  <p className="text-sm text-slate-500">Prix unitaire</p>
                  <p className="font-semibold">
                    {prixBillet.toLocaleString()} Fcfa
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {(quantite * prixBillet).toLocaleString()} Fcfa
                  </p>
                </div>
              </div>

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
                className="w-full btn-primary py-4 text-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Acheter {quantite} billet{quantite > 1 ? "s" : ""} avec FedaPay
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-800/50">
          <ExclamationCircleIcon className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h3 className="mb-2 text-xl font-semibold">Connexion requise</h3>
          <p className="mb-6 text-slate-500">
            Veuillez vous connecter ou créer un compte pour acheter des billets.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn-primary">
              Se connecter
            </Link>
            <Link to="/register" className="btn-outline">
              Créer un compte
            </Link>
          </div>
        </section>
      )}

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 animate-scale-in dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {paymentStep === "details" && (
              <>
                <h3 className="mb-4 text-xl font-bold">
                  Paiement sécurisé FedaPay
                </h3>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-600 to-primary-700 p-4 text-white">
                  <p className="text-sm opacity-90">Montant a payer</p>
                  <p className="text-3xl font-bold">
                    {(quantite * prixBillet).toLocaleString()} Fcfa
                  </p>
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
                    Orange Money, Wave et les moyens compatibles seront proposés
                    sur FedaPay.
                  </p>
                  {showSandboxHint && (
                    <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
                      {FEDAPAY_SANDBOX_MTN_HINT}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDirectPayment}
                  disabled={loading}
                  className="w-full btn-primary py-3 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Preparation du paiement..."
                    : `Payer ${(quantite * prixBillet).toLocaleString()} Fcfa avec FedaPay`}
                </button>
              </>
            )}

            {paymentStep === "processing" && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                <p className="text-lg font-medium">Création du paiement...</p>
                <p className="text-sm text-slate-500">
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
