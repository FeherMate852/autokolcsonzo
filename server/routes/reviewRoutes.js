const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleWares/authMiddleware");

router.get("/car/:carId", reviewController.getReviewsByCar);

router.post("/", verifyToken, reviewController.addReview);

module.exports = router;
