const app = require('./app');
const { prisma } = require("./lib/prisma");

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log('[OK] Connecte a la base de donnees MySQL');
    
    app.listen(PORT, () => {
      console.log(`[START] Serveur demarre sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[ERROR] Erreur de connexion a la base de donnees:', error);
    process.exit(1);
  }
}

main();
