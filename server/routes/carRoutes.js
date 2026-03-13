const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const { verifyToken, verifyAdmin } = require("../middleWares/authMiddleware");
const upload = require("../middleWares/uploadMiddleware");

// Nyilvános
router.get("/", carController.getAllCars);
router.get("/:id", carController.getCarById);

// Admin védett útvonalak
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  carController.addCar,
);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  carController.updateCar,
);
router.delete("/:id", verifyToken, verifyAdmin, carController.deleteCar);

module.exports = router;
