const multer = require("multer");

// A fájlt csak a memóriában tartjuk meg ideiglenesen, nem mentjük a szerver mappájába!
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
