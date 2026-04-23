const fs = require("fs");
const path = require("path");

const { prismaTicketing } = require("../src/lib/prismaTicketing");
const ordersService = require("../src/modules/v2/orders/orders.service");
const paymentsService = require("../src/modules/v2/payments/payments.service");
const ticketsService = require("../src/modules/v2/tickets/tickets.service");
const scansService = require("../src/modules/v2/scans/scans.service");

const logPath = path.join(__dirname, "smoke-ticketing-v2.log");
const trace = (message) => {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
};

async function main() {
  fs.writeFileSync(logPath, "");
  trace("start");
  await prismaTicketing.$connect();
  trace("connected");

  const galaTicketType = await prismaTicketing.ticketType.findFirst({
    where: { code: "GALA_ACTIF" },
    orderBy: { createdAt: "asc" },
  });
  trace(`ticket-type:${galaTicketType ? galaTicketType.id : "none"}`);

  if (!galaTicketType) {
    throw new Error("Ticket type GALA_ACTIF introuvable");
  }

  const customerEmail = "smoke.ticketing.v2@example.com";

  const order = await ordersService.createOrder({
    items: [{ ticketTypeId: galaTicketType.id, quantity: 1 }],
    customer: {
      firstName: "Smoke",
      lastName: "Test",
      email: customerEmail,
      phone: "0700000099",
    },
  });
  trace(`order-created:${order.reference}`);

  const payment = await paymentsService.simulatePayment({
    orderReference: order.reference,
    customerEmail,
    scenario: "SUCCESS",
  });
  trace(`payment-simulated:${payment.transactionReference}`);

  const download = await ticketsService.getDownloadByReference(order.reference, {
    customerEmail,
  });
  trace(`download-ready:${download.tickets.length}`);

  let scanner = await prismaTicketing.user.findUnique({
    where: { email: "scanner.v2@example.com" },
  });
  trace(`scanner-loaded:${scanner ? scanner.id : "none"}`);

  if (!scanner) {
    scanner = await prismaTicketing.user.create({
      data: {
        email: "scanner.v2@example.com",
        firstName: "Scanner",
        lastName: "V2",
        role: "SCANNER",
        isActive: true,
      },
    });
    trace(`scanner-created:${scanner.id}`);
  }

  const scan = await scansService.validateScan(
    {
      ticketCode: download.tickets[0].ticketCode,
      eventSlug: download.tickets[0].event.slug,
      scannerDevice: "smoke-ticketing-v2",
    },
    scanner,
    { ipAddress: "127.0.0.1" },
  );
  trace(`scan-result:${scan.scanResult}`);

  console.log(
    JSON.stringify(
      {
        orderReference: order.reference,
        paymentMessage: payment.message,
        orderStatusAfterPayment: payment.order?.status,
        ticketCode: download.tickets[0].ticketCode,
        scanResult: scan.scanResult,
        scanMessage: scan.message,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    trace(`error:${error && error.stack ? error.stack : String(error)}`);
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prismaTicketing.$disconnect();
      trace("disconnected");
    } catch (_error) {
      // Ignore disconnect errors in smoke script.
    }
  });
