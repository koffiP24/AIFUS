export const FEDAPAY_SANDBOX_MTN_HINT =
  "En sandbox FedaPay, MTN passe par momo_test. Seuls les numéros 64000001 et 66000001 simulent un paiement réussi ; tout autre numéro produit un échec.";

export const isLikelyFedapaySandbox = () => {
  if (typeof window === "undefined") {
    return Boolean(import.meta.env.DEV);
  }

  const hostname = String(window.location.hostname || "").toLowerCase();

  return (
    Boolean(import.meta.env.DEV) ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".ngrok-free.dev") ||
    hostname.endsWith(".ngrok.app")
  );
};
