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
    label: "Retraite",
    price: 25000,
    description: "Pour les alumni a la retraite",
    icon: UserIcon,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    value: "SANS_EMPLOI",
    ticketCode: "GALA_SANS_EMPLOI",
    label: "Sans emploi",
    price: 15000,
    description: "Pour les alumni en quete d'emploi",
    icon: MagnifyingGlassIcon,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    value: "INVITE",
    ticketCode: "GALA_INVITE",
    label: "Invite",
    price: 20000,
    description: "Pour les personnes invitees par un membre",
    icon: GiftIcon,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },
];

const buildCustomerFromUser = (user, phoneOverride) => ({
  firstName: String(user?.prenom || user?.firstName || "").trim(),
  lastName: String(user?.nom || user?.lastName || "").trim(),
  email: String(user?.email || "").trim().toLowerCase(),
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
      throw new Error("Le billet selectionne n'est pas disponible.");
    }

    const items = [
      {
        ticketTypeId: mainTicketType.id,
        quantity: 1,
      },
    ];

    if (draft.categorie !== "INVITE" && Number(draft.nombreInvites || 0) > 0) {
      if (!inviteTicketType) {
        throw new Error("Le billet invite n'est pas disponible.");
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
          "Votre profil est incomplet. Ajoutez votre nom, prenom et email avant le paiement.",
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
        throw new Error("Aucun lien de paiement FedaPay n'a ete retourne.");
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 animate-pulse-slow rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 h-96 w-96 animate-pulse-slow rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 blur-3xl" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/3 right-1/4 h-48 w-48 animate-float rounded-full bg-gradient-to-br from-white/5 to-white/10 blur-xl" style={{animationDelay: '2.5s'}}></div>

          {/* Sparkle Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-7xl">
            {/* Badge */}
            <div className="mb-8 flex justify-center animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/15 px-6 py-3 backdrop-blur-sm">
                <SparklesIcon className="h-5 w-5 text-amber-300 animate-pulse" />
                <span className="text-sm font-bold tracking-wide uppercase">Événement exclusif</span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 animate-slide-up text-center text-5xl font-bold tracking-tight md:text-6xl">
              <div className="mb-2">Grand</div>
              <div className="bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                Gala des Alumni
              </div>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-12 max-w-3xl animate-slide-up text-center text-xl leading-relaxed text-amber-100 md:text-2xl" style={{animationDelay: '0.2s'}}>
              Une soirée de célébration, de reconnaissance et de réseautage intergénérationnel
            </p>

            {/* Info Cards */}
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              <div
                className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/15 animate-slide-up"
                style={{animationDelay: '0.3s'}}
              >
                <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-amber-300" />
                <p className="text-center font-bold">{formatEventDateLabel(galaEvent)}</p>
              </div>
              <div
                className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/15 animate-slide-up"
                style={{animationDelay: '0.4s'}}
              >
                <MapPinIcon className="mx-auto mb-3 h-10 w-10 text-amber-300" />
                <p className="text-center font-bold">{galaEvent?.location || "Lieu à confirmer"}</p>
              </div>
              <div
                className="group rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/15 animate-slide-up"
                style={{animationDelay: '0.5s'}}
              >
                <ClockIcon className="mx-auto mb-3 h-10 w-10 text-amber-300" />
                <p className="text-center font-bold">{formatEventTimeRange(galaEvent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-900 dark:to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Program Section */}
            <div className="group overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Au programme</h3>
              </div>
              <ul className="space-y-4">
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
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/50 dark:border-slate-700 dark:hover:bg-amber-900/20"
                    style={{animationDelay: `${index * 0.08}s`}}
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Participate Section */}
            <div className="group overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Pourquoi participer ?</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Rencontrer les générations d'alumni",
                  "Échanger avec les partenaires",
                  "Participer à la vie de l'association",
                  "Profiter d'une soirée inoubliable",
                ].map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50/50 dark:border-slate-700 dark:hover:bg-primary-900/20"
                    style={{animationDelay: `${index * 0.08}s`}}
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                      <CheckCircleIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-xl dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-200/20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-200/20 blur-2xl"></div>

            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <ExclamationCircleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                  Informations importantes - Gala des Alumni AIFUS
                </h3>
              </div>

              <div className="prose max-w-none text-slate-700 dark:text-slate-300">
                <p className="mb-6 text-lg">
                  Le paiement est maintenant géré par un vrai tunnel FedaPay. La place est réservée temporairement, puis confirmée seulement après validation du paiement.
                </p>

                <div className="mb-6 rounded-2xl border border-amber-200 bg-white/60 p-6 backdrop-blur-sm dark:bg-amber-900/30">
                  <p className="mb-2 font-bold text-amber-900 dark:text-amber-300">Accès au Gala (places limitées)</p>
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    La participation au Gala est strictement limitée à 300 personnes.
                  </p>
                </div>

                <p className="mb-4 font-semibold text-amber-900 dark:text-amber-300">Tarifs en vigueur :</p>
                <ul className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 backdrop-blur-sm dark:bg-amber-900/30">
                    <span className="text-slate-600 dark:text-slate-300">Personnes en fonction :</span>
                    <strong className="ml-auto text-amber-600 dark:text-amber-400">40 000 Fcfa</strong>
                  </li>
                  <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 backdrop-blur-sm dark:bg-amber-900/30">
                    <span className="text-slate-600 dark:text-slate-300">Retraités :</span>
                    <strong className="ml-auto text-amber-600 dark:text-amber-400">25 000 Fcfa</strong>
                  </li>
                  <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 backdrop-blur-sm dark:bg-amber-900/30">
                    <span className="text-slate-600 dark:text-slate-300">Sans emploi :</span>
                    <strong className="ml-auto text-amber-600 dark:text-amber-400">15 000 Fcfa</strong>
                  </li>
                  <li className="flex items-center gap-3 rounded-xl bg-white/70 p-4 backdrop-blur-sm dark:bg-amber-900/30">
                    <span className="text-slate-600 dark:text-slate-300">Invités :</span>
                    <strong className="ml-auto text-amber-600 dark:text-amber-400">20 000 Fcfa</strong>
                  </li>
                </ul>

                <div className="flex items-center justify-center gap-3 rounded-2xl bg-amber-100 p-5 text-center dark:bg-amber-900/40">
                  <SparklesIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <p className="font-bold text-amber-900 dark:text-amber-300">
                    Paiement sécurisé via FedaPay - premier payé, premier servi
                  </p>
                </div>
              </div>
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
                    Un paiement Gala est déjà en cours ou récent sur cet appareil.
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

      {/* Reservation Section */}
      {user ? (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center animate-fade-in">
              <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-2 text-sm font-bold text-primary-700 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-300">
                Réservation
              </div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Réservez votre place au Gala
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
                Choisissez votre catégorie puis continuez vers le paiement sécurisé FedaPay
              </p>
            </div>

            {/* Category Selection */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, index) => (
                <label
                  key={cat.value}
                  className={`group relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    categorie === cat.value
                      ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl dark:from-amber-900/20 dark:to-orange-900/20"
                      : "border-slate-200 hover:border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
                  } ${places[cat.value] <= 0 ? "cursor-not-allowed opacity-50" : ""}`}
                  style={{animationDelay: `${index * 0.08}s`}}
                >
                  <input
                    type="radio"
                    value={cat.value}
                    {...register("categorie")}
                    disabled={places[cat.value] <= 0}
                    className="sr-only"
                  />

                  {/* Icon */}
                  <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${cat.iconBg}`}>
                    <cat.icon className={`h-8 w-8 ${cat.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="mb-3 text-lg font-bold">{cat.label}</div>
                  <div className="mb-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {cat.price.toLocaleString()} Fcfa
                  </div>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{cat.description}</p>

                  {/* Stock Status */}
                  <div className="mb-3 text-sm">
                    {catalogLoading ? (
                      <span className="flex items-center gap-2 text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                        Vérification du stock...
                      </span>
                    ) : places[cat.value] > 0 ? (
                      <span className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                        {places[cat.value]} places restantes
                      </span>
                    ) : (
                      <span className="font-semibold text-red-500">Complet</span>
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {categorie === cat.value && (
                    <div className="absolute right-3 top-3 animate-bounce">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 shadow-lg">
                        <CheckCircleIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Invite Selection */}
            {categorie !== "INVITE" && (
              <div className="mb-8 overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl dark:bg-slate-800 animate-slide-up">
                <label className="mb-4 block text-lg font-bold">Nombre d'invités</label>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="w-full max-w-xs">
                    <select
                      {...register("nombreInvites", { valueAsNumber: true })}
                      className="input-field py-3 text-lg"
                    >
                      <option value={0}>0 invité</option>
                      <option value={1}>1 invité</option>
                      <option value={2}>2 invités</option>
                      <option value={3}>3 invités</option>
                    </select>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">20 000 Fcfa</span> par invité supplémentaire
                  </div>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 shadow-2xl animate-pulse-slow">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div>
                  <p className="mb-2 text-primary-100">Montant total à payer</p>
                  <p className="text-5xl font-bold text-white">
                    {montant().toLocaleString()} <span className="text-2xl text-primary-200">Fcfa</span>
                  </p>
                  {categorie !== "INVITE" && nbInvites > 0 && (
                    <p className="mt-2 text-sm text-primary-200">
                      ({selectedCategory?.price.toLocaleString()} Fcfa + {nbInvites} x 20 000 Fcfa)
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <img src="/payment-icons.png" alt="Paiement sécurisé" className="h-12 opacity-80" />
                </div>
              </div>
            </div>

            {/* Invite Stock Warning */}
            {!hasEnoughInviteStock && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/30">
                Le stock disponible pour les billets invités ne couvre pas encore cette quantité.
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                onClick={handleSubmit(openPaymentModal)}
                disabled={!canContinueToPayment}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-12 py-5 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {catalogLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Chargement du stock...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-6 w-6" />
                      Continuer vers FedaPay
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </button>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Paiement 100% sécurisé via FedaPay
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* Login Required */
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 p-10 text-center shadow-2xl dark:from-slate-800 dark:to-slate-900">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                <ExclamationCircleIcon className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Connexion requise</h3>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Veuillez vous connecter ou créer un compte pour réserver votre place au Gala.
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
              onClick={() => {
                setShowPayment(false);
                setPaymentStep("details");
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              type="button"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {paymentStep === "details" && (
              <>
                <h3 className="mb-6 text-2xl font-bold">Paiement sécurisé FedaPay</h3>
                <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white shadow-lg">
                  <p className="mb-2 text-amber-100">Montant à payer</p>
                  <p className="text-4xl font-bold">
                    {montant(
                      checkoutDraft.categorie,
                      checkoutDraft.nombreInvites,
                    ).toLocaleString()}{" "}
                    Fcfa
                  </p>
                </div>

                <div className="mb-6 overflow-hidden rounded-2xl bg-slate-50 p-6 dark:bg-slate-700/50">
                  <p className="mb-4 font-bold text-slate-900 dark:text-white">Récapitulatif</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white p-3 dark:bg-slate-800">
                      <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                        {SelectedCategoryIcon && (
                          <SelectedCategoryIcon className="h-4 w-4 text-amber-600" />
                        )}
                        {
                          categories.find(
                            (item) => item.value === checkoutDraft.categorie,
                          )?.label
                        }
                      </span>
                    </div>
                    {checkoutDraft.categorie !== "INVITE" && (
                      <div className="flex items-center justify-between rounded-xl bg-white p-3 dark:bg-slate-800">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Invités</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {checkoutDraft.nombreInvites}
                        </span>
                      </div>
                    )}
                  </div>
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
                    Orange Money, Wave et les moyens compatibles seront proposés sur la page FedaPay.
                  </p>
                  {showSandboxHint && (
                    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
                      {FEDAPAY_SANDBOX_MTN_HINT}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFedapayCheckout}
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                        Payer {montant(
                          checkoutDraft.categorie,
                          checkoutDraft.nombreInvites,
                        ).toLocaleString()} Fcfa avec FedaPay
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>
              </>
            )}

            {paymentStep === "processing" && (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
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

export default Gala;
