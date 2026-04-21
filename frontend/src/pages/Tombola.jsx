import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import api from "../services/api";
import {
  BoltIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  TicketIcon,
  SparklesIcon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatEventShortDate } from "../utils/eventSettings";

const Tombola = () => {
  const { user } = useAuth();
  const { getEvent } = useEvents();
  const [quantite, setQuantite] = useState(1);
  const [billets, setBillets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [places, setPlaces] = useState({ totale: 100, restantes: 100 });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState("amount");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const tombolaEvent = getEvent("tombola");

  const prixBillet = 10000;
  const maxBillets = 10;

  useEffect(() => {
    if (user) {
      api
        .get("/tombola/mes-billets")
        .then((res) => setBillets(res.data))
        .catch(() => {});
      api
        .get("/tombola/places")
        .then((res) => setPlaces(res.data))
        .catch(() => {});
    }
  }, [user]);

  const handleInitiatePurchase = () => {
    setShowPayment(true);
    setPaymentStep("amount");
    setPaymentMethod("");
    setPaymentPhone("");
  };

  const handleDirectPayment = async () => {
    if (!paymentPhone || !paymentMethod) {
      setMessage("Veuillez sélectionner une méthode de paiement et entrer votre numéro");
      return;
    }
    setLoading(true);
    setPaymentStep("processing");
    try {
      const res = await api.post("/tombola/payer-direct", {
        quantite,
        phone: paymentPhone,
        method: paymentMethod,
      });
      setMessage(
        res.data.message || `Achat réussi de ${quantite} billet(s).`,
      );
      const billetsRes = await api.get("/tombola/mes-billets");
      setBillets(billetsRes.data);
      setShowPayment(false);
      setQuantite(1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors du paiement");
      setPaymentStep("amount");
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
    'Télévision 55"',
    "Machine à laver",
    "Réfrigérateur",
    "Climatiseur",
    "Tablette",
    "Montre connectée",
    "Casque audio",
    "Appareil photo",
    "Séjour en Resort",
    "Billet avion Abidjan-Moscou",
    "Cours de russe",
    "Pack tech",
    "Bon d'achat",
    "Et autres lots...",
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <SparklesIcon className="w-4 h-4 animate-spin" />
            <span>Tirage lors du Gala - {formatEventShortDate(tombolaEvent)}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Grande{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              Tombola
            </span>{" "}
            AIFUS 2026
          </h1>

          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Tentez de gagner une voiture et de nombreux lots exceptionnels
          </p>

          <div className="mt-8 inline-block">
            <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-4">
              <p className="text-purple-200 text-sm mb-1">Prix du billet</p>
              <p className="text-4xl font-bold text-white">
                {prixBillet.toLocaleString()}{" "}
                <span className="text-lg">Fcfa</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lots principaux */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Les lots à gagner</h2>
          <p className="text-slate-500">Plus de 50 lots à remporter !</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {lots.map((lot, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
            >
              <div
                className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${lot.couleur} flex items-center justify-center text-3xl`}
              >
                <lot.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-xs text-slate-500 mb-1">Rang {lot.rang}</div>
              <div className="font-bold text-sm mb-1">{lot.libelle}</div>
              <div className="text-primary-600 font-semibold text-sm">
                {lot.valeur}
              </div>
            </div>
          ))}
        </div>

        {/* Autres lots */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Et aussi...</h3>
          <div className="flex flex-wrap gap-2">
            {autresLots.map((lot, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 shadow-sm"
              >
                {lot}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Achat de billets */}
      {user ? (
        <section className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TicketIcon className="w-6 h-6" />
                Acheter des billets
              </h3>
            </div>

            <div className="p-6">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${message.includes("succès") || message.includes("Achat réussi") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
                >
                  {message}
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">
                    Nombre de billets (max {maxBillets})
                  </label>
                  <span className="text-sm text-slate-500">
                    {places.restantes > 0 ? (
                      <span className="text-green-600 font-medium">{places.restantes} billets disponibles</span>
                    ) : (
                      <span className="text-red-500 font-medium">Complet</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={maxBillets}
                    value={quantite}
                    onChange={(e) =>
                      setQuantite(
                        Math.min(
                          maxBillets,
                          Math.max(1, parseInt(e.target.value) || 1),
                        ),
                      )
                    }
                    className="input-field text-center text-xl font-bold w-24"
                  />
                  <button
                    onClick={() =>
                      setQuantite(Math.min(maxBillets, quantite + 1))
                    }
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-6">
                <div>
                  <p className="text-slate-500 text-sm">Prix unitaire</p>
                  <p className="font-semibold">
                    {prixBillet.toLocaleString()} Fcfa
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm">Total</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {(quantite * prixBillet).toLocaleString()} Fcfa
                  </p>
                </div>
              </div>

              <button
                onClick={handleInitiatePurchase}
                disabled={loading || quantite < 1}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Achat en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <TicketIcon className="h-5 w-5" />
                    Acheter {quantite} billet{quantite > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mes billets */}
          {billets.length > 0 && (
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                Mes billets ({billets.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {billets.map((billet) => (
                  <div
                    key={billet.id}
                    className={`p-3 rounded-lg text-center ${
                      billet.statutPaiement === "VALIDE"
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                    }`}
                  >
                    <div className="font-mono font-bold text-lg">
                      {billet.numeroBillet}
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 text-xs ${billet.statutPaiement === "VALIDE" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {billet.statutPaiement === "VALIDE"
                        ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Validé</span>
                          </>
                        )
                        : (
                          <>
                            <ClockIcon className="h-4 w-4" />
                            <span>En attente</span>
                          </>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <ExclamationCircleIcon className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connexion requise</h3>
          <p className="text-slate-500 mb-6">
            Veuillez vous connecter ou créer un compte pour acheter des billets.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn-primary">
              Se connecter
            </a>
            <a href="/register" className="btn-outline">
              Créer un compte
            </a>
          </div>
        </section>
      )}

      {/* Modal Paiement */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full animate-scale-in relative">
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 absolute top-4 right-4">
              <XMarkIcon className="w-6 h-6" />
            </button>

            {paymentStep === "amount" && (
              <>
                <h3 className="text-xl font-bold mb-4">Paiement - Orange Money / Wave</h3>
                <div className="bg-gradient-to-r from-purple-600 to-primary-700 rounded-lg p-4 mb-4 text-white">
                  <p className="text-sm opacity-90">Montant à payer</p>
                  <p className="text-3xl font-bold">{(quantite * prixBillet).toLocaleString()} Fcfa</p>
                </div>

                <div className="mb-4">
                  <label className="label">Méthode de paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod("orange")}
                      className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === "orange" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-slate-200 dark:border-slate-700"}`}
                    >
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-sm font-medium">Orange Money</div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("wave")}
                      className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === "wave" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700"}`}
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
                  {loading ? "Traitement en cours..." : `Payer ${(quantite * prixBillet).toLocaleString()} Fcfa`}
                </button>
              </>
            )}

            {paymentStep === "processing" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg font-medium">Traitement du paiement...</p>
                <p className="text-sm text-slate-500">Veuillez patienter</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tombola;
