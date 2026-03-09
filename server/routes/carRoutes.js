const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

// Nyilvános
router.get("/", carController.getAllCars);

// Admin védett útvonalak
router.post("/", verifyToken, verifyAdmin, carController.addCar);
router.put("/:id", verifyToken, verifyAdmin, carController.updateCar);
router.delete("/:id", verifyToken, verifyAdmin, carController.deleteCar);

module.exports = router;
