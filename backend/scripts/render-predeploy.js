const path = require("path");
const { execFileSync } = require("child_process");
const mysql = require("mysql2/promise");

const backendRoot = path.resolve(__dirname, "..");
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const runNpx = (args, { allowFailure = false } = {}) => {
  try {
    execFileSync(npxCommand, args, {
      cwd: backendRoot,
      stdio: "inherit",
      env: process.env,
    });
    return true;
  } catch (error) {
    if (!allowFailure) {
      throw error;
    }

    console.warn("[render-predeploy] Command failed but recovery will continue:", [
      npxCommand,
      ...args,
    ].join(" "));
    return false;
  }
};

const tableExists = async (connection, tableName) => {
  const [rows] = await connection.query(`SHOW TABLES LIKE ?`, [tableName]);
  return Array.isArray(rows) && rows.length > 0;
};

const columnExists = async (connection, tableName, columnName) => {
  const [rows] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\` LIKE ?`, [
    columnName,
  ]);
  return Array.isArray(rows) && rows.length > 0;
};

const ensureLegacyAuthSchema = async (connection) => {
  const hasUserTable =
    (await tableExists(connection, "User")) ||
    (await tableExists(connection, "user"));

  if (!hasUserTable) {
    console.log("[render-predeploy] Creating legacy auth schema...");
    runNpx([
      "prisma",
      "db",
      "execute",
      "--file",
      "prisma/migrations/20260412020528_aifus_db/migration.sql",
      "--schema",
      "prisma/schema.prisma",
    ]);
  }

  const hasPasswordResetTable = await tableExists(connection, "PasswordReset");

  if (!hasPasswordResetTable) {
    console.log("[render-predeploy] Creating PasswordReset table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`PasswordReset\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`identifier\` VARCHAR(191) NOT NULL,
        \`token\` VARCHAR(191) NULL,
        \`code\` VARCHAR(191) NULL,
        \`expiresAt\` DATETIME(3) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX \`PasswordReset_identifier_idx\`(\`identifier\`),
        INDEX \`PasswordReset_expiresAt_idx\`(\`expiresAt\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
  }

  const legacyUserTableName = (await tableExists(connection, "User"))
    ? "User"
    : (await tableExists(connection, "user"))
      ? "user"
      : null;

  if (legacyUserTableName) {
    const hasResetCode = await columnExists(
      connection,
      legacyUserTableName,
      "resetCode",
    );
    const hasResetCodeExpiry = await columnExists(
      connection,
      legacyUserTableName,
      "resetCodeExpiry",
    );

    if (hasResetCode || hasResetCodeExpiry) {
      console.log("[render-predeploy] Dropping obsolete legacy reset columns...");
      if (hasResetCode) {
        await connection.query(
          `ALTER TABLE \`${legacyUserTableName}\` DROP COLUMN \`resetCode\``,
        );
      }
      if (hasResetCodeExpiry) {
        await connection.query(
          `ALTER TABLE \`${legacyUserTableName}\` DROP COLUMN \`resetCodeExpiry\``,
        );
      }
    }
  }
};

const runDeployPreparation = async () => {
  const databaseUrl = String(process.env.DATABASE_URL || "").trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
  }

  console.log("[render-predeploy] Applying legacy Prisma migrations...");
  runNpx(["prisma", "migrate", "deploy"], { allowFailure: true });

  const connection = await mysql.createConnection(databaseUrl);

  try {
    await ensureLegacyAuthSchema(connection);

    const [eventsTable] = await connection.query("SHOW TABLES LIKE 'events'");
    const [webhookEventsTable] = await connection.query(
      "SHOW TABLES LIKE 'payment_webhook_events'",
    );

    if (!Array.isArray(eventsTable) || eventsTable.length === 0) {
      console.log("[render-predeploy] Creating ticketing v2 schema...");
      runNpx([
        "prisma",
        "db",
        "execute",
        "--file",
        "prisma/migrations_v2/20260421143000_ticketing_core/migration.sql",
        "--schema",
        "prisma/schema.mysql.prisma",
      ]);
    }

    if (!Array.isArray(webhookEventsTable) || webhookEventsTable.length === 0) {
      console.log("[render-predeploy] Applying v2 recovery migration...");
      runNpx([
        "prisma",
        "db",
        "execute",
        "--file",
        "prisma/migrations_v2/20260421150000_ticketing_core_recovery.sql",
        "--schema",
        "prisma/schema.mysql.prisma",
      ]);
    }
  } finally {
    await connection.end();
  }

  console.log("[render-predeploy] Seeding ticketing v2 catalog...");
  runNpx([
    "prisma",
    "db",
    "execute",
    "--file",
    "prisma/seeds_v2/ticketing_core.sql",
    "--schema",
    "prisma/schema.mysql.prisma",
  ]);

  console.log("[render-predeploy] Done.");
};

runDeployPreparation().catch((error) => {
  console.error("[render-predeploy] Failed:", error);
  process.exit(1);
});
