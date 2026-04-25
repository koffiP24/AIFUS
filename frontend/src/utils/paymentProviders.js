export const DEFAULT_PAYMENT_PROVIDER = "CINETPAY";

export const PAYMENT_PROVIDER_OPTIONS = [
  {
    value: "CINETPAY",
    queryValue: "cinetpay",
    label: "CinetPay",
    description: "Paiement web avec Mobile Money, carte et wallet selon votre service.",
  },
];

const PAYMENT_PROVIDER_MAP = Object.fromEntries(
  PAYMENT_PROVIDER_OPTIONS.map((provider) => [provider.value, provider]),
);

export const normalizePaymentProvider = (provider) => {
  const normalizedProvider = String(provider || "").trim().toUpperCase();
  return PAYMENT_PROVIDER_MAP[normalizedProvider]
    ? normalizedProvider
    : DEFAULT_PAYMENT_PROVIDER;
};

export const toPaymentProviderQuery = (provider) =>
  PAYMENT_PROVIDER_MAP[normalizePaymentProvider(provider)].queryValue;

export const getPaymentProviderLabel = (provider) =>
  PAYMENT_PROVIDER_MAP[normalizePaymentProvider(provider)].label;

export const getPaymentProviderDescription = (provider) =>
  PAYMENT_PROVIDER_MAP[normalizePaymentProvider(provider)].description;
