const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes'); // Beimportáljuk az új útvonalat

const app = express();
app.use(cors());
app.use(express.json());

// Az autós végpontok regisztrálása
app.use('/api/cars', carRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton...`));