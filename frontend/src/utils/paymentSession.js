const PAYMENT_SESSION_STORAGE_KEY = "aifus.ticketing.paymentSessions";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 48;

const isBrowser = typeof window !== "undefined";

const readStore = () => {
  if (!isBrowser) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PAYMENT_SESSION_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_error) {
    return {};
  }
};

const writeStore = (store) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(
      PAYMENT_SESSION_STORAGE_KEY,
      JSON.stringify(store),
    );
  } catch (_error) {
    // Ignore storage write failures on restricted mobile browsers.
  }
};

const isExpired = (session) => {
  const createdAt = Date.parse(session?.createdAt || "");
  if (Number.isNaN(createdAt)) {
    return true;
  }

  return Date.now() - createdAt > SESSION_MAX_AGE_MS;
};

const cleanupStore = (store) =>
  Object.fromEntries(
    Object.entries(store).filter(
      ([, session]) => session?.orderReference && !isExpired(session),
    ),
  );

export const savePaymentSession = (session) => {
  if (!session?.orderReference) {
    return;
  }

  const store = cleanupStore(readStore());
  store[session.orderReference] = {
    ...session,
    createdAt: session.createdAt || new Date().toISOString(),
  };
  writeStore(store);
};

export const getPaymentSession = (orderReference) => {
  const store = cleanupStore(readStore());
  writeStore(store);

  if (!orderReference) {
    return null;
  }

  return store[orderReference] || null;
};

export const getLatestPaymentSessionForPath = (sourcePath) => {
  const store = cleanupStore(readStore());
  writeStore(store);

  const sessions = Object.values(store)
    .filter((session) => !sourcePath || session.sourcePath === sourcePath)
    .sort(
      (left, right) =>
        Date.parse(right.createdAt || "") - Date.parse(left.createdAt || ""),
    );

  return sessions[0] || null;
};

export const removePaymentSession = (orderReference) => {
  if (!orderReference) {
    return;
  }

  const store = cleanupStore(readStore());
  delete store[orderReference];
  writeStore(store);
};

export const buildPaymentReturnPath = ({
  provider = "fedapay",
  orderReference,
  paymentReference,
} = {}) => {
  const searchParams = new URLSearchParams();

  if (provider) {
    searchParams.set("provider", provider);
  }

  if (orderReference) {
    searchParams.set("orderReference", orderReference);
  }

  if (paymentReference) {
    searchParams.set("paymentReference", paymentReference);
  }

  const query = searchParams.toString();
  return query ? `/payment-return?${query}` : "/payment-return";
};
