const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleWares/authMiddleware");
console.log("Middleware-ek betöltve:", { verifyToken, verifyAdmin });
const adminController = require("../controllers/adminController");
console.log("Admin Controller betöltve:", adminController);

router.use(verifyToken, verifyAdmin);

router.get("/bookings", adminController.getAllBookings);
router.put("/bookings/:id/status", adminController.updateBookingStatus);

module.exports = router;
