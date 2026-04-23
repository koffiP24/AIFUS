export const FEDAPAY_SANDBOX_MTN_HINT =
  "En sandbox FedaPay, MTN passe par momo_test. Seuls les numeros 64000001 et 66000001 simulent un paiement reussi ; tout autre numero produit un echec.";

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
