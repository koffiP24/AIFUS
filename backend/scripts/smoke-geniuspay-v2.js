const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { prismaTicketing } = require("../src/lib/prismaTicketing");
const ordersService = require("../src/modules/v2/orders/orders.service");
const paymentsService = require("../src/modules/v2/payments/payments.service");

const ensureGeniusPayConfig = () => {
  const missing = [];

  if (!process.env.GENIUSPAY_API_KEY) {
    missing.push("GENIUSPAY_API_KEY");
  }

  if (!process.env.GENIUSPAY_API_SECRET) {
    missing.push("GENIUSPAY_API_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(
      `Configuration GeniusPay manquante: ${missing.join(", ")}. Renseignez ces variables dans backend/.env avant de lancer le smoke test.`,
    );
  }
};

async function main() {
  ensureGeniusPayConfig();

  await prismaTicketing.$connect();

  const galaTicketType = await prismaTicketing.ticketType.findFirst({
    where: { code: "GALA_ACTIF", isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (!galaTicketType) {
    throw new Error("Ticket type GALA_ACTIF introuvable pour le smoke test.");
  }

  const timestamp = Date.now();
  const customerEmail = `smoke.geniuspay.${timestamp}@example.com`;

  const order = await ordersService.createOrder({
    items: [{ ticketTypeId: galaTicketType.id, quantity: 1 }],
    customer: {
      firstName: "Smoke",
      lastName: "GeniusPay",
      email: customerEmail,
      phone: "0700000099",
    },
  });

  const payment = await paymentsService.initiatePayment(
    {
      orderReference: order.reference,
      customerEmail,
      provider: "GENIUSPAY",
    },
    { user: null },
  );

  if (!payment?.payment?.paymentUrl) {
    throw new Error(
      "Session GeniusPay creee sans paymentUrl. Verifiez la reponse provider.",
    );
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        provider: payment.payment.provider,
        orderReference: payment.order.reference,
        orderStatus: payment.order.status,
        transactionReference: payment.payment.transactionReference,
        providerPaymentId: payment.payment.providerPaymentId,
        paymentUrl: payment.payment.paymentUrl,
        instructions: payment.instructions,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: error.message,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prismaTicketing.$disconnect();
    } catch (_error) {
      // Ignore disconnect errors in smoke script.
    }
  });
