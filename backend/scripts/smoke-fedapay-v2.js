const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { prismaTicketing } = require("../src/lib/prismaTicketing");
const ordersService = require("../src/modules/v2/orders/orders.service");
const paymentsService = require("../src/modules/v2/payments/payments.service");

const ensureFedapayConfig = () => {
  const missing = [];

  if (!process.env.FEDAPAY_SECRET_KEY) {
    missing.push("FEDAPAY_SECRET_KEY");
  }

  if (!process.env.FEDAPAY_WEBHOOK_SECRET) {
    missing.push("FEDAPAY_WEBHOOK_SECRET");
  }

  if (missing.length > 0) {
    throw new Error(
      `Configuration FedaPay manquante: ${missing.join(", ")}. Renseignez ces variables dans backend/.env avant de lancer le smoke test.`,
    );
  }
};

async function main() {
  ensureFedapayConfig();

  await prismaTicketing.$connect();

  const galaTicketType = await prismaTicketing.ticketType.findFirst({
    where: { code: "GALA_ACTIF", isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (!galaTicketType) {
    throw new Error("Ticket type GALA_ACTIF introuvable pour le smoke test.");
  }

  const timestamp = Date.now();
  const customerEmail = `smoke.fedapay.${timestamp}@example.com`;

  const order = await ordersService.createOrder({
    items: [{ ticketTypeId: galaTicketType.id, quantity: 1 }],
    customer: {
      firstName: "Smoke",
      lastName: "FedaPay",
      email: customerEmail,
      phone: "0700000099",
    },
  });

  const payment = await paymentsService.initiatePayment(
    {
      orderReference: order.reference,
      customerEmail,
      provider: "FEDAPAY",
    },
    { user: null },
  );

  if (!payment?.payment?.paymentUrl) {
    throw new Error(
      "Session FedaPay creee sans paymentUrl. Verifiez la reponse provider.",
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
