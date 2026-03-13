const jwt = require("jsonwebtoken");

// 1. Token ellenőrző (bejelentkezett-e)
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Nincs token!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Érvénytelen token: " + err.message });
    }
    req.user = decoded;
    next();
  });
};

// 2. Admin ellenőrző (Admin-e?)
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Hozzáférés megtagadva: Csak adminoknak!" });
  }
};
