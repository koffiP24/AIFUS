const path = require("path");
const { execFileSync } = require("child_process");
const mysql = require("mysql2/promise");

const backendRoot = path.resolve(__dirname, "..");
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const runNpx = (args) => {
  execFileSync(npxCommand, args, {
    cwd: backendRoot,
    stdio: "inherit",
    env: process.env,
  });
};

const runDeployPreparation = async () => {
  const databaseUrl = String(process.env.DATABASE_URL || "").trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing");
  }

  console.log("[render-predeploy] Applying legacy Prisma migrations...");
  runNpx(["prisma", "migrate", "deploy"]);

  const connection = await mysql.createConnection(databaseUrl);

  try {
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
