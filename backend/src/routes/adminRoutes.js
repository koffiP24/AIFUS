const express = require("express");

const router = express.Router();

const {
  getAllInscriptions,
  validerInscription,
  getAllBilletsTombola,
  validerBilletTombola,
  getStats,
  getUsers,
  updateUser,
  getEventSettings,
  updateEventSetting,
  getMonitoringOverview,
  scanGalaTicket,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.use(authMiddleware, adminMiddleware);
router.get("/inscriptions", getAllInscriptions);
router.put("/inscriptions/:id/valider", validerInscription);
router.put("/tombola/:id/valider", validerBilletTombola);
router.get("/tombola", getAllBilletsTombola);
router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.get("/events", getEventSettings);
router.put("/events/:key", updateEventSetting);
router.get("/monitoring", getMonitoringOverview);
router.post("/monitoring/scan", scanGalaTicket);

module.exports = router;
