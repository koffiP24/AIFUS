import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ExclamationCircleIcon,
  GiftIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  SparklesIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import {
  GALA_EVENT_SLUG,
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
  formatEventDateLabel,
  formatEventTimeRange,
} from "../utils/eventSettings";
import {
  FEDAPAY_SANDBOX_MTN_HINT,
  isLikelyFedapaySandbox,
} from "../utils/fedapaySandbox";

const schema = z.object({
  categorie: z.enum(["ACTIF", "RETRAITE", "SANS_EMPLOI", "INVITE"]),
  nombreInvites: z.number().min(0).max(3),
});

const categories = [
  {
    value: "ACTIF",
    ticketCode: "GALA_ACTIF",
    label: "Alumni en fonction",
    price: 40000,
    description: "Pour les alumni actuellement en poste",
    icon: BriefcaseIcon,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-100 dark:bg-sky-900/30",
  },
  {
    value: "RETRAITE",
    ticketCode: "GALA_RETRAITE",
    label: "Retraité",
    price: 25000,
    description: "Pour les alumni à la retraite",
    icon: UserIcon,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    value: "SANS_EMPLOI",
    ticketCode: "GALA_SANS_EMPLOI",
    label: "Sans emploi",
    price: 15000,
    description: "Pour les alumni en quête d'emploi",
    icon: MagnifyingGlassIcon,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    value: "INVITE",
    ticketCode: "GALA_INVITE",
    label: "Invite",
    price: 20000,
    description: "Pour les personnes invitées par un membre",
    icon: GiftIcon,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },
];

const buildCustomerFromUser = (user, phoneOverride) => ({
  firstName: String(user?.prenom || user?.firstName || "").trim(),
  lastName: String(user?.nom || user?.lastName || "").trim(),
  email: String(user?.email || "")
    .trim()
    .toLowerCase(),
  phone: String(phoneOverride || user?.telephone || user?.phone || "").trim(),
});

const Gala = () => {
  const { user } = useAuth();
  const { getEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [places, setPlaces] = useState({
    ACTIF: 170,
    RETRAITE: 40,
    SANS_EMPLOI: 10,
    INVITE: 50,
  });
  const [paymentStep, setPaymentStep] = useState("details");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [checkoutDraft, setCheckoutDraft] = useState({
    categorie: "ACTIF",
    nombreInvites: 0,
  });
  const [ticketTypesByCode, setTicketTypesByCode] = useState({});
  const [recentSession, setRecentSession] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { categorie: "ACTIF", nombreInvites: 0 },
  });

  const galaEvent = getEvent("gala");
  const categorie = watch("categorie");
  const nbInvites = watch("nombreInvites");
  const selectedCategory = categories.find((item) => item.value === categorie);
  const hasEnoughInviteStock =
    categorie === "INVITE" || Number(nbInvites || 0) <= (places.INVITE || 0);
  const canContinueToPayment =
    !catalogLoading &&
    !loading &&
    (places[categorie] || 0) > 0 &&
    hasEnoughInviteStock;
  const isPositiveMessage = /redirection|pret|reprendre|verification/i.test(
    message,
  );
  const SelectedCategoryIcon = selectedCategory?.icon;
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

  const montant = (categoryValue = categorie, invitesValue = nbInvites) => {
    const category = categories.find((item) => item.value === categoryValue);
    let base = category?.price || 0;

    if (categoryValue !== "INVITE") {
      base += Number(invitesValue || 0) * 20000;
    }

    return base;
  };

  useEffect(() => {
    setPaymentPhone(String(user?.telephone || user?.phone || "").trim());
  }, [user?.telephone, user?.phone]);

  useEffect(() => {
    setRecentSession(getLatestPaymentSessionForPath("/gala"));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTicketTypes = async () => {
      setCatalogLoading(true);

      try {
        const ticketTypes = await listTicketTypes({
          eventSlug: GALA_EVENT_SLUG,
        });

        if (!isMounted) {
          return;
        }

        const nextMap = Object.fromEntries(
          ticketTypes.map((ticketType) => [ticketType.code, ticketType]),
        );
        setTicketTypesByCode(nextMap);
        setPlaces({
          ACTIF: nextMap.GALA_ACTIF?.availableQuantity ?? 0,
          RETRAITE: nextMap.GALA_RETRAITE?.availableQuantity ?? 0,
          SANS_EMPLOI: nextMap.GALA_SANS_EMPLOI?.availableQuantity ?? 0,
          INVITE: nextMap.GALA_INVITE?.availableQuantity ?? 0,
        });
      } catch (_error) {
        if (isMounted) {
          setMessage(
            "Le catalogue de billetterie est temporairement indisponible. Rechargez la page dans un instant.",
          );
        }
      } finally {
        if (isMounted) {
          setCatalogLoading(false);
        }
      }
    };

    loadTicketTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  const openPaymentModal = (values) => {
    setMessage("");
    setCheckoutDraft({
      categorie: values.categorie,
      nombreInvites:
        values.categorie === "INVITE" ? 0 : Number(values.nombreInvites || 0),
    });
    setPaymentStep("details");
    setShowPayment(true);
  };

  const buildOrderItems = (draft) => {
    const category = categories.find((item) => item.value === draft.categorie);
    const mainTicketType = ticketTypesByCode[category?.ticketCode];
    const inviteTicketType = ticketTypesByCode.GALA_INVITE;

    if (!mainTicketType) {
      throw new Error("Le billet sélectionné n'est pas disponible.");
    }

    const items = [
      {
        ticketTypeId: mainTicketType.id,
        quantity: 1,
      },
    ];

    if (draft.categorie !== "INVITE" && Number(draft.nombreInvites || 0) > 0) {
      if (!inviteTicketType) {
        throw new Error("Le billet invité n'est pas disponible.");
      }

      items.push({
        ticketTypeId: inviteTicketType.id,
        quantity: Number(draft.nombreInvites),
      });
    }

    return items;
  };

  const handleFedapayCheckout = async () => {
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

      const items = buildOrderItems(checkoutDraft);
      const order = await createTicketingOrder({
        items,
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
        sourcePath: "/gala",
        label: "Gala des Alumni",
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
          "Impossible de lancer le paiement FedaPay pour le moment.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* ========== NOUVEAU BOUTON SCROLL TO TOP ========== */}
      {/* Animation : apparition/disparition avec opacity + scale, transition fluide */}
      {/* Au survol : agrandissement, rotation de l'icône, ombre plus forte */}
      {/* Au clic : effet de rebond actif */}
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
        {/* Icône flèche avec rotation au survol */}
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
        {/* Anneau de lueur au survol */}
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl"></div>
          <div
            className="absolute bottom-0 right-0 h-96 w-96 animate-pulse rounded-full bg-yellow-300 blur-3xl"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative px-8 py-16 text-center md:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm animate-fade-in">
            <SparklesIcon className="h-4 w-4 animate-spin" />
            <span>Événement exclusif</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold animate-slide-up md:text-5xl">
            Grand{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Gala
            </span>{" "}
            des Alumni
          </h1>

          <div className="flex flex-col items-center justify-center text-center w-full">
            <p className="text-xl md:text-2xl">
              Une soirée de célébration, de reconnaissance et de réseautage
              intergénérationnel
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
            <div
              className="rounded-xl bg-white/10 p-4 backdrop-blur animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CalendarIcon className="mx-auto mb-2 h-8 w-8 text-amber-300" />
              <p className="font-semibold">{formatEventDateLabel(galaEvent)}</p>
            </div>
            <div
              className="rounded-xl bg-white/10 p-4 backdrop-blur animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <MapPinIcon className="mx-auto mb-2 h-8 w-8 text-amber-300" />
              <p className="font-semibold">
                {galaEvent?.location || "Lieu à confirmer"}
              </p>
            </div>
            <div
              className="rounded-xl bg-white/10 p-4 backdrop-blur animate-slide-up"
              style={{ animationDelay: "0.5s" }}
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
              "Cocktail de bienvenue",
              "Dîner gala gastronomique",
              "Discours et témoignages",
              "Remise de distinctions",
              "Animation musicale",
              "Networking intergénérationnel",
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
              "Rencontrer les générations d'alumni",
              "Échanger avec les partenaires",
              "Participer à la vie de l'association",
              "Profiter d'une soirée inoubliable",
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
            Le paiement est maintenant géré par un vrai tunnel FedaPay. La place
            est réservée temporairement, puis confirmée seulement après
            validation du paiement.
          </p>

          <div className="mb-4 rounded-lg bg-amber-100 p-4 dark:bg-amber-900/40">
            <p className="mb-2 font-semibold">
              Accès au Gala (places limitées)
            </p>
            <p className="text-xs">
              La participation au Gala est strictement limitée à 300 personnes.
            </p>
          </div>

          <p className="mb-2 font-semibold">Tarifs en vigueur :</p>
          <ul className="mb-4 list-inside list-disc space-y-1">
            <li>
              Personnes en fonctions : <strong>40 000 FCFA</strong>
            </li>
            <li>
              Retraites : <strong>25 000 FCFA</strong>
            </li>
            <li>
              Sans emploi : <strong>15 000 FCFA</strong>
            </li>
            <li>
              Invites : <strong>20 000 FCFA</strong>
            </li>
          </ul>

          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Paiement sécurisé via FedaPay - premier payé, premier servi
          </p>
        </div>
      </section>

      {recentSession && (
        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-900/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                Un paiement Gala est déjà en cours ou récent sur cet appareil.
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
          className={`rounded-lg border p-4 animate-fade-in ${
            isPositiveMessage
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {user ? (
        <section>
          <div className="mb-8 text-center animate-fade-in">
            <h2 className="mb-2 text-3xl font-bold">Reservation du Gala</h2>
            <p className="text-slate-500">
              Choisissez votre catégorie puis continuez vers le paiement
              FedaPay.
            </p>
          </div>

          <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, index) => (
              <label
                key={cat.value}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-105 ${
                  categorie === cat.value
                    ? "border-amber-500 bg-amber-50 shadow-lg dark:bg-amber-900/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                } ${places[cat.value] <= 0 ? "cursor-not-allowed opacity-50" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <input
                  type="radio"
                  value={cat.value}
                  {...register("categorie")}
                  disabled={places[cat.value] <= 0}
                  className="sr-only"
                />
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}
                >
                  <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                </div>
                <div className="mb-1 font-semibold">{cat.label}</div>
                <div className="font-bold text-amber-600">
                  {cat.price.toLocaleString()} Fcfa
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {cat.description}
                </div>
                <div className="mt-2 text-xs font-medium">
                  {catalogLoading ? (
                    <span className="text-slate-500">
                      Vérification du stock...
                    </span>
                  ) : places[cat.value] > 0 ? (
                    <span className="text-green-600">
                      {places[cat.value]} places restantes
                    </span>
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

          {categorie !== "INVITE" && (
            <div className="mb-4 rounded-xl bg-white p-6 shadow-lg animate-slide-up dark:bg-slate-800">
              <label className="label">Nombre d'invités</label>
              <select
                {...register("nombreInvites", { valueAsNumber: true })}
                className="input-field"
              >
                <option value={0}>0 invité</option>
                <option value={1}>1 invité</option>
                <option value={2}>2 invités</option>
                <option value={3}>3 invités</option>
              </select>
              <p className="mt-2 text-sm text-slate-500">
                20 000 Fcfa par invité supplémentaire
              </p>
            </div>
          )}

          <div className="mb-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-center text-white animate-pulse">
            <p className="mb-2 text-primary-100">Montant total à payer</p>
            <p className="text-4xl font-bold">
              {montant().toLocaleString()} Fcfa
            </p>
            {categorie !== "INVITE" && nbInvites > 0 && (
              <p className="mt-2 text-sm text-primary-200">
                ({selectedCategory?.price.toLocaleString()} Fcfa + {nbInvites} x
                20 000 Fcfa)
              </p>
            )}
          </div>

          {!hasEnoughInviteStock && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Le stock disponible pour les billets invités ne couvre pas encore
              cette quantite.
            </div>
          )}

          <form
            onSubmit={handleSubmit(openPaymentModal)}
            className="text-center"
          >
            <button
              type="submit"
              disabled={!canContinueToPayment}
              className="btn-primary px-8 py-4 text-lg transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {catalogLoading
                ? "Chargement du stock..."
                : "Continuer vers FedaPay"}
            </button>
          </form>
        </section>
      ) : (
        <section className="rounded-2xl bg-slate-50 p-8 text-center animate-fade-in dark:bg-slate-800/50">
          <ExclamationCircleIcon className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h3 className="mb-2 text-xl font-semibold">Connexion requise</h3>
          <p className="mb-6 text-slate-500">
            Veuillez vous connecter ou créer un compte pour réserver votre
            place.
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
              onClick={() => {
                setShowPayment(false);
                setPaymentStep("details");
              }}
              className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-600"
              type="button"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {paymentStep === "details" && (
              <>
                <h3 className="mb-4 text-xl font-bold">
                  Paiement sécurisé FedaPay
                </h3>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                  <p className="text-sm opacity-90">Montant a payer</p>
                  <p className="text-3xl font-bold">
                    {montant(
                      checkoutDraft.categorie,
                      checkoutDraft.nombreInvites,
                    ).toLocaleString()}{" "}
                    Fcfa
                  </p>
                </div>

                <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-700/50 dark:text-slate-200">
                  <p className="font-semibold">Récapitulatif</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Catégorie</span>
                      <span className="flex items-center gap-2 font-medium">
                        {SelectedCategoryIcon ? (
                          <SelectedCategoryIcon className="h-4 w-4 text-amber-600" />
                        ) : null}
                        {
                          categories.find(
                            (item) => item.value === checkoutDraft.categorie,
                          )?.label
                        }
                      </span>
                    </div>
                    {checkoutDraft.categorie !== "INVITE" && (
                      <div className="flex items-center justify-between">
                        <span>Invites</span>
                        <span className="font-medium">
                          {checkoutDraft.nombreInvites}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label">Numéro de téléphone</label>
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
                    sur la page FedaPay.
                  </p>
                  {showSandboxHint && (
                    <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
                      {FEDAPAY_SANDBOX_MTN_HINT}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFedapayCheckout}
                  disabled={loading}
                  className="w-full btn-primary py-3 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Preparation du paiement..."
                    : `Payer ${montant(
                        checkoutDraft.categorie,
                        checkoutDraft.nombreInvites,
                      ).toLocaleString()} Fcfa avec FedaPay`}
                </button>
              </>
            )}

            {paymentStep === "processing" && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
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

export default Gala;
