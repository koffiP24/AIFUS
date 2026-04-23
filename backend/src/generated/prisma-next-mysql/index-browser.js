
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  passwordHash: 'passwordHash',
  authProvider: 'authProvider',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenHash: 'tokenHash',
  userAgent: 'userAgent',
  ipAddress: 'ipAddress',
  expiresAt: 'expiresAt',
  revokedAt: 'revokedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  type: 'type',
  description: 'description',
  venue: 'venue',
  timezone: 'timezone',
  capacity: 'capacity',
  saleStartsAt: 'saleStartsAt',
  saleEndsAt: 'saleEndsAt',
  startAt: 'startAt',
  endAt: 'endAt',
  isActive: 'isActive',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketTypeScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  name: 'name',
  code: 'code',
  description: 'description',
  priceAmount: 'priceAmount',
  currency: 'currency',
  stockTotal: 'stockTotal',
  maxPerOrder: 'maxPerOrder',
  requiresAttendeeInfo: 'requiresAttendeeInfo',
  isActive: 'isActive',
  saleStartsAt: 'saleStartsAt',
  saleEndsAt: 'saleEndsAt',
  sortOrder: 'sortOrder',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  reference: 'reference',
  userId: 'userId',
  customerFirstName: 'customerFirstName',
  customerLastName: 'customerLastName',
  customerEmail: 'customerEmail',
  customerPhone: 'customerPhone',
  currency: 'currency',
  subtotalAmount: 'subtotalAmount',
  feesAmount: 'feesAmount',
  totalAmount: 'totalAmount',
  status: 'status',
  expiresAt: 'expiresAt',
  paidAt: 'paidAt',
  cancelledAt: 'cancelledAt',
  failureReason: 'failureReason',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  eventId: 'eventId',
  ticketTypeId: 'ticketTypeId',
  label: 'label',
  quantity: 'quantity',
  unitAmount: 'unitAmount',
  subtotalAmount: 'subtotalAmount',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StockReservationScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  ticketTypeId: 'ticketTypeId',
  quantity: 'quantity',
  status: 'status',
  expiresAt: 'expiresAt',
  releasedAt: 'releasedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  provider: 'provider',
  transactionReference: 'transactionReference',
  providerPaymentId: 'providerPaymentId',
  idempotencyKey: 'idempotencyKey',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  paymentUrl: 'paymentUrl',
  providerStatus: 'providerStatus',
  failureReason: 'failureReason',
  callbackPayload: 'callbackPayload',
  verifiedAt: 'verifiedAt',
  paidAt: 'paidAt',
  attemptCount: 'attemptCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentWebhookEventScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  eventReference: 'eventReference',
  signatureValid: 'signatureValid',
  processingStatus: 'processingStatus',
  payload: 'payload',
  errorMessage: 'errorMessage',
  processedAt: 'processedAt',
  paymentId: 'paymentId',
  orderId: 'orderId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  orderItemId: 'orderItemId',
  eventId: 'eventId',
  ticketTypeId: 'ticketTypeId',
  ticketCode: 'ticketCode',
  qrToken: 'qrToken',
  participantFirstName: 'participantFirstName',
  participantLastName: 'participantLastName',
  participantEmail: 'participantEmail',
  participantPhone: 'participantPhone',
  status: 'status',
  checkedInAt: 'checkedInAt',
  cancelledAt: 'cancelledAt',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketScanScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  scannedById: 'scannedById',
  scanResult: 'scanResult',
  scannerDevice: 'scannerDevice',
  scannerIp: 'scannerIp',
  payload: 'payload',
  scannedAt: 'scannedAt',
  createdAt: 'createdAt'
};

exports.Prisma.RaffleTicketScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  ticketId: 'ticketId',
  serialNumber: 'serialNumber',
  status: 'status',
  assignedTo: 'assignedTo',
  prizeLabel: 'prizeLabel',
  drawnAt: 'drawnAt',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  ticketId: 'ticketId',
  channel: 'channel',
  recipient: 'recipient',
  templateKey: 'templateKey',
  status: 'status',
  providerMessageId: 'providerMessageId',
  lastError: 'lastError',
  payload: 'payload',
  sentAt: 'sentAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  actorUserId: 'actorUserId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  payload: 'payload',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.AuthProvider = exports.$Enums.AuthProvider = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE'
};

exports.UserRole = exports.$Enums.UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SCANNER: 'SCANNER'
};

exports.EventType = exports.$Enums.EventType = {
  GALA: 'GALA',
  VILLAGE: 'VILLAGE',
  RAFFLE: 'RAFFLE',
  OTHER: 'OTHER'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  REFUNDED: 'REFUNDED'
};

exports.StockReservationStatus = exports.$Enums.StockReservationStatus = {
  ACTIVE: 'ACTIVE',
  CONVERTED: 'CONVERTED',
  RELEASED: 'RELEASED',
  EXPIRED: 'EXPIRED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  INITIATED: 'INITIATED',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  GENERATED: 'GENERATED',
  USED: 'USED',
  CANCELLED: 'CANCELLED'
};

exports.ScanResult = exports.$Enums.ScanResult = {
  SUCCESS: 'SUCCESS',
  ALREADY_USED: 'ALREADY_USED',
  INVALID: 'INVALID',
  CANCELLED_TICKET: 'CANCELLED_TICKET',
  EVENT_MISMATCH: 'EVENT_MISMATCH'
};

exports.RaffleTicketStatus = exports.$Enums.RaffleTicketStatus = {
  ASSIGNED: 'ASSIGNED',
  CANCELLED: 'CANCELLED',
  WINNER: 'WINNER'
};

exports.NotificationChannel = exports.$Enums.NotificationChannel = {
  EMAIL: 'EMAIL',
  SMS: 'SMS'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  User: 'User',
  RefreshToken: 'RefreshToken',
  Event: 'Event',
  TicketType: 'TicketType',
  Order: 'Order',
  OrderItem: 'OrderItem',
  StockReservation: 'StockReservation',
  Payment: 'Payment',
  PaymentWebhookEvent: 'PaymentWebhookEvent',
  Ticket: 'Ticket',
  TicketScan: 'TicketScan',
  RaffleTicket: 'RaffleTicket',
  Notification: 'Notification',
  AuditLog: 'AuditLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
