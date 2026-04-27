import api from "./api";

export const GALA_EVENT_SLUG = "gala-aifus-2026";
export const TOMBOLA_EVENT_SLUG = "tombola-aifus-2026";

export const listTicketTypes = async ({
  eventSlug,
  eventId,
  includeInactive = false,
} = {}) => {
  const { data } = await api.get("/v2/ticket-types", {
    params: {
      eventSlug,
      eventId,
      includeInactive: includeInactive ? "true" : undefined,
    },
  });

  return data;
};

export const createTicketingOrder = async ({ items, customer }) => {
  const { data } = await api.post("/v2/orders", {
    items,
    customer,
  });

  return data;
};

export const initiateTicketingPayment = async ({
  orderReference,
  customerEmail,
  provider = "FEDAPAY",
}) => {
  const { data } = await api.post("/v2/payments/initiate", {
    orderReference,
    customerEmail,
    provider,
  });

  return data;
};

export const reconcileTicketingPayment = async ({
  orderReference,
  transactionReference,
  customerEmail,
}) => {
  const { data } = await api.post("/v2/payments/reconcile", {
    orderReference,
    transactionReference,
    customerEmail,
  });

  return data;
};

export const getTicketingOrder = async (reference, { customerEmail } = {}) => {
  const { data } = await api.get(`/v2/orders/${encodeURIComponent(reference)}`, {
    params: {
      customerEmail,
    },
  });

  return data;
};

export const getTicketingDownload = async (
  reference,
  { customerEmail } = {},
) => {
  const { data } = await api.get(
    `/v2/tickets/download/${encodeURIComponent(reference)}`,
    {
      params: {
        customerEmail,
      },
    },
  );

  return data;
};

export const getOrderPrimaryEvent = (order) => order?.items?.[0]?.event || null;

export const getOrderLatestPayment = (order) => order?.payments?.[0] || null;
