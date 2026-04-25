import { useEffect, useEffectEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";
import {
  getOrderLatestPayment,
  getOrderPrimaryEvent,
  getTicketingDownload,
  getTicketingOrder,
  reconcileTicketingPayment,
} from "../services/ticketingV2";
import {
  getPaymentSession,
  removePaymentSession,
} from "../utils/paymentSession";
import {
  DEFAULT_PAYMENT_PROVIDER,
  getPaymentProviderLabel,
  normalizePaymentProvider,
  toPaymentProviderQuery,
} from "../utils/paymentProviders";

const STATUS_META = {
  PAID: {
    title: "Paiement confirme",
    description:
      "Votre commande est payee. Vos billets sont maintenant disponibles.",
    icon: CheckCircleIcon,
    accent: "text-green-700",
    panel:
      "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-900",
    badge: "bg-green-100 text-green-800",
  },
  PAYMENT_PROCESSING: {
    title: "Paiement en cours de verification",
    description:
      "Le paiement a ete initie. Nous recontrolons le statut avec le prestataire de paiement.",
    icon: ClockIcon,
    accent: "text-amber-700",
    panel:
      "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900",
    badge: "bg-amber-100 text-amber-800",
  },
  PENDING: {
    title: "Commande reservee temporairement",
    description:
      "Votre reservation est creee, mais le paiement n'est pas encore confirme.",
    icon: ClockIcon,
    accent: "text-amber-700",
    panel:
      "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900",
    badge: "bg-amber-100 text-amber-800",
  },
  FAILED: {
    title: "Paiement echoue",
    description:
      "Le paiement n'a pas ete confirme. Vous pouvez relancer une tentative.",
    icon: ExclamationCircleIcon,
    accent: "text-red-700",
    panel:
      "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 text-red-900",
    badge: "bg-red-100 text-red-800",
  },
  CANCELLED: {
    title: "Paiement annule",
    description:
      "Le paiement a ete annule avant confirmation. Vous pouvez reprendre depuis la page evenement.",
    icon: ExclamationCircleIcon,
    accent: "text-red-700",
    panel:
      "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 text-red-900",
    badge: "bg-red-100 text-red-800",
  },
  EXPIRED: {
    title: "Reservation expiree",
    description:
      "La reservation temporaire est arrivee a expiration avant la confirmation du paiement.",
    icon: ExclamationCircleIcon,
    accent: "text-red-700",
    panel:
      "border-red-200 bg-gradient-to-br from-red-50 to-rose-50 text-red-900",
    badge: "bg-red-100 text-red-800",
  },
};

const shouldPollStatus = (status) =>
  status === "PENDING" || status === "PAYMENT_PROCESSING";

const formatAmount = (amount, currency = "XOF") =>
  `${Number(amount || 0).toLocaleString()} ${currency === "XOF" ? "Fcfa" : currency}`;

const statusLabel = (status) =>
  ({
    PAID: "Paye",
    PAYMENT_PROCESSING: "Verification",
    PENDING: "En attente",
    FAILED: "Echoue",
    CANCELLED: "Annule",
    EXPIRED: "Expire",
    REFUNDED: "Rembourse",
  })[status] || status || "Inconnu";

const PaymentReturn = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [download, setDownload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const sessionOrderReference = searchParams.get("orderReference") || "";
  const session = getPaymentSession(sessionOrderReference);
  const provider = toPaymentProviderQuery(
    normalizePaymentProvider(
      searchParams.get("provider") || session?.provider || DEFAULT_PAYMENT_PROVIDER,
    ),
  );
  const orderReference = searchParams.get("orderReference") || "";
  const paymentReference = searchParams.get("paymentReference") || "";
  const customerEmail =
    session?.customerEmail || user?.email || "";
  const sourcePath = session?.sourcePath || "/";
  const providerLabel = getPaymentProviderLabel(provider);

  const loadPaymentState = useEffectEvent(
    async ({ reconcile = true, silent = false } = {}) => {
      if (!orderReference) {
        setError("Reference de commande absente dans le retour de paiement.");
        setLoading(false);
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setInfo("");

      try {
        if (reconcile && provider === "cinetpay") {
          try {
            await reconcileTicketingPayment({
              orderReference,
              transactionReference: paymentReference || undefined,
              customerEmail: customerEmail || undefined,
              provider: provider.toUpperCase(),
            });
          } catch (reconcileError) {
            const message = getApiErrorMessage(
              reconcileError,
              "Le paiement n'a pas encore pu etre recontrole.",
            );
            setInfo(message);
          }
        }

        const nextOrder = await getTicketingOrder(orderReference, {
          customerEmail: customerEmail || undefined,
        });

        setOrder(nextOrder);

        if (nextOrder.status === "PAID") {
          const nextDownload = await getTicketingDownload(orderReference, {
            customerEmail: customerEmail || undefined,
          });
          setDownload(nextDownload);
          removePaymentSession(orderReference);
        } else {
          setDownload(null);
        }
      } catch (requestError) {
        setError(
          getApiErrorMessage(
            requestError,
            "Impossible de verifier le statut de votre paiement.",
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
  );

  useEffect(() => {
    loadPaymentState({ reconcile: true, silent: false });
  }, [loadPaymentState, orderReference, paymentReference, provider, customerEmail]);

  useEffect(() => {
    if (!shouldPollStatus(order?.status)) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      loadPaymentState({ reconcile: true, silent: true });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [loadPaymentState, order?.status]);

  const meta = STATUS_META[order?.status] || STATUS_META.PAYMENT_PROCESSING;
  const StatusIcon = meta.icon;
  const primaryEvent = getOrderPrimaryEvent(order);
  const latestPayment = getOrderLatestPayment(order);
  const ticketCount = download?.tickets?.length || order?.tickets?.length || 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <section className={`overflow-hidden rounded-[2rem] border p-6 shadow-lg sm:p-8 ${meta.panel}`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
              <StatusIcon className={`h-8 w-8 ${meta.accent}`} />
            </div>
            <div className="space-y-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}>
                {statusLabel(order?.status)}
              </span>
              <h1 className="text-2xl font-bold sm:text-3xl">{meta.title}</h1>
              <p className="max-w-2xl text-sm text-slate-700 sm:text-base">
                {meta.description}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur">
            <p className="text-slate-500">Commande</p>
            <p className="font-mono text-sm font-semibold text-slate-900">
              {orderReference || "N/A"}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {info && !error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {info}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <CreditCardIcon className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold">Statut de la commande</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-5 text-slate-600 dark:bg-slate-800/70">
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              <span>Verification du paiement en cours...</span>
            </div>
          ) : order ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Evenement
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {primaryEvent?.name || "Billetterie AIFUS"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Montant
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatAmount(order.totalAmount, order.currency)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Billets
                  </p>
                  <p className="mt-2 text-sm font-semibold">{ticketCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Temps restant
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {order.remainingSeconds > 0
                      ? `${Math.ceil(order.remainingSeconds / 60)} min`
                      : "Finalise"}
                  </p>
                </div>
              </div>

              {latestPayment?.paymentUrl &&
                shouldPollStatus(order.status) && (
                  <a
                    href={latestPayment.paymentUrl}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    Retourner au paiement {providerLabel}
                  </a>
                )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70">
              Aucune commande n'a pu etre chargee pour ce retour.
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <TicketIcon className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold">Actions</h2>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => loadPaymentState({ reconcile: true, silent: false })}
              disabled={loading || refreshing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Reverifier le paiement
            </button>

            <Link
              to={sourcePath}
              className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Retourner a l'evenement
            </Link>

            {!customerEmail && !user && (
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl border border-amber-300 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
              >
                Se reconnecter pour verifier
              </Link>
            )}
          </div>
        </div>
      </section>

      {download?.tickets?.length > 0 && (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Billets generes</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {download.tickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Ticket
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold">
                      {ticket.ticketCode}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    {ticket.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Type:
                    </span>{" "}
                    {ticket.ticketType?.name}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Participant:
                    </span>{" "}
                    {[ticket.participantFirstName, ticket.participantLastName]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                  {ticket.raffleEntry?.serialNumber && (
                    <p>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        Numero tombola:
                      </span>{" "}
                      {ticket.raffleEntry.serialNumber}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PaymentReturn;
