const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleWares/authMiddleware");
const adminController = require("../controllers/adminController");

router.use(verifyToken, verifyAdmin);

router.get("/bookings", adminController.getAllBookings);
router.put("/bookings/:id/status", adminController.updateBookingStatus);
router.delete("/bookings/:id", adminController.deleteBooking);

module.exports = router;
